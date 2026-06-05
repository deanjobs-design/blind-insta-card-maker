import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export interface ZipEntry {
  filename: string
  dataUrl: string
}

export async function downloadZip(cards: ZipEntry[], zipName = 'cards.zip'): Promise<void> {
  if (cards.length === 0) throw new Error('다운로드할 카드가 없습니다')

  const zip = new JSZip()

  for (const { filename, dataUrl } of cards) {
    const base64 = dataUrl.replace(/^data:image\/[^;]+;base64,/, '')
    // Pad base64 to valid length
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
    zip.file(filename, padded, { base64: true })
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  saveAs(blob, zipName)
}
