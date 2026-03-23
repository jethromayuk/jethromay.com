# jethromay.com

Personal portfolio and blog built with Next.js and MDX.

## Tech Stack

- [Next.js 15](https://nextjs.org/) (pages router)
- [Tailwind CSS](https://tailwindcss.com/)
- [MDX](https://mdxjs.com/) for blog articles

## Getting Started

Copy the environment file and set your site URL:

```bash
cp .env.example .env.local
```

Install dependencies and start the development server:

```bash
bun install
bun dev
```

The site will be available at [http://localhost:3000](http://localhost:3000).

## Commands

| Command | Description |
| --- | --- |
| `bun dev` | Start development server |
| `bun run build` | Build for production |
| `bun run lint` | Run ESLint |
| `bun run start` | Start production server |

## Writing Articles

Articles are MDX files in `src/pages/articles/`. Each file must export a `meta` object:

```js
export const meta = {
  author: 'Jethro May',
  date: '2024-01-01',
  title: 'Article Title',
  description: 'Short description',
}
```

Wrap the content with `ArticleLayout`:

```jsx
export default (props) => <ArticleLayout meta={meta} {...props} />
```
