import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function PhotoComment({ values }: Props) {
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
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
        }}
      />

      <div className="absolute top-12 left-12">
        <img src="/assets/logo.png" alt="blind" className="h-10 object-contain" />
      </div>

      <div
        className="absolute left-20 right-20 bg-white rounded-2xl p-10"
        style={{ bottom: 120 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="rounded-full bg-gray-200" style={{ width: 60, height: 60 }} />
          <div>
            <div className="font-semibold text-gray-900" style={{ fontSize: 30 }}>
              {values.channelName || '채널명'}
            </div>
            <div className="text-gray-400" style={{ fontSize: 26 }}>
              {values.timestamp || '방금 전'}
            </div>
          </div>
        </div>
        <div
          className="text-gray-800 leading-relaxed"
          style={{ fontSize: 32, lineHeight: 1.5 }}
        >
          {values.postBody || '게시물 본문 내용이 여기에 표시됩니다.'}
        </div>
      </div>
    </div>
  )
}
