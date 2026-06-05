import { describe, it, expect, vi } from 'vitest'

vi.mock('file-saver', () => ({ saveAs: vi.fn() }))

import { downloadZip } from '@/lib/createZip'
import { saveAs } from 'file-saver'

describe('downloadZip', () => {
  it('PNG dataURL 배열을 받아 saveAs를 호출한다', async () => {
    const cards = [
      { filename: '01_photo_01.png', dataUrl: 'data:image/png;base64,abc' },
      { filename: '02_post.png', dataUrl: 'data:image/png;base64,def' },
    ]
    await downloadZip(cards, 'test.zip')
    expect(saveAs).toHaveBeenCalledOnce()
  })

  it('카드가 없으면 에러를 던진다', async () => {
    await expect(downloadZip([], 'empty.zip')).rejects.toThrow('다운로드할 카드가 없습니다')
  })
})
