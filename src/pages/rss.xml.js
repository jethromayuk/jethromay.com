import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'

export async function GET(context) {
  const articles = await getCollection('articles')
  const sorted = articles.sort(
    (a, b) =>
      new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  )

  return rss({
    title: 'Jethro May',
    description:
      'Articles on web development, technology, and engineering leadership by Jethro May.',
    site: context.site,
    items: sorted.map((article) => ({
      title: article.data.title,
      pubDate: new Date(article.data.updated || article.data.date),
      description: article.data.description,
      link: `/articles/${article.id}/`,
    })),
    customData: `<language>en-gb</language>`,
  })
}
