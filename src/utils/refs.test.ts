import assert from 'node:assert/strict'
import { test } from 'node:test'
import { splitRefs } from './refs.ts'

const repo = 'https://github.com/T-ravelers/NA-WA'

await test('splitRefs: 끝 괄호의 PR 번호를 링크로 나눈다', () => {
  assert.deepEqual(splitRefs('요청별 Zod 응답 검증 (#188)', repo), {
    text: '요청별 Zod 응답 검증',
    refs: [{ label: '#188', url: `${repo}/pull/188` }]
  })
})

await test('splitRefs: 여러 근거와 접두어를 처리한다', () => {
  const { text, refs } = splitRefs(
    'lost update 수정 (이슈 #36, server #42)',
    'https://github.com/jittaejap/sottaejap-server'
  )
  assert.equal(text, 'lost update 수정')
  assert.deepEqual(refs, [
    {
      label: '이슈 #36',
      url: 'https://github.com/jittaejap/sottaejap-server/issues/36'
    },
    {
      label: 'server #42',
      url: 'https://github.com/jittaejap/sottaejap-server/pull/42'
    }
  ])
})

await test('splitRefs: 근거가 없으면 본문만 돌려준다', () => {
  assert.deepEqual(splitRefs('CI/CD·Docker·Nginx 배포 (팀 공동)', repo), {
    text: 'CI/CD·Docker·Nginx 배포 (팀 공동)',
    refs: []
  })
  assert.deepEqual(splitRefs('앱 셸·HTTP 계층', repo), {
    text: '앱 셸·HTTP 계층',
    refs: []
  })
})

await test('splitRefs: 저장소가 없으면 표기만 남긴다', () => {
  assert.deepEqual(splitRefs('로그아웃 장벽 (#167)'), {
    text: '로그아웃 장벽',
    refs: [{ label: '#167', url: undefined }]
  })
})
