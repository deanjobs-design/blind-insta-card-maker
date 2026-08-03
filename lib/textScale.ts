import { FieldValues } from './types'

// 필드별 글자 크기 배율 저장 키 접미사
export const SCALE_SUFFIX = '__scale'

export const MIN_SCALE = 0.5
export const MAX_SCALE = 2.0
export const SCALE_STEP = 0.1

export function getScale(values: FieldValues, key: string): number {
  const s = parseFloat(values[`${key}${SCALE_SUFFIX}`] || '1')
  if (!isFinite(s) || s <= 0) return 1
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, s))
}

// base 크기에 배율 적용
export function scaledFont(base: number, values: FieldValues, key: string): number {
  return Math.round(base * getScale(values, key))
}
