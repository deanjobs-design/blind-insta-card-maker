import { FieldValues } from './types'

// 로고가 원 안에서 차지하는 비율(%) 저장 키 접미사
export const LOGO_SCALE_SUFFIX = '__logoscale'

export const MIN_LOGO_SCALE = 40   // %
export const MAX_LOGO_SCALE = 100  // %
export const LOGO_SCALE_STEP = 5   // %
export const DEFAULT_LOGO_SCALE = 100

// 현재 로고 비율(%) 반환
export function getLogoScale(values: FieldValues, key: string): number {
  const raw = values[`${key}${LOGO_SCALE_SUFFIX}`]
  if (raw == null || raw === '') return DEFAULT_LOGO_SCALE
  const n = parseInt(raw, 10)
  if (!isFinite(n)) return DEFAULT_LOGO_SCALE
  return Math.min(MAX_LOGO_SCALE, Math.max(MIN_LOGO_SCALE, n))
}
