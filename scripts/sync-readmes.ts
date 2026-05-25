import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

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

function getGitRemoteUrl(repoDir: string): string | null {
  try {
    const url = execSync('git remote get-url origin', {
      cwd: repoDir,
      encoding: 'utf-8',
      timeout: 5000,
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();

    // Convert SSH URLs (git@host:org/repo) to HTTPS
    const sshMatch = url.match(/^git@([^:]+):(.+)$/);
    if (sshMatch) {
      return `https://${sshMatch[1]}/${sshMatch[2]}`.replace(/\.git$/, '');
    }
    // Strip .git suffix from HTTPS URLs
    return url.replace(/\.git$/, '');
  } catch {
    return null;
  }
}

function buildFrontmatter(title: string, description: string, repo: string | null): string {
  const safeTitle = title.replace(/"/g, '\\"');
  const safeDesc = description.replace(/"/g, '\\"');
  const lines = [
    '---',
    `title: "${safeTitle}"`,
    `description: "${safeDesc}"`,
    'category: "project"',
    'tags: ["auto-imported"]',
    'status: "completed"',
    'draft: false',
  ];
  if (repo) {
    lines.push(`repo: "${repo}"`);
  }
  lines.push('---');
  return lines.join('\n');
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
      const repoUrl = getGitRemoteUrl(path.join(PARENT_DIR, dirname));
      const frontmatter = buildFrontmatter(title, description, repoUrl);
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
