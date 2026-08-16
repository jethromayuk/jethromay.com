// @ts-check
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import rehypePrism from '@mapbox/rehype-prism'
import remarkGfm from 'remark-gfm'
import cloudflare from '@astrojs/cloudflare'

const SITE = process.env.PUBLIC_SITE_URL || 'https://jethromay.com'

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'ignore',
  // 'compile' optimises images with Sharp at build time. The adapter default
  // ('cloudflare-binding') would defer every transform to a runtime Images
  // binding this Worker does not have.
  adapter: cloudflare({ imageService: 'compile' }),
  integrations: [
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypePrism],
    }),
    react(),
    sitemap({
      filter: (page) => !page.includes('/rss.xml') && !page.includes('/llms.txt'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    syntaxHighlight: false,
  },
})
