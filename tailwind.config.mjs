import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        amber: {
          50: '#faf6f0',
          100: '#f2ebe0',
          200: '#e5d5be',
          300: '#d4bc97',
          400: '#c4a882',
          500: '#a88b62',
          600: '#8d714c',
          700: '#725a3a',
          800: '#5c472f',
          900: '#4a3926',
          950: '#2d2118',
        },
        brand: {
          50: '#faf6f0',
          100: '#f2ebe0',
          200: '#e5d5be',
          300: '#d4bc97',
          400: '#c4a882',
          500: '#a88b62',
          600: '#8d714c',
          700: '#725a3a',
          800: '#5c472f',
          900: '#4a3926',
          950: '#2d2118',
        },
      },
      fontFamily: {
        sans: ['JetBrains Mono', 'Fira Code', 'monospace'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.slate[300]'),
            '--tw-prose-headings': theme('colors.slate[100]'),
            '--tw-prose-lead': theme('colors.slate[300]'),
            '--tw-prose-links': theme('colors.amber[400]'),
            '--tw-prose-bold': theme('colors.slate[100]'),
            '--tw-prose-counters': theme('colors.slate[400]'),
            '--tw-prose-bullets': theme('colors.amber[500]'),
            '--tw-prose-hr': theme('colors.slate[700]'),
            '--tw-prose-quotes': theme('colors.slate[300]'),
            '--tw-prose-quote-borders': theme('colors.amber[600]'),
            '--tw-prose-captions': theme('colors.slate[400]'),
            '--tw-prose-code': theme('colors.amber[400]'),
            '--tw-prose-pre-code': theme('colors.slate[300]'),
            '--tw-prose-pre-bg': theme('colors.slate[900]'),
            '--tw-prose-th-borders': theme('colors.slate[600]'),
            '--tw-prose-td-borders': theme('colors.slate[700]'),
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            code: {
              backgroundColor: theme('colors.slate[800]'),
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            a: {
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
              '&:hover': {
                color: theme('colors.amber[300]'),
              },
            },
            img: {
              borderRadius: '0.5rem',
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
