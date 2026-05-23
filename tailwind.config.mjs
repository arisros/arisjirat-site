import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic theme tokens — actual values come from CSS variables defined
        // in src/styles/global.css (:root for light/cream, .dark for dark).
        // Tokens use the `rgb(var(--token) / <alpha-value>)` pattern so Tailwind
        // alpha utilities (`bg-accent/40`) work in both themes.
        bg:           'rgb(var(--bg) / <alpha-value>)',
        surface:      'rgb(var(--surface) / <alpha-value>)',
        'surface-alt':'rgb(var(--surface-alt) / <alpha-value>)',
        ink:          'rgb(var(--ink) / <alpha-value>)',
        'ink-muted':  'rgb(var(--ink-muted) / <alpha-value>)',
        border:       'rgb(var(--border) / <alpha-value>)',
        accent: {
          DEFAULT:    'rgb(var(--accent) / <alpha-value>)',
          strong:     'rgb(var(--accent-strong) / <alpha-value>)',
        },
      },
      fontFamily: {
        // Sofia Sans (geometric sans, close to Mastercard's proprietary MarkForMC)
        // for prose and headlines; JetBrains Mono for labels and code.
        sans: ['Sofia Sans', 'system-ui', '-apple-system', 'Segoe UI', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        // Mastercard headline tracking: -2%.
        tightish: '-0.02em',
      },
      borderRadius: {
        // Mastercard motif: oversized pill radii and large card rounding.
        pill:  '9999px',
        card:  '1.25rem',
        panel: '1.75rem',
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body':          'rgb(var(--ink-muted))',
            '--tw-prose-headings':      'rgb(var(--ink))',
            '--tw-prose-lead':          'rgb(var(--ink-muted))',
            '--tw-prose-links':         'rgb(var(--accent))',
            '--tw-prose-bold':          'rgb(var(--ink))',
            '--tw-prose-counters':      'rgb(var(--ink-muted))',
            '--tw-prose-bullets':       'rgb(var(--accent))',
            '--tw-prose-hr':            'rgb(var(--border))',
            '--tw-prose-quotes':        'rgb(var(--ink))',
            '--tw-prose-quote-borders': 'rgb(var(--accent))',
            '--tw-prose-captions':      'rgb(var(--ink-muted))',
            '--tw-prose-code':          'rgb(var(--accent-strong))',
            '--tw-prose-pre-code':      'rgb(var(--ink))',
            '--tw-prose-pre-bg':        'rgb(var(--surface-alt))',
            '--tw-prose-th-borders':    'rgb(var(--border))',
            '--tw-prose-td-borders':    'rgb(var(--border))',
            'code::before': { content: 'none' },
            'code::after':  { content: 'none' },
            code: {
              backgroundColor: 'rgb(var(--surface-alt))',
              color: 'rgb(var(--accent-strong))',
              padding: '0.2em 0.4em',
              borderRadius: '0.4rem',
              fontWeight: '500',
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: 'inherit',
              padding: 0,
            },
            pre: {
              borderRadius: '1rem',
              border: '1px solid rgb(var(--border))',
            },
            a: {
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              textDecorationColor: 'rgb(var(--accent) / 0.4)',
              '&:hover': {
                color: 'rgb(var(--accent-strong))',
                textDecorationColor: 'rgb(var(--accent-strong))',
              },
            },
            img: {
              borderRadius: '1rem',
              border: '1px solid rgb(var(--border))',
            },
            blockquote: {
              fontStyle: 'normal',
              borderLeftWidth: '3px',
              borderLeftColor: 'rgb(var(--accent))',
              backgroundColor: 'rgb(var(--surface))',
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
            },
            'blockquote p:first-of-type::before': { content: 'none' },
            'blockquote p:last-of-type::after':   { content: 'none' },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
