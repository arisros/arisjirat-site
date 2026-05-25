/**
 * Claude-driven inline-image generator.
 *
 * Mirrors generate-inline-images.ts but drives `claude -p` non-interactively
 * for both planning AND SVG generation. No external API keys required.
 *
 * Per canonical post:
 *   1. PLAN — Claude reads title + headings + excerpt, returns up to MAX spots
 *      as JSON: { afterHeadingIndex, alt, svgPrompt }.
 *   2. DRAW — for each spot, Claude returns standalone <svg> markup written to
 *      /public/images/inline/<slug>-<n>.svg.
 *   3. INSERT — `![alt](/images/inline/...)` placed after the matching H2/H3
 *      in BOTH the .id and .en files so translations stay paired.
 *
 * Idempotent: skips spots whose alt text or image path is already referenced.
 * Resumable: existing SVG files are not regenerated unless --regen is passed.
 *
 * Usage:
 *   npm run generate:inline-images-claude
 *   npm run generate:inline-images-claude -- --only setup-dactyl-manuform-keyboard
 *   npm run generate:inline-images-claude -- --regen      # re-plan + re-generate
 *   npm run generate:inline-images-claude -- --dry-run
 *   npm run generate:inline-images-claude -- --max 2
 */
import {
  readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync,
} from 'node:fs';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { readPost, stringifyPost } from './lib/frontmatter';

// ---- CLI -------------------------------------------------------------------
const args = process.argv.slice(2);
const flag = (n: string) => args.includes(`--${n}`);
const val  = (n: string) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const DRY   = flag('dry-run');
const REGEN = flag('regen');
const ONLY  = val('only');
const MAX   = Number(val('max') ?? '3');

const ROOT_DIR     = join(fileURLToPath(import.meta.url), '../../');
const POSTS_DIR    = join(ROOT_DIR, 'src/content/posts');
const IMAGES_DIR   = join(ROOT_DIR, 'public/images/inline');
const IMAGE_PUBLIC = '/images/inline';

if (!existsSync(IMAGES_DIR)) mkdirSync(IMAGES_DIR, { recursive: true });

// ---- Claude driver ---------------------------------------------------------
function callClaude(prompt: string, input: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn('claude', ['-p', prompt], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: process.env,
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', d => (stdout += d.toString()));
    child.stderr.on('data', d => (stderr += d.toString()));
    child.on('error', reject);
    child.on('close', code => {
      if (code !== 0) reject(new Error(`claude -p exit ${code}: ${stderr.slice(0, 400)}`));
      else resolve(stdout);
    });
    child.stdin.write(input);
    child.stdin.end();
  });
}

async function callClaudeRetry(prompt: string, input: string, attempts = 3): Promise<string> {
  let err: any;
  for (let i = 0; i < attempts; i++) {
    try { return (await callClaude(prompt, input)).trim(); }
    catch (e) {
      err = e;
      console.warn(`    ! attempt ${i + 1}/${attempts}: ${(e as Error).message.slice(0, 200)}`);
      if (i < attempts - 1) await new Promise(r => setTimeout(r, 3000 + i * 2000));
    }
  }
  throw err;
}

// ---- Markdown helpers (same shape as Gemini script) -----------------------
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

// ---- Planning --------------------------------------------------------------
interface InlineSpot { afterHeadingIndex: number; alt: string; svgPrompt: string }

const PLAN_PROMPT = `You are choosing where to add diagrams to a technical blog post. You will receive the title, a numbered list of H2/H3 headings, and a short excerpt.

Choose AT MOST the requested number of spots where a simple diagram would genuinely help a reader understand a system, flow, structure, or concept. Skip if the article is already visual enough, or is short / narrative / personal.

For each spot output one JSON object with:
  - "afterHeadingIndex": integer, the 0-based heading index the diagram should follow
  - "alt": short alt text (≤80 chars) in the post's language describing the diagram
  - "svgPrompt": a precise description of what the SVG should depict — concept, structure, components, relationships. Be concrete. No instructions about style or colors; that's controlled separately.

Output ONLY a JSON array. No preamble, no commentary, no markdown fences. Empty array \`[]\` if nothing is needed.`;

async function planSpots(title: string, body: string, maxSpots: number): Promise<InlineSpot[]> {
  const headings = listHeadings(body);
  if (headings.length === 0) return [];
  const headingList = headings.map(h => `  ${h.index}: ${'#'.repeat(h.depth)} ${h.text}`).join('\n');
  const excerpt = stripMd(body).slice(0, 2400);

  const input = `Max spots: ${maxSpots}

Title: ${title}

Headings (index : level + text):
${headingList}

Excerpt:
${excerpt}`;

  const raw = await callClaudeRetry(PLAN_PROMPT, input);
  const json = raw.match(/\[[\s\S]*\]/)?.[0];
  if (!json) return [];
  let parsed: InlineSpot[] = [];
  try { parsed = JSON.parse(json); } catch { return []; }
  return parsed
    .filter(s => Number.isInteger(s.afterHeadingIndex) && s.afterHeadingIndex >= 0 && s.afterHeadingIndex < headings.length)
    .filter(s => typeof s.alt === 'string' && typeof s.svgPrompt === 'string')
    .slice(0, maxSpots);
}

