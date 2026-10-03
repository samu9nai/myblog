---
title: 마크다운 렌더링 확인용 글
description: 블로그 목록, 상세, 태그, 코드 블록이 제대로 그려지는지 확인하는 검증용 글이다. 첫 글을 발행하면 지운다.
pubDate: 2026-10-03
tags:
  - test
  - markdown
draft: true
---

이 글은 2단계 블로그 기능을 확인하려고 넣은 검증용 글이다. `draft: true`라서 프로덕션 빌드에는 나오지 않는다.

## 문단과 강조

**굵게**, _기울임_, `인라인 코드`, [링크](https://github.com/samu9nai)를 한 문단에 섞었다.

> 인용문은 이렇게 보인다.

## 목록

- 순서 없는 목록
- 두 번째 항목
  - 들여쓴 항목

1. 순서 있는 목록
2. 두 번째 항목

## 코드 블록

```java
// OrderService.java
@Transactional
public Order buy(String idempotencyKey, BuyCommand command) {
    return orderRepository.findByIdempotencyKey(idempotencyKey)
        .orElseGet(() -> placeOrder(idempotencyKey, command));
}
```

```bash
pnpm build
```

## 표

| 필드      | 타입   | 필수 |
| --------- | ------ | ---- |
| `title`   | string | 예   |
| `pubDate` | date   | 예   |
