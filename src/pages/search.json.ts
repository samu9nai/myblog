import { getPosts } from '@/utils/posts'

// ⌘K 검색이 브라우저에서 내려받는 목록이다. 본문은 넣지 않는다.
export async function GET() {
  const posts = await getPosts()
  const entries = posts.map(post => ({
    title: post.data.title,
    description: post.data.description,
    tags: post.data.tags,
    url: `/posts/${post.id}/`
  }))
  return Response.json(entries)
}
