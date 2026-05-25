/**
 * Sanity check the content collection's bilingual structure:
 *   - every <slug>.<lang>.md has lang + translationKey in frontmatter
 *   - (translationKey, lang) is unique — no two files claim the same key in
 *     the same language (would silently overwrite the LangSwitcher target)
 *   - lang in frontmatter matches the filename suffix
 *
 * Exits non-zero on any violation. Run before pushing.
 *
 * Usage:
 *   npx tsx scripts/validate-translations.ts
 */
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { readPost } from './lib/frontmatter';

const POSTS_DIR = 'src/content/posts';

interface Issue { file: string; problem: string }
const issues: Issue[] = [];
const pair = new Map<string, string>(); // `${key}::${lang}` → first file

for (const name of readdirSync(POSTS_DIR).sort()) {
  if (!name.endsWith('.md')) continue;
  const m = name.match(/^(.+)\.(id|en)\.md$/);
  if (!m) {
    issues.push({ file: name, problem: 'filename does not match <slug>.(id|en).md' });
    continue;
  }
  const [, slug, fileLang] = m;
  const full = join(POSTS_DIR, name);
  let post; try { post = readPost(full); } catch (e) {
    issues.push({ file: name, problem: `unreadable: ${(e as Error).message}` });
    continue;
  }
  const { lang, translationKey } = post.data;

  if (!lang) issues.push({ file: name, problem: 'missing lang frontmatter' });
  else if (lang !== fileLang) issues.push({ file: name, problem: `lang frontmatter "${lang}" disagrees with filename "${fileLang}"` });
  if (!translationKey) issues.push({ file: name, problem: 'missing translationKey frontmatter' });

  const key = translationKey || slug;
  const pairKey = `${key}::${fileLang}`;
  const dup = pair.get(pairKey);
  if (dup) issues.push({ file: name, problem: `duplicate (translationKey="${key}", lang="${fileLang}") — also in ${dup}` });
  else pair.set(pairKey, name);
}

if (issues.length === 0) {
  console.log(`✓ ${pair.size} entries validated — no issues.`);
  process.exit(0);
}

console.error(`✗ ${issues.length} issue(s):`);
for (const i of issues) console.error(`  ${i.file}: ${i.problem}`);
process.exit(1);
