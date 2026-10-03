import { getCollection } from 'astro:content'

/** 공개할 글을 최신순으로 돌려준다. draft는 개발 서버에서만 보인다. */
export async function getPosts() {
  const posts = await getCollection(
    'posts',
    ({ data }) => import.meta.env.DEV || !data.draft
  )
  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  )
}

const dateFormat = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'Asia/Seoul'
})

export const formatDate = (date: Date) => dateFormat.format(date)
