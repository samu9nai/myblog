---
pubDatetime: 2026-06-23T09:30:00+09:00
title: Expressive Code 코드 블록 테스트
featured: false
draft: false
tags:
  - test
  - expressive-code
description: Catppuccin 테마와 Maple Mono를 적용한 코드 블록 기능을 확인하기 위한 테스트 게시글이다.
timezone: Asia/Seoul
---

이 글은 블로그의 코드 블록 스타일과 기능을 확인하기 위한 테스트 게시글이다. 확인이 끝나면 삭제하거나 초안으로 전환할 예정이다.

본문의 인라인 코드는 `calculateChange()`, `currentPrice != previousPrice`, `result => snapshot`처럼 표시된다. 아래 블록에서는 Maple Mono 리거처와 라이트·다크 모드에 공통으로 적용된 Catppuccin Mocha 테마를 함께 확인할 수 있다.

## 파일명 프레임과 줄 강조

파일명을 지정하면 에디터 탭 형태의 프레임이 생긴다. 중괄호로 지정한 줄은 강조 표시된다.

```java title="PriceChangeCalculator.java" {6-9} "calculateChange"
public final class PriceChangeCalculator {
    private static final double MAX_CHANGE_RATE = 0.15;

    // 경기 결과를 바탕으로 가격 변동률을 계산한다.
    public double calculateChange(MatchResult result) {
        double baseRate = result.won() ? 0.04 : -0.04;
        double scoreBonus = result.scoreBonus();
        return clamp(baseRate + scoreBonus);
    }
}
```

## 변경 전후 비교

`del`과 `ins` 메타데이터를 사용하면 삭제된 줄과 추가된 줄을 구분할 수 있다.

```java title="SettlementService.java" del={3} ins={4}
public Money settle(Stock stock, MatchResult result) {
    Money previousPrice = stock.currentPrice();
    Money nextPrice = previousPrice.changeBy(tradeVolumeRate);
    Money nextPrice = previousPrice.changeBy(priceEngine.rateFor(result));
    return stock.confirmPrice(nextPrice);
}
```

## 터미널 프레임

셸 언어의 코드 블록은 터미널 창 형태로 렌더링된다.

```bash title="Fansdaq API"
./gradlew test
./gradlew bootRun
curl http://localhost:8080/api/stocks
```

## SQL과 한글 주석

코드 안의 한글은 D2Coding 계열 fallback으로 표시되고 영문과 기호는 Maple Mono를 사용한다.

```sql title="V1__init_fansdaq.sql" {2,7-8}
-- 사용자의 예수금은 음수가 될 수 없다.
ALTER TABLE users
    ADD CONSTRAINT ck_users_cash_non_negative
    CHECK (cash >= 0);

-- 같은 멱등성 키의 거래는 한 번만 저장한다.
ALTER TABLE trades
    ADD CONSTRAINT uk_trades_user_idempotency_key
    UNIQUE (user_id, idempotency_key);
```

## 긴 줄 자동 줄바꿈

`wrap`을 지정한 블록은 모바일처럼 폭이 좁은 화면에서도 가로 스크롤 대신 줄을 감싼다.

```json title="portfolio-analysis.json" wrap
{
  "summary": "경기 결과와 가격 변동 이력을 바탕으로 포트폴리오의 위험도와 종목 편중을 설명하는 긴 분석 문장입니다.",
  "generatedBy": "rules-first-ai-explainer",
  "isDecisionMaker": false
}
```

## 프레임 없는 짧은 블록

짧은 의사 코드에는 `frame="none"`을 지정해 장식을 줄일 수 있다.

```text frame="none"
경기 결과 -> 가격 계산 -> 관리자 확인 -> 가격 확정 -> 랭킹 스냅샷
```
