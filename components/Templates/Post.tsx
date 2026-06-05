import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function Post({ values }: Props) {
  return (
    <div className="relative" style={{ width: 1080, height: 1350, background: '#1a1a1a' }}>
      <div className="absolute" style={{ left: 60, right: 60, top: 80, bottom: 110 }}>
        {/* Channel header */}
        <div className="flex items-center" style={{ gap: 16, marginBottom: 32 }}>
          <div style={{ width: 72, height: 72, borderRadius: 36, background: 'rgba(163,163,163,0.3)', overflow: 'hidden', flexShrink: 0 }}>
            {values.channelThumbnail && (
              <img src={values.channelThumbnail} alt="" className="w-full h-full object-cover" />
            )}
          </div>
          <div>
            <span style={{
              fontFamily: "'Rethink Sans', sans-serif",
              fontWeight: 400,
              fontSize: 55,
              color: '#e9e9e9',
              lineHeight: 1.2,
            }}>
              {values.channelName || '채널명'}
            </span>
            <span style={{
              fontFamily: "'Rethink Sans', sans-serif",
              fontWeight: 400,
              fontSize: 55,
              color: '#c1c2c3',
              lineHeight: 1.2,
              marginLeft: 8,
            }}>
              said
            </span>
          </div>
        </div>

        {/* Body text */}
        <p style={{
          fontFamily: "'Rethink Sans', sans-serif",
          fontWeight: 500,
          fontSize: 54,
          lineHeight: 1.22,
          color: 'white',
          letterSpacing: '-1.08px',
          margin: 0,
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
        }}>
          {values.body || '게시물 내용을 입력하세요.'}
        </p>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center" style={{ height: 110, padding: '0 24px' }}>
        <img src="/assets/logo.png" alt="blind" style={{ height: 40, objectFit: 'contain' }} />
        <div className="flex-1" />
        <img src="/assets/logo.png" alt="" style={{ width: 110, height: 110, objectFit: 'contain' }} />
      </div>
    </div>
  )
}
