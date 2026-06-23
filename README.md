# samu9nai.log

개발 과정에서 마주친 설계 문제와 선택을 기록하는 개인 블로그입니다.

- Website: [samu9nai.vercel.app](https://samu9nai.vercel.app)
- Author: [samu9nai](https://github.com/samu9nai)
- Theme: [AstroPaper](https://github.com/satnaing/astro-paper)

## 기술 구성

- Astro 6
- TypeScript
- Tailwind CSS 4
- Astro Content Collections
- Pagefind
- Satori + Sharp
- Vercel

## 로컬 실행

```bash
pnpm install
pnpm dev
```

프로덕션 빌드와 검사는 다음 명령으로 실행합니다.

```bash
pnpm lint
pnpm format:check
pnpm build
```

## 글 작성

글은 `src/content/posts` 아래에 Markdown 또는 MDX로 작성합니다.

```yaml
---
pubDatetime: 2026-06-22T00:00:00+09:00
title: 글 제목
featured: false
draft: true
tags:
  - project
description: 글을 한 문장으로 설명합니다.
timezone: Asia/Seoul
---
```

초안은 `draft: true`로 유지하고, 공개할 때 `false`로 변경합니다.

## 주요 커스텀

- 한국어 UI와 서울 시간대
- Spoqa Han Sans Neo 본문·제목 및 마포꽃섬 포인트
- 중립 배경과 파스텔 핑크·블루 포인트의 라이트/다크 테마
- 한글을 지원하는 동적 OG 이미지
- Pagefind 정적 검색

## 원본 테마 동기화

원본 AstroPaper 저장소는 `astro-paper` 리모트로 연결되어 있습니다.

```bash
git fetch astro-paper
git merge astro-paper/main
```

원본 테마의 저작권과 라이선스는 [LICENSE](LICENSE)를 따릅니다.
