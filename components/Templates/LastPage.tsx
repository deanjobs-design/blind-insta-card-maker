import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function LastPage({ values }: Props) {
  return (
    <div
      className="relative bg-white flex flex-col items-center justify-center"
      style={{ width: 1080, height: 1350 }}
    >
      <div
        className="rounded-2xl bg-gray-100 flex items-center justify-center mb-16"
        style={{ width: 640, height: 640 }}
      >
        <div className="text-gray-300 text-8xl">📱</div>
      </div>

      <div
        className="text-gray-900 font-bold text-center leading-snug px-20"
        style={{ fontSize: 52, lineHeight: 1.35 }}
      >
        {values.ctaText || 'Follow us for more breaking news and stories!'}
      </div>

      <div className="absolute bottom-10 right-10">
        <img src="/assets/logo.png" alt="blind" className="h-10 object-contain" />
      </div>
    </div>
  )
}
