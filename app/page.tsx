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

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateConfig | null>(null)
  const [fieldValues, setFieldValues] = useState<FieldValues>({})
  const [cardSet, setCardSet] = useState<CardItem[]>([])
  const [isDownloading, setIsDownloading] = useState(false)
  const renderRef = useRef<HTMLDivElement>(null)

  const handleTemplateSelect = useCallback((t: TemplateConfig) => {
    setSelectedTemplate(t)
    setFieldValues({})
  }, [])

  const handleFieldChange = useCallback((key: string, value: string) => {
    setFieldValues(prev => ({ ...prev, [key]: value }))
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
      const entries = []
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
    <main className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <h1 className="text-xl font-bold text-gray-900">블라인드 카드 메이커</h1>
      </header>

      <div className="flex flex-col gap-4 p-6 max-w-7xl mx-auto" style={{ height: 'calc(100vh - 64px)' }}>
        <TemplateSelector
          selectedId={selectedTemplate?.id ?? ''}
          onSelect={handleTemplateSelect}
        />

        <div className="flex gap-4 flex-1 min-h-0">
          <div className="w-80 flex-shrink-0 overflow-y-auto">
            <InputPanel
              template={selectedTemplate}
              values={fieldValues}
              onChange={handleFieldChange}
              onAddToSet={handleAddToSet}
            />
          </div>

          <div className="flex-1">
            <PreviewPanel
              templateId={selectedTemplate?.id ?? null}
              values={fieldValues}
            />
          </div>
        </div>

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
