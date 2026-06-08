import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

// 마지막 페이지 — 두 가지 고정 이미지 중 선택
export function LastPage({ values }: Props) {
  const src = values.variant === 'b' ? '/assets/last_page2.png' : '/assets/last_page.png'
  return (
    <div className="relative overflow-hidden" style={{ width: 1080, height: 1350, background: 'black' }}>
      <img
        src={src}
        alt="마지막 페이지"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  )
}
