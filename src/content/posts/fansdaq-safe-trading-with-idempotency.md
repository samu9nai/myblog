---
pubDatetime: 2026-06-29T00:00:00+09:00
title: 버튼을 두 번 눌러도 주식이 두 번 사지지 않게 만들기
featured: false
draft: true
tags:
  - fansdaq
  - spring-boot
  - concurrency
  - idempotency
  - side-project
description: Fansdaq의 매수·매도 API를 구현하며 멱등성 키, 비관적 락, 데이터베이스 제약으로 중복 거래와 자산 불일치를 막은 과정을 정리했다.
timezone: Asia/Seoul
---

주문 버튼을 눌렀는데 화면이 멈췄다고 가정해보자. 사용자는 주문이 접수됐는지 알 수 없어서 버튼을 한 번 더 누른다. 첫 번째 요청도 서버에 도착했다면 같은 종목을 두 번 사게 되고, 예수금도 두 번 빠져나간다.

네트워크 타임아웃이나 사용자의 연속 클릭은 특별한 예외 상황이 아니다. 언제든 발생할 수 있는 평범한 재요청이다. 하지만 거래 API에서 같은 요청을 두 번 처리한 결과는 평범하지 않다.

Fansdaq의 매수·매도 API를 구현하면서 가장 중요하게 둔 조건도 이것이었다.

> 같은 거래 요청이 여러 번 도착해도 자산 변경은 한 번만 일어나야 한다.

이를 위해 요청에는 멱등성 키를 넣고, 거래 중에는 사용자와 보유 종목을 잠그며, 데이터베이스에는 중복 거래를 막는 유니크 제약을 두었다.

## Table of contents

## 거래 하나가 바꾸는 데이터

Fansdaq은 현재 확정된 기준가로 가상 종목을 즉시 매수하거나 매도한다. 주문 한 번을 처리할 때는 한 테이블만 변경되지 않는다.

매수라면 다음 상태가 함께 바뀐다.

1. 사용자의 예수금을 차감한다.
2. 기존 보유 종목의 수량과 평균 매수가를 갱신하거나 새 보유 정보를 만든다.
3. 체결 가격과 수량을 거래 내역으로 저장한다.

매도는 반대 방향으로 움직이지만 완전히 대칭적이지는 않다.

1. 보유 수량이 충분한지 확인한다.
2. 매도 대금을 예수금에 더한다.
3. 일부 매도라면 수량을 줄이고, 전량 매도라면 보유 정보를 삭제한다.
4. 거래 내역을 저장한다.

이 변경들은 모두 성공하거나 모두 실패해야 한다. 예수금만 줄고 보유 수량이 늘지 않거나, 보유 수량은 줄었는데 거래 내역이 없다면 사용자의 자산을 설명할 수 없게 된다. 그래서 매수와 매도 서비스는 하나의 트랜잭션 안에서 실행한다.

```java title="TradeService.java" {1,7}
@Transactional
public TradeResponse buy(Long userId, BuyTradeRequest request) {
    // 사용자 잠금, 중복 요청 확인, 매수 실행
}

@Transactional
public TradeResponse sell(Long userId, SellTradeRequest request) {
    // 사용자 잠금, 중복 요청 확인, 매도 실행
}
```

`@Transactional`은 여러 변경을 하나의 작업으로 묶어준다. 그러나 이것만으로 동시에 들어온 요청이나 재시도까지 안전해지는 것은 아니다.

## 요청에 멱등성 키를 넣었다

멱등한 API는 같은 요청을 여러 번 실행해도 한 번 실행한 것과 같은 결과를 만든다. 조회 API는 대체로 자연스럽게 멱등하지만, 호출할 때마다 예수금과 보유량이 바뀌는 거래 API는 별도의 장치가 필요하다.

Fansdaq에서는 클라이언트가 각 주문마다 고유한 `idempotencyKey`를 만들어 요청 본문에 담도록 했다.

```json title="POST /api/trades/buy"
{
  "stockId": 1,
  "quantity": 2,
  "idempotencyKey": "54d4d890-1b87-4b68-9fca-4abeb93182ee"
}
```

서버는 사용자 ID와 멱등성 키가 같은 거래가 이미 존재하는지 먼저 확인한다. 기존 거래가 있다면 매수나 매도를 다시 실행하지 않고 저장된 결과를 반환한다.

```java title="TradeService.java" {6-8}
String idempotencyKey = normalizeIdempotencyKey(request.idempotencyKey());
User user = userRepository.findByIdForUpdate(userId)
        .orElseThrow(() -> new BusinessException(ErrorCode.UNAUTHORIZED));

return tradeRepository
        .findByUserIdAndIdempotencyKey(user.getId(), idempotencyKey)
        .map(TradeResponse::from)
        .orElseGet(() -> executeBuy(user, request, idempotencyKey));
```

