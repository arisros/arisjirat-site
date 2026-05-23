/**
 * Improve and translate every post by driving `claude -p` non-interactively.
 *
 * Two operations per canonical post:
 *   1. IMPROVE — rewrite the body in its own language (clarity, structure,
 *      may add KaTeX). Frontmatter is never sent or touched.
 *   2. TRANSLATE — produce <slug>.<otherLang>.md if it doesn't exist yet.
 *      Title and description are translated explicitly via TITLE:/DESC: lines.
 *
 * Idempotent + resumable: scripts/.content-state.json records the body hash
 * after each successful operation, so re-runs skip unchanged posts.
 *
 * Usage:
 *   npx tsx scripts/improve-content.ts                  # all posts, both passes
 *   npx tsx scripts/improve-content.ts --dry-run        # preview, write nothing
 *   npx tsx scripts/improve-content.ts --only <key>     # one canonical key
 *   npx tsx scripts/improve-content.ts --regen          # overwrite even if up to date
 *   npx tsx scripts/improve-content.ts --skip-improve   # translations only
 *   npx tsx scripts/improve-content.ts --skip-translate # improvements only
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { readPost, setFmField, buildFrontmatter, stringifyPost } from './lib/frontmatter';

const POSTS_DIR = 'src/content/posts';
const STATE_FILE = 'scripts/.content-state.json';

// ---------- CLI ----------
const args = process.argv.slice(2);
const flag = (n: string) => args.includes(`--${n}`);
const val = (n: string) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const DRY = flag('dry-run');
const REGEN = flag('regen');
const SKIP_IMPROVE = flag('skip-improve');
const SKIP_TRANSLATE = flag('skip-translate');
const ONLY = val('only');

// ---------- State ----------
type Op = 'improve_id' | 'improve_en' | 'translate_id_to_en' | 'translate_en_to_id';
interface State { [key: string]: Partial<Record<Op, string>> }
const state: State = fs.existsSync(STATE_FILE)
  ? JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'))
  : {};
const saveState = () => { if (!DRY) fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2)); };
const hash = (s: string) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);

// ---------- Claude driver ----------
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
    try {
      return cleanResponse(await callClaude(prompt, input));
    } catch (e) {
      err = e;
      console.warn(`    ! attempt ${i + 1}/${attempts} failed: ${(e as Error).message.slice(0, 200)}`);
      if (i < attempts - 1) await new Promise(r => setTimeout(r, 3000 + i * 2000));
    }
  }
  throw err;
}

/** Strip a single outer fence if Claude wrapped the body in ```markdown ... ```. */
function cleanResponse(s: string): string {
  s = s.trim();
  const fence = s.match(/^```(?:markdown|md|mdx)?\r?\n([\s\S]*?)\r?\n```$/);
  if (fence) s = fence[1].trim();
  return s + '\n';
}

// ---------- Prompts ----------
const IMPROVE_PROMPT = `You are editing a markdown blog-post body. The BODY ONLY arrives via stdin (no frontmatter).

Rewrite for clarity and structure. Output ONLY the improved markdown body. Rules:

- Keep the SAME language as the input. Do NOT translate.
- Do NOT add or change frontmatter.
- Preserve all facts. Preserve code blocks VERBATIM (do not edit code). Preserve link URLs, image paths, and KaTeX expressions exactly.
- Improve grammar, tighten wording, add logical "## " / "### " section headings where the structure benefits.
- Prefer markdown features: lists, tables, blockquotes for asides.
- If a concept is genuinely mathematical, you MAY express it with KaTeX ($inline$ or $$block$$). Do NOT invent equations.
- Do NOT add a top-level "# " heading — the title comes from frontmatter.
- Do NOT wrap the whole output in code fences.
- Output ONLY the finished markdown body.`;

function translatePrompt(src: 'id' | 'en', dst: 'id' | 'en') {
  const srcName = src === 'id' ? 'Indonesian' : 'English';
  const dstName = dst === 'id' ? 'Indonesian' : 'English';
  return `Translate the markdown blog post below from ${srcName} to ${dstName}.

Rules:
- Preserve ALL markdown structure exactly: headings, lists, tables, blockquotes, code blocks (do NOT translate code), link URLs, image paths, KaTeX math.
- Translate prose naturally and idiomatically — not word-for-word.
- Keep technical terms that are conventionally left in English (e.g. "split keyboard", "firmware", framework names).
- Output EXACTLY this format with no preamble, no commentary, and no surrounding code fences:

TITLE: <translated title>
DESC: <translated description>

<translated body>

Input follows (TITLE, DESC, BODY):`;
}

function buildTranslateInput(title: string, desc: string, body: string): string {
  return `TITLE: ${title}\nDESC: ${desc ?? ''}\n\n${body}`;
}

