'use client'
import { getSectionTemplates } from '@/lib/templateConfig'
import { TemplateConfig } from '@/lib/types'

const SECTION_TABS = [
  { id: 'all', label: '전체' },
  { id: 'cover', label: '표지' },
  { id: 'post', label: '게시물' },
  { id: 'post_comment', label: '댓글' },
  { id: 'last_page', label: '마지막 페이지' },
] as const

export interface CommentPageItem {
  id: string
  label: string
}

interface Props {
  selectedId: string
  onSelect: (template: TemplateConfig) => void
  activeSection: string
  onSectionChange: (sectionId: string) => void
  // 댓글 멀티페이지
  commentPages: CommentPageItem[]
  activeCommentPageId: string
  onSelectCommentPage: (id: string) => void
  onAddCommentPage: () => void
  onRemoveCommentPage: (id: string) => void
}

export function TemplateSelector({
  selectedId, onSelect,
  activeSection, onSectionChange,
  commentPages, activeCommentPageId,
  onSelectCommentPage, onAddCommentPage, onRemoveCommentPage,
}: Props) {
  const templates = activeSection === 'all' || activeSection === 'last_page' || activeSection === 'post' || activeSection === 'post_comment' || activeSection === 'cover'
    ? getSectionTemplates(activeSection as TemplateConfig['section'])
    : []

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-0 flex-shrink-0">
      {/* Section tabs */}
      <div className="flex gap-0 border-b border-gray-100">
        {SECTION_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onSectionChange(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeSection === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 전체 탭: 칩 줄 숨김 (갤러리는 본문에서 렌더) */}
      {activeSection === 'all' ? null : activeSection === 'post_comment' ? (
        /* 댓글 섹션: 페이지 서브탭 */
        <div className="flex gap-2 py-2 overflow-x-auto items-center" style={{ scrollbarWidth: 'none' }}>
          {commentPages.map(page => (
            <div key={page.id} className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => {
                  onSelectCommentPage(page.id)
                  const t = getSectionTemplates('post_comment')[0]
                  if (t) onSelect(t)
                }}
                className={`px-4 py-2 rounded-lg border-2 text-xs font-medium transition-all whitespace-nowrap ${
                  activeCommentPageId === page.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300 text-gray-600'
                }`}
              >
                {page.label}
              </button>
              {commentPages.length > 1 && (
                <button
                  onClick={() => onRemoveCommentPage(page.id)}
                  className="text-gray-400 hover:text-red-500 text-xs px-1"
                  title="삭제"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {commentPages.length < 5 && (
            <button
              onClick={onAddCommentPage}
              className="flex-shrink-0 px-3 py-2 rounded-lg border-2 border-dashed border-gray-300 text-xs font-medium text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-all whitespace-nowrap"
            >
              + 페이지 추가
            </button>
          )}
        </div>
      ) : (
        /* 일반 섹션: 템플릿 칩 */
        <div className="flex gap-2 py-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {templates.map(t => (
            <button
              key={t.id}
              onClick={() => onSelect(t)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg border-2 text-xs font-medium transition-all whitespace-nowrap ${
                selectedId === t.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300 text-gray-600'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
