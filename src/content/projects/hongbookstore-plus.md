---
name: 홍책방 고도화
summary: 팀 졸업 프로젝트 홍책방을 이어받아, 보안 결함을 고치기 전에 저장소 구조·빌드 도구·CI·의존성 관리와 결함 백로그를 정비한 개인 작업
period:
  start: 2026-10
kind: solo
basedOn: hongbookstore
role:
  - 결함 분석 교차 검토와 백로그·결정 기록 관리
  - 저장소 레이아웃 재구성과 빌드 도구 이전 (Gradle Kotlin DSL, pnpm 워크스페이스)
  - CI·커밋 훅·의존성 업데이트 자동화 (GitHub Actions, husky·lint-staged, Renovate)
  - 미사용 의존성 정리와 직접 의존성 취약점 해소
stack:
  - Java 21
  - Spring Boot 3.5
  - Spring Security
  - Spring Data JPA
  - MySQL
  - Redis
  - Gradle (Kotlin DSL)
  - React 19
  - Vite 7
  - pnpm
  - TypeScript (도입 중)
  - oxlint
  - Vitest
  - Playwright
  - GitHub Actions
  - Renovate
links:
  repo: https://github.com/samu9nai/hongbookstore
order: 4
# P0 보안 결함(SEC-01~04)을 고친 뒤 공개한다. 공개할 때 summary와 본문을 보안 수정 내용으로 다시 쓴다.
draft: true
---

[홍책방](/projects/hongbookstore/) 졸업 프로젝트를 이어받아 혼자 고도화하고 있다. 서비스를 다시 운영하지 않고, 보안·정합성·운영 안정성을 단계적으로 고치는 것이 목표다. 전면 재작성이나 프레임워크 교체는 하지 않는다.

먼저 Claude와 Codex 두 AI 에이전트의 코드 분석을 교차 검토해 결함 백로그를 만들고, 아직 정하지 않은 정책은 결정 기록으로 분리했다. 그다음 보안 결함을 고치기 전에 저장소 구조, 빌드 도구, CI, 의존성 관리를 정비했다.
