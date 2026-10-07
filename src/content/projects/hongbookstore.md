---
name: 홍책방
summary: 홍익대학교 학생 전용 중고 교재 거래·정보 공유 플랫폼 (2025학년도 컴퓨터공학과 졸업 프로젝트)
period:
  start: 2025-03
  end: 2025-11
kind: team
teamSize: 4
role:
  - '인증 백엔드: JWT, OAuth2 소셜 로그인(Google·Naver·Kakao), 학교 이메일 인증'
  - '중고책 판매글: 카카오 책 API·ISBN 등록, 이미지 업로드, 찜, 정렬, 거래 후기'
  - '유해 표현 필터 연동: 추론 API 클라이언트와 필드별 BLOCK·WARN 정책'
  - '배포: Docker, GitHub Actions → GCP Cloud Run, Vercel'
stack:
  - Java 21
  - Spring Boot 3.5
  - Spring Security
  - OAuth2 Client
  - MySQL
  - React 19
  - Spring Data JPA
  - Redis
  - WebSocket (STOMP)
  - SSE
  - GCP Cloud Storage
  - Vite 6
  - TanStack Query 5
  - styled-components
  - i18next
  - Docker
  - GCP Cloud Run
  - GitHub Actions
  - Vercel
# 근거: 기획 문서 "프로젝트 조사" 탭의 홍책방 절. 팀원의 마지막 커밋 715994a(2025-10-12)까지만 원본 성과로 본다.
boundary:
  mine:
    - 프로젝트 초기 세팅 (React 생성, CRA → Vite 전환, RDS 연동, 패키지 구조)
    - JWT 로그인을 소셜 로그인으로 전환, 학교 이메일 인증, 아이디 찾기·비밀번호 재설정
    - 판매글 작성·조회, 카카오 책 API 검색, ISBN이 없는 책 등록
    - 판매글 이미지 업로드, 조회수·찜 순 정렬, 찜, 최근 본 판매글
    - 구매자·판매자 거래 후기 통합
    - 유해 표현 필터 클라이언트와 필드별 BLOCK·WARN 정책
    - Docker·GitHub Actions·Cloud Run 배포, Vercel 프록시, 운영 OAuth 콜백 수정
  team:
    - 네이버 지도·장소 검색·장소 리뷰, 사용자 지도 카테고리
    - STOMP 채팅과 SSE 알림
    - 스마트 예약 (중간 지점 추천, 날씨)
    - 구해요 게시판·댓글, 신고·관리자, 회원 탈퇴
    - 로그인·회원가입 UI, 다국어 번역 (영어·일본어·중국어), 챗봇
    - 마이페이지·거래 게시판·채팅방·지도 UI, 메인 온보딩
links:
  repo: https://github.com/HongikBookStore/HongBookStore
order: 3
---

홍책방은 홍익대학교 학생끼리 중고 교재를 사고팔고 정보를 나누는 플랫폼이다. 2025학년도 컴퓨터공학과 졸업 프로젝트로 4명이 만들었다.

학교 이메일로 학생임을 확인하고, 판매글은 카카오 책 API로 책 정보를 채운다. 거래는 채팅과 예약으로 이어지고, 게시글과 채팅의 유해 표현은 별도 추론 서버로 걸러 낸다.

나는 인증과 판매글 백엔드, 유해 표현 필터 연동, 배포를 맡았다. 원본 저장소는 보관(archived)됐다.
