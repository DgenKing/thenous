import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const chapters = defineCollection({
  loader: glob({ base: './src/content/chapters', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string().min(150).max(160),
    part: z.string(),
    partTitle: z.string(),
    order: z.number(),
    heroImage: z.string().optional(),
    ogImage: z.string().optional(),
  }),
});

export const collections = { chapters };
