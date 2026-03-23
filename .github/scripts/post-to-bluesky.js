const fs = require('fs')

const files = (process.env.NEW_ARTICLE_FILES || '').trim().split(/\s+/).filter(Boolean)

function extractMeta(content) {
  const titleMatch = content.match(/title:\s*['"](.+?)['"]/)
  const descriptionMatch = content.match(/description:\s*['"](.+?)['"]/)
  return {
    title: titleMatch?.[1] ?? null,
    description: descriptionMatch?.[1] ?? null,
  }
}

function getSlug(filePath) {
  return filePath
    .replace('src/pages/articles/', '')
    .replace(/\/index\.mdx$/, '')
    .replace(/\.mdx$/, '')
}

async function createSession() {
  const res = await fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: process.env.BLUESKY_HANDLE,
      password: process.env.BLUESKY_APP_PASSWORD,
    }),
  })
  if (!res.ok) throw new Error(`Session error: ${await res.text()}`)
  return res.json()
}

async function post(accessJwt, did, { title, description, url }) {
  const text = `New article: ${title}\n\n${url}`
  const encoder = new TextEncoder()
  const byteStart = encoder.encode(`New article: ${title}\n\n`).length
  const byteEnd = byteStart + encoder.encode(url).length

  const record = {
    $type: 'app.bsky.feed.post',
    text,
    facets: [
      {
        index: { byteStart, byteEnd },
        features: [{ $type: 'app.bsky.richtext.facet#link', uri: url }],
      },
    ],
    embed: {
      $type: 'app.bsky.embed.external',
      external: { uri: url, title, description: description ?? '' },
    },
    createdAt: new Date().toISOString(),
  }

  const res = await fetch('https://bsky.social/xrpc/com.atproto.repo.createRecord', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessJwt}`,
    },
    body: JSON.stringify({ repo: did, collection: 'app.bsky.feed.post', record }),
  })
  if (!res.ok) throw new Error(`Post error: ${await res.text()}`)
  return res.json()
}

async function main() {
  if (!files.length) {
    console.log('No new articles found.')
    return
  }

  console.log(`Found ${files.length} new article(s): ${files.join(', ')}`)

  const session = await createSession()
  console.log(`Authenticated as ${session.handle}`)

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8')
    const meta = extractMeta(content)

    if (!meta.title) {
      console.log(`Skipping ${file} — could not extract title.`)
      continue
    }

    const slug = getSlug(file)
    const url = `${process.env.SITE_URL}/articles/${slug}`

    console.log(`Posting: ${meta.title}`)
    const result = await post(session.accessJwt, session.did, { ...meta, url })
    console.log(`Posted: ${result.uri}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
