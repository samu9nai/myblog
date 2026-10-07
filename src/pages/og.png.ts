import { site } from '@/site'
import { renderOgImage } from '@/utils/og'

// 글이 아닌 페이지가 함께 쓰는 기본 OG 이미지다.
export async function GET() {
  const png = await renderOgImage({ title: site.description })
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' }
  })
}
