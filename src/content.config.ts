import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    badge: z.string(),
    summary: z.string(),
    meta: z.string(),
    repo: z.string().url(),
    tags: z.array(z.string()),
    media: z.object({
      kind: z.enum(['video', 'image', 'pair', 'type']),
      src: z.string().optional(),
      src2: z.string().optional(),
      poster: z.string().optional(),
      alt: z.string().optional(),
      text: z.string().optional(),
      layout: z.enum(['bleed', 'center', 'phone', 'fill']).optional(),
    }),
    fullVideo: z.string().optional(),
  }),
});

export const collections = { projects };
