import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function Text02({ values }: Props) {
  return (
    <div
      className="relative bg-gray-50"
      style={{ width: 1080, height: 1350 }}
    >
      <div className="absolute left-20 right-20" style={{ top: 80 }}>
        <div className="text-blue-600 font-black" style={{ fontSize: 120, lineHeight: 1 }}>"</div>
        <div
          className="text-gray-900 font-bold leading-snug mt-8"
          style={{ fontSize: 60, lineHeight: 1.3 }}
        >
          {values.quote || '인용구 텍스트를 입력하세요'}
        </div>
      </div>

      <div className="absolute flex items-center gap-6" style={{ bottom: 176, left: 80 }}>
        {values.channelThumbnail ? (
          <img
            src={values.channelThumbnail}
            alt=""
            className="rounded-full object-cover"
            style={{ width: 96, height: 96 }}
          />
        ) : (
          <div className="rounded-full bg-gray-300" style={{ width: 96, height: 96 }} />
        )}
        <div>
          <div className="text-gray-900 font-semibold" style={{ fontSize: 40 }}>
            {values.channelName || '채널명'}
          </div>
          <div className="text-gray-500" style={{ fontSize: 36 }}>
            {values.occupation || '직책'}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-8">
        <img src="/assets/logo.png" alt="blind" className="h-10 object-contain" />
      </div>
    </div>
  )
}
