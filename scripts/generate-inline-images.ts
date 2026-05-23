/**
 * scripts/generate-inline-images.ts
 *
 * Identify 1–3 spots in each post that would benefit from an illustrative
 * diagram, then generate the illustrations with Gemini (raster + SVG fallback)
 * and insert markdown image references into BOTH the .id and .en versions of
 * the post (so translations stay paired).
 *
 * Pipeline per canonical post:
 *   1. Ask Gemini text to read the body and propose up to 3 spots as
 *      { afterHeadingIndex, alt, imagePrompt }. heading index counts all H2/H3
 *      headings in document order, 0-based, so it maps across translations.
 *   2. For each spot: Gemini image → /public/images/inline/<slug>-<n>.png.
 *      Theme-neutral light background so the image sits on cream and dark.
 *      Falls back to a Gemini-written SVG → Sharp PNG on quota errors.
 *   3. Insert `![alt](path)` after the H2/H3 at that index in both .id and .en
 *      files. Idempotent: skips spots whose alt text already appears in the file.
 *
 * Usage:
 *   npm run generate:inline-images
 *   npm run generate:inline-images -- --only setup-dactyl-manuform-keyboard
 *   npm run generate:inline-images -- --regen      # re-plan + re-insert
 *   npm run generate:inline-images -- --dry-run
 *
 * Requires:  .env  →  API_KEY_GEMINI=<key>
 */
import {
  readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync,
} from 'node:fs';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readPost, stringifyPost } from './lib/frontmatter';

// ---- .env loader (shared shape with generate-banners.ts) -------------------
function loadDotEnv() {
  const p = join(fileURLToPath(import.meta.url), '../../.env');
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, 'utf-8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    const v = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (k && !(k in process.env)) process.env[k] = v;
  }
}
loadDotEnv();

const args = process.argv.slice(2);
const flag = (n: string) => args.includes(`--${n}`);
const val  = (n: string) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const DRY    = flag('dry-run');
const REGEN  = flag('regen');
const ONLY   = val('only');
const MAX    = Number(val('max') ?? '3');

const API_KEY = process.env.API_KEY_GEMINI;
if (!API_KEY) {
  console.error('❌  API_KEY_GEMINI not set. Add it to .env (see .env.example).');
  process.exit(1);
}

const ROOT_DIR    = join(fileURLToPath(import.meta.url), '../../');
const POSTS_DIR   = join(ROOT_DIR, 'src/content/posts');
const IMAGES_DIR  = join(ROOT_DIR, 'public/images/inline');
const IMAGE_PUBLIC = '/images/inline';

const TEXT_DELAY_MS  = 4000;
const IMAGE_DELAY_MS = 10000;
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const isQuota = (e: unknown) => {
  const m = e instanceof Error ? e.message : String(e);
  return m.includes('429') || m.includes('quota') || m.includes('billing');
};

// ---- Markdown helpers ------------------------------------------------------
interface HeadingPos { index: number; depth: number; text: string; line: number }