같은 키로 첫 번째 요청이 성공했다면 두 번째 요청은 기존 `Trade`를 응답받는다. 따라서 예수금 차감과 보유량 증가는 다시 일어나지 않는다.

키 앞뒤의 공백은 제거하고, 빈 값은 거래를 시작하기 전에 거부한다. 같은 주문을 나타내는 키가 표현 차이 때문에 서로 다른 값으로 저장되는 일을 줄이기 위해서다.

## 조회 후 저장 사이의 틈

기존 거래를 먼저 조회하는 것만으로는 충분하지 않다. 거의 동시에 도착한 두 요청이 다음 순서로 실행될 수 있기 때문이다.

```text
요청 A: 기존 거래 없음 확인
요청 B: 기존 거래 없음 확인
요청 A: 예수금 차감 및 거래 저장
요청 B: 예수금 차감 및 거래 저장
```

두 요청 모두 상대가 거래를 저장하기 전에 조회했다면 둘 다 새 요청이라고 판단한다. 흔히 말하는 조회 후 변경 사이의 경쟁 조건이다.

Fansdaq에서는 거래를 시작할 때 사용자 행에 `PESSIMISTIC_WRITE` 락을 건다.

```java title="UserRepository.java" {1-3}
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("select u from User u where u.id = :id")
Optional<User> findByIdForUpdate(@Param("id") Long id);
```

먼저 들어온 요청이 사용자 행의 잠금을 획득하면, 같은 사용자의 다음 거래는 첫 번째 트랜잭션이 끝날 때까지 기다린다. 첫 번째 요청이 거래를 저장하고 커밋한 뒤 두 번째 요청이 진행되므로, 두 번째 요청은 기존 멱등성 키를 발견할 수 있다.

사용자 행을 먼저 잠그는 데에는 중복 요청 방지 외의 이유도 있다. 서로 다른 키를 가진 두 매수 요청이 동시에 같은 예수금을 보고 각각 잔액이 충분하다고 판단하는 상황을 막아준다. 사용자의 거래를 직렬화하면 한 요청이 변경한 예수금을 다음 요청이 이어서 확인하게 된다.

```text
사용자 행 잠금
    ↓
기존 멱등성 키 조회
    ↓
종목과 거래 가능 상태 확인
    ↓
예수금·보유량 변경
    ↓
거래 저장
    ↓
트랜잭션 커밋 및 잠금 해제
```

보유 종목을 변경할 때도 사용자와 종목 ID로 행을 조회하며 쓰기 잠금을 사용한다.

```java title="HoldingRepository.java" {1-6}
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("""
        select h from Holding h
        where h.userId = :userId and h.stockId = :stockId
        """)
Optional<Holding> findByUserIdAndStockIdForUpdate(
        @Param("userId") Long userId,
        @Param("stockId") Long stockId
);
```

현재 구조는 한 사용자의 거래를 안전하게 순서대로 처리하는 대신, 같은 사용자의 거래 처리량을 잠금 단위로 제한한다. MVP에서는 한 사용자가 동시에 많은 주문을 처리하는 성능보다 자산의 일관성이 더 중요하다고 판단했다.

## 데이터베이스에도 마지막 방어선을 두었다

애플리케이션의 조회와 잠금이 올바르게 동작하더라도 중복을 허용하는 스키마라면 안전 규칙이 코드에만 존재하게 된다. Fansdaq은 `user_id`와 `idempotency_key` 조합에 유니크 제약을 둔다.

```sql title="V1__init_schema.sql" {2-3}
CONSTRAINT uk_trades_user_idempotency_key
    UNIQUE (user_id, idempotency_key)
```

멱등성 키는 사용자 단위로 유일하다. 서로 다른 사용자는 우연히 같은 키를 사용해도 되지만, 한 사용자가 같은 키로 거래를 두 개 저장할 수는 없다.

보유 정보에도 사용자와 종목 조합의 유니크 제약이 있다.

```sql title="V1__init_schema.sql" {2-3}
CONSTRAINT uk_holdings_user_stock
    UNIQUE (user_id, stock_id)
```

덕분에 같은 사용자의 같은 종목 보유 행이 두 개로 갈라지는 상태를 데이터베이스에서도 거부한다. 애플리케이션의 비관적 락이 정상적인 요청 흐름을 정리하고, 유니크 제약이 최종적으로 잘못된 상태의 저장을 차단하는 구조다.

## 매도는 매수의 반대가 아니었다

처음에는 매도를 매수의 반대 연산처럼 생각하기 쉽다. 실제로 구현해보니 매도에는 별도로 결정해야 할 규칙이 있었다.

일부 수량만 매도할 때는 보유 수량을 줄이되 평균 매수가는 유지한다.

```java title="Holding.java"
public void decreaseForSell(int sellQuantity) {
    this.quantity = Math.subtractExact(this.quantity, sellQuantity);
}
```

