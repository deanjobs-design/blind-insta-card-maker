'use client'
import { TEMPLATES } from '@/lib/templateConfig'
import { TemplateConfig, FieldValues } from '@/lib/types'
import { TemplateRenderer } from '@/components/Templates/TemplateRenderer'

const SECTION_LABELS: Record<string, string> = {
  cover: '표지',
  post: '게시물',
  post_comment: '댓글',
  last_page: '마지막 페이지',
}

const SECTION_ORDER = ['cover', 'post', 'post_comment', 'last_page']

// 갤러리 미리보기용 기본값 (대표 모습)
function previewValues(t: TemplateConfig): FieldValues {
  if (t.id === 'text_02') return { showChannelInfo: 'true' }
  if (t.id === 'photo_text_02') return { showBody: 'true' }
  if (t.section === 'post_comment') return { showC2: 'true', showC3: 'true' }
  return {}
}

interface Props {
  onSelect: (template: TemplateConfig) => void
}

// 입력 전, 모든 템플릿을 한 화면에서 보고 선택하는 갤러리
export function TemplateGallery({ onSelect }: Props) {
  return (
    <div className="h-full overflow-y-auto p-6">
      {SECTION_ORDER.map(section => {
        const items = TEMPLATES.filter(t => t.section === section)
        if (items.length === 0) return null
        return (
          <section key={section} className="mb-8">
            <h2 className="text-sm font-bold text-gray-700 mb-3">{SECTION_LABELS[section]}</h2>
            <div className="flex flex-wrap gap-5">
              {items.map(t => (
                <button
                  key={t.id}
                  onClick={() => onSelect(t)}
                  className="group flex flex-col items-center gap-2"
                >
                  <div
                    className="bg-white rounded-xl overflow-hidden shadow-sm border-2 border-transparent group-hover:border-blue-500 group-hover:shadow-lg transition-all"
                    style={{ width: 216, height: 270, textAlign: 'left' }}
                  >
                    <div style={{ width: 1080, height: 1350, transform: 'scale(0.2)', transformOrigin: 'top left', textAlign: 'left' }}>
                      <TemplateRenderer templateId={t.id} values={previewValues(t)} />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-600 group-hover:text-blue-600">{t.name}</span>
                </button>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
