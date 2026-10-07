// 경력 기간 합산. node --test가 그대로 읽도록 경로 별칭과 astro 모듈을 쓰지 않는다.

export interface Period {
  /** YYYY-MM */
  start: string
  /** YYYY-MM. 없으면 진행 중이다. */
  end?: string
}

const toIndex = (month: string) => {
  const [year, value] = month.split('-').map(Number)
  return year * 12 + value - 1
}

/**
 * 기간들의 개월 수를 더한다. 시작 달과 끝 달을 모두 세고, 겹치는 달은 한 번만 센다.
 * 끝이 없는 기간은 now(YYYY-MM)까지로 본다.
 */
export function totalMonths(periods: Period[], now: string) {
  const ranges = periods
    .map(({ start, end }) => [toIndex(start), toIndex(end ?? now)] as const)
    .sort((a, b) => a[0] - b[0])

  let total = 0
  let covered = -Infinity
  for (const [start, end] of ranges) {
    const from = Math.max(start, covered + 1)
    if (end >= from) total += end - from + 1
    covered = Math.max(covered, end)
  }
  return total
}

/** 14 → '1년 2개월', 12 → '1년', 5 → '5개월' */
export function formatMonths(months: number) {
  const years = Math.floor(months / 12)
  const rest = months % 12
  return [years > 0 && `${years}년`, rest > 0 && `${rest}개월`]
    .filter(Boolean)
    .join(' ')
}
