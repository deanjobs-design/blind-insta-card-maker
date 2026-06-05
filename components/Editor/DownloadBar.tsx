'use client'
import { CardItem } from '@/lib/types'
import { Button } from '@/components/ui/Button'

interface Props {
  cards: CardItem[]
  onRemove: (id: string) => void
  onDownload: () => void
  isDownloading: boolean
}

export function DownloadBar({ cards, onRemove, onDownload, isDownloading }: Props) {
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
              className="flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1 text-sm text-blue-700 whitespace-nowrap"
            >
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
