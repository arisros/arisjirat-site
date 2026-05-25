/**
 * scripts/generate-banners.ts
 *
 * Generates AI illustration banners for every article.
 *
 * Pipeline per post:
 *   1. Read full article body text
 *   2. Gemini text → summarize content into a vivid visual concept + prompt
 *   3a. Gemini image (gemini-2.5-flash-image) → raster PNG illustration
 *   3b. Fallback if image quota hit: Gemini text generates custom SVG illustration code
 *       → rendered to PNG via Sharp
 *
 * Both paths produce AI-generated illustrations unique to each article.
 *
 * Usage:
 *   npm run generate:banners              # skip posts that already have a banner
 *   npm run generate:banners -- --regen   # regenerate all
 *
 * Requires:  .env  →  API_KEY_GEMINI=<key>
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join, basename } from "path";
import { fileURLToPath } from "url";

// ---------------------------------------------------------------------------
// .env loader
// ---------------------------------------------------------------------------
function loadDotEnv() {
  const p = join(fileURLToPath(import.meta.url), "../../.env");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    const v = t.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (k && !(k in process.env)) process.env[k] = v;
  }
}
loadDotEnv();

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const REGEN   = process.argv.includes("--regen");
const API_KEY = process.env.API_KEY_GEMINI;

if (!API_KEY) {
  console.error("❌  API_KEY_GEMINI not set. Add it to .env");
  process.exit(1);
}

const ROOT_DIR      = join(fileURLToPath(import.meta.url), "../../");
const POSTS_DIR     = join(ROOT_DIR, "src/content/posts");
const BANNERS_DIR   = join(ROOT_DIR, "public/images/banners");
const BANNER_PUBLIC = "/images/banners";

// Delay between API calls (ms). Increase if hitting 429s on text too.
const TEXT_DELAY_MS  = 4000;
const IMAGE_DELAY_MS = 12000;
const SVG_DELAY_MS   = 5000;

// ---------------------------------------------------------------------------
// Frontmatter + body parser
// ---------------------------------------------------------------------------
interface FM {
  title?: string; description?: string; category?: string;
  tags?: string[]; tech?: string[]; image?: string;
  [k: string]: unknown;
}

function parsePost(content: string): { fm: FM; body: string } {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---([\s\S]*)$/m);
  if (!m) return { fm: {}, body: content };
  const fm: FM = {};
  let key = ""; let inArr = false; const arr: string[] = [];
  for (const line of m[1].split("\n")) {
    if (inArr && line.match(/^\s+-\s+/)) { arr.push(line.replace(/^\s+-\s+/,"").trim().replace(/^["']|["']$/g,"")); continue; }
    if (inArr && !line.match(/^\s+/)) { fm[key] = [...arr]; arr.length = 0; inArr = false; }
    const kv = line.match(/^([a-zA-Z_][a-zA-Z0-9_-]*):\s*(.*)?$/);
    if (!kv) continue;
    key = kv[1]; const val = (kv[2] ?? "").trim();
    if (val === "" || val === "[]") { val === "[]" ? (fm[key]=[]) : (inArr=true, arr.length=0); continue; }
    if (val.startsWith("[")) { fm[key]=val.slice(1,-1).split(",").map(s=>s.trim().replace(/^["']|["']$/g,"")); continue; }
    const u = val.replace(/^["']|["']$/g,"");
    if (u==="true"){ fm[key]=true; continue; } if (u==="false"){ fm[key]=false; continue; }
    const n = Number(u); fm[key] = (!isNaN(n) && u!=="") ? n : u;
  }
  if (inArr) fm[key] = [...arr];
  return { fm, body: m[2].trim() };
}

function stripMd(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g,"").replace(/`[^`]+`/g,"").replace(/#{1,6}\s+/g,"")
    .replace(/!\[.*?\]\(.*?\)/g,"").replace(/\[([^\]]+)\]\([^)]+\)/g,"$1")
    .replace(/[*_~|>#]/g,"").replace(/\s+/g," ").trim();
}

function setImageFm(content: string, path: string): string {
  return content.replace(/\nimage:.*/,"").replace(
    /^(---\r?\n[\s\S]*?)((\r?\n)---)/m,
    (_,fb,closing) => `${fb}\nimage: "${path}"${closing}`
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Ask Gemini text to produce a visual concept from article content
// ---------------------------------------------------------------------------
interface VisualConcept {
  imagePrompt: string;   // for Gemini image model
  svgBrief:    string;   // brief for SVG fallback
}

async function buildVisualConcept(fm: FM, body: string): Promise<VisualConcept> {
  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey: API_KEY! });

  const title   = String(fm.title ?? "");
  const desc    = String(fm.description ?? "");
  const tech    = ((fm.tech as string[]) ?? []).filter(t => t !== "auto-imported");
  const tags    = ((fm.tags as string[]) ?? []).filter(t => t !== "auto-imported");
  const excerpt = stripMd(body).slice(0, 1000);

  const r = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are a visual art director for a dark tech blog. Analyze this article and produce a visual concept.