function listHeadings(body: string): HeadingPos[] {
  const lines = body.split('\n');
  const out: HeadingPos[] = [];
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^```/.test(lines[i])) { inFence = !inFence; continue; }
    if (inFence) continue;
    const m = lines[i].match(/^(#{2,3})\s+(.+?)\s*$/);
    if (m) out.push({ index: out.length, depth: m[1].length, text: m[2], line: i });
  }
  return out;
}

function stripMd(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, '').replace(/`[^`]+`/g, '')
    .replace(/#{1,6}\s+/g, '').replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~|>#]/g, '').replace(/\s+/g, ' ').trim();
}

interface InlineSpot { afterHeadingIndex: number; alt: string; imagePrompt: string }

// ---- Gemini calls ----------------------------------------------------------
async function planSpots(title: string, body: string): Promise<InlineSpot[]> {
  const { GoogleGenAI } = await import('@google/genai');
  const ai = new GoogleGenAI({ apiKey: API_KEY! });

  const headings = listHeadings(body);
  if (headings.length === 0) return [];
  const headingList = headings.map(h => `  ${h.index}: ${'#'.repeat(h.depth)} ${h.text}`).join('\n');
  const excerpt = stripMd(body).slice(0, 2400);

  const r = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `You are choosing where to add at most ${MAX} illustrative diagrams to a technical blog post.

Title: ${title}

Headings (index : level + text):
${headingList}

Excerpt: ${excerpt}

For each spot worth illustrating, return one object:
- "afterHeadingIndex": the integer heading index (0-based) the image should follow.
- "alt": short alt text (≤80 chars) describing the diagram in the post's language.
- "imagePrompt": a vivid prompt for an image AI. Flat-vector / editorial illustration style. 16:9 or 4:3. THEME-NEUTRAL background (transparent or soft cream/off-white). Mastercard-warm orange accents (#F37338) allowed. NO TEXT, NO LETTERS, NO PEOPLE. Convey concept, not data.

Return ONLY a JSON array (no commentary, no markdown fences). If no images are needed, return [].
Maximum ${MAX} entries. Skip if the article is already visual enough.`,
    config: { temperature: 0.7 } as Record<string, unknown>,
  });

  const text = r.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  const json = text.match(/\[[\s\S]*\]/)?.[0];
  if (!json) return [];
  let parsed: InlineSpot[] = [];
  try { parsed = JSON.parse(json); } catch { return []; }
  return parsed
    .filter(s => Number.isInteger(s.afterHeadingIndex) && s.afterHeadingIndex >= 0 && s.afterHeadingIndex < headings.length)
    .slice(0, MAX);
}

async function generateImage(prompt: string, outPath: string): Promise<void> {
  const { GoogleGenAI } = await import('@google/genai');
  const ai = new GoogleGenAI({ apiKey: API_KEY! });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: prompt,
    config: { responseModalities: ['IMAGE'] } as Record<string, unknown>,
  });
  const parts = (response.candidates?.[0]?.content?.parts ?? []) as Array<{ inlineData?: { data?: string } }>;
  const img = parts.find(p => p.inlineData?.data);
  if (!img?.inlineData?.data) throw new Error('No image data');
  writeFileSync(outPath, Buffer.from(img.inlineData.data, 'base64'));
}

async function generateSvgFallback(prompt: string, outPath: string): Promise<void> {
  const { GoogleGenAI } = await import('@google/genai');
  const sharp = (await import('sharp')).default;
  const ai = new GoogleGenAI({ apiKey: API_KEY! });
  const r = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Write a 1200×800 SVG illustration for: ${prompt}

Theme-neutral cream background (#FCFBFA). Warm orange accents (#F37338). Abstract geometric shapes only. No text. Output ONLY the <svg>...</svg> markup, no markdown fences.`,
    config: { temperature: 0.8 } as Record<string, unknown>,
  });
  let svg = r.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
  svg = svg.replace(/^```(?:svg|xml)?\s*/i, '').replace(/```\s*$/, '').trim();
  await sharp(Buffer.from(svg)).png({ quality: 90 }).toFile(outPath);
}

// ---- Insertion -------------------------------------------------------------
function insertAfterHeading(body: string, headingIndex: number, mdLine: string): string {
  const headings = listHeadings(body);
  if (headingIndex >= headings.length) return body;
  const h = headings[headingIndex];
  const lines = body.split('\n');
  // Skip past any immediate blank line after the heading.
  let insertAt = h.line + 1;
  while (insertAt < lines.length && lines[insertAt].trim() === '') insertAt++;
  lines.splice(insertAt, 0, '', mdLine, '');
  return lines.join('\n');
}

function alreadyHasImage(body: string, src: string): boolean {
  return body.includes(`](${src})`);
}

