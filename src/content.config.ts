import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Writing: one Markdown file per post in src/content/writing/, with its
// pictures in a folder of the same name beside it.
const writing = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/writing' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      excerpt: z.string(),
      tags: z.array(z.string()).default([]),
      image: image().optional(),          // shown when the post is shared
    }),
});

export const collections = { writing };
