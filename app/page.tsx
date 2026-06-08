'use client'
import { useState, useRef, useCallback } from 'react'
import { TemplateSelector, CommentPageItem } from '@/components/Editor/TemplateSelector'
import { InputPanel } from '@/components/Editor/InputPanel'
import { PreviewPanel } from '@/components/Editor/PreviewPanel'
import { DownloadBar } from '@/components/Editor/DownloadBar'
import { CardSetRenderer } from '@/components/Editor/CardSetRenderer'
import { TemplateConfig, FieldValues, CardItem } from '@/lib/types'
import { captureCard } from '@/lib/exportCard'
import { downloadZip } from '@/lib/createZip'
import { getTemplate } from '@/lib/templateConfig'

const TEMPLATE_DEFAULTS: Record<string, Record<string, string>> = {
  text_02: { showChannelInfo: 'true' },
  photo_text_02: { showBody: 'true' },
}

// 댓글 페이지 기본값 — 댓글2, 댓글3 표시 ON
const COMMENT_DEFAULTS: FieldValues = { showC2: 'true', showC3: 'true' }

function makeCommentPage(idx: number): CommentPageItem {
  return { id: crypto.randomUUID(), label: `댓글${idx}` }
}

const INITIAL_COMMENT_PAGE = makeCommentPage(1)

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateConfig | null>(getTemplate('photo_01') ?? null)
  const [fieldValues, setFieldValues] = useState<FieldValues>({})
  const [cardSet, setCardSet] = useState<CardItem[]>([])
  const [isDownloading, setIsDownloading] = useState(false)
  const [sharedCoverImage, setSharedCoverImage] = useState<string>('')
  const renderRef = useRef<HTMLDivElement>(null)

  // 댓글 멀티페이지 상태
  const [commentPages, setCommentPages] = useState<CommentPageItem[]>([INITIAL_COMMENT_PAGE])
  const [activeCommentPageId, setActiveCommentPageId] = useState<string>(INITIAL_COMMENT_PAGE.id)
  const [commentPageValues, setCommentPageValues] = useState<Record<string, FieldValues>>({
    [INITIAL_COMMENT_PAGE.id]: { ...COMMENT_DEFAULTS },
  })

  // 현재 활성 fieldValues — 댓글 섹션이면 commentPageValues 사용
  const isCommentSection = selectedTemplate?.section === 'post_comment'
  const activeValues = isCommentSection
    ? (commentPageValues[activeCommentPageId] ?? COMMENT_DEFAULTS)
    : fieldValues

  const handleTemplateSelect = useCallback((t: TemplateConfig) => {
    setSelectedTemplate(t)
    if (t.section !== 'post_comment') {
      const base = t.section === 'cover' && sharedCoverImage ? { mainImage: sharedCoverImage } : {}
      setFieldValues({ ...base, ...(TEMPLATE_DEFAULTS[t.id] ?? {}) })
    }
  }, [sharedCoverImage])

  const handleSelectCommentPage = useCallback((id: string) => {
    setActiveCommentPageId(id)
    const t = getTemplate('post_comment')
    if (t) setSelectedTemplate(t)
  }, [])

  const handleAddCommentPage = useCallback(() => {
    setCommentPages(prev => {
      const newPage = makeCommentPage(prev.length + 1)
      setActiveCommentPageId(newPage.id)
      setCommentPageValues(vals => ({ ...vals, [newPage.id]: { ...COMMENT_DEFAULTS } }))
      const t = getTemplate('post_comment')
      if (t) setSelectedTemplate(t)
      return [...prev, newPage]
    })
  }, [])

  const handleRemoveCommentPage = useCallback((id: string) => {
    setCommentPages(prev => {
      const next = prev.filter(p => p.id !== id)
      if (activeCommentPageId === id && next.length > 0) {
        setActiveCommentPageId(next[0].id)
      }
      setCommentPageValues(vals => {
        const { [id]: _, ...rest } = vals
        return rest
      })
      return next
    })
  }, [activeCommentPageId])

  const handleFieldChange = useCallback((key: string, value: string) => {
    if (isCommentSection) {
      setCommentPageValues(prev => ({
        ...prev,
        [activeCommentPageId]: { ...(prev[activeCommentPageId] ?? {}), [key]: value },
      }))
    } else {
      setFieldValues(prev => ({ ...prev, [key]: value }))
      if (key === 'mainImage' || key === 'sectionImage') {
        setSharedCoverImage(value)
      }
    }
  }, [isCommentSection, activeCommentPageId])

  const handleAddToSet = useCallback(() => {
    if (!selectedTemplate) return
    const values = isCommentSection
      ? (commentPageValues[activeCommentPageId] ?? {})
      : fieldValues
    const activePage = commentPages.find(p => p.id === activeCommentPageId)
    setCardSet(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        templateId: selectedTemplate.id,
        values: { ...values },
        label: isCommentSection ? (activePage?.label ?? selectedTemplate.name) : selectedTemplate.name,
      },
    ])
  }, [selectedTemplate, fieldValues, isCommentSection, activeCommentPageId, commentPageValues, commentPages])

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
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900">블라인드 카드 메이커</h1>
      </header>

      <TemplateSelector
        selectedId={selectedTemplate?.id ?? ''}
        onSelect={handleTemplateSelect}
        commentPages={commentPages}
        activeCommentPageId={activeCommentPageId}
        onSelectCommentPage={handleSelectCommentPage}
        onAddCommentPage={handleAddCommentPage}
        onRemoveCommentPage={handleRemoveCommentPage}
      />

      <div className="flex gap-4 flex-1 min-h-0 p-4">
        <div className="w-72 flex-shrink-0 min-h-0 overflow-y-auto">
          <InputPanel
            template={selectedTemplate}
            values={activeValues}
            onChange={handleFieldChange}
            onAddToSet={handleAddToSet}
          />
        </div>
        <div className="flex-1 min-h-0 min-w-0">
          <PreviewPanel
            templateId={selectedTemplate?.id ?? null}
            values={activeValues}
          />
        </div>
      </div>

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
