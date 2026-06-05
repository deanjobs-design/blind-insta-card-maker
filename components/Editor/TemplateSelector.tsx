'use client'
import { useState } from 'react'
import { Tabs } from '@/components/ui/Tabs'
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
    <div className="bg-white rounded-xl shadow-sm p-4">
      <Tabs
        tabs={SECTION_TABS.map(t => ({ id: t.id, label: t.label }))}
        activeTab={activeSection}
        onChange={setActiveSection}
      />
      <div className="grid grid-cols-3 gap-3 mt-4">
        {templates.map(t => (
          <button
            key={t.id}
            onClick={() => onSelect(t)}
            className={`aspect-[4/5] rounded-lg border-2 transition-all text-xs font-medium flex items-center justify-center ${
              selectedId === t.id
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-500'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>
    </div>
  )
}
