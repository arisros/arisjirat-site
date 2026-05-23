import { getCollection, type CollectionEntry } from 'astro:content';

export type Lang = 'id' | 'en';
export const LANGS = ['id', 'en'] as const satisfies readonly Lang[];
export const DEFAULT_LANG: Lang = 'id';
export const OTHER_LANG: Record<Lang, Lang> = { id: 'en', en: 'id' };

// Singular content `category` → plural URL segment.
export const CATEGORY_TO_PATH = {
  study: 'studies',
  project: 'projects',
  research: 'research',
  tool: 'tools',
  setup: 'setup',
} as const satisfies Record<string, string>;

// Inverse: URL segment → singular category.
export const PATH_TO_CATEGORY = {
  studies: 'study',
  projects: 'project',
  research: 'research',
  tools: 'tool',
  setup: 'setup',
} as const satisfies Record<string, string>;

export const CATEGORIES = Object.keys(CATEGORY_TO_PATH) as (keyof typeof CATEGORY_TO_PATH)[];

export const CATEGORY_LABELS: Record<string, Record<Lang, string>> = {
  study: { id: 'Studi', en: 'Studies' },
  project: { id: 'Proyek', en: 'Projects' },
  research: { id: 'Riset', en: 'Research' },
  tool: { id: 'Alat', en: 'Tools' },
  setup: { id: 'Setup', en: 'Setup' },
};

export const CATEGORY_DESCRIPTIONS: Record<string, Record<Lang, string>> = {
  study: {
    id: 'Catatan kuliah dan pembelajaran akademik.',
    en: 'Academic coursework and learning notes.',
  },
  project: {
    id: 'Software, hardware, dan segala yang ada di antaranya.',
    en: 'Software, hardware, and everything in between.',
  },
  research: {
    id: 'Penelitian dan eksplorasi mendalam.',
    en: 'Deep dives and academic research.',
  },
  tool: {
    id: 'Hardware, IoT, dan alat developer.',
    en: 'Hardware, IoT, and developer tools.',
  },
  setup: {
    id: 'Workspace dan infrastruktur.',
    en: 'Workspace and infrastructure.',
  },
};

export const UI_STRINGS = {
  siteName: 'arisjirat',
  home: { id: 'Beranda', en: 'Home' },
  viewSource: { id: 'Lihat Source', en: 'View Source' },
  viewProjects: { id: 'Lihat Proyek', en: 'View Projects' },
  browseStudies: { id: 'Telusuri Studi', en: 'Browse Studies' },
  recent: { id: 'Terbaru', en: 'Recent' },
  featured: { id: 'Unggulan', en: 'Featured' },
  explore: { id: 'Jelajahi', en: 'Explore' },
  noPosts: { id: 'Belum ada konten.', en: 'No posts yet.' },
  total: { id: 'Total Postingan', en: 'Total Posts' },
  switchTheme: { id: 'Ganti tema', en: 'Toggle theme' },
} as const;

export function langPrefix(lang: Lang): string {
  return lang === DEFAULT_LANG ? '' : `/${lang}`;
}

export function langFromPath(pathname: string): Lang {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'id';
}

/**
 * The canonical key shared by a post's translations. Equals the `translationKey`
 * frontmatter field, falling back to the filename slug with the `.id`/`.en`
 * suffix stripped (so the helper still works for unmigrated files).
 */
export function keyOf(entry: CollectionEntry<'posts'>): string {
  return entry.data.translationKey ?? entry.slug.replace(/\.(id|en)$/, '');
}

export function postHref(entry: CollectionEntry<'posts'>, lang: Lang = entry.data.lang): string {
  const cat = CATEGORY_TO_PATH[entry.data.category as keyof typeof CATEGORY_TO_PATH];
  return `${langPrefix(lang)}/${cat}/${keyOf(entry)}`;
}

export function categoryHref(category: string, lang: Lang): string {
  const cat = CATEGORY_TO_PATH[category as keyof typeof CATEGORY_TO_PATH] ?? category;
  return `${langPrefix(lang)}/${cat}`;
}

export function homeHref(lang: Lang): string {
  return langPrefix(lang) || '/';
}

export async function getPosts(opts: { category?: string; lang?: Lang; includeDrafts?: boolean } = {}) {
  return getCollection('posts', ({ data }) => {
    if (!opts.includeDrafts && data.draft) return false;
    if (opts.category && data.category !== opts.category) return false;
    if (opts.lang && data.lang !== opts.lang) return false;
    return true;
  });
}

/**
 * Find the counterpart entry for a given key in the requested language, or
 * undefined if no translation has been written yet.
 */
export async function findTranslation(
  key: string,
  lang: Lang,
): Promise<CollectionEntry<'posts'> | undefined> {
  const all = await getCollection('posts');
  return all.find(p => keyOf(p) === key && p.data.lang === lang);
}
