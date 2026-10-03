---
name: 검증용 팀 프로젝트
summary: 프로젝트 목록, 상세, 협업 경계, 사례 묶기가 제대로 그려지는지 확인하는 검증용 프로젝트다. 실제 프로젝트를 넣으면 지운다.
period:
  start: 2025-03
  end: 2025-08
kind: team
teamSize: 5
role:
  - 백엔드 API 설계와 구현
  - 배포 파이프라인
stack:
  - Java 21
  - Spring Boot
  - MySQL
  - AWS
boundary:
  mine:
    - 주문 API와 멱등성 처리
    - GitHub Actions 배포 파이프라인
  team:
    - 프론트엔드 화면
    - 결제 연동
links:
  repo: https://github.com/samu9nai/myblog
order: 99
draft: true
---

이 파일은 3단계 포트폴리오 기능을 확인하려고 넣은 검증용 프로젝트다. `draft: true`라서 프로덕션 빌드에는 나오지 않는다.

여기에는 프로젝트를 왜 만들었고 무엇을 해결했는지 쓴다.
