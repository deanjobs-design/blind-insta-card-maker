import html2canvas from 'html2canvas'

export const CARD_WIDTH = 1080
export const CARD_HEIGHT = 1350

export async function captureCard(element: HTMLElement): Promise<string> {
  if (!element) throw new Error('카드 엘리먼트가 없습니다')

  const canvas = await html2canvas(element, {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    scale: 1,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
  })

  return canvas.toDataURL('image/png')
}
