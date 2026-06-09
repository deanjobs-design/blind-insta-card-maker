'use client'
import { useEffect, useRef, useState } from 'react'
import { TemplateRenderer } from '@/components/Templates/TemplateRenderer'
import { FieldValues } from '@/lib/types'
import { getCardHeight } from '@/lib/exportCard'

const CARD_W = 1080

interface Props {
  templateId: string | null
  values: FieldValues
}

export function PreviewPanel({ templateId, values }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ w: 0, h: 0 })

  const CARD_H = templateId ? getCardHeight(templateId, values) : 1350

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      setBox({ w: width, h: height })
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const scale = box.w && box.h
    ? Math.min(box.w / CARD_W, box.h / CARD_H) * 0.95
    : 0.3

  if (!templateId) {
    return (
      <div
        ref={containerRef}
        className="bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 text-sm h-full"
      >
        템플릿을 선택하면 미리보기가 표시됩니다
      </div>
    )
  }

  const scaledH = CARD_H * scale
  const scaledW = CARD_W * scale

  return (
    <div ref={containerRef} className="bg-gray-100 rounded-xl shadow-sm overflow-hidden h-full flex items-center justify-center">
      {/* Wrapper sized to the scaled card so centering works correctly */}
      <div style={{ width: scaledW, height: scaledH, flexShrink: 0, position: 'relative' }}>
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: CARD_W,
            height: CARD_H,
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          <div data-card-preview="true">
            <TemplateRenderer templateId={templateId} values={values} />
          </div>
        </div>
      </div>
    </div>
  )
}