Title: ${title}
Description: ${desc}
Tech: ${tech.join(", ") || "N/A"}
Tags: ${tags.join(", ") || "N/A"}
Content excerpt: ${excerpt}

Return JSON only (no markdown, no explanation):
{
  "imagePrompt": "<A highly specific, vivid illustration prompt for an image AI. 16:9 banner. Dark #0a0a10 background. Minimal flat vector style. Abstract/metaphorical visuals unique to THIS article's content. Amber/golden glows #f59e0b. No text, no people, no letters anywhere in the image.>",
  "svgBrief": "<A one-sentence description of 2-3 abstract geometric shapes or visual metaphors that represent this article, with their colors. Example: 'Overlapping hexagonal grids in amber on dark slate, with flowing curved connection lines in blue'>."
}`,
    config: { temperature: 0.8 } as Record<string, unknown>,
  });

  const text = r.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const json = text.match(/\{[\s\S]*\}/)?.[0];
  if (!json) throw new Error("No JSON in response: " + text.slice(0,200));
  return JSON.parse(json) as VisualConcept;
}

// ---------------------------------------------------------------------------
// Step 2a — Gemini image model → raster PNG
// ---------------------------------------------------------------------------
async function generateRasterImage(prompt: string, outputPath: string): Promise<void> {
  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey: API_KEY! });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
    config: { responseModalities: ["IMAGE"] } as Record<string, unknown>,
  });

  const parts = (response.candidates?.[0]?.content?.parts ?? []) as Array<{
    inlineData?: { data?: string };
  }>;
  const img = parts.find(p => p.inlineData?.data);
  if (!img?.inlineData?.data) throw new Error("No image data returned");
  writeFileSync(outputPath, Buffer.from(img.inlineData.data, "base64"));
}

// ---------------------------------------------------------------------------
// Step 2b — Gemini text generates SVG illustration code → rendered to PNG
// ---------------------------------------------------------------------------
async function generateSvgIllustration(
  fm: FM,
  concept: VisualConcept,
  slug: string,
  outputPath: string
): Promise<void> {
  const { GoogleGenAI } = await import("@google/genai");
  const ai  = new GoogleGenAI({ apiKey: API_KEY! });
  const sharp = (await import("sharp")).default;

  const category = String(fm.category ?? "project");
  const accentMap: Record<string,string> = {
    study:"#3b82f6", project:"#f59e0b", setup:"#06b6d4", tool:"#f97316", research:"#a855f7"
  };
  const accent = accentMap[category] ?? "#f59e0b";
  const title  = String(fm.title ?? slug);

  const r = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are an SVG artist. Create a 1200×630 SVG illustration for a tech blog banner.

Visual brief: ${concept.svgBrief}
Article title: ${title}
Accent color: ${accent}
Background: dark, #0a0a10

Requirements:
- ONLY abstract geometric shapes, patterns, gradients (no text in the illustration area)
- Use the visual brief as inspiration for the shapes
- Dark background with the accent color as highlights/glows
- Subtle dot or grid pattern in background
- Visually interesting and unique to this article
- Keep the SVG compact and valid

Output ONLY the SVG code between <svg ...> and </svg>. No explanation, no markdown fences.`,
    config: { temperature: 0.9 } as Record<string, unknown>,
  });

  let svgRaw = r.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
  // Strip markdown code fences if present
  svgRaw = svgRaw.replace(/^```(?:svg|xml)?\s*/i, "").replace(/```\s*$/, "").trim();

  // Ensure correct dimensions
  svgRaw = svgRaw.replace(/<svg([^>]*)>/, (_, attrs) => {
    const cleaned = attrs
      .replace(/width="[^"]*"/, `width="1200"`)
      .replace(/height="[^"]*"/, `height="630"`)
      .replace(/viewBox="[^"]*"/, `viewBox="0 0 1200 630"`);
    // Add missing attrs if not already there
    const w = cleaned.includes('width=') ? cleaned : cleaned + ' width="1200"';
    const h = w.includes('height=') ? w : w + ' height="630"';
    const v = h.includes('viewBox=') ? h : h + ' viewBox="0 0 1200 630"';
    return `<svg${v}>`;
  });

  await sharp(Buffer.from(svgRaw)).png({ quality: 90 }).toFile(outputPath);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const isQuota = (e: unknown) => {
  const m = e instanceof Error ? e.message : String(e);
  return m.includes("429") || m.includes("quota") || m.includes("billing");
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  mkdirSync(BANNERS_DIR, { recursive: true });

  const files = readdirSync(POSTS_DIR)
    .filter(f => f.endsWith(".md") || f.endsWith(".mdx"))
    .sort();

  console.log(`\n🎨  AI Banner Generator — ${files.length} posts`);
  console.log(`    Plan: Gemini text → concept → Gemini image → [fallback: Gemini SVG → Sharp PNG]\n`);

  let generated=0, skipped=0, failed=0;

  for (let i = 0; i < files.length; i++) {
    const file     = files[i];
    const slug     = basename(file, file.endsWith(".mdx") ? ".mdx" : ".md");
    const filePath = join(POSTS_DIR, file);
    const content  = readFileSync(filePath, "utf-8");
    const { fm, body } = parsePost(content);

    if (fm.image && !REGEN) {
      console.log(`⏭️  [${i+1}/${files.length}] ${file} — already has banner`);
      skipped++; continue;
    }

    const outputPath = join(BANNERS_DIR, `${slug}.png`);
    const publicPath = `${BANNER_PUBLIC}/${slug}.png`;

    console.log(`\n[${i+1}/${files.length}] ${file}`);
    console.log(`  ${fm.category} | ${String(fm.title ?? slug).slice(0, 70)}`);

    // ── Step 1: build visual concept from content ──────────────────────────
    let concept: VisualConcept;
    try {
      concept = await buildVisualConcept(fm, body);
      console.log(`  🧠 Brief: ${concept.svgBrief.slice(0, 90)}`);
      await sleep(TEXT_DELAY_MS);
    } catch (err) {
      console.error(`  ❌  Concept generation failed: ${err instanceof Error ? err.message.slice(0,100) : err}`);
      failed++; continue;
    }

    // ── Step 2a: try Gemini image model ───────────────────────────────────
    let success = false;
    try {
      await generateRasterImage(concept.imagePrompt, outputPath);
      console.log(`  ✅  Raster illustration saved`);
      success = true;
      await sleep(IMAGE_DELAY_MS);
    } catch (err) {
      if (isQuota(err)) {
        console.log(`  ⚠️  Image model quota hit — using Gemini SVG fallback`);
      } else {
        console.log(`  ⚠️  Image model error (${err instanceof Error ? err.message.slice(0,60) : err}) — using SVG fallback`);
      }
    }

    // ── Step 2b: Gemini writes SVG illustration ───────────────────────────
    if (!success) {
      try {
        await generateSvgIllustration(fm, concept, slug, outputPath);
        console.log(`  ✅  Gemini SVG illustration rendered`);
        success = true;
        await sleep(SVG_DELAY_MS);
      } catch (err) {
        console.error(`  ❌  SVG generation failed: ${err instanceof Error ? err.message.slice(0,100) : err}`);
        failed++; continue;
      }
    }

    writeFileSync(filePath, setImageFm(content, publicPath), "utf-8");
    generated++;
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  Generated : ${generated}
⏭️   Skipped   : ${skipped}
❌  Failed    : ${failed}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  if (failed > 0) {
    console.log(`\nRe-run to retry failed posts:\n  npm run generate:banners\n`);
    process.exit(1);
  }
}

main().catch(err => { console.error("Fatal:", err); process.exit(1); });
