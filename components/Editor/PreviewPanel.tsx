'use client'
import { useEffect, useRef, useState } from 'react'
import { TemplateRenderer } from '@/components/Templates/TemplateRenderer'
import { FieldValues } from '@/lib/types'

const CARD_W = 1080
const CARD_H = 1350

interface Props {
  templateId: string | null
  values: FieldValues
}

export function PreviewPanel({ templateId, values }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.3)

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      const scaleW = width / CARD_W
      const scaleH = height / CARD_H
      setScale(Math.min(scaleW, scaleH) * 0.95)
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

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

  return (
    <div ref={containerRef} className="bg-gray-100 rounded-xl shadow-sm flex items-center justify-center overflow-hidden h-full">
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: CARD_W,
          height: CARD_H,
          flexShrink: 0,
        }}
      >
        <div data-card-preview="true">
          <TemplateRenderer templateId={templateId} values={values} />
        </div>
      </div>
    </div>
  )
}
