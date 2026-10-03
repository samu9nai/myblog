import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import astroExpressiveCode from 'astro-expressive-code'

export default defineConfig({
  site: 'https://blog.samu9nai.workers.dev',
  trailingSlash: 'always',
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
          '"Spoqa Han Sans Neo", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", system-ui, sans-serif',
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
    plugins: [tailwindcss()]
  }
})
