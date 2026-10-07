import { defineCollection, reference } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const posts = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/posts' }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      // 태그는 /posts/tags/<tag> 주소가 되므로 소문자 kebab만 받는다.
      tags: z
        .array(
          z
            .string()
            .regex(
              /^[a-z0-9]+(-[a-z0-9]+)*$/,
              '태그는 소문자 kebab(spring-boot)으로 쓴다'
            )
        )
        .default([]),
      draft: z.boolean().default(false),
      // 있으면 해당 프로젝트 페이지의 사례 목록에 caseOrder 순으로 들어간다.
      project: reference('projects').optional(),
      caseOrder: z.number().int().optional()
    })
    .refine(post => !post.project || post.caseOrder !== undefined, {
      message: 'project가 있으면 caseOrder도 쓴다',
      path: ['caseOrder']
    })
})

const month = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, '기간은 YYYY-MM으로 쓴다')

// end가 없으면 진행 중이다.
const periodFields = { start: month, end: month.optional() }

const endAfterStart = <T extends z.ZodType<{ start: string; end?: string }>>(
  schema: T
) =>
  schema.refine(value => !value.end || value.start <= value.end, {
    message: '기간의 끝이 시작보다 빠르다',
    path: ['end']
  })

const period = endAfterStart(z.object(periodFields))

const projectFields = {
  name: z.string(),
  summary: z.string(),
  period,
  role: z.array(z.string()).min(1),
  stack: z.array(z.string()).min(1),
  links: z
    .object({ repo: z.url(), docs: z.url(), live: z.url() })
    .partial()
    .default({}),
  // 홍책방 고도화 → 홍책방처럼 바탕이 된 원본 프로젝트를 가리킨다.
  basedOn: reference('projects').optional(),
  order: z.number().int(),
  draft: z.boolean().default(false)
}

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/projects' }),
  schema: z.discriminatedUnion('kind', [
    z.object({
      ...projectFields,
      kind: z.literal('team'),
      teamSize: z.number().int().min(2),
      // 협업 경계: 내가 한 일과 팀원이 한 일을 나눠 적는다.
      boundary: z.object({
        mine: z.array(z.string()).min(1),
        team: z.array(z.string()).min(1)
      })
    }),
    z.object({ ...projectFields, kind: z.literal('solo') })
  ])
})

// 경력과 프로젝트 섹션이 함께 쓰는 프로젝트 항목이다.
const resumeProject = z.object({
  name: z.string(),
  // 있으면 이름이 프로젝트 상세 페이지로 링크된다.
  project: reference('projects').optional(),
  summary: z.string(),
  period,
  // 소속과 팀 (예: KB IT's Your Life 7기 최종 프로젝트 · 팀 5명)
  context: z.string(),
  role: z.string(),
  contribution: z.string().optional(),
  stack: z.array(z.string()).min(1),
  work: z
    .array(
      z.object({
        title: z.string(),
        // PR·이슈 번호 같은 근거 (예: PR #41)
        refs: z.string().optional(),
        points: z.array(z.string()).min(1)
      })
    )
    .min(1)
})

// src/data/resume.yaml 한 파일이다.
const resume = defineCollection({
  loader: glob({ pattern: 'resume.yaml', base: './src/data' }),
  schema: z.object({
    profile: z.object({
      name: z.string(),
      title: z.string(),
      email: z.email(),
      github: z.url(),
      summary: z.string()
    }),
    highlights: z
      .array(
        z.object({
          text: z.string(),
          source: z.string().optional(),
          link: z.url().optional()
        })
      )
      .default([]),
    // 회사 경력이다. 비어 있으면 경력 섹션과 기간 합산을 보이지 않는다.
    experience: z
      .array(
        endAfterStart(
          z.object({
            org: z.string(),
            role: z.string(),
            ...periodFields,
            stack: z.array(z.string()).default([]),
            projects: z.array(resumeProject).default([])
          })
        )
      )
      .default([]),
    projects: z.array(resumeProject).default([]),
    education: z
      .array(
        endAfterStart(
          z.object({
            school: z.string(),
            // 학위가 없는 교육 과정은 비워 둔다.
            degree: z.string().optional(),
            ...periodFields
          })
        )
      )
      .default([]),
    skills: z
      .array(z.object({ group: z.string(), items: z.array(z.string()).min(1) }))
      .min(1),
    awards: z
      .array(
        z.object({
          name: z.string(),
          issuer: z.string(),
          date: month
        })
      )
      .default([])
  })
})

export const collections = { posts, projects, resume }
