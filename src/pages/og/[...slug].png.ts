import type { APIContext } from 'astro'
import type { CollectionEntry } from 'astro:content'
import { renderOgImage } from '@/utils/og'
import { getPosts } from '@/utils/posts'

export async function getStaticPaths() {
  const posts = await getPosts()
  return posts.map(post => ({ params: { slug: post.id }, props: { post } }))
}

export async function GET({
  props
}: APIContext<{ post: CollectionEntry<'posts'> }>) {
  const { title, description } = props.post.data
  const png = await renderOgImage({ title, description })
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' }
  })
}
