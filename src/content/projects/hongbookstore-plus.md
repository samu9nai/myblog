---
name: 홍책방 고도화
summary: 팀 졸업 프로젝트 홍책방을 이어받아, 보안 결함을 고치기 전에 저장소 구조·빌드 도구·CI·의존성 관리와 결함 백로그를 정비한 개인 작업
period:
  start: 2026-10
kind: solo
basedOn: hongbookstore
role:
  - 결함 분석 교차 검토와 백로그·결정 기록 관리
  - 저장소 레이아웃 재구성과 빌드 도구 이전 (Gradle Kotlin DSL, pnpm 워크스페이스), 전후 결과물 비교 검증
  - CI·커밋 훅·의존성 업데이트 자동화 (GitHub Actions, husky·lint-staged, Renovate), 바뀐 파일 기준 린트 게이트
  - 미사용 의존성 정리와 의존성 취약점 75건 해소 (직접 49건, 전이 26건)
  - 메이저 업데이트 (Vite 8, i18next 26)와 화면 캡처 비교 검증
  - 프론트엔드 앱 소스 JavaScript 60개 파일을 10개 PR로 나눈 TypeScript strict 전환
  - AI 코딩 에이전트의 작업 규칙·검증 기준 설계, 결정과 병합
stack:
  - Gradle (Kotlin DSL)
  - pnpm
  - GitHub Actions
  - Renovate
  - Spring Boot 3.5
  - React 19
  - Java 21
  - Spring Security
  - Spring Data JPA
  - MySQL
  - Redis
  - Vite 8
  - TypeScript 7
  - oxlint
  - Vitest
  - Playwright
links:
  repo: https://github.com/samu9nai/hongbookstore
order: 4
# P0 보안 결함(SEC-01~04)을 고친 뒤 공개한다. 공개할 때 summary와 본문을 보안 수정 내용으로 다시 쓴다.
draft: true
---

[홍책방](/projects/hongbookstore/) 졸업 프로젝트를 이어받아 혼자 고도화하고 있다. 서비스를 다시 운영하지 않고, 보안·정합성·운영 안정성을 단계적으로 고치는 것이 목표다. 전면 재작성이나 프레임워크 교체는 하지 않는다.

먼저 Claude와 Codex 두 AI 에이전트의 코드 분석을 교차 검토해 결함 백로그를 만들고, 아직 정하지 않은 정책은 결정 기록으로 분리했다. 그다음 보안 결함을 고치기 전에 저장소 구조, 빌드 도구, CI, 의존성 관리를 정비했다.

이어서 메이저 업데이트와 프론트엔드의 TypeScript 전환을 마쳤다. 단계마다 압축하지 않은 빌드 결과나 화면 캡처를 전후로 비교해 동작이 바뀌지 않았는지 확인했다. 구현과 리뷰의 상당 부분은 AI 에이전트가 맡았고, 나는 에이전트가 따를 규칙과 검증 기준을 정하고 결정과 병합을 맡았다. P0 보안 결함(SEC-01~04)은 아직 고치지 않았다.
