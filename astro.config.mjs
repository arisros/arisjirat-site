import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import rehypeExternalLinks from 'rehype-external-links';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://arisjirat.com',
  integrations: [
    tailwind(),
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'id',
        locales: { id: 'id', en: 'en' },
      },
    }),
  ],
  markdown: {
    // Dual Shiki themes — global.css swaps to dark when `html.dark` is set.
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
      rehypeKatex,
    ],
  },
  image: {
    domains: [],
  },
});
