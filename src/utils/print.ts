// 브라우저에서 쓴다. 인쇄하기 전에 끝내야 할 일(예: mermaid 그림을 라이트 색으로 다시 그리기)을 모은다.
type Hook = () => Promise<void>

const hooks: Hook[] = []

export const onBeforePrint = (hook: Hook) => {
  hooks.push(hook)
}

/**
 * 준비할 일이 있으면 화면을 라이트 테마로 바꿔 끝낸 뒤 인쇄 창을 연다.
 * 인쇄 창이 닫히면 원래 테마로 돌린다.
 */
export async function printPage() {
  if (hooks.length === 0) {
    window.print()
    return
  }
  const root = document.documentElement
  const theme = root.dataset.theme
  root.dataset.theme = 'light'
  addEventListener(
    'afterprint',
    () => {
      root.dataset.theme = theme
    },
    { once: true }
  )
  // 준비가 실패해도(예: mermaid를 못 불러옴) 인쇄는 연다. 그림 자리에는 원문이 남는다.
  await Promise.allSettled(hooks.map(hook => hook()))
  window.print()
}

// ⌘P·Ctrl+P도 같은 길로 보낸다. 브라우저 메뉴의 인쇄는 가로챌 수 없다.
addEventListener('keydown', event => {
  if (hooks.length === 0) return
  if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'p')
    return
  event.preventDefault()
  void printPage()
})
