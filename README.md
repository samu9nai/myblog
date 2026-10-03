# samu9nai

samu9nai의 포트폴리오, 이력서, 블로그를 한곳에 모은 정적 사이트입니다. 이 문서를 읽으면 로컬에서 사이트를 띄우고, 검사를 돌리고, Cloudflare Workers에 배포할 수 있습니다.

## 기술 구성

| 영역        | 도구                                                |
| ----------- | --------------------------------------------------- |
| 프레임워크  | Astro 7 (정적 출력), TypeScript 6                   |
| 스타일      | Tailwind CSS 4                                      |
| 린트·서식   | oxlint + oxlint-tsgolint (type-aware), Prettier 3.9 |
| 커밋 훅     | husky + lint-staged                                 |
| 배포        | Cloudflare Workers 정적 자산 (Workers Builds)       |
| 의존성 갱신 | Renovate (월 1회, 공개 후 3일 지난 버전만)          |

TypeScript는 6에 둡니다. `astro check`가 TypeScript 7을 지원하지 않기 때문입니다. TypeScript 7.1과 `@astrojs/ts-content-mapper`가 정식으로 나오면 올립니다.

## 로컬 실행

Node 24.21.0(`.node-version`)과 pnpm 12.8.1(`packageManager`)을 씁니다.

```bash
pnpm install
pnpm dev        # http://localhost:4321
```

배포 환경과 같은 Workers 런타임으로 빌드 결과를 확인하려면 다음을 실행합니다.

```bash
pnpm build
pnpm preview    # http://localhost:8787
```

## 검사 명령

CI가 같은 순서로 돕니다. 커밋할 때는 pre-commit 훅이 바뀐 파일에만 oxlint와 Prettier를 실행합니다.

```bash
pnpm format:check
pnpm lint
pnpm type-check
pnpm build
pnpm exec wrangler deploy --dry-run
```

## 배포

Cloudflare 대시보드의 Workers Builds가 GitHub 저장소 `samu9nai/myblog`에 연결되어 push마다 배포합니다. 설정값은 다음과 같습니다.

| 항목        | 값                                                     |
| ----------- | ------------------------------------------------------ |
| 빌드 명령   | `pnpm build`                                           |
| 배포 명령   | `pnpm run deploy`                                      |
| Worker 이름 | `samu9nai` (`wrangler.jsonc`의 `name`과 같아야 합니다) |

`wrangler.jsonc`는 `dist`를 정적 자산으로 올리고, 없는 경로에는 `404.html`을 돌려줍니다.

## 라이선스

소스 코드는 [MIT 라이선스](./LICENSE)를 따릅니다. `src/content/`, `src/data/`, `public/` 아래의 글, 프로젝트 소개, 이력서 데이터, 이미지는 MIT 라이선스에 포함되지 않으며 저작권은 Mingyu Joung에게 있습니다.
