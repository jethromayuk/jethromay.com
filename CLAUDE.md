# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev          # Start Astro dev server (http://localhost:4321)
bun run build    # astro check + astro build → static output in dist/
bun run preview  # Serve the production build locally
bun run lint     # Run astro check (TypeScript + Astro diagnostics)
```

## Architecture

Personal portfolio/blog built with **Astro 6** (static output), **TypeScript** (strict mode via `astro/tsconfigs/strict`), **Tailwind CSS 4** (via `@tailwindcss/vite`), and **MDX** for blog articles.

The site ships zero JavaScript by default — only the header (mobile nav + theme toggle + scroll-driven avatar) hydrates as a React island via `client:load`.

**Key directories:**
- `src/pages/` — Astro pages and routes. `articles/[...slug].astro` is the dynamic article route.
- `src/content/articles/` — MDX article source files (managed by Astro Content Collections, schema in `src/content.config.ts`)
- `src/layouts/` — `RootLayout.astro` (global wrapper, head, theme-init script) and `ArticleLayout.astro` (article wrapper)
- `src/components/` — Mostly `.astro` (static); `Header.tsx` is the one React island. Icons under `src/components/icons/` are `.astro`.
- `src/lib/` — Small utilities (`formatDate.ts`)
- `src/images/` — Static images imported into components
- `src/styles/` — `tailwind.css` (entry) + `prism.css` (syntax highlighting theme)
- `public/_redirects` + `public/_headers` — Cloudflare Pages redirect/header rules

**Path alias:** `@/*` maps to `src/*`

## Content

Articles are MDX files in `src/content/articles/` with YAML frontmatter validated by the Zod schema in `src/content.config.ts`:

```mdx
---
author: Jethro May
date: '2024-01-01'
title: Article Title
description: Short description
# optional: updated, hook, tags
---

Article body here. Standard MDX.
```

The article body is rendered by `src/pages/articles/[...slug].astro` using `getStaticPaths` + `render(entry)`. No need to wrap in a layout manually — `ArticleLayout.astro` is applied automatically by the route.

RSS feed is generated at `src/pages/rss.xml.js` via `@astrojs/rss`; sitemap is the `@astrojs/sitemap` integration (configured in `astro.config.mjs`). Both pull from the same `articles` collection.

## Styling

- Tailwind CSS 4 via the Vite plugin. Config still in `tailwind.config.js` (referenced from `src/styles/tailwind.css` via `@config`).
- Dark mode uses the `class` strategy, toggled via `localStorage` by the inline `modeScript` in `RootLayout.astro` (runs synchronously in `<head>` to prevent FOUC).
- Custom typography colors use CSS variables (`--tw-prose-*`) defined in `tailwind.config.js` — primary accent is teal, greys are zinc.
- Prism syntax highlighting colours are pinned to sRGB hex inside `pre[class*='language-']` in `prism.css` to keep code blocks visually stable across Tailwind palette updates (oklch vs hex).
- Prettier sorts Tailwind classes (`prettier-plugin-tailwindcss`); Astro files via `prettier-plugin-astro`.
- Code style: single quotes, no semicolons.

## Deployment

Deployed to **Cloudflare Pages** via the GitHub integration. Build command `bun run build`, output `dist/`, Node 20. Required env var: `PUBLIC_SITE_URL`.

`public/_redirects` carries legacy `/posts/*` → `/articles` redirects from the old Next.js site, plus `/rss/feed.{xml,json}` → `/rss.xml`. `public/_headers` carries the security headers (HSTS, X-Frame-Options, Referrer-Policy, X-Content-Type-Options).

## Environment

Requires `PUBLIC_SITE_URL` — see `.env.example`. Note: the `PUBLIC_` prefix is required for client-exposed vars in Astro (replaces the old `NEXT_PUBLIC_` convention).
