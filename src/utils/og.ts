import { readFile } from 'node:fs/promises'
import satori from 'satori'
import sharp from 'sharp'
import { site } from '@/site'

// satori는 woff2를 읽지 못해 ttf와 woff를 쓴다. 빌드는 저장소 루트에서 돈다.
const fontFiles = {
  regular:
    'node_modules/spoqa-han-sans/Subset/SpoqaHanSansNeo/SpoqaHanSansNeo-Regular.ttf',
  bold: 'node_modules/spoqa-han-sans/Subset/SpoqaHanSansNeo/SpoqaHanSansNeo-Bold.ttf',
  mono: 'node_modules/@fontsource/maple-mono/files/maple-mono-latin-600-normal.woff'
}

let fonts: Promise<Buffer[]> | undefined
const loadFonts = () =>
  (fonts ??= Promise.all(
    [fontFiles.regular, fontFiles.bold, fontFiles.mono].map(file =>
      readFile(file)
    )
  ))

// global.css의 라이트 테마 색과 같다.
const color = {
  bg: '#fafaf9',
  fg: '#1c1917',
  muted: '#57534e',
  border: '#e7e5e4',
  accent: '#1d4ed8'
}

interface OgImage {
  title: string
  description?: string
}

/** 1200×630 PNG를 만든다. */
export async function renderOgImage({ title, description }: OgImage) {
  const [regular, bold, mono] = await loadFonts()
  const host = new URL(import.meta.env.SITE).host

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '72px 80px',
          background: color.bg,
          color: color.fg,
          fontFamily: 'Spoqa Han Sans Neo',
          borderTop: `12px solid ${color.accent}`
        },
        children: [
          {
            type: 'div',
            props: {
              style: { fontFamily: 'Maple Mono', fontSize: 32 },
              children: site.name
            }
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                justifyContent: 'center',
                overflow: 'hidden',
                gap: 24
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: 60,
                      fontWeight: 700,
                      lineHeight: 1.3,
                      display: 'block',
                      lineClamp: 2,
                      wordBreak: 'keep-all'
                    },
                    children: title
                  }
                },
                description && {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: 30,
                      lineHeight: 1.5,
                      color: color.muted,
                      display: 'block',
                      lineClamp: 2,
                      wordBreak: 'keep-all'
                    },
                    children: description
                  }
                }
              ]
            }
          },
          {
            type: 'div',
            props: {
              style: {
                paddingTop: 28,
                borderTop: `2px solid ${color.border}`,
                fontFamily: 'Maple Mono',
                fontSize: 26,
                color: color.muted
              },
              children: host
            }
          }
        ]
      }
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Spoqa Han Sans Neo', data: regular, weight: 400 },
        { name: 'Spoqa Han Sans Neo', data: bold, weight: 700 },
        { name: 'Maple Mono', data: mono, weight: 600 }
      ]
    }
  )

  return sharp(Buffer.from(svg)).png().toBuffer()
}
