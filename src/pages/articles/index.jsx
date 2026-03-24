import Head from 'next/head'

import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import { StructuredData } from '@/components/StructuredData'
import { formatDate } from '@/lib/formatDate'
import { getAllArticles } from '@/lib/getAllArticles'

function Article({ article }) {
  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card className="md:col-span-3">
        <Card.Title href={`/articles/${article.slug}`}>
          {article.title}
        </Card.Title>
        <Card.Eyebrow
          as="time"
          dateTime={article.date}
          className="md:hidden"
          decorate
        >
          {formatDate(article.date)}
        </Card.Eyebrow>
        <Card.Description>{article.description}</Card.Description>
        <Card.Cta>Read article</Card.Cta>
      </Card>
      <Card.Eyebrow
        as="time"
        dateTime={article.date}
        className="mt-1 hidden md:block"
      >
        {formatDate(article.date)}
      </Card.Eyebrow>
    </article>
  )
}

export default function ArticlesIndex({ articles }) {
  return (
    <>
      <Head>
        <title>Articles - Jethro May</title>
        <meta
          name="description"
          content="Articles on web development, engineering leadership, and technology by Jethro May."
        />
        <link rel="canonical" href="https://jethromay.com/articles" />
        <meta property="og:url" content="https://jethromay.com/articles" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Articles - Jethro May" />
        <meta property="og:description" content="Articles on web development, engineering leadership, and technology by Jethro May." />
        <meta property="og:image" content="https://jethromay.com/me.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Articles - Jethro May" />
        <meta name="twitter:description" content="Articles on web development, engineering leadership, and technology by Jethro May." />
        <meta name="twitter:image" content="https://jethromay.com/me.jpg" />
      </Head>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Articles - Jethro May',
          description:
            'Articles on web development, engineering leadership, and technology by Jethro May.',
          url: 'https://jethromay.com/articles',
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: articles.map((article, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: `https://jethromay.com/articles/${article.slug}`,
              name: article.title,
            })),
          },
        }}
      />
      <SimpleLayout
        title="Sometimes, I write blog posts about things I find interesting."
        intro="I don't publish them frequently, but when I do, I post them here."
      >
        <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
          <div className="flex max-w-3xl flex-col space-y-16">
            {articles.map((article) => (
              <Article key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </SimpleLayout>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      articles: (await getAllArticles()).map(({ component, ...meta }) => meta),
    },
  }
}
