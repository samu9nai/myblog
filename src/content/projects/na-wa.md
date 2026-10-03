---
name: NA-WA
summary: 방한 외국인 여행자가 일정을 짜고, 동행을 만나고, 비용을 결제·정산하고, 여행 리포트로 돌아보는 모바일 우선 PWA
period:
  start: 2026-07
  end: 2026-08
kind: team
teamSize: 5
role:
  - 프론트엔드 기반 설계 (앱 셸·HTTP 계층·공용 UI·i18n)
  - 인증과 세션 (Google·LINE OAuth, refresh, 로그아웃 장벽)
  - 리포트 비교 API·UI (GROUP·SIMILAR)
  - 다국어·CJK 타이포그래피
stack:
  - Java 17
  - Spring MVC 5.3
  - Spring Security 5.8
  - MyBatis 3.5
  - MySQL 8.4
  - Redis 7
  - Flyway
  - Vue 3.5
  - TypeScript 6
  - Vite 8
  - Pinia
  - TanStack Vue Query 5
  - Vue I18n 11
  - Tailwind CSS 4
  - Zod
  - PWA
  - Vitest
  - Playwright
  - Docker Compose
  - Nginx
  - AWS EC2·S3
  - Vercel
  - GitHub Actions
# 근거: 기획 문서 "프로젝트 조사" 탭의 NA-WA 절. PR 번호는 모두 본인 작성 커밋으로 확인했다.
boundary:
  mine:
    - '백엔드·프론트엔드 초기 설정과 프론트엔드 CI (#2, #5, #12)'
    - 'Google·LINE 소셜 로그인 백엔드, 로그아웃 계약, refresh 회원 상태 검증 (#41, #131, #142, #220)'
    - 네트워크가 끊겨도 세션이 되살아나지 않는 로그아웃 장벽 (#167)
    - '앱 셸·HTTP 계층·i18n 기반과 공용 UI 컴포넌트 (#55, #92)'
    - 요청별 Zod 응답 검증 (#188)
    - '날짜·시각·금액 포맷 공용화 (#109, #202)'
    - '로케일 계층, 4개 언어 번역, CJK 글꼴 (#100, #218, #358, #361, #363, #377)'
    - '리포트 비교 API와 GROUP·SIMILAR 화면 (#400, #405, #416, #445, #515, #529)'
    - '회원 프로필·찜 API, 약속 목록 scope 확장 (#67, #234, #235, #236)'
  team:
    - 탐색(Event·Place) API·화면, 약속·후기·보증금 예치와 출석 정산
    - CI/CD·Docker·Nginx 배포, Flyway 도입, 지갑·충전·QR 결제, 가맹점, 부하 테스트
    - 여정(Journey) API·화면, 리포트 스냅샷 생성·조회와 기본 화면, 크롤러 적재
    - 공통 응답·전역 예외 처리, 보증금 도메인, 정산 API·화면, 영수증 OCR, 정산 알림
links:
  repo: https://github.com/T-ravelers/NA-WA
  live: https://na-wa.cloud
order: 1
---

NA-WA는 한국을 찾은 외국인 여행자를 위한 여행 협업 서비스다. 여행자는 일정을 짜고, 같은 일정의 동행을 만나고, 함께 쓴 비용을 결제·정산한다. 여행이 끝나면 리포트로 자신의 여행을 돌아보고 다른 여행과 비교한다.

5명이 8주 동안 만들었다. 백엔드는 Spring MVC 단일 애플리케이션이고, 프론트엔드는 모바일 우선 Vue PWA다. 4개 언어를 지원한다.

나는 프론트엔드의 기반 구조와 인증·세션을 맡았고, 리포트 비교 기능을 API부터 화면까지 만들었다.
