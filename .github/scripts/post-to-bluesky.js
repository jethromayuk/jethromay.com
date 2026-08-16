import fs from 'node:fs'

const files = (process.env.NEW_ARTICLE_FILES || '').trim().split(/\s+/).filter(Boolean)

function unquote(value) {
  const trimmed = value.trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

// Minimal YAML frontmatter reader covering the shapes used by the articles
// collection: plain scalars, quoted scalars, inline arrays, and `|` block
// scalars. Kept dependency-free because the workflow runs without installing.
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}

  const lines = match[1].split(/\r?\n/)
  const data = {}

  for (let i = 0; i < lines.length; i++) {
    const keyMatch = lines[i].match(/^([A-Za-z_][\w-]*):\s*(.*)$/)
    if (!keyMatch) continue

    const [, key, rawValue] = keyMatch

    if (/^[|>][+-]?$/.test(rawValue.trim())) {
      const block = []
      while (i + 1 < lines.length && /^(\s{2,}|\s*$)/.test(lines[i + 1])) {
        block.push(lines[++i].replace(/^\s{2}/, ''))
      }
      data[key] = block.join('\n').trim()
      continue
    }

    if (rawValue.trim().startsWith('[')) {
      const inner = rawValue.trim().replace(/^\[|\]$/g, '')
      data[key] = inner
        .split(',')
        .map((item) => unquote(item))
        .filter(Boolean)
      continue
    }

    data[key] = unquote(rawValue)
  }

  return data
}

function extractMeta(content) {
  const data = parseFrontmatter(content)
  return {
    title: data.title || null,
    description: data.description || null,
    hook: data.hook || null,
    tags: Array.isArray(data.tags) ? data.tags : [],
  }
}

function getSlug(filePath) {
  return filePath
    .replace('src/content/articles/', '')
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
  const ogUrl = `${process.env.SITE_URL}/og.png`
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

async function createRecord(accessJwt, did, record) {
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

// First post: native text only, no link, no embed (better reach).
// Uses `hook` from meta if present, falls back to title + description.
function buildNativeText({ title, description, hook }) {
  const nativeText = hook ?? `${title}\n\n${description ?? ''}`
  const graphemeCount = [...nativeText].length
  if (graphemeCount > 300) {
    throw new Error(`Native post text is ${graphemeCount} graphemes — Bluesky limit is 300. Shorten the hook in the article meta.`)
  }
  return nativeText
}

function buildReplyText({ url, tags }) {
  const hashtagLine = tags.length ? '\n\n' + tags.map((t) => `#${t}`).join(' ') : ''
  return `${url}${hashtagLine}`
}

async function post(accessJwt, did, { title, description, hook, url, tags }) {
  const encoder = new TextEncoder()

  const nativeText = buildNativeText({ title, description, hook })
  const firstRecord = {
    $type: 'app.bsky.feed.post',
    text: nativeText,
    createdAt: new Date().toISOString(),
  }
  const firstPost = await createRecord(accessJwt, did, firstRecord)

  // Reply post: link + hashtags + embed card, threaded under the first
  const replyText = buildReplyText({ url, tags })

  const urlByteEnd = encoder.encode(url).length
  const facets = [
    {
      index: { byteStart: 0, byteEnd: urlByteEnd },
      features: [{ $type: 'app.bsky.richtext.facet#link', uri: url }],
    },
  ]

  if (tags.length) {
    let offset = encoder.encode(`${url}\n\n`).length
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

  const replyRef = {
    root: { uri: firstPost.uri, cid: firstPost.cid },
    parent: { uri: firstPost.uri, cid: firstPost.cid },
  }

  const replyRecord = {
    $type: 'app.bsky.feed.post',
    text: replyText,
    facets,
    reply: replyRef,
    embed: {
      $type: 'app.bsky.embed.external',
      external: {
        uri: url,
        title,
        description: description ?? '',
        ...(await uploadThumb(accessJwt, title, description).then((thumb) => (thumb ? { thumb } : {}))),
      },
    },
    createdAt: new Date().toISOString(),
  }

  return createRecord(accessJwt, did, replyRecord)
}

async function main() {
  const dryRun = /^(1|true)$/i.test(process.env.DRY_RUN ?? '')

  if (!files.length) {
    console.log('No new articles found.')
    return
  }

  console.log(`Found ${files.length} new article(s): ${files.join(', ')}`)

  const session = dryRun ? null : await createSession()
  console.log(dryRun ? 'Dry run: nothing will be published.' : `Authenticated as ${session.handle}`)

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8')
    const meta = extractMeta(content)

    if (!meta.title) {
      console.log(`Skipping ${file} — could not extract title.`)
      continue
    }

    const slug = getSlug(file)
    const url = `${process.env.SITE_URL}/articles/${slug}`

    if (dryRun) {
      console.log(`\n--- ${file} ---`)
      console.log(buildNativeText(meta))
      console.log('--- reply ---')
      console.log(buildReplyText({ url, tags: meta.tags }))
      continue
    }

    console.log(`Posting: ${meta.title}`)
    const result = await post(session.accessJwt, session.did, { ...meta, url })
    console.log(`Posted thread reply: ${result.uri}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
