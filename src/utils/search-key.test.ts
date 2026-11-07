import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getSearchAction } from './search-key.ts'

await test('한글 조합 중에는 Enter와 방향키를 입력기에 맡긴다', () => {
  for (const key of ['Enter', 'ArrowDown', 'ArrowUp']) {
    assert.equal(
      getSearchAction({ key, isComposing: true, keyCode: 0 }, true),
      undefined
    )
    assert.equal(
      getSearchAction({ key, isComposing: false, keyCode: 229 }, true),
      undefined
    )
  }
})

await test('조합이 끝나면 방향키로 이동하고 Enter로 검색 결과를 연다', () => {
  const event = { isComposing: false, keyCode: 0 }
  assert.equal(getSearchAction({ ...event, key: 'ArrowDown' }, true), 1)
  assert.equal(getSearchAction({ ...event, key: 'ArrowUp' }, true), -1)
  assert.equal(getSearchAction({ ...event, key: 'Enter' }, true), 'open')
  assert.equal(getSearchAction({ ...event, key: 'Enter' }, false), undefined)
})
