import { getAllArticles } from '@/lib/getAllArticles'

const staticRoutes = ['', '/about', '/uses', '/articles']

function generateSitemap(articles) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL

  const staticUrls = staticRoutes
    .map(
      (route) => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>monthly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`
    )
    .join('')

  const articleUrls = articles
    .map(
      (article) => `
  <url>
    <loc>${baseUrl}/articles/${article.slug}</loc>
    <lastmod>${article.date}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>`
    )
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${articleUrls}
</urlset>`
}

export async function getServerSideProps({ res }) {
  const articles = await getAllArticles()
  const sitemap = generateSitemap(articles)

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return { props: {} }
}

export default function Sitemap() {
  return null
}
