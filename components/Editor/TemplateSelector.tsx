'use client'
import { useState } from 'react'
import { getSectionTemplates } from '@/lib/templateConfig'
import { TemplateConfig } from '@/lib/types'

const SECTION_TABS = [
  { id: 'cover', label: '표지' },
  { id: 'post', label: '게시물' },
  { id: 'post_comment', label: '게시물+댓글' },
  { id: 'last_page', label: '마지막 페이지' },
] as const

interface Props {
  selectedId: string
  onSelect: (template: TemplateConfig) => void
}

export function TemplateSelector({ selectedId, onSelect }: Props) {
  const [activeSection, setActiveSection] = useState<string>('cover')
  const templates = getSectionTemplates(activeSection as TemplateConfig['section'])

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-0 flex-shrink-0">
      {/* Section tabs */}
      <div className="flex gap-0 border-b border-gray-100">
        {SECTION_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveSection(tab.id)
              const first = getSectionTemplates(tab.id as TemplateConfig['section'])[0]
              if (first) onSelect(first)
            }}
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

      {/* Template chips — horizontal scroll */}
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
    </div>
  )
}
