import { execFileSync } from 'node:child_process'

const git = (...args: string[]) =>
  execFileSync('git', args, { encoding: 'utf8' }).trim()

const dateFormat = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'Asia/Seoul'
})

/**
 * 사이트를 빌드한 커밋이다. 바닥글에 보여 준다.
 * git 기록 없이 빌드하면(압축 파일로 받은 소스 등) undefined라서 표시하지 않는다.
 */
export const buildCommit = (() => {
  try {
    const sha = git('rev-parse', 'HEAD')
    const committedAt = new Date(git('show', '-s', '--format=%cI', 'HEAD'))
    return { sha, short: sha.slice(0, 7), date: dateFormat.format(committedAt) }
  } catch {
    return undefined
  }
})()
