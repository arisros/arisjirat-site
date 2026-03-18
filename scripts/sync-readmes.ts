import fs from 'node:fs';
import path from 'node:path';

const SITE_ROOT = path.resolve(import.meta.dirname, '..');
const PARENT_DIR = path.resolve(SITE_ROOT, '..');
const POSTS_DIR = path.join(SITE_ROOT, 'src', 'content', 'posts');

const SKIP_DIRS = new Set([
  'arisjirat-site',
  'homelab_doc_setup_infras',
  'node_modules',
  '.git',
]);

function extractTitle(content: string, dirname: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : dirname;
}

function extractDescription(content: string): string {
  const lines = content.split('\n');
  let pastHeading = false;

  for (const line of lines) {
    if (!pastHeading) {
      if (/^#\s+/.test(line)) pastHeading = true;
      continue;
    }
    const trimmed = line.trim();
    if (trimmed === '') continue;
    if (/^[#\-*>|`\[]/.test(trimmed) || /^!\[/.test(trimmed)) continue;
    const desc = trimmed.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    return desc.length > 160 ? desc.slice(0, 157) + '...' : desc;
  }

  return `README for ${path.basename(content)}`;
}

function buildFrontmatter(title: string, description: string): string {
  const safeTitle = title.replace(/"/g, '\\"');
  const safeDesc = description.replace(/"/g, '\\"');
  return [
    '---',
    `title: "${safeTitle}"`,
    `description: "${safeDesc}"`,
    'category: "project"',
    'tags: ["auto-imported"]',
    'status: "completed"',
    'draft: false',
    '---',
  ].join('\n');
}

function main() {
  fs.mkdirSync(POSTS_DIR, { recursive: true });

  let entries: string[];
  try {
    entries = fs.readdirSync(PARENT_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('.') && !SKIP_DIRS.has(d.name))
      .map(d => d.name);
  } catch (err) {
    console.error(`[sync] Failed to read parent directory: ${err}`);
    process.exit(1);
  }

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const dirname of entries) {
    const slug = `project-${dirname}`;
    const outFile = path.join(POSTS_DIR, `${slug}.md`);
    const readmePath = path.join(PARENT_DIR, dirname, 'README.md');

    if (fs.existsSync(outFile)) {
      console.log(`[sync] Skipped ${dirname} (custom article exists)`);
      skipped++;
      continue;
    }

    if (!fs.existsSync(readmePath)) {
      continue;
    }

    try {
      const content = fs.readFileSync(readmePath, 'utf-8');
      const title = extractTitle(content, dirname);
      const description = extractDescription(content);
      const frontmatter = buildFrontmatter(title, description);
      const output = `${frontmatter}\n\n${content}`;

      fs.writeFileSync(outFile, output, 'utf-8');
      console.log(`[sync] Created ${slug}.md from ../${dirname}/README.md`);
      created++;
    } catch (err) {
      console.error(`[sync] Error processing ${dirname}: ${err}`);
      errors++;
    }
  }

  console.log(`\nSynced ${created} new, ${skipped} skipped, ${errors} errors`);
}

main();
