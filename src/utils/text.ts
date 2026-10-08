/** '**…**'로 감싼 부분을 강조 조각으로 나눈다. resume.yaml의 소개 문단에 쓴다. */
export const splitEmphasis = (text: string) =>
  text.split('**').map((part, index) => ({ part, strong: index % 2 === 1 }))

/** 메타 설명처럼 강조를 그릴 수 없는 곳에서는 표시를 지운다. */
export const stripEmphasis = (text: string) => text.replaceAll('**', '')