function parseTranslateOutput(raw: string): { title: string; desc: string; body: string } {
  const lines = raw.split('\n');
  let titleIdx = -1;
  let descIdx = -1;
  for (let i = 0; i < lines.length && i < 10; i++) {
    if (titleIdx === -1 && lines[i].startsWith('TITLE:')) titleIdx = i;
    else if (descIdx === -1 && lines[i].startsWith('DESC:')) descIdx = i;
  }
  if (titleIdx === -1) throw new Error('translate output missing TITLE');
  const title = lines[titleIdx].replace(/^TITLE:\s*/, '').trim();
  const desc = descIdx >= 0 ? lines[descIdx].replace(/^DESC:\s*/, '').trim() : '';
  // body is everything after the first blank line following the headers
  let bodyStart = (descIdx >= 0 ? descIdx : titleIdx) + 1;
  while (bodyStart < lines.length && lines[bodyStart].trim() === '') bodyStart++;
  const body = lines.slice(bodyStart).join('\n').trim() + '\n';
  return { title, desc, body };
}

// ---------- Driver ----------
type Lang = 'id' | 'en';
const OTHER: Record<Lang, Lang> = { id: 'en', en: 'id' };

interface Canon {
  key: string;
  files: Partial<Record<Lang, string>>; // filename per lang
}

function discoverCanonical(): Canon[] {
  const byKey = new Map<string, Canon>();
  for (const name of fs.readdirSync(POSTS_DIR).sort()) {
    const m = name.match(/^(.+)\.(id|en)\.md$/);
    if (!m) continue;
    const key = m[1];
    const lang = m[2] as Lang;
    if (ONLY && key !== ONLY) continue;
    if (!byKey.has(key)) byKey.set(key, { key, files: {} });
    byKey.get(key)!.files[lang] = path.join(POSTS_DIR, name);
  }
  return [...byKey.values()];
}

async function doImprove(canon: Canon, lang: Lang) {
  const file = canon.files[lang];
  if (!file) return;
  const op: Op = lang === 'id' ? 'improve_id' : 'improve_en';
  const post = readPost(file);
  const bodyHash = hash(post.body);
  const done = state[canon.key]?.[op];
  if (done === bodyHash && !REGEN) {
    console.log(`  ↷ improve(${lang}) skip (up to date)`);
    return;
  }
  console.log(`  ✎ improve(${lang})  ${path.basename(file)}  (${post.body.length}b)`);
  if (DRY) return;
  const improved = await callClaudeRetry(IMPROVE_PROMPT, post.body);
  const newRaw = stringifyPost(post.fm, improved);
  fs.writeFileSync(file, newRaw);
  state[canon.key] = { ...state[canon.key], [op]: hash(improved) };
  saveState();
}

async function doTranslate(canon: Canon, from: Lang) {
  const srcFile = canon.files[from];
  if (!srcFile) return;
  const to = OTHER[from];
  if (canon.files[to] && !REGEN) {
    console.log(`  ↷ translate(${from}→${to}) skip (target exists)`);
    return;
  }
  const op: Op = from === 'id' ? 'translate_id_to_en' : 'translate_en_to_id';
  const src = readPost(srcFile);
  const bodyHash = hash(src.body);
  if (state[canon.key]?.[op] === bodyHash && canon.files[to] && !REGEN) {
    console.log(`  ↷ translate(${from}→${to}) skip (up to date)`);
    return;
  }
  console.log(`  ⇄ translate(${from}→${to})  ${path.basename(srcFile)}  (${src.body.length}b)`);
  if (DRY) return;

  const input = buildTranslateInput(src.data.title ?? '', src.data.description ?? '', src.body);
  const raw = await callClaudeRetry(translatePrompt(from, to), input);
  const parsed = parseTranslateOutput(raw);

  // Build the new file's frontmatter from a known field set so we never
  // inherit any malformed multi-line YAML from the source.
  const targetData: Record<string, any> = {
    ...src.data,
    title: parsed.title,
    description: parsed.desc || src.data.description || '',
    lang: to,
    translationKey: src.data.translationKey ?? canon.key,
  };
  const fm = buildFrontmatter(targetData);
  const dstFile = path.join(POSTS_DIR, `${canon.key}.${to}.md`);
  fs.writeFileSync(dstFile, stringifyPost(fm, parsed.body));
  canon.files[to] = dstFile;

  state[canon.key] = { ...state[canon.key], [op]: bodyHash };
  saveState();
}

async function main() {
  const canons = discoverCanonical();
  console.log(`Discovered ${canons.length} canonical post(s)${ONLY ? ` (filtered to "${ONLY}")` : ''}.`);
  console.log(`Dry-run: ${DRY}  Regen: ${REGEN}  Skip improve: ${SKIP_IMPROVE}  Skip translate: ${SKIP_TRANSLATE}\n`);

  let okCount = 0, failCount = 0;
  for (const c of canons) {
    console.log(`▸ ${c.key}  [${Object.keys(c.files).join(',')}]`);
    try {
      if (!SKIP_IMPROVE) {
        if (c.files.id) await doImprove(c, 'id');
        if (c.files.en) await doImprove(c, 'en');
      }
      if (!SKIP_TRANSLATE) {
        // Prefer translating from the original language to the missing one.
        // If both exist already (and not regen), skip.
        if (c.files.id && !c.files.en) await doTranslate(c, 'id');
        else if (c.files.en && !c.files.id) await doTranslate(c, 'en');
        else if (REGEN && c.files.id) await doTranslate(c, 'id');
      }
      okCount++;
    } catch (e) {
      failCount++;
      console.error(`  ✗ ${c.key}: ${(e as Error).message}`);
    }
  }
  console.log(`\nDone. OK: ${okCount}  Failed: ${failCount}`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
