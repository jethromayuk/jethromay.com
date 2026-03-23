import Head from 'next/head'

// data is always JSON.stringify'd from our own static objects — not user input
// so dangerouslySetInnerHTML is safe here (standard Next.js JSON-LD pattern)
export function StructuredData({ data }) {
  return (
    <Head>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    </Head>
  )
}
