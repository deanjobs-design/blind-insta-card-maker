'use client'
import { useState, useRef, useCallback } from 'react'
import { TemplateSelector, CommentPageItem } from '@/components/Editor/TemplateSelector'
import { TemplateGallery } from '@/components/Editor/TemplateGallery'
import { InputPanel } from '@/components/Editor/InputPanel'
import { PreviewPanel } from '@/components/Editor/PreviewPanel'
import { DownloadBar } from '@/components/Editor/DownloadBar'
import { CardSetRenderer } from '@/components/Editor/CardSetRenderer'
import { TemplateRenderer } from '@/components/Templates/TemplateRenderer'
import { TemplateConfig, FieldValues, CardItem } from '@/lib/types'
import { captureCard, getCardHeight } from '@/lib/exportCard'
import { downloadZip, downloadSinglePng } from '@/lib/createZip'
import { getTemplate, getSectionTemplates } from '@/lib/templateConfig'

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
  const [isDownloadingPng, setIsDownloadingPng] = useState(false)
  const [showOverview, setShowOverview] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('all') // 'all'이면 템플릿 갤러리
  const renderRef = useRef<HTMLDivElement>(null)
  const currentRenderRef = useRef<HTMLDivElement>(null)

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
      const base: FieldValues = t.section === 'cover' && sharedCoverImage ? { mainImage: sharedCoverImage } : {}
      setFieldValues({ ...base, ...(TEMPLATE_DEFAULTS[t.id] ?? {}) })
    }
  }, [sharedCoverImage])

  // 섹션 탭 클릭 — 'all'은 갤러리, 나머지는 해당 섹션 첫 템플릿 선택
  const handleSectionChange = useCallback((sectionId: string) => {
    setActiveSection(sectionId)
    if (sectionId === 'all') return
    if (sectionId === 'post_comment') {
      if (commentPages.length > 0) setActiveCommentPageId(commentPages[0].id)
      const t = getTemplate('post_comment')
      if (t) setSelectedTemplate(t)
    } else {
      const first = getSectionTemplates(sectionId as TemplateConfig['section'])[0]
      if (first) handleTemplateSelect(first)
    }
  }, [commentPages, handleTemplateSelect])

  // 갤러리에서 템플릿 선택 → 편집으로 전환
  const handleGallerySelect = useCallback((t: TemplateConfig) => {
    setActiveSection(t.section)
    if (t.section === 'post_comment') {
      if (commentPages.length > 0) setActiveCommentPageId(commentPages[0].id)
      setSelectedTemplate(t)
    } else {
      handleTemplateSelect(t)
    }
  }, [commentPages, handleTemplateSelect])

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

  // 현재 카드를 바로 PNG로 다운로드 (세트에 추가하지 않음)
  const handleDownloadPng = useCallback(async () => {
    if (!currentRenderRef.current || !selectedTemplate) return
    setIsDownloadingPng(true)
    try {
      const el = currentRenderRef.current.querySelector('[data-current-card]') as HTMLElement
      if (!el) return
      const dataUrl = await captureCard(el, getCardHeight(selectedTemplate.id, activeValues))
      await downloadSinglePng(dataUrl, `${selectedTemplate.id}.png`)
    } finally {
      setIsDownloadingPng(false)
    }
  }, [selectedTemplate, activeValues])

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
        const dataUrl = await captureCard(el, getCardHeight(card.templateId, card.values))
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
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex-shrink-0 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">블라인드 인스타 카드 메이커</h1>
        <button
          onClick={() => setShowOverview(true)}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          ⊞ 전체 보기
        </button>
      </header>

      <TemplateSelector
        selectedId={selectedTemplate?.id ?? ''}
        onSelect={handleTemplateSelect}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        commentPages={commentPages}
        activeCommentPageId={activeCommentPageId}
        onSelectCommentPage={handleSelectCommentPage}
        onAddCommentPage={handleAddCommentPage}
        onRemoveCommentPage={handleRemoveCommentPage}
      />

      {activeSection === 'all' ? (
        /* 전체 템플릿 갤러리 — 입력 전 모든 템플릿 선택 */
        <div className="flex-1 min-h-0">
          <TemplateGallery onSelect={handleGallerySelect} />
        </div>
      ) : (
        <div className="flex gap-4 flex-1 min-h-0 p-4">
          <div className="w-72 flex-shrink-0 min-h-0 overflow-y-auto">
            <InputPanel
              template={selectedTemplate}
              values={activeValues}
              onChange={handleFieldChange}
              onAddToSet={handleAddToSet}
              onDownloadPng={handleDownloadPng}
              isDownloadingPng={isDownloadingPng}
            />
          </div>
          <div className="flex-1 min-h-0 min-w-0">
            <PreviewPanel
              templateId={selectedTemplate?.id ?? null}
              values={activeValues}
            />
          </div>
        </div>
      )}

      <div className="flex-shrink-0 px-4 pb-4">
        <DownloadBar
          cards={cardSet}
          onRemove={handleRemoveFromSet}
          onDownload={handleDownload}
          isDownloading={isDownloading}
        />
      </div>

      <CardSetRenderer ref={renderRef} cards={cardSet} />

      {/* 현재 카드 풀사이즈 렌더 (PNG 즉시 다운로드용, 화면 밖) */}
      <div ref={currentRenderRef} className="absolute -left-[99999px] top-0 pointer-events-none">
        {selectedTemplate && (
          <div data-current-card style={{ width: 1080, height: getCardHeight(selectedTemplate.id, activeValues) }}>
            <TemplateRenderer templateId={selectedTemplate.id} values={activeValues} />
          </div>
        )}
      </div>

      {/* 전체 보기 오버레이 */}
      {showOverview && (
        <div className="fixed inset-0 z-50 bg-neutral-900 flex flex-col">
          <div className="flex items-center justify-between px-8 py-4 bg-white/10 flex-shrink-0">
            <h2 className="text-lg font-bold text-white">전체 보기 — 다운로드 세트 ({cardSet.length}장)</h2>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                disabled={cardSet.length === 0 || isDownloading}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isDownloading ? '렌더링 중...' : '⬇ ZIP 다운로드'}
              </button>
              <button
                onClick={() => setShowOverview(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white/20 text-white hover:bg-white/30"
              >
                ✕ 닫기
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-8">
            {cardSet.length === 0 ? (
              <div className="h-full flex items-center justify-center text-white/60 text-sm">
                세트에 추가된 카드가 없습니다. 각 탭에서 “+ 세트에 추가”로 카드를 담아보세요.
              </div>
            ) : (
              <div className="flex flex-wrap gap-6 justify-center">
                {cardSet.map((card, i) => (
                  <div key={card.id} className="flex flex-col items-center gap-2">
                    <div
                      className="bg-white rounded-lg overflow-hidden shadow-xl"
                      style={{ width: 270, height: 337.5 }}
                    >
                      <div style={{ width: 1080, height: 1350, transform: 'scale(0.25)', transformOrigin: 'top left' }}>
                        <TemplateRenderer templateId={card.templateId} values={card.values} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-white text-xs">
                      <span>{String(i + 1).padStart(2, '0')}. {card.label}</span>
                      <button
                        onClick={() => handleRemoveFromSet(card.id)}
                        className="text-white/50 hover:text-red-400"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
