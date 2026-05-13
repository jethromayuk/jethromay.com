import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro:schema'

const articles = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/articles' }),
  schema: z.object({
    author: z.string(),
    date: z.string(),
    updated: z.string().optional(),
    title: z.string(),
    description: z.string(),
    hook: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
})

export const collections = { articles }
