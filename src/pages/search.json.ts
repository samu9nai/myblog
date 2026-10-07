import { getPosts } from '@/utils/posts'
import { getProjects } from '@/utils/projects'

// ⌘K 검색이 브라우저에서 내려받는 목록이다. 본문은 넣지 않는다.
// 프로젝트는 태그 대신 기술 스택으로 찾는다.
export async function GET() {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()])
  const entries = [
    ...projects.map(project => ({
      kind: 'project',
      title: project.data.name,
      description: project.data.summary,
      tags: project.data.stack,
      url: `/projects/${project.id}/`
    })),
    ...posts.map(post => ({
      kind: 'post',
      title: post.data.title,
      description: post.data.description,
      tags: post.data.tags,
      url: `/posts/${post.id}/`
    }))
  ]
  return Response.json(entries)
}
