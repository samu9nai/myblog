import { getEntry } from 'astro:content'
import { checkProjects } from '@/utils/projects'

/** src/data/resume.yaml을 읽는다. 없는 프로젝트를 가리키면 빌드를 멈춘다. */
export async function getResume() {
  await checkProjects()
  const resume = await getEntry('resume', 'resume')
  if (!resume) throw new Error('src/data/resume.yaml이 없다')
  return resume.data
}

const monthFormat = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  timeZone: 'Asia/Seoul'
})

/** 빌드한 날의 달(Asia/Seoul)을 YYYY-MM으로 돌려준다. 진행 중인 경력을 셀 때 쓴다. */
export const currentMonth = () => monthFormat.format(new Date())
