import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function Photo01({ values }: Props) {
  return (
    <div
      className="relative overflow-hidden bg-gray-300"
      style={{ width: 1080, height: 1350 }}
    >
      {values.mainImage ? (
        <img src={values.mainImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600" />
      )}

      {/* 블라인드 로고 */}
      <div className="absolute top-12 left-12">
        <img src="/assets/logo.png" alt="blind" className="h-10 object-contain" />
      </div>

      {/* 하단 헤드라인 박스 */}
      <div className="absolute bottom-0 left-0 right-0 bg-white px-24 pt-10 pb-16">
        <div
          className="text-gray-900 font-bold leading-tight"
          style={{ fontSize: 72, lineHeight: 1.2 }}
        >
          {values.headline || '헤드라인 텍스트'}
        </div>
      </div>
    </div>
  )
}
