import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function Photo02({ values }: Props) {
  return (
    <div
      className="relative overflow-hidden bg-gray-300"
      style={{ width: 1080, height: 1350 }}
    >
      {values.mainImage ? (
        <img src={values.mainImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-500 to-gray-800" />
      )}

      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: 684,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
        }}
      />

      <div className="absolute top-12 left-12">
        <img src="/assets/logo.png" alt="blind" className="h-10 object-contain" />
      </div>

      <div className="absolute left-10 right-10" style={{ bottom: 100 }}>
        <div
          className="text-white font-bold leading-tight"
          style={{ fontSize: 72, lineHeight: 1.2 }}
        >
          {values.headline || '헤드라인 텍스트'}
        </div>
      </div>
    </div>
  )
}
