import { forwardRef } from 'react'
import { CardItem } from '@/lib/types'
import { TemplateRenderer } from '@/components/Templates/TemplateRenderer'
import { getCardHeight } from '@/lib/exportCard'

interface Props {
  cards: CardItem[]
}

export const CardSetRenderer = forwardRef<HTMLDivElement, Props>(({ cards }, ref) => {
  return (
    <div ref={ref} className="absolute -left-[99999px] top-0 pointer-events-none">
      {cards.map(card => (
        <div
          key={card.id}
          data-card-id={card.id}
          data-card-height={getCardHeight(card.templateId, card.values)}
          style={{ width: 1080, height: getCardHeight(card.templateId, card.values) }}
        >
          <TemplateRenderer templateId={card.templateId} values={card.values} />
        </div>
      ))}
    </div>
  )
})
CardSetRenderer.displayName = 'CardSetRenderer'
