import { type CollectionEntry, getCollection } from 'astro:content'

/** draft는 개발 서버에서만 보인다. */
export const isVisible = ({ data }: { data: { draft: boolean } }) =>
  import.meta.env.DEV || !data.draft

let checked: Promise<void> | undefined

/**
 * 컬렉션 스키마로는 잡지 못하는 규칙을 검사하고, 어기면 빌드를 멈춘다.
 * Astro는 없는 항목을 가리키는 reference를 로그로만 알리고 빌드를 계속한다.
 */
export const checkProjects = () =>
  (checked ??= (async () => {
    const [projects, posts, resume] = await Promise.all([
      getCollection('projects'),
      getCollection('posts'),
      getCollection('resume')
    ])
    const errors: string[] = []

    const orders = new Map<number, string>()
    for (const project of projects) {
      const other = orders.get(project.data.order)
      if (other) {
        errors.push(
          `프로젝트 ${other}와 ${project.id}의 order(${project.data.order})가 같다`
        )
      }
      orders.set(project.data.order, project.id)
    }

    const byId = new Map(projects.map(project => [project.id, project]))
    const references = [
      ...posts
        .filter(isVisible)
        .map(post => [`글 ${post.id}`, post.data.project?.id] as const),
      ...projects
        .filter(isVisible)
        .map(
          project =>
            [`프로젝트 ${project.id}`, project.data.basedOn?.id] as const
        ),
      ...resume.flatMap(({ data }) =>
        [
          ...data.experience.flatMap(item => item.projects),
          ...data.projects
        ].map(item => [`이력서 항목 ${item.name}`, item.project?.id] as const)
      )
    ]
    for (const [from, id] of references) {
      if (id === undefined) continue
      const target = byId.get(id)
      if (!target) errors.push(`${from}가 없는 프로젝트 ${id}를 가리킨다`)
      else if (!isVisible(target)) {
        errors.push(`${from}가 draft 프로젝트 ${id}를 가리킨다`)
      }
    }

    if (errors.length > 0) throw new Error(errors.join('\n'))
  })())

/** 공개할 프로젝트를 order 순으로 돌려준다. */
export async function getProjects() {
  await checkProjects()
  const projects = await getCollection('projects', isVisible)
  return projects.sort((a, b) => a.data.order - b.data.order)
}

const month = (value: string) => value.replace('-', '.')

export const formatPeriod = ({
  start,
  end
}: CollectionEntry<'projects'>['data']['period']) =>
  `${month(start)} – ${end ? month(end) : '진행 중'}`

export const formatKind = (data: CollectionEntry<'projects'>['data']) =>
  data.kind === 'team' ? `팀 ${data.teamSize}명` : '개인'
