import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    category: z.enum(['study', 'project', 'research', 'tool', 'setup']),
    // Bilingual fields. `lang` is the language of this file's content.
    // `translationKey` pairs translations of the same canonical post; it doubles
    // as the route slug (e.g. "/studies/<translationKey>") so URLs stay stable
    // across languages and across renames.
    lang: z.enum(['id', 'en']).default('id'),
    translationKey: z.string().optional(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    repo: z.string().url().optional(),
    featured: z.boolean().default(false),
    status: z.enum(['completed', 'in-progress', 'archived']).default('completed'),
    draft: z.boolean().default(false),
    // study-specific
    semester: z.number().optional(),
    course: z.string().optional(),
    subtitle: z.string().optional(),
    // project-specific
    tech: z.array(z.string()).default([]),
    demo: z.string().url().optional(),
  }),
});

export const collections = { posts };
