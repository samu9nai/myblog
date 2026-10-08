import { readFile } from 'node:fs/promises'
import satori from 'satori'
import sharp from 'sharp'
import { site } from '@/site'
import { ogVersion } from '@/utils/og-version'
import template from './og.ts?raw'

// satori는 woff2를 읽지 못해 woff를 쓴다. 빌드는 저장소 루트에서 돈다.
const fontFiles = {
  regular:
    'src/assets/fonts/hakgyoansim-dunggeunmiso/HakgyoansimDunggeunmiso-R.woff',
  bold: 'src/assets/fonts/hakgyoansim-dunggeunmiso/HakgyoansimDunggeunmiso-B.woff',
  mono: 'node_modules/@fontsource/maple-mono/files/maple-mono-latin-600-normal.woff'
}

let fonts: Promise<Buffer[]> | undefined
const loadFonts = () =>
  (fonts ??= Promise.all(
    [fontFiles.regular, fontFiles.bold, fontFiles.mono].map(file =>
      readFile(file)
    )
  ))

// global.css의 다크 테마(기본) 색과 같다. 위쪽 띠는 두 테마에 공통인 금빛이다.
const color = {
  bg: '#0c0a10',
  fg: '#efeaf4',
  muted: '#a79eb4',
  border: '#28222f',
  accent: '#f1cb67'
}

interface OgImage {
  title: string
  description?: string
}

/** 글이 아닌 페이지가 함께 쓰는 기본 OG 이미지의 내용이다. */
export const defaultOgImage: OgImage = { title: site.description }

/** 이 파일(그리는 방법)이나 제목·설명이 바뀔 때만 바뀌는 이미지 주소를 만든다. */
export const ogImagePath = (path: string, { title, description }: OgImage) =>
  `${path}?v=${ogVersion(template, title, description)}`

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
          fontFamily: 'Hakgyoansim Dunggeunmiso',
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
        { name: 'Hakgyoansim Dunggeunmiso', data: regular, weight: 400 },
        { name: 'Hakgyoansim Dunggeunmiso', data: bold, weight: 700 },
        { name: 'Maple Mono', data: mono, weight: 600 }
      ]
    }
  )

  return sharp(Buffer.from(svg)).png().toBuffer()
}
