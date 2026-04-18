import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    type: z.enum(['video', 'disco', 'texto', 'foto', 'bio']),
    title: z.string(),
    year: z.number().nullable().optional(),
    order: z.number(),
    embed: z.string().nullable().optional(),
    artist: z.string().nullable().optional(),
    cover: z.string().nullable().optional(),
    tracks: z.array(z.object({
      title: z.string(),
      file: z.string(),
    })).optional(),
    description: z.string().nullable().optional(),
    credits: z.string().nullable().optional(),
    images: z.array(z.string()).nullable().optional(),
    showTitle: z.boolean().nullable().optional(),
    fullscreen: z.boolean().nullable().optional(),
    bgColor: z.string().nullable().optional(),
    textColor: z.string().nullable().optional(),
  }),
});

export const collections = { posts };
