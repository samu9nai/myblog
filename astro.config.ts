import {
  defineConfig,
  envField,
  fontProviders,
  svgoOptimizer,
} from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import config from "./astro-paper.config";

export default defineConfig({
  site: config.site.url,
  integrations: [
    mdx(),
    sitemap({
      filter: page =>
        config.features?.showArchives !== false || !page.endsWith("/archives/"),
    }),
  ],
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      name: "Pretendard",
      cssVariable: "--font-pretendard",
      provider: fontProviders.local(),
      weights: [300, 400, 500, 600, 700],
      styles: ["normal"],
      fallbacks: [
        "Apple SD Gothic Neo",
        "Noto Sans KR",
        "Malgun Gothic",
        "system-ui",
        "sans-serif",
      ],
      options: {
        variants: [
          {
            src: ["pretendard/dist/web/static/woff2/Pretendard-Light.woff2"],
            weight: 300,
            style: "normal",
          },
          {
            src: ["pretendard/dist/web/static/woff2/Pretendard-Regular.woff2"],
            weight: 400,
            style: "normal",
          },
          {
            src: ["pretendard/dist/web/static/woff2/Pretendard-Medium.woff2"],
            weight: 500,
            style: "normal",
          },
          {
            src: ["pretendard/dist/web/static/woff2/Pretendard-SemiBold.woff2"],
            weight: 600,
            style: "normal",
          },
          {
            src: ["pretendard/dist/web/static/woff2/Pretendard-Bold.woff2"],
            weight: 700,
            style: "normal",
          },
        ],
      },
    },
    {
      name: "Google Sans Code",
      cssVariable: "--font-google-sans-code",
      provider: fontProviders.google(),
      fallbacks: ["monospace"],
      weights: [400, 700],
      styles: ["normal"],
      formats: ["woff"],
    },
  ],
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
