import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const posts = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    // 태그는 /tags/<tag> 주소가 되므로 소문자 kebab만 받는다.
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
    draft: z.boolean().default(false)
  })
})

export const collections = { posts }
