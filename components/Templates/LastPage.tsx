import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

// 마지막 페이지는 고정 이미지 — 편집 필드 없음
export function LastPage(_props: Props) {
  return (
    <div className="relative overflow-hidden" style={{ width: 1080, height: 1350, background: 'black' }}>
      <img
        src="/assets/last_page.png"
        alt="마지막 페이지"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  )
}
