# jethromay.com

Personal portfolio and blog. Built with [Astro](https://astro.build/) and MDX, deployed on [Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/) via static assets.

## Tech stack

- [Astro 6](https://astro.build/) — static output, zero JS by default
- [TypeScript](https://www.typescriptlang.org/) — strict mode (`astro/tsconfigs/strict`)
- [Tailwind CSS 4](https://tailwindcss.com/) — via `@tailwindcss/vite`
- [MDX](https://mdxjs.com/) — articles via Astro Content Collections with Zod-validated frontmatter
- [React](https://react.dev/) — single client island for the header (mobile nav, theme toggle, scroll-driven avatar)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/) — Static Assets via `@astrojs/cloudflare`

## Getting started

```bash
cp .env.example .env.local      # set PUBLIC_SITE_URL
bun install
bun dev
```

The dev server runs at [http://localhost:4321](http://localhost:4321).

## Commands

| Command | What it does |
| --- | --- |
| `bun dev` | Astro dev server with HMR |
| `bun run build` | `astro check` (TS + Astro diagnostics) then `astro build` → `dist/` |
| `bun run preview` | Builds, then serves via `wrangler dev` (real Workers runtime) |
| `bun run lint` | `astro check` only |
| `bun run deploy` | Manual deploy via `wrangler deploy` (normally CI handles this) |
| `bun run generate-types` | Regenerate `worker-configuration.d.ts` from `wrangler.jsonc` bindings |

## Writing articles

Articles are MDX files in `src/content/articles/` with YAML frontmatter. The schema is defined in [`src/content.config.ts`](./src/content.config.ts):

```mdx
---
author: Jethro May
date: '2024-01-01'
updated: '2024-02-15'   # optional — used for dateModified in structured data
title: Article Title
description: Short description
hook: |                  # optional — teaser copy
  Two-line hook for the article.
tags:                    # optional
  - webdev
  - AI
---

Article body here. Standard MDX — code blocks get Prism syntax highlighting,
links use teal accents, headings auto-style via @tailwindcss/typography.
```

Save the file with a kebab-case slug — that becomes the URL (`/articles/<slug>`). The dynamic route at `src/pages/articles/[...slug].astro` picks it up automatically; no need to wire it up manually.

## Project layout

```
src/
  pages/              Astro pages and routes
    articles/
      [...slug].astro Dynamic article route
      index.astro     Article index
    index.astro       Home
    about.astro
    projects.astro
    uses.astro
    rss.xml.js        RSS feed (@astrojs/rss)
  content/
    articles/         MDX article source files
  layouts/
    RootLayout.astro  Global wrapper, head, theme-init script
    ArticleLayout.astro
  components/
    Header.tsx        React island (client:load)
    *.astro           Static components
    icons/            SVG icons as .astro
  lib/                Small utilities (formatDate.ts)
  styles/             tailwind.css + prism.css
  images/             Static images imported into components
public/
  _redirects          Cloudflare redirect rules
  _headers            Cloudflare security headers
```

## Deployment

Deployed automatically on push to `main` by Cloudflare Workers Builds. Configuration lives in [`wrangler.jsonc`](./wrangler.jsonc); the deploy target is a single Worker named `jethromay` serving the static `dist/` via the [Static Assets binding](https://developers.cloudflare.com/workers/static-assets/).

## Environment

`PUBLIC_SITE_URL` is the only required variable — see [`.env.example`](./.env.example). The `PUBLIC_` prefix is Astro's convention for client-exposed env vars.