// ---- Main ------------------------------------------------------------------
interface Canon { key: string; files: Partial<Record<'id'|'en', string>> }

function discoverCanonical(): Canon[] {
  const by = new Map<string, Canon>();
  for (const name of readdirSync(POSTS_DIR).sort()) {
    const m = name.match(/^(.+)\.(id|en)\.md$/);
    if (!m) continue;
    const key = m[1];
    if (ONLY && key !== ONLY) continue;
    if (!by.has(key)) by.set(key, { key, files: {} });
    by.get(key)!.files[m[2] as 'id'|'en'] = join(POSTS_DIR, name);
  }
  return [...by.values()];
}

async function processOne(c: Canon) {
  // Plan against the id (or first available) version.
  const planSrc = c.files.id ?? c.files.en;
  if (!planSrc) return;
  const planPost = readPost(planSrc);
  const title = String(planPost.data.title ?? c.key);

  console.log(`\n▸ ${c.key}`);
  const spots = await planSpots(title, planPost.body);
  if (spots.length === 0) {
    console.log('  (no inline illustrations needed)');
    return;
  }
  console.log(`  planned ${spots.length} spot(s)`);
  await sleep(TEXT_DELAY_MS);

  for (let i = 0; i < spots.length; i++) {
    const spot = spots[i];
    const fileName = `${c.key}-${i + 1}.png`;
    const fsPath   = join(IMAGES_DIR, fileName);
    const pubPath  = `${IMAGE_PUBLIC}/${fileName}`;

    if (existsSync(fsPath) && !REGEN) {
      console.log(`  ↷ image ${i + 1} exists`);
    } else {
      console.log(`  🎨 image ${i + 1}/${spots.length}: ${spot.alt.slice(0, 60)}`);
      if (!DRY) {
        try {
          await generateImage(spot.imagePrompt, fsPath);
          await sleep(IMAGE_DELAY_MS);
        } catch (e) {
          if (isQuota(e)) console.log('    ⚠ raster quota — SVG fallback');
          else console.log(`    ⚠ raster error (${(e as Error).message.slice(0, 60)}) — SVG fallback`);
          try { await generateSvgFallback(spot.imagePrompt, fsPath); } catch (e2) {
            console.error(`    ✗ SVG fallback also failed: ${(e2 as Error).message.slice(0, 100)}`);
            continue;
          }
        }
      }
    }

    // Insert markdown reference into every language file for this canonical key.
    const mdLine = `![${spot.alt}](${pubPath})`;
    for (const lang of ['id','en'] as const) {
      const f = c.files[lang]; if (!f) continue;
      const post = readPost(f);
      if (alreadyHasImage(post.body, pubPath)) {
        console.log(`    ↷ ${lang}: already references image`);
        continue;
      }
      const newBody = insertAfterHeading(post.body, spot.afterHeadingIndex, mdLine);
      if (newBody === post.body) {
        console.log(`    ! ${lang}: heading index ${spot.afterHeadingIndex} not found, skipping insert`);
        continue;
      }
      if (!DRY) writeFileSync(f, stringifyPost(post.fm, newBody));
      console.log(`    ✎ ${lang}: inserted after heading ${spot.afterHeadingIndex}`);
    }
  }
}

async function main() {
  mkdirSync(IMAGES_DIR, { recursive: true });
  const canons = discoverCanonical();
  console.log(`🎨 Inline-image generator — ${canons.length} canonical post(s)${ONLY ? ` (filtered to "${ONLY}")` : ''}`);
  console.log(`   Dry-run: ${DRY}  Regen: ${REGEN}  Max per post: ${MAX}\n`);

  let ok = 0, fail = 0;
  for (const c of canons) {
    try { await processOne(c); ok++; } catch (e) {
      console.error(`  ✗ ${c.key}: ${(e as Error).message.slice(0, 200)}`);
      fail++;
    }
  }
  console.log(`\nDone. OK: ${ok}  Failed: ${fail}`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
