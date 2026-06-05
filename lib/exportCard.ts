import { toPng } from 'html-to-image'

export const CARD_WIDTH = 1080
export const CARD_HEIGHT = 1350

export async function captureCard(element: HTMLElement): Promise<string> {
  if (!element) throw new Error('카드 엘리먼트가 없습니다')

  return toPng(element, {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    pixelRatio: 1,
    cacheBust: true,
  })
}
