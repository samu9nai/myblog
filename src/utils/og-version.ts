import { createHash } from 'node:crypto'

/**
 * OG 이미지 주소에 붙일 버전(8자리)을 만든다. 링크 미리보기(카카오톡·디스코드·슬랙)는 이미지를
 * 주소 기준으로 캐시하므로, 그림을 정하는 입력(템플릿 소스, 제목, 설명)이 바뀔 때만 주소를 바꾼다.
 */
export const ogVersion = (
  template: string,
  title: string,
  description?: string
) =>
  createHash('sha256')
    .update(JSON.stringify([template, title, description ?? '']))
    .digest('hex')
    .slice(0, 8)
