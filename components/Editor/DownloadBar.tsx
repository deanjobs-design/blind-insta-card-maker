'use client'
import { useState } from 'react'
import { CardItem } from '@/lib/types'
import { Button } from '@/components/ui/Button'

interface Props {
  cards: CardItem[]
  onRemove: (id: string) => void
  onReorder: (fromIndex: number, toIndex: number) => void
  onDownload: () => void
  isDownloading: boolean
}

export function DownloadBar({ cards, onRemove, onReorder, onDownload, isDownloading }: Props) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  return (
    <div className="bg-white rounded-xl shadow-sm px-6 py-4 flex items-center gap-4">
      <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
        다운로드 세트
      </span>

      <div className="flex-1 flex gap-2 overflow-x-auto">
        {cards.length === 0 ? (
          <span className="text-sm text-gray-400">카드를 추가하세요</span>
        ) : (
          cards.map((card, i) => (
            <div
              key={card.id}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={e => {
                e.preventDefault()
                if (i !== overIndex) setOverIndex(i)
              }}
              onDrop={e => {
                e.preventDefault()
                if (dragIndex !== null && dragIndex !== i) onReorder(dragIndex, i)
                setDragIndex(null)
                setOverIndex(null)
              }}
              onDragEnd={() => { setDragIndex(null); setOverIndex(null) }}
              className={`flex items-center gap-1 rounded-lg px-3 py-1 text-sm whitespace-nowrap cursor-grab active:cursor-grabbing transition-all select-none ${
                dragIndex === i
                  ? 'opacity-40 bg-blue-100 border border-blue-300 text-blue-700'
                  : overIndex === i && dragIndex !== null
                  ? 'bg-blue-100 border border-blue-400 text-blue-700 ring-2 ring-blue-300'
                  : 'bg-blue-50 border border-blue-200 text-blue-700'
              }`}
              title="드래그해서 순서 변경"
            >
              <span className="text-blue-300">⠿</span>
              <span>{String(i + 1).padStart(2, '0')}. {card.label}</span>
              <button
                onClick={() => onRemove(card.id)}
                className="ml-1 text-blue-400 hover:text-blue-700 font-bold"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      <Button
        onClick={onDownload}
        disabled={cards.length === 0 || isDownloading}
        className="whitespace-nowrap"
      >
        {isDownloading ? '렌더링 중...' : '⬇ ZIP 다운로드'}
      </Button>
    </div>
  )
}
