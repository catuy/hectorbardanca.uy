import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    type: z.enum(['video', 'disco', 'texto', 'foto', 'bio']),
    title: z.string(),
    year: z.number().optional(),
    order: z.number(),
    embed: z.string().optional(),
    artist: z.string().optional(),
    cover: z.string().optional(),
    tracks: z.array(z.object({
      title: z.string(),
      file: z.string(),
    })).optional(),
    description: z.string().optional(),
    credits: z.string().optional(),
    images: z.array(z.string()).optional(),
    showTitle: z.boolean().optional(),
    fullscreen: z.boolean().optional(),
    bgColor: z.string().optional(),
    textColor: z.string().optional(),
  }),
});

export const collections = { posts };
