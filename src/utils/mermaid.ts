// Expressive Code가 코드 블록으로 바꾸기 전에 mermaid 블록을 <pre class="mermaid">로 빼 둔다.
// 그림은 글 상세 페이지의 스크립트가 브라우저에서 그린다.
const escapeHtml = (text: string) =>
  text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

export const mermaidBlocks = {
  name: 'mermaid-blocks',
  code: (node: { lang?: string | null; value: string }) =>
    node.lang === 'mermaid'
      ? {
          type: 'html' as const,
          value: `<pre class="mermaid">${escapeHtml(node.value)}</pre>`
        }
      : undefined
}
