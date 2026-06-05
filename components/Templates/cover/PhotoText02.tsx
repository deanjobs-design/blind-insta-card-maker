import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function PhotoText02({ values }: Props) {
  return (
    <div
      className="relative overflow-hidden bg-gray-300"
      style={{ width: 1080, height: 1350 }}
    >
      {values.mainImage ? (
        <img src={values.mainImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-700" />
      )}

      <div className="absolute top-12 left-12">
        <img src="/assets/logo.png" alt="blind" className="h-10 object-contain" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white" style={{ height: 586 }}>
        <div className="px-14 pt-14">
          <div
            className="text-gray-900 font-bold leading-tight"
            style={{ fontSize: 66, lineHeight: 1.2 }}
          >
            {values.headline || '헤드라인 텍스트'}
          </div>
          {values.body && (
            <div
              className="text-gray-600 mt-10 leading-relaxed"
              style={{ fontSize: 36 }}
            >
              {values.body}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
