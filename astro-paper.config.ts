import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://samu9nai.vercel.app",
    title: "samu9nai.log",
    description: "개발 과정에서 마주친 설계 문제와 선택을 기록합니다.",
    author: "samu9nai",
    profile: "https://github.com/samu9nai",
    ogImage: "og.png",
    lang: "ko",
    timezone: "Asia/Seoul",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/samu9nai/myblog/edit/main/",
    },
    search: "pagefind",
  },
  socials: [
    {
      name: "github",
      url: "https://github.com/samu9nai",
      linkTitle: "GitHub에서 samu9nai 보기",
    },
  ],
  shareLinks: [
    { name: "x", url: "https://x.com/intent/post?url=" },
    {
      name: "mail",
      url: "mailto:?subject=%EA%B3%B5%EC%9C%A0%ED%95%98%EA%B3%A0%20%EC%8B%B6%EC%9D%80%20%EA%B8%80&body=",
    },
  ],
});
