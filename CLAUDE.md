# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev          # Start development server
bun run build    # Build for production
bun run lint     # Run ESLint
bun run start    # Start production server
```

## Architecture

Personal portfolio/blog built with **Next.js 15** (pages router), **Tailwind CSS**, and **MDX** for blog articles.

**Key directories:**
- `src/pages/` — Next.js pages; articles live in `src/pages/articles/` as `.mdx` files
- `src/components/` — Reusable UI components
- `src/lib/` — Utilities: `getAllArticles.js` (article fetching/sorting via fast-glob), `formatDate.js`, `generateRssFeed.js`
- `src/images/` — Static images imported directly into components
- `src/styles/` — Global CSS (Tailwind base + Prism syntax highlighting theme)

**Path alias:** `@/*` maps to `src/*`

## Content

Articles are MDX files in `src/pages/articles/`. Each must export metadata:

```js
export const meta = {
  author: 'Jethro May',
  date: '2024-01-01',
  title: 'Article Title',
  description: 'Short description',
}
```

Wrap the article content with `<ArticleLayout meta={meta}>...</ArticleLayout>`.

## Styling

- Tailwind CSS with dark mode via `class` strategy (toggled via `localStorage`)
- Custom typography colors use CSS variables (`--tw-prose-*`) defined in `tailwind.config.js` — primary accent is teal, grays are zinc
- Prettier sorts Tailwind classes automatically (`prettier-plugin-tailwindcss`)
- Code style: single quotes, no semicolons

## Environment

Requires `NEXT_PUBLIC_SITE_URL` — see `.env.example`.
