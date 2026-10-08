// 협업 경계 항목 끝의 근거 표기를 링크로 나눈다. node --test가 그대로 읽도록 별칭을 쓰지 않는다.

export interface Ref {
  label: string
  url?: string
}

/**
 * '로그아웃 장벽 (#167)', '롤업 (server #6)', 'lost update (이슈 #36, server #42)'처럼
 * 끝 괄호에 #번호가 있으면 본문과 근거로 나눈다. '이슈'로 시작하면 issues, 아니면 pull로 잇는다.
 * repo가 없으면 링크 없이 표기만 돌려준다.
 */
export function splitRefs(item: string, repo?: string) {
  const match = item.match(/^(.*?)\s*\(([^()]*#\d+[^()]*)\)$/)
  if (!match) return { text: item, refs: [] as Ref[] }
  const refs = match[2].split(',').map(part => {
    const label = part.trim()
    const number = label.match(/#(\d+)/)?.[1]
    const kind = label.startsWith('이슈') ? 'issues' : 'pull'
    return {
      label,
      url: repo && number ? `${repo}/${kind}/${number}` : undefined
    }
  })
  return { text: match[1], refs }
}
