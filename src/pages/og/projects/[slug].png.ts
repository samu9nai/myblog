import type { APIContext } from 'astro'
import type { CollectionEntry } from 'astro:content'
import { renderOgImage } from '@/utils/og'
import { getProjects } from '@/utils/projects'

export async function getStaticPaths() {
  const projects = await getProjects()
  return projects.map(project => ({
    params: { slug: project.id },
    props: { project }
  }))
}

export async function GET({
  props
}: APIContext<{ project: CollectionEntry<'projects'> }>) {
  const { name, summary } = props.project.data
  const png = await renderOgImage({ title: name, description: summary })
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' }
  })
}
