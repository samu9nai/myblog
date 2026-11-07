type SearchKeyEvent = Pick<KeyboardEvent, 'key' | 'isComposing' | 'keyCode'>

/** 결과가 선택되면 'open', 방향키면 이동할 칸 수를 반환한다. */
export function getSearchAction(event: SearchKeyEvent, hasResults: boolean) {
  // 조합이 끝나는 경계에서는 isComposing이 false여도 IME 키 코드 229가 온다.
  if (event.isComposing || event.keyCode === 229) return
  if (event.key === 'ArrowDown') return 1
  if (event.key === 'ArrowUp') return -1
  if (event.key === 'Enter' && hasResults) return 'open'
}
