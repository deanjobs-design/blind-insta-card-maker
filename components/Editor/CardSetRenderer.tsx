import { forwardRef } from 'react'
import { CardItem } from '@/lib/types'
import { TemplateRenderer } from '@/components/Templates/TemplateRenderer'

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
          style={{ width: 1080, height: 1350 }}
        >
          <TemplateRenderer templateId={card.templateId} values={card.values} />
        </div>
      ))}
    </div>
  )
})
CardSetRenderer.displayName = 'CardSetRenderer'
