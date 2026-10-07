---
title: '날짜·시각·금액에서 의미를 잃지 않는 표현'
description: '모양이 비슷한 달력 날짜와 서버 instant를 다른 파이프라인으로 분리하고, decimal string을 Number로 바꾸지 않는 포맷터를 도입해 시간대·정밀도 오류를 공용 경계에서 막았습니다.'
pubDate: 2026-08-24
tags:
  - na-wa
  - typescript
  - datetime
  - frontend
project: na-wa
caseOrder: 4
---

> **성과:** 모양이 비슷한 달력 날짜와 서버 instant를 다른 파이프라인으로 분리하고, decimal string을 `Number`로 바꾸지 않는 포맷터를 도입해 시간대·정밀도 오류를 공용 경계에서 막았습니다.

## 상황과 내 역할

백엔드 날짜가 ISO 문자열뿐 아니라 Jackson 배열로도 내려오며 화면이 깨진 사건이 있었습니다. 이후 여러 기능이 날짜와 금액 포맷을 각자 구현하면서 UTC/KST 변환, 음수 부호, 큰 소수 정밀도도 달라졌습니다. 저는 공용 날짜·금액 유틸리티와 적용부, 회귀 테스트를 구현했습니다.

## 문제와 제약

`2026-08-24`는 사용자가 고른 달력 날짜이고 `2026-08-24T00:00:00`은 서버 시간대에서 발생한 instant일 수 있습니다. 둘을 `Date` 하나로 처리하면 미국 시간대에서 전날로 보일 수 있습니다. 금액도 JSON의 decimal string을 `Number`로 변환하면 큰 정수와 소수 자릿수를 잃습니다. 한편 상대 시간·기간 계산이 필요하지 않은데 Day.js를 넣거나, `Intl.NumberFormat`의 부족한 타입 하나 때문에 전역 `tsconfig` target을 올리는 것은 영향 범위가 과했습니다.

## 검토한 대안과 선택 기준

| 입력 의미                        | 선택한 처리                                           | 피한 처리와 이유                                         |
| -------------------------------- | ----------------------------------------------------- | -------------------------------------------------------- |
| 서버 instant, 명시적 offset 있음 | offset을 보존해 instant로 해석한 뒤 `Asia/Seoul` 표시 | 브라우저 로컬 시간대 표시: 사용자 환경마다 결과가 달라짐 |
| 서버 instant, offset 없음        | 서버 계약의 `Asia/Seoul`로 해석                       | 무조건 UTC 간주: 실제 계약과 다름                        |
| Jackson 배열 `[Y,M,D,...]`       | 길이·범위를 검증해 KST instant 구성                   | 문자열만 가정: 실제 응답에서 런타임 실패                 |
| 달력 날짜 `YYYY-MM-DD`           | 연·월·일 값 자체를 parse/serialize                    | `Date` 변환: 시간대에 따라 날짜 이동                     |
| decimal string 금액              | 문자열 분해·반올림·그룹핑                             | `Number` 변환: 정밀도 손실                               |

## 해결 방법

서버 시간 파이프라인은 문자열과 3~7개 원소의 Jackson 배열을 받아 유효성을 검사하고, offset이 없으면 KST로 해석하며 출력도 KST로 고정했습니다. 달력 날짜 파이프라인은 `Date`를 거치지 않고 구성 요소를 그대로 직렬화합니다.

금액 포맷터는 부호·정수·소수를 문자열로 분해하고 필요한 자리에서 반올림한 뒤 그룹 구분자를 붙입니다. `signDisplay: 'negative'`처럼 현재 런타임은 지원하지만 프로젝트의 타입 라이브러리가 아직 알지 못하는 값은 좁은 로컬 타입으로만 확장했습니다. Day.js는 상대 시간·기간·복잡한 시간대 연산이 생길 때 다시 평가하기로 하고 도입하지 않았습니다.

## 검증된 결과

공용화 PR에서 집중 테스트 14개 파일 100건, 전체 단위 테스트 97개 파일 535건과 빌드를 통과했습니다. `TZ=America/Los_Angeles`로 4개 파일 36건을 별도 실행해 달력 날짜가 전날로 이동하지 않는지 확인했고, 기존 23개 화면 스크린샷은 변경 전후 byte-identical이었습니다. 리뷰에서 큰 소수의 `Number` 변환과 `negative`가 양수에 `+`를 붙이는 오류가 발견됐고, 두 구현을 수정한 뒤 승인받았습니다. 이 검증은 fixture 기반이며 실백엔드·전 로케일 브라우저 조합을 모두 실행한 것은 아닙니다.

## 남은 한계와 회고

서버가 offset 없는 시간을 KST로 준다는 계약이 바뀌면 해석 규칙도 함께 바뀌어야 합니다. 또한 수동 decimal 포맷은 통화별 반올림 규칙 전체를 대체하지 않습니다. 이 사례를 통해 “공용 유틸로 합쳤다”보다 먼저 해야 할 일은 **입력의 모양이 아니라 도메인 의미를 타입과 함수 이름으로 분리하는 것**임을 확인했습니다.

## 근거

- 배경과 구현: [PR #109](https://github.com/T-ravelers/NA-WA/pull/109), [Issue #172](https://github.com/T-ravelers/NA-WA/issues/172), [PR #202](https://github.com/T-ravelers/NA-WA/pull/202)
- 리뷰에서 수정한 선택: [정밀도 지적](https://github.com/T-ravelers/NA-WA/pull/202#pullrequestreview-4933940769), [부호 지적](https://github.com/T-ravelers/NA-WA/pull/202#pullrequestreview-4934204077), [수정 결과](https://github.com/T-ravelers/NA-WA/pull/202#issuecomment-5289891672), [최종 승인](https://github.com/T-ravelers/NA-WA/pull/202#pullrequestreview-4934637651)
- 핵심 코드: [datetime.ts](https://github.com/T-ravelers/NA-WA/blob/ff662cd242da88c178a92e164c5d5da281ff8978/frontend/src/shared/lib/datetime.ts), [money.ts](https://github.com/T-ravelers/NA-WA/blob/ff662cd242da88c178a92e164c5d5da281ff8978/frontend/src/shared/lib/money.ts)