// ---- SVG generation --------------------------------------------------------
const SVG_PROMPT = `You are producing a self-contained SVG diagram for a technical blog post. The post explains the subject in detail; the SVG is a visual aid.

Hard requirements:
- Output ONLY the SVG markup: starts with \`<svg\` and ends with \`</svg>\`. No preamble, no commentary, no markdown fences.
- Root \`<svg>\` has \`xmlns="http://www.w3.org/2000/svg"\`, \`viewBox="0 0 1200 800"\`, and \`role="img"\`.
- NO background \`<rect>\` — leave the canvas transparent so the page background shows through.
- The diagram must be readable on BOTH a cream light theme (#FCFBFA) AND a near-black dark theme (#1A1A1A). Use mid-tone neutrals: stroke #525252, fill #A3A3A3 or none. The accent color (use sparingly) is warm orange #F37338. Avoid pure black, pure white, or pastels.
- All strokes have \`stroke-width\` 2 or 3. All text uses \`font-family="sans-serif"\` and \`fill="#525252"\` (or accent). Font sizes 14–22px.
- Composition must explain the concept: boxes, arrows, labeled flows, layered structures, sequence steps — whichever fits the prompt. Geometric and clean, NOT decorative. Labels in the same language as the alt text.
- Keep total markup ≤ 6 KB. No \`<image>\`, no external refs, no scripts, no styles outside inline attributes.
- The output is fed directly to a browser as a file — it must be valid standalone SVG.

Diagram brief follows.`;

function cleanSvg(raw: string): string {
  let s = raw.trim();
  // Strip code fences.
  s = s.replace(/^```(?:svg|xml|html)?\r?\n?/i, '').replace(/\r?\n?```\s*$/i, '').trim();
  // Strip any leading prose before the <svg> tag.
  const start = s.indexOf('<svg');
  if (start > 0) s = s.slice(start);
  const end = s.lastIndexOf('</svg>');
  if (end >= 0) s = s.slice(0, end + 6);
  return s;
}

async function generateSvg(svgPrompt: string, alt: string, outPath: string): Promise<void> {
  const input = `Alt text (for the post's language): ${alt}\n\nDiagram brief:\n${svgPrompt}`;
  const raw = await callClaudeRetry(SVG_PROMPT, input);
  const svg = cleanSvg(raw);
  if (!svg.startsWith('<svg') || !svg.endsWith('</svg>')) {
    throw new Error(`Output is not a valid SVG (first 80 chars: ${raw.slice(0, 80)!})`);
  }
  writeFileSync(outPath, svg);
}

// ---- Insertion -------------------------------------------------------------
function insertAfterHeading(body: string, headingIndex: number, mdLine: string): string {
  const headings = listHeadings(body);
  if (headingIndex >= headings.length) return body;
  const h = headings[headingIndex];
  const lines = body.split('\n');
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
  const planSrc = c.files.id ?? c.files.en;
  if (!planSrc) return;
  const planPost = readPost(planSrc);
  const title = String(planPost.data.title ?? c.key);

  console.log(`\n▸ ${c.key}`);
  const spots = await planSpots(title, planPost.body, MAX);
  if (spots.length === 0) {
    console.log('  (no inline illustrations needed)');
    return;
  }
  console.log(`  planned ${spots.length} spot(s)`);

  for (let i = 0; i < spots.length; i++) {
    const spot = spots[i];
    const fileName = `${c.key}-${i + 1}.svg`;
    const fsPath   = join(IMAGES_DIR, fileName);
    const pubPath  = `${IMAGE_PUBLIC}/${fileName}`;

    if (existsSync(fsPath) && !REGEN) {
      console.log(`  ↷ svg ${i + 1} exists`);
    } else {
      console.log(`  ✎ svg ${i + 1}/${spots.length}: ${spot.alt.slice(0, 60)}`);
      if (!DRY) {
        try { await generateSvg(spot.svgPrompt, spot.alt, fsPath); }
        catch (e) {
          console.error(`    ✗ svg failed: ${(e as Error).message.slice(0, 200)}`);
          continue;
        }
      }
    }

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
        console.log(`    ! ${lang}: heading index ${spot.afterHeadingIndex} not found`);
        continue;
      }
      if (!DRY) writeFileSync(f, stringifyPost(post.fm, newBody));
      console.log(`    + ${lang}: inserted after heading ${spot.afterHeadingIndex}`);
    }
  }
}

async function main() {
  const canons = discoverCanonical();
  console.log(`Discovered ${canons.length} canonical post(s)${ONLY ? ` (filtered to "${ONLY}")` : ''}.`);
  console.log(`Dry-run: ${DRY}  Regen: ${REGEN}  Max spots/post: ${MAX}`);

  let ok = 0, fail = 0;
  for (const c of canons) {
    try { await processOne(c); ok++; }
    catch (e) { fail++; console.error(`  ✗ ${c.key}: ${(e as Error).message.slice(0, 200)}`); }
  }
  console.log(`\nDone. OK: ${ok}  Failed: ${fail}`);
}

main().catch(e => { console.error(e); process.exit(1); });
