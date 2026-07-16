import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const chapters = defineCollection({
  // generateId keeps filename dots (1.1-...) that Astro's default slugifier strips.
  loader: glob({
    base: './src/content/chapters',
    pattern: '**/*.md',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    // Finished legacy pages retain their original SEO descriptions verbatim.
    description: z.string().min(50).max(200),
    part: z.string(),
    partTitle: z.string(),
    order: z.number(),
    heroImage: z.string().optional(),
    ogImage: z.string().optional(),
  }),
});

export const collections = { chapters };
