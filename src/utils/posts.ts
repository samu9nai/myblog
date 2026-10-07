import { getCollection } from 'astro:content'
import { checkProjects, isVisible } from '@/utils/projects'

/**
 * 공개할 글을 최신순으로 돌려준다. 같은 날 발행한 사례 글은 caseOrder 순서로 둔다.
 * draft는 개발 서버에서만 보인다.
 */
export async function getPosts() {
  await checkProjects()
  const posts = await getCollection('posts', isVisible)
  return posts.sort(
    (a, b) =>
      b.data.pubDate.valueOf() - a.data.pubDate.valueOf() ||
      (a.data.caseOrder ?? Infinity) - (b.data.caseOrder ?? Infinity)
  )
}

/** 프로젝트에 묶인 사례 글을 caseOrder 순으로 돌려준다. */
export async function getCases(projectId: string) {
  const posts = await getPosts()
  return posts
    .filter(post => post.data.project?.id === projectId)
    .sort((a, b) => (a.data.caseOrder ?? 0) - (b.data.caseOrder ?? 0))
}

const dateFormat = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'Asia/Seoul'
})

export const formatDate = (date: Date) => dateFormat.format(date)
