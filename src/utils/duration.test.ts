import assert from 'node:assert/strict'
import { test } from 'node:test'
import { formatMonths, totalMonths } from './duration.ts'

await test('totalMonths: 시작 달과 끝 달을 모두 센다', () => {
  assert.equal(
    totalMonths([{ start: '2026-07', end: '2026-08' }], '2026-10'),
    2
  )
  assert.equal(
    totalMonths([{ start: '2026-09', end: '2026-09' }], '2026-10'),
    1
  )
})

await test('totalMonths: 해를 넘기는 기간을 센다', () => {
  assert.equal(
    totalMonths([{ start: '2024-11', end: '2025-02' }], '2026-10'),
    4
  )
})

await test('totalMonths: 끝이 없으면 now까지 센다', () => {
  assert.equal(totalMonths([{ start: '2026-03' }], '2026-10'), 8)
})

await test('totalMonths: 겹치는 달은 한 번만 센다', () => {
  const periods = [
    { start: '2025-01', end: '2025-06' },
    { start: '2025-04', end: '2025-09' }
  ]
  assert.equal(totalMonths(periods, '2026-10'), 9)
})

await test('totalMonths: 다른 기간 안에 들어가는 기간은 더하지 않는다', () => {
  const periods = [
    { start: '2025-01', end: '2025-12' },
    { start: '2025-03', end: '2025-04' }
  ]
  assert.equal(totalMonths(periods, '2026-10'), 12)
})

await test('totalMonths: 떨어진 기간은 사이를 빼고 더한다', () => {
  const periods = [
    { start: '2026-09', end: '2026-09' },
    { start: '2025-01', end: '2025-03' }
  ]
  assert.equal(totalMonths(periods, '2026-10'), 4)
})

await test('totalMonths: 맞닿은 기간은 이어서 센다', () => {
  const periods = [
    { start: '2025-01', end: '2025-03' },
    { start: '2025-04', end: '2025-06' }
  ]
  assert.equal(totalMonths(periods, '2026-10'), 6)
})

await test('totalMonths: 기간이 없으면 0이다', () => {
  assert.equal(totalMonths([], '2026-10'), 0)
})

await test('formatMonths: 년과 개월로 나눠 쓴다', () => {
  assert.equal(formatMonths(14), '1년 2개월')
  assert.equal(formatMonths(12), '1년')
  assert.equal(formatMonths(5), '5개월')
  assert.equal(formatMonths(0), '')
})
