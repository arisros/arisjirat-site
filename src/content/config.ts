import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    category: z.enum(['study', 'project', 'research', 'tool', 'setup']),
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
