import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

const SITE_URL = import.meta.env.PUBLIC_SITE_URL || 'https://jethromay.com'

export const GET: APIRoute = async () => {
  const articles = (await getCollection('articles')).sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  )

  const articleLines = articles.map(
    (article) =>
      `- [${article.data.title}](${SITE_URL}/articles/${article.id}): ${article.data.description}`,
  )

  const body = [
    '# Jethro May',
    '',
    '> Partner and Head of Development at FINN Partners UK, based in London. I lead global development teams, build AI-first engineering workflows, and write about engineering leadership and the realities of running agency dev teams.',
    '',
    'This is my personal site: a short professional profile, the side projects I ship, and occasional writing. It is not a company site and has no products for sale.',
    '',
    '## Pages',
    '',
    `- [Home](${SITE_URL}/): Profile, current role, recent writing, and links to my work.`,
    `- [About](${SITE_URL}/about): Longer background on my career and how I work.`,
    `- [Projects](${SITE_URL}/projects): Side projects, including AuditZap, an AI-powered website audit tool.`,
    `- [Uses](${SITE_URL}/uses): The software, hardware, and services I rely on day to day.`,
    `- [Articles](${SITE_URL}/articles): Index of everything I have written.`,
    '',
    '## Articles',
    '',
    ...articleLines,
    '',
    '## Elsewhere',
    '',
    '- [GitHub](https://github.com/jethromayuk/)',
    '- [LinkedIn](https://www.linkedin.com/in/jethromay/)',
    '- [Bluesky](https://bsky.app/profile/jethromay.bsky.social)',
    `- [RSS](${SITE_URL}/rss.xml)`,
    '',
  ].join('\n')

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
