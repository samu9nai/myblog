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

const projectFields = {
  name: z.string(),
  summary: z.string(),
  // end가 없으면 진행 중이다.
  period: z
    .object({ start: month, end: month.optional() })
    .refine(period => !period.end || period.start <= period.end, {
      message: '기간의 끝이 시작보다 빠르다',
      path: ['end']
    }),
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

export const collections = { posts, projects }
