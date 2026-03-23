import { ImageResponse } from 'next/og'

export const config = { runtime: 'edge' }

export default async function handler(req) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') || 'Jethro May'
  const description = searchParams.get('description') || ''

  const [fontRegular, fontBold] = await Promise.all([
    fetch('https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.ttf').then((r) => r.arrayBuffer()),
    fetch('https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.ttf').then((r) => r.arrayBuffer()),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff',
          padding: '64px',
          fontFamily: 'Inter',
        }}
      >
        {/* Top: domain */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '4px',
              height: '20px',
              backgroundColor: '#14b8a6',
              borderRadius: '2px',
            }}
          />
          <span style={{ color: '#14b8a6', fontSize: '18px', fontWeight: 400, letterSpacing: '-0.01em' }}>
            jethromay.com
          </span>
        </div>

        {/* Middle: title + description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              color: '#18181b',
              fontSize: title.length > 40 ? '48px' : '56px',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                color: '#52525b',
                fontSize: '24px',
                fontWeight: 400,
                lineHeight: 1.5,
                letterSpacing: '-0.01em',
              }}
            >
              {description}
            </div>
          )}
        </div>

        {/* Bottom: author */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ color: '#a1a1aa', fontSize: '16px', fontWeight: 400 }}>
            Jethro May · Partner, Head of Development at FINN Partners
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: fontRegular, weight: 400 },
        { name: 'Inter', data: fontBold, weight: 700 },
      ],
    }
  )
}
