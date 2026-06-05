import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function Text02({ values }: Props) {
  return (
    <div className="relative overflow-hidden" style={{ width: 1080, height: 1350, background: 'black' }}>
      {/* Red gradient background */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(117deg, rgb(255,32,32) 0%, rgba(17,31,0,0.47) 100%)',
        opacity: 0.85,
      }} />

      {/* Quote container */}
      <div className="absolute" style={{ left: 80, top: 80, width: 817, display: 'flex', flexDirection: 'column', gap: 55 }}>
        {/* Quote mark */}
        <div style={{ height: 64, width: 96 }}>
          <p style={{
            fontFamily: "'Rethink Sans', sans-serif",
            fontWeight: 700,
            fontSize: 120,
            lineHeight: 0.6,
            color: 'white',
            margin: 0,
          }}>&ldquo;</p>
        </div>

        {/* Quote text */}
        <p style={{
          fontFamily: "'Rethink Sans', sans-serif",
          fontWeight: 700,
          fontSize: 140,
          lineHeight: 1.05,
          color: 'white',
          letterSpacing: '-4.2px',
          margin: 0,
          wordBreak: 'break-word',
        }}>
          {values.quote || '인용구 텍스트를 입력하세요'}
        </p>
      </div>

      {/* Channel info */}
      <div className="absolute flex items-center" style={{ left: 80, top: 1174, gap: 20 }}>
        <div style={{ width: 96, height: 96, borderRadius: 48, overflow: 'hidden', background: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>
          {values.channelThumbnail && (
            <img src={values.channelThumbnail} alt="" className="w-full h-full object-cover" />
          )}
        </div>
        <div>
          <p style={{
            fontFamily: "'Pretendard', 'Rethink Sans', sans-serif",
            fontWeight: 600,
            fontSize: 38,
            color: 'white',
            letterSpacing: '0.76px',
            margin: 0,
            lineHeight: 1.2,
          }}>
            {values.channelName || '채널명'}
          </p>
          <p style={{
            fontFamily: "'Pretendard', 'Rethink Sans', sans-serif",
            fontWeight: 400,
            fontSize: 30,
            color: '#bec1c5',
            letterSpacing: '0.6px',
            margin: 0,
          }}>
            {values.occupation || '직책/소속'}
          </p>
        </div>
      </div>

      <div className="absolute" style={{ bottom: 10, right: 10 }}>
        <img src="/assets/logo.png" alt="" style={{ width: 110, height: 110, objectFit: 'contain' }} />
      </div>
    </div>
  )
}
