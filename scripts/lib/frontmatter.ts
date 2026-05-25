import * as fs from 'node:fs';

export interface PostFile {
  path: string;
  raw: string;
  fm: string;
  body: string;
  data: Record<string, any>;
}

const FM_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

export function readPost(filePath: string): PostFile {
  const raw = fs.readFileSync(filePath, 'utf8');
  const m = raw.match(FM_RE);
  if (!m) throw new Error(`No frontmatter in ${filePath}`);
  const fm = m[1];
  const body = m[2].replace(/^\n/, '');
  return { path: filePath, raw, fm, body, data: parseFrontmatter(fm) };
}

/**
 * Naive frontmatter parser — enough to read scalar values we depend on.
 * Arrays parsed only when written inline (`[a, b, c]`). Multi-line YAML lists
 * are returned as raw strings (we don't care to round-trip them).
 */
export function parseFrontmatter(fm: string): Record<string, any> {
  const out: Record<string, any> = {};
  for (const line of fm.split('\n')) {
    const m = line.match(/^([a-zA-Z][a-zA-Z0-9_]*):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let v: any = m[2].trim();
    if (v === '') v = '';
    else if (v === 'true') v = true;
    else if (v === 'false') v = false;
    else if (/^-?\d+(\.\d+)?$/.test(v)) v = Number(v);
    else if (v.startsWith('"') && v.endsWith('"')) v = JSON.parse(v);
    else if (v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1);
    else if (v.startsWith('[') && v.endsWith(']')) {
      v = v
        .slice(1, -1)
        .split(',')
        .map(s => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    }
    out[key] = v;
  }
  return out;
}

/**
 * Replace one scalar field in a frontmatter string in place. Handles
 * multi-line values: replaces from the key line through (but not including)
 * the next key line — so an unterminated quoted string spanning many lines
 * is collapsed back to a single, clean key. If the key doesn't exist it is
 * appended. String values are double-quoted via JSON.stringify so embedded
 * quotes/colons/emoji round-trip safely.
 */
export function setFmField(fm: string, key: string, value: string | number | boolean): string {
  const formatted =
    typeof value === 'string'
      ? `${key}: ${JSON.stringify(value)}`
      : `${key}: ${value}`;
  const lines = fm.split('\n');
  const keyRe = /^([a-zA-Z][a-zA-Z0-9_-]*):/;

  let startIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(keyRe);
    if (m && m[1] === key) { startIdx = i; break; }
  }
  if (startIdx === -1) {
    return `${fm.replace(/\s*$/, '')}\n${formatted}`;
  }
  let endIdx = lines.length;
  for (let j = startIdx + 1; j < lines.length; j++) {
    if (keyRe.test(lines[j])) { endIdx = j; break; }
  }
  return [...lines.slice(0, startIdx), formatted, ...lines.slice(endIdx)].join('\n');
}

/**
 * Build a clean, well-formed frontmatter from a known set of fields. Used by
 * the translate pass to produce the target-language file with predictable YAML
 * (avoids inheriting any malformed multi-line strings from the source).
 */
export function buildFrontmatter(data: Record<string, any>): string {
  const lines: string[] = [];
  const scalarKeys = ['title', 'description', 'date', 'category', 'lang', 'translationKey', 'image', 'repo', 'status', 'course', 'subtitle', 'demo'];
  const boolKeys = ['featured', 'draft'];
  const numberKeys = ['semester'];
  const arrayKeys = ['tags', 'tech'];

  for (const k of scalarKeys) {
    const v = data[k];
    if (v === undefined || v === null || v === '') continue;
    lines.push(`${k}: ${JSON.stringify(String(v))}`);
  }
  for (const k of boolKeys) {
    if (data[k] === true || data[k] === false) lines.push(`${k}: ${data[k]}`);
  }
  for (const k of numberKeys) {
    if (typeof data[k] === 'number') lines.push(`${k}: ${data[k]}`);
  }
  for (const k of arrayKeys) {
    const v = data[k];
    if (Array.isArray(v) && v.length) {
      lines.push(`${k}: [${v.map((t: string) => JSON.stringify(String(t))).join(', ')}]`);
    }
  }
  return lines.join('\n');
}

export function stringifyPost(fm: string, body: string): string {
  return `---\n${fm.replace(/\s*$/, '')}\n---\n\n${body.replace(/^\n+/, '').replace(/\s*$/, '')}\n`;
}
