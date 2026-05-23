/**
 * One-shot migration: rename each post in src/content/posts/ from
 *   <slug>.md  →  <slug>.<lang>.md
 * and inject `lang` + `translationKey` into its frontmatter.
 *
 * `translationKey` equals the canonical slug (== the URL slug), so existing
 * URLs (/studies/study-storage etc.) stay valid.
 *
 * Safe to re-run: files already ending in .id.md / .en.md are skipped.
 *
 * Run:  npx tsx scripts/migrate-bilingual.ts
 */
import * as fs from 'node:fs';
import * as path from 'node:path';

const POSTS_DIR = 'src/content/posts';

// Authoritative lang map (hand-classified by content language).
const LANG_MAP: Record<string, 'id' | 'en'> = {
  // Indonesian
  'project-algo3': 'id',
  'project-aplikasi_absen': 'id',
  'project-pcd': 'id',
  'project-php': 'id',
  'study-basic-computer': 'id',
  'study-component-of-computer': 'id',
  'study-computer-devices': 'id',
  'study-device-input-output': 'id',
  'study-digital-era': 'id',
  'study-digital-security': 'id',
  'study-mid-summarize': 'id',
  'study-program-apps': 'id',
  'study-storage': 'id',
  // English
  'project-beepresent': 'en',
  'project-busgo': 'en',
  'project-godot-demo-projects': 'en',
  'project-gostudentubl': 'en',
  'project-lemme': 'en',
  'project-marcom': 'en',
  'project-marcom_services': 'en',
  'project-network': 'en',
  'project-playground_flutter': 'en',
  'project-test_presence': 'en',
  'project-tugas_mp': 'en',
  'project-wa-bot-notif': 'en',
  'project-workspace-mobile-kampus': 'en',
  'setup-homelab': 'en',
  'setup-workspace': 'en',
};

let migrated = 0;
let skipped = 0;
const unknown: string[] = [];

for (const file of fs.readdirSync(POSTS_DIR).sort()) {
  if (!file.endsWith('.md')) continue;
  if (/\.(id|en)\.md$/.test(file)) {
    skipped++;
    continue;
  }
  const slug = file.replace(/\.md$/, '');
  const lang = LANG_MAP[slug];
  if (!lang) {
    unknown.push(slug);
    continue;
  }

  const src = path.join(POSTS_DIR, file);
  const raw = fs.readFileSync(src, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) {
    console.warn(`! no frontmatter in ${file}`);
    continue;
  }
  let [, fm, body] = m;

  if (!/^lang:/m.test(fm)) fm = `${fm}\nlang: "${lang}"`;
  if (!/^translationKey:/m.test(fm)) fm = `${fm}\ntranslationKey: "${slug}"`;

  const dst = path.join(POSTS_DIR, `${slug}.${lang}.md`);
  fs.writeFileSync(dst, `---\n${fm}\n---\n${body}`);
  fs.unlinkSync(src);
  migrated++;
  console.log(`✓ ${file} → ${path.basename(dst)}`);
}

if (unknown.length) {
  console.warn(`\n! Unknown lang for: ${unknown.join(', ')}`);
}
console.log(`\nMigrated: ${migrated} · Skipped (already done): ${skipped}`);
