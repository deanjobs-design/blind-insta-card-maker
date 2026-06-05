import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function PhotoText01({ values }: Props) {
  return (
    <div
      className="relative bg-white flex flex-col"
      style={{ width: 1080, height: 1350 }}
    >
      <div className="px-12 pt-14" style={{ height: 546 }}>
        <div
          className="text-gray-900 font-bold leading-tight"
          style={{ fontSize: 88, lineHeight: 1.15 }}
        >
          {values.title || '타이틀 텍스트'}
        </div>
      </div>

      <div className="mx-5" style={{ height: 690, borderRadius: 20, overflow: 'hidden' }}>
        {values.sectionImage ? (
          <img src={values.sectionImage} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl">
            이미지
          </div>
        )}
      </div>

      <div className="absolute bottom-6 right-8">
        <img src="/assets/logo.png" alt="blind" className="h-10 object-contain" />
      </div>
    </div>
  )
}
