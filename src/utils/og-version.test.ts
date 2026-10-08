import assert from 'node:assert/strict'
import { test } from 'node:test'
import { ogVersion } from './og-version.ts'

await test('ogVersion: 입력이 같으면 같은 8자리 버전을 만든다', () => {
  const version = ogVersion('template', '제목', '설명')
  assert.match(version, /^[0-9a-f]{8}$/)
  assert.equal(ogVersion('template', '제목', '설명'), version)
})

await test('ogVersion: 템플릿·제목·설명 중 하나만 바뀌어도 버전이 바뀐다', () => {
  const base = ogVersion('template', '제목', '설명')
  assert.notEqual(ogVersion('template v2', '제목', '설명'), base)
  assert.notEqual(ogVersion('template', '다른 제목', '설명'), base)
  assert.notEqual(ogVersion('template', '제목', '다른 설명'), base)
})

await test('ogVersion: 입력 경계가 섞여도 같은 버전이 되지 않는다', () => {
  assert.notEqual(ogVersion('ab', 'c'), ogVersion('a', 'bc'))
})
