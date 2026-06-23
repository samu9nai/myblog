import type { UIStrings } from "../types";

export default {
  nav: {
    home: "홈",
    posts: "글",
    tags: "태그",
    about: "소개",
    archives: "보관함",
    search: "검색",
  },
  post: {
    publishedAt: "게시",
    updatedAt: "수정",
    sharePostIntro: "이 글 공유하기",
    sharePostOn: "{{platform}}에서 이 글 공유하기",
    sharePostViaEmail: "이메일로 이 글 공유하기",
    tagLabel: "태그",
    backToTop: "맨 위로",
    goBack: "돌아가기",
    editPage: "이 글 수정하기",
    previousPost: "이전 글",
    nextPost: "다음 글",
  },
  pagination: {
    prev: "이전",
    next: "다음",
    page: "페이지",
  },
  home: {
    socialLinks: "링크",
    featured: "대표 글",
    recentPosts: "최근 글",
    allPosts: "모든 글 보기",
  },
  footer: {
    copyright: "저작권",
    allRightsReserved: "모든 권리 보유.",
  },
  pages: {
    tagTitle: "태그",
    tagDesc: "이 태그가 붙은 모든 글",

    tagsTitle: "태그",
    tagsDesc: "글에 사용된 모든 태그입니다.",

    postsTitle: "글",
    postsDesc: "지금까지 작성한 모든 글입니다.",

    archivesTitle: "보관함",
    archivesDesc: "작성한 글을 시기별로 모았습니다.",

    searchTitle: "검색",
    searchDesc: "블로그에서 원하는 글을 찾아보세요.",
  },
  a11y: {
    skipToContent: "본문으로 건너뛰기",
    openMenu: "메뉴 열기",
    closeMenu: "메뉴 닫기",
    toggleTheme: "색상 모드 전환",
    searchPlaceholder: "글 검색하기...",
    noResults: "검색 결과가 없습니다",
    goToPreviousPage: "이전 페이지로 이동",
    goToNextPage: "다음 페이지로 이동",
  },
  notFound: {
    title: "404 찾을 수 없음",
    message: "페이지를 찾을 수 없습니다",
    goHome: "홈으로 돌아가기",
  },
} satisfies UIStrings;
