import { defineConfig } from 'astro/config'
import { satteri } from '@astrojs/markdown-satteri'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import astroExpressiveCode from 'astro-expressive-code'
import { mermaidBlocks } from './src/utils/mermaid'

export default defineConfig({
  site: 'https://blog.samu9nai.workers.dev',
  trailingSlash: 'always',
  markdown: {
    processor: satteri({ mdastPlugins: [mermaidBlocks] })
  },
  integrations: [
    // 예전 블로그 설정을 그대로 옮겼다. 라이트 모드에서도 코드 블록은 어두운 테마 하나를 쓴다.
    astroExpressiveCode({
      themes: ['catppuccin-mocha'],
      emitExternalStylesheet: false,
      useDarkModeMediaQuery: false,
      themeCssSelector: false,
      defaultProps: {
        wrap: false
      },
      frames: {
        extractFileNameFromCode: true,
        showCopyToClipboardButton: true
      },
      styleOverrides: {
        borderColor: 'var(--border)',
        borderRadius: '0.75rem',
        borderWidth: '1px',
        codeFontFamily:
          '"Maple Mono", "D2Coding", "Sarasa Mono K", "Sarasa Mono J", "Sarasa Mono HC", ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        codeFontSize: '0.875rem',
        codeLineHeight: '1.65',
        focusBorder: 'var(--accent)',
        uiFontFamily:
          '"Hakgyoansim Dunggeunmiso", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", system-ui, sans-serif',
        uiFontSize: '0.75rem',
        frames: {
          editorActiveTabIndicatorTopColor: 'var(--accent)',
          frameBoxShadowCssValue: 'none',
          shadowColor: 'transparent'
        }
      }
    }),
    sitemap()
  ],
  vite: {
    plugins: [tailwindcss()],
    // mermaid는 글 페이지에서 동적으로 불러온다. 개발 서버가 뒤늦게 발견해 의존성을 다시 묶으면
    // 이미 열린 페이지의 import가 504(Outdated Optimize Dep)로 깨지므로 처음부터 묶어 둔다.
    optimizeDeps: { include: ['mermaid'] }
  }
})
