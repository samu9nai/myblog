---
title: '다국어의 구조·의미·글꼴을 따로 검증하기'
description: '번역 키 구조가 완전한지와 문장이 자연스러운지를 별개의 품질 문제로 다루고, CJK 본문·디스플레이 글꼴을 로케일별 unicode-range 슬라이스로 self-hosting해 브랜드 표현과 전송 비용을 함께 제어했습니다.'
pubDate: 2026-08-24
tags:
  - na-wa
  - i18n
  - typography
  - frontend
project: na-wa
caseOrder: 6
---

> **성과:** 번역 키 구조가 완전한지와 문장이 자연스러운지를 별개의 품질 문제로 다루고, CJK 본문·디스플레이 글꼴을 로케일별 `unicode-range` 슬라이스로 self-hosting해 브랜드 표현과 전송 비용을 함께 제어했습니다.

## 상황과 내 역할

NA-WA는 영어·일본어·번체중문·베트남어를 지원합니다. 저는 locale 계약과 저장 정책, 긴 문구 자동 축소, CJK 본문·디스플레이 글꼴 도입을 구현하고 4개 언어 번역을 정비했습니다. 원어민의 최종 번역 감수는 별도 전문 영역입니다. 그래서 자동 테스트를 통과했다고 해서 감수를 마쳤다고 표현하지 않았습니다.

## 문제와 제약

키가 모두 있어도 번역이 제품 개념을 잘못 옮기거나 화면 문맥에 어색할 수 있습니다. 반대로 자연스러운 문장이어도 placeholder나 plural 분기가 빠지면 런타임에서 깨집니다. CJK 문자를 라틴 글꼴 fallback에만 맡기면 브랜드 톤이 달라집니다. 그렇다고 글꼴 전체를 한 파일로 싣기에는 문자 집합이 크고 캐시 비용도 큽니다. 번역문이 길어지면 너비가 같은 버튼과 모바일 280px 화면의 레이아웃도 무너졌습니다.

## 검토한 대안과 선택 기준

| 선택지                                                      | 장점                          | 판단                                               |
| ----------------------------------------------------------- | ----------------------------- | -------------------------------------------------- |
| 시스템 CJK 글꼴만 사용                                      | 전송 비용 없음                | OS별 모양이 달라 브랜드 일관성이 부족해 제외       |
| 로케일별 전체 글꼴 파일                                     | 구성 단순                     | 사용하지 않는 glyph까지 내려받아 제외              |
| 전 로케일 CSS를 한 번에 import하고 `unicode-range` 슬라이스 | 브라우저가 필요한 파일만 요청 | 현재 선택. CSS 선언 파싱·캐시 헤더 과제는 남음     |
| 텍스트 말줄임                                               | 레이아웃 안정                 | 의미가 사라져 주요 버튼에는 부적합                 |
| 범위 안에서 글자 크기 자동 축소                             | 의미 보존                     | `v-fit-text`로 선택하고 최소 크기·그룹 너비를 제한 |

## 해결 방법

기본 locale과 fallback은 영어로 고정했습니다. 사용자가 직접 고른 언어와 브라우저가 감지한 언어는 구분해 저장했습니다. `zh-CN`을 번체중문으로 조용히 치환하지 않고 지원하지 않는 언어로 처리했습니다. 번역 테스트는 영어를 기준으로 키 누락·고아 키·placeholder·plural 구조를 검사합니다. 실제 문장은 화면 그룹별 용어집과 문맥 검수로 따로 확인했습니다.

글꼴 체인은 로케일별로 본문에 Noto Sans JP/TC, 디스플레이에 M PLUS 1p/Taipei Sans TC Beta를 쓰고 그 뒤에 라틴·시스템 fallback을 둡니다. 글꼴 파일은 `unicode-range`로 나눠 브라우저가 실제로 쓰는 glyph가 든 조각만 요청하게 했습니다. 긴 문구는 폰트가 준비된 뒤 실제 범위를 측정하는 `v-fit-text`로 축소하고, 같은 그룹의 버튼은 크기를 서로 맞췄습니다.

## 검증된 결과

번역 정비 PR을 병합할 때 4개 로케일마다 키 1,277개와 그룹 10개를 대조했습니다. 전체 단위 테스트 134개 파일 1,149건과 4개 로케일 스크린샷 65개 흐름도 통과했습니다. 이 수치는 당시 스냅샷이며 현재 키 수가 아닙니다. 본문 글꼴 실험에서는 JP 슬라이스 124개와 TC 슬라이스 105개 가운데 혼합 문구를 표시할 때 요청된 파일이 17개(약 596KB)뿐임을 확인했습니다. 현재 `main`에는 `@font-face` 선언이 본문 229개, 디스플레이 462개로 총 691개 있고 CJK 슬라이스도 같은 수만큼 있습니다.

## 남은 한계와 회고

현재는 모든 로케일의 font CSS 선언을 전역에서 import합니다. 그래서 글꼴 파일은 필요할 때만 받더라도 선언 691개를 파싱하는 비용은 남습니다. `/fonts` 장기 캐시와 locale별 CSS 분리는 [Issue #372](https://github.com/T-ravelers/NA-WA/issues/372)의 미완료 과제입니다. 키·placeholder 테스트는 번역이 자연스럽다는 것을 증명하지 않습니다. `document.fonts` 로딩 성공도 280px에서 줄바꿈이 안전하다는 증거가 아닙니다. 그래서 구조 테스트, 문맥 검수, 좁은 화면 스크린샷을 서로 대신할 수 없는 검증으로 따로 유지했습니다.

## 근거

- 구현: [PR #100](https://github.com/T-ravelers/NA-WA/pull/100), [PR #218](https://github.com/T-ravelers/NA-WA/pull/218), [PR #358](https://github.com/T-ravelers/NA-WA/pull/358), [PR #361](https://github.com/T-ravelers/NA-WA/pull/361), [PR #363](https://github.com/T-ravelers/NA-WA/pull/363), [PR #377](https://github.com/T-ravelers/NA-WA/pull/377)
- 번역 검수: [리뷰 반영 답변](https://github.com/T-ravelers/NA-WA/pull/363#issuecomment-5378909869), [병합 트리 재검증](https://github.com/T-ravelers/NA-WA/pull/363#issuecomment-5379018064)
- 최종 코드·운영 한계: [fonts-cjk.css](https://github.com/T-ravelers/NA-WA/blob/2a1532601b1794e2e0cde561fc63e80a39911c6c/frontend/src/app/styles/fonts-cjk.css), [font README](https://github.com/T-ravelers/NA-WA/blob/2a1532601b1794e2e0cde561fc63e80a39911c6c/frontend/public/fonts/README.md), [translations.spec.ts](https://github.com/T-ravelers/NA-WA/blob/2a1532601b1794e2e0cde561fc63e80a39911c6c/frontend/src/app/i18n/__tests__/translations.spec.ts)
