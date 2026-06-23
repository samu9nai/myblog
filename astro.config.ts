import { defineConfig, envField, svgoOptimizer } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import astroExpressiveCode from "astro-expressive-code";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import rehypeCallouts from "rehype-callouts";
import config from "./astro-paper.config";

export default defineConfig({
  site: config.site.url,
  integrations: [
    astroExpressiveCode({
      themes: ["catppuccin-mocha"],
      emitExternalStylesheet: false,
      useDarkModeMediaQuery: false,
      themeCssSelector: false,
      defaultProps: {
        wrap: false,
      },
      frames: {
        extractFileNameFromCode: true,
        showCopyToClipboardButton: true,
      },
      styleOverrides: {
        borderColor: "var(--border)",
        borderRadius: "0.75rem",
        borderWidth: "1px",
        codeFontFamily:
          '"Maple Mono", "D2Coding", "Sarasa Mono K", "Sarasa Mono J", "Sarasa Mono HC", ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        codeFontSize: "0.875rem",
        codeLineHeight: "1.65",
        focusBorder: "var(--accent)",
        uiFontFamily:
          '"Spoqa Han Sans Neo", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", system-ui, sans-serif',
        uiFontSize: "0.75rem",
        frames: {
          editorActiveTabIndicatorTopColor: "var(--accent)",
          frameBoxShadowCssValue: "none",
          shadowColor: "transparent",
        },
      },
    }),
    mdx(),
    sitemap({
      filter: page => {
        if (page.endsWith("/font-preview/")) return false;

        return (
          config.features?.showArchives !== false ||
          !page.endsWith("/archives/")
        );
      },
    }),
  ],
  i18n: {
    locales: ["ko"],
    defaultLocale: "ko",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
      ],
      rehypePlugins: [rehypeCallouts],
    }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
