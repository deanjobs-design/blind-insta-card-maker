'use client'
import { useState, useRef, useCallback } from 'react'
import { TemplateSelector } from '@/components/Editor/TemplateSelector'
import { InputPanel } from '@/components/Editor/InputPanel'
import { PreviewPanel } from '@/components/Editor/PreviewPanel'
import { DownloadBar } from '@/components/Editor/DownloadBar'
import { CardSetRenderer } from '@/components/Editor/CardSetRenderer'
import { TemplateConfig, FieldValues, CardItem } from '@/lib/types'
import { captureCard } from '@/lib/exportCard'
import { downloadZip } from '@/lib/createZip'
import { getTemplate } from '@/lib/templateConfig'

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateConfig | null>(getTemplate('photo_01') ?? null)
  const [fieldValues, setFieldValues] = useState<FieldValues>({})
  const [cardSet, setCardSet] = useState<CardItem[]>([])
  const [isDownloading, setIsDownloading] = useState(false)
  // 표지 섹션 공유 배경 이미지 — 어느 표지 템플릿에서 업로드해도 전체 적용
  const [sharedCoverImage, setSharedCoverImage] = useState<string>('')
  const renderRef = useRef<HTMLDivElement>(null)

  const handleTemplateSelect = useCallback((t: TemplateConfig) => {
    setSelectedTemplate(t)
    const base = t.section === 'cover' && sharedCoverImage ? { mainImage: sharedCoverImage } : {}
    // 템플릿별 기본값
    const defaults: Record<string, Record<string, string>> = {
      text_02: { showChannelInfo: 'true' },
    }
    setFieldValues({ ...base, ...(defaults[t.id] ?? {}) })
  }, [sharedCoverImage])

  const handleFieldChange = useCallback((key: string, value: string) => {
    setFieldValues(prev => ({ ...prev, [key]: value }))
    // 배경 이미지 업로드 시 표지 공유 상태에도 저장
    if (key === 'mainImage' || key === 'sectionImage') {
      setSharedCoverImage(value)
    }
  }, [])

  const handleAddToSet = useCallback(() => {
    if (!selectedTemplate) return
    setCardSet(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        templateId: selectedTemplate.id,
        values: { ...fieldValues },
        label: selectedTemplate.name,
      },
    ])
  }, [selectedTemplate, fieldValues])

  const handleRemoveFromSet = useCallback((id: string) => {
    setCardSet(prev => prev.filter(c => c.id !== id))
  }, [])

  const handleDownload = useCallback(async () => {
    if (!renderRef.current || cardSet.length === 0) return
    setIsDownloading(true)
    try {
      const entries: { filename: string; dataUrl: string }[] = []
      const cardEls = renderRef.current.querySelectorAll('[data-card-id]')
      for (let i = 0; i < cardEls.length; i++) {
        const el = cardEls[i] as HTMLElement
        const cardId = el.getAttribute('data-card-id')!
        const card = cardSet.find(c => c.id === cardId)!
        const dataUrl = await captureCard(el)
        entries.push({
          filename: `${String(i + 1).padStart(2, '0')}_${card.templateId}.png`,
          dataUrl,
        })
      }
      await downloadZip(entries, 'blind_cards.zip')
    } finally {
      setIsDownloading(false)
    }
  }, [cardSet])

  return (
    <main className="flex flex-col bg-gray-100 overflow-hidden" style={{ height: '100dvh' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900">블라인드 카드 메이커</h1>
      </header>

      {/* Template selector — compact horizontal strip, never grows */}
      <TemplateSelector
        selectedId={selectedTemplate?.id ?? ''}
        onSelect={handleTemplateSelect}
      />

      {/* Editor — takes all remaining space */}
      <div className="flex gap-4 flex-1 min-h-0 p-4">
        {/* Input form */}
        <div className="w-72 flex-shrink-0 min-h-0 overflow-y-auto">
          <InputPanel
            template={selectedTemplate}
            values={fieldValues}
            onChange={handleFieldChange}
            onAddToSet={handleAddToSet}
          />
        </div>

        {/* Card preview */}
        <div className="flex-1 min-h-0 min-w-0">
          <PreviewPanel
            templateId={selectedTemplate?.id ?? null}
            values={fieldValues}
          />
        </div>
      </div>

      {/* Download bar */}
      <div className="flex-shrink-0 px-4 pb-4">
        <DownloadBar
          cards={cardSet}
          onRemove={handleRemoveFromSet}
          onDownload={handleDownload}
          isDownloading={isDownloading}
        />
      </div>

      <CardSetRenderer ref={renderRef} cards={cardSet} />
    </main>
  )
}