평균 매수가는 지금까지 매수한 물량의 취득 가격을 나타낸다. 현재 가격으로 일부를 팔았다고 해서 남은 물량을 얼마에 샀는지가 바뀌지는 않는다. 실현 손익을 별도로 제공하게 된다면 매도 거래의 체결가와 보유 물량의 평균 매수가를 이용해 계산할 수 있다.

반면 보유 수량 전체를 매도한 경우에는 수량이 0인 `Holding`을 남기지 않고 행을 삭제한다. 스키마의 `quantity > 0` 제약과도 일치하는 선택이다.

```java title="TradeService.java" {1-5}
if (holding.getQuantity() == quantity) {
    holdingRepository.delete(holding);
} else {
    holding.decreaseForSell(quantity);
}
```

보유 정보가 없거나 요청 수량이 현재 수량보다 많다면 예수금과 보유량을 변경하기 전에 요청을 거부한다. 매도 대금을 더할 때와 가격에 수량을 곱할 때는 `Math.addExact`, `Math.multiplyExact`를 사용해 `long` 범위를 넘는 값이 조용히 음수로 뒤집히지 않게 했다.

## 성공 경로보다 실패 경로를 더 많이 테스트했다

거래 API는 정상 매수 한 번만 확인해서는 안전성을 설명하기 어렵다. Fansdaq에서는 서비스 단위 테스트, 컨트롤러 테스트, 실제 HTTP와 데이터베이스를 거치는 통합 테스트로 역할을 나눴다.

주요 검증 대상은 다음과 같다.

- 같은 멱등성 키로 재요청해도 예수금과 보유량이 다시 바뀌지 않는가?
- 예수금이 부족한 매수는 거래 내역을 남기지 않는가?
- 보유 수량을 초과한 매도는 예수금과 보유량을 그대로 유지하는가?
- 일부 매도는 수량만 줄이고 평균 매수가를 유지하는가?
- 전량 매도는 보유 행을 삭제하는가?
- 거래 중지 상태의 종목은 매수와 매도를 모두 거부하는가?
- 인증 정보가 없는 요청은 `401 Unauthorized`를 반환하는가?
- 금액 계산이 `long` 범위를 넘으면 트랜잭션을 중단하는가?

특히 멱등성 테스트에서는 두 번째 요청의 종목 ID와 수량을 일부러 다르게 보내도 기존 키에 해당하는 거래를 반환하는지 확인했다. 현재 계약에서 멱등성 키는 하나의 거래를 식별하며, 같은 키로 들어온 후속 요청보다 최초 요청의 결과가 우선한다.

이 선택은 클라이언트가 하나의 키를 서로 다른 주문에 재사용하면 새 주문이 처리되지 않는다는 뜻이기도 하다. 이후 API를 외부에 공개한다면 같은 키에 다른 요청 본문이 들어왔을 때 `409 Conflict`로 거부하도록 요청 지문을 함께 저장하는 방법도 검토할 수 있다.

## 현재 구조가 해결한 것과 남은 것

Day 9까지 구현한 거래 흐름은 다음 조건을 만족한다.

- 매수·매도의 자산 변경과 거래 기록이 하나의 트랜잭션으로 처리된다.
- 동일한 멱등성 키의 재요청은 최초 거래 결과를 반환한다.
- 같은 사용자의 동시 거래는 사용자 행 잠금으로 순서대로 처리된다.
- 사용자별 멱등성 키와 종목별 보유 행의 중복은 데이터베이스에서도 거부된다.
- 일부 매도와 전량 매도의 보유 상태가 구분된다.

다만 이것으로 거래 시스템의 모든 동시성 문제가 끝난 것은 아니다. 현재는 단일 애플리케이션과 MySQL 트랜잭션을 전제로 하고 있으며, 잠금 대기 시간이나 교착 상태에 대한 운영 지표도 아직 없다. 거래량이 늘어난다면 잠금 획득 순서를 고정하고, 타임아웃과 재시도 정책을 정하며, 실제 동시 요청을 발생시키는 테스트도 추가해야 한다.

수수료 역시 현재는 `0`으로 고정돼 있다. 향후 수수료가 추가되면 매수에 필요한 총액과 매도 후 받는 금액, 거래 내역에 남길 금액의 의미를 다시 명확하게 나눠야 한다.

그래도 이번 구현으로 설계 문서에 남겨두었던 질문 하나에는 답할 수 있게 됐다.

> 같은 시점에 들어온 중복 주문과 잔액 변경을 어떻게 안전하게 처리할 것인가?

현재의 답은 **멱등성 키로 같은 요청을 식별하고, 비관적 락으로 변경 순서를 정하며, 데이터베이스 제약으로 잘못된 상태를 마지막에 한 번 더 막는 것**이다.

거래 API에서 중요한 것은 성공 응답을 빠르게 만드는 일만이 아니었다. 같은 요청이 다시 오고, 여러 요청이 겹치고, 처리 도중 하나가 실패하더라도 사용자의 자산을 설명할 수 있는 상태로 남기는 일이었다.
