import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function Text01({ values }: Props) {
  return (
    <div
      className="relative bg-white"
      style={{ width: 1080, height: 1350 }}
    >
      <div className="px-16 pt-16">
        <img src="/assets/logo.png" alt="blind" className="h-16 object-contain" />
        <div
          className="mt-24 text-gray-900 font-semibold leading-relaxed"
          style={{ fontSize: 52, lineHeight: 1.45 }}
        >
          {values.announcement || '공지 텍스트를 입력하세요'}
        </div>
      </div>
      <div className="absolute bottom-6 right-8">
        <img src="/assets/logo.png" alt="blind" className="h-10 object-contain" />
      </div>
    </div>
  )
}
