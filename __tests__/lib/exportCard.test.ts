import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: vi.fn().mockReturnValue('data:image/png;base64,abc123'),
  }),
}))

import { captureCard } from '@/lib/exportCard'

describe('captureCard', () => {
  let el: HTMLElement

  beforeEach(() => {
    el = document.createElement('div')
    el.id = 'card-preview'
    document.body.appendChild(el)
  })

  it('html2canvas를 호출하고 dataURL 문자열을 반환한다', async () => {
    const result = await captureCard(el)
    expect(result).toBe('data:image/png;base64,abc123')
  })

  it('엘리먼트가 null이면 에러를 던진다', async () => {
    await expect(captureCard(null as unknown as HTMLElement)).rejects.toThrow('카드 엘리먼트가 없습니다')
  })
})
