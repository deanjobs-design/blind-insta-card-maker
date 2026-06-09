import { toPng } from 'html-to-image'
import { FieldValues } from './types'

export const CARD_WIDTH = 1080
export const CARD_HEIGHT = 1350
export const CARD_HEIGHT_TALL = 1920

// 1080x1920 토글을 지원하는 템플릿
const TALL_CAPABLE = new Set(['photo_01', 'photo_02', 'photo_comment'])

export function supportsTall(templateId: string): boolean {
  return TALL_CAPABLE.has(templateId)
}

export function getCardHeight(templateId: string, values?: FieldValues): number {
  return supportsTall(templateId) && values?.tallRatio === 'true'
    ? CARD_HEIGHT_TALL
    : CARD_HEIGHT
}

export async function captureCard(element: HTMLElement, height: number = CARD_HEIGHT): Promise<string> {
  if (!element) throw new Error('카드 엘리먼트가 없습니다')

  return toPng(element, {
    width: CARD_WIDTH,
    height,
    pixelRatio: 1,
    cacheBust: true,
  })
}
