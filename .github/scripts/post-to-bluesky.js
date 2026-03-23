const fs = require('fs')

const files = (process.env.NEW_ARTICLE_FILES || '').trim().split(/\s+/).filter(Boolean)

function extractMeta(content) {
  const titleMatch = content.match(/title:\s*['"](.+?)['"]/)
  const descriptionMatch = content.match(/description:\s*['"](.+?)['"]/)
  const tagsMatch = content.match(/tags:\s*\[([^\]]+)\]/)
  const tags = tagsMatch
    ? tagsMatch[1].match(/['"]([^'"]+)['"]/g).map((t) => t.replace(/['"]/g, ''))
    : []
  return {
    title: titleMatch?.[1] ?? null,
    description: descriptionMatch?.[1] ?? null,
    tags,
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

async function uploadThumb(accessJwt, title, description) {
  const ogUrl = `${process.env.SITE_URL}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description ?? '')}`
  const imageRes = await fetch(ogUrl)
  if (!imageRes.ok) return null
  const imageBuffer = await imageRes.arrayBuffer()
  const res = await fetch('https://bsky.social/xrpc/com.atproto.repo.uploadBlob', {
    method: 'POST',
    headers: {
      'Content-Type': 'image/png',
      Authorization: `Bearer ${accessJwt}`,
    },
    body: imageBuffer,
  })
  if (!res.ok) return null
  const { blob } = await res.json()
  return blob
}

async function post(accessJwt, did, { title, description, url, tags }) {
  const encoder = new TextEncoder()
  const hashtagLine = tags.length ? '\n\n' + tags.map((t) => `#${t}`).join(' ') : ''
  const text = `New article: ${title}\n\n${url}${hashtagLine}`

  const urlPrefix = `New article: ${title}\n\n`
  const byteStart = encoder.encode(urlPrefix).length
  const byteEnd = byteStart + encoder.encode(url).length

  const facets = [
    {
      index: { byteStart, byteEnd },
      features: [{ $type: 'app.bsky.richtext.facet#link', uri: url }],
    },
  ]

  if (tags.length) {
    let offset = encoder.encode(`New article: ${title}\n\n${url}\n\n`).length
    for (const tag of tags) {
      const tagText = `#${tag}`
      const tagStart = offset
      const tagEnd = offset + encoder.encode(tagText).length
      facets.push({
        index: { byteStart: tagStart, byteEnd: tagEnd },
        features: [{ $type: 'app.bsky.richtext.facet#tag', tag }],
      })
      offset = tagEnd + encoder.encode(' ').length
    }
  }

  const record = {
    $type: 'app.bsky.feed.post',
    text,
    facets,
    embed: {
      $type: 'app.bsky.embed.external',
      external: {
        uri: url,
        title,
        description: description ?? '',
        ...(await uploadThumb(accessJwt, title, description).then((thumb) => thumb ? { thumb } : {})),
      },
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
