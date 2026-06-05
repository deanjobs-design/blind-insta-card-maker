import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function Post({ values }: Props) {
  return (
    <div
      className="relative bg-white flex flex-col"
      style={{ width: 1080, height: 1350 }}
    >
      <div className="flex-1 overflow-hidden" style={{ padding: '80px 60px 0' }}>
        <div className="flex items-center gap-6 mb-12">
          {values.channelThumbnail ? (
            <img
              src={values.channelThumbnail}
              alt=""
              className="rounded-full object-cover"
              style={{ width: 72, height: 72 }}
            />
          ) : (
            <div className="rounded-full bg-gray-200" style={{ width: 72, height: 72 }} />
          )}
          <div className="font-semibold text-gray-900" style={{ fontSize: 36 }}>
            {values.channelName || '채널명'}
          </div>
        </div>

        <div
          className="text-gray-900 leading-relaxed"
          style={{ fontSize: 44, lineHeight: 1.6 }}
        >
          {values.body || '게시물 내용을 입력하세요.'}
        </div>
      </div>

      <div className="flex items-center px-6 pb-6" style={{ height: 110 }}>
        <img src="/assets/logo.png" alt="blind" className="h-10 object-contain" />
      </div>
    </div>
  )
}
