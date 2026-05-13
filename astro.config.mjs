// @ts-check
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import rehypePrism from '@mapbox/rehype-prism'
import remarkGfm from 'remark-gfm'

const SITE = process.env.PUBLIC_SITE_URL || 'https://jethromay.com'

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypePrism],
    }),
    react(),
    sitemap({
      filter: (page) => !page.includes('/rss.xml'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    syntaxHighlight: false,
  },
})
