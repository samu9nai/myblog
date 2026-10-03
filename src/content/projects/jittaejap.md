---
name: 소때잡
summary: 며칠 뒤 소비를 돌아보며 지킬 소비와 줄일 소비를 가려 주는 대화형 AI 자산관리 서비스
period:
  start: 2026-09
  end: 2026-09
kind: team
teamSize: 5
role:
  - 회고 규칙 엔진 (묶음 키·롤업·축소 추정·판정, 결정론 골든 테스트)
  - 회고 API와 월간 리포트 (목표 실적 배분)
  - 카카오 로그인 (서버 코드 교환)
  - 기획·설계 문서의 정본 관리 (결정로그·API 명세·액션시트)
stack:
  - Java 21
  - Spring Boot 4.1
  - Spring Data JPA
  - Spring Security
  - Flyway
  - PostgreSQL 18
  - pgvector
  - Vue 3
  - TypeScript
  - Vite
  - Tailwind CSS 4
  - Python 3.12
  - FastAPI
  - OpenAI gpt-4o-mini
  - Docker Compose
  - Nginx
  - AWS EC2
  - GitHub Actions
# 근거: 기획 문서 "프로젝트 조사" 탭의 소때잡 절.
# server PR #2·#12·#16·#18·#22는 팀원의 demo 구현을 옮긴 이식 PR이라 mine에서 뺐다.
boundary:
  mine:
    - '회고 규칙 엔진 ⓪②③④ — 후보 선별·묶음 키·롤업·축소 추정·판정과 골든 테스트 (server #6)'
    - '회고 API — 후보·저장·묶음 재계산·대화 턴·AI 내부 API (server #10)'
    - '월간 리포트와 목표 실적 배분 (server #32)'
    - '목표 수정과 실적 배분이 겹칠 때의 lost update 수정 (이슈 #36, server #42)'
    - '카카오 로그인 서버 코드 교환과 동시 가입 경합 처리 (server #4)'
    - 기획·설계 문서 정본 관리 (docs 커밋 101개)
  team:
    - CSV 카드 내역 파서, 알림·Web Push, 금융 Q&A 채팅 서버
    - 소비 분석 집계·만족도 지도 API, 절감액·제안·목표 API
    - 금융 RAG 스키마, EC2·Nginx 배포와 CI/CD
    - AI 서버의 회고 대화·추출기·하이브리드 RAG
    - 클라이언트 화면
links:
  repo: https://github.com/jittaejap/sottaejap-server
  docs: https://github.com/jittaejap/sottaejap-docs
order: 2
---

소때잡은 카드 소비 내역을 며칠 뒤에 다시 보며, 지킬 소비와 줄일 소비를 가려 주는 대화형 AI 자산관리 서비스다. 2026 KB IT's Your Life 해커톤 본선에서 5명이 만들었다.

서버는 같은 입력이면 언제나 같은 판정을 내는 규칙 엔진으로 소비를 묶고 판정한다. AI 서버는 그 결과를 바탕으로 사용자와 회고 대화를 나눈다.

나는 회고 규칙 엔진과 회고 API, 월간 리포트를 구현했고, 팀의 결정로그와 API 명세 같은 기획·설계 문서를 정본으로 관리했다.
