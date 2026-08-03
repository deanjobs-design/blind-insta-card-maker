import { FieldValues } from './types'

// 필드별 글자 크기(px) 저장 키 접미사
export const SIZE_SUFFIX = '__px'

export const MIN_PX = 10
export const MAX_PX = 400

// 저장된 px 값이 있으면 그 값을, 없으면 base(기본 px)를 반환
export function resolveFont(base: number, values: FieldValues, key: string): number {
  const raw = values[`${key}${SIZE_SUFFIX}`]
  if (raw == null || raw === '') return base
  const n = parseInt(raw, 10)
  if (!isFinite(n)) return base
  return Math.min(MAX_PX, Math.max(MIN_PX, n))
}

// 해당 필드의 현재 표시 px (컨트롤 UI에서 사용)
export function currentFont(base: number, values: FieldValues, key: string): number {
  return resolveFont(base, values, key)
}
