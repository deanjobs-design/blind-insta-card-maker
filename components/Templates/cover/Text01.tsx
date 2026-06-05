import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function Text01({ values }: Props) {
  return (
    <div className="relative" style={{ width: 1080, height: 1350, background: '#111' }}>
      <div className="absolute" style={{ left: 64, top: 64, display: 'flex', flexDirection: 'column', gap: 40, width: 952 }}>
        {/* Blind logo */}
        <div style={{ height: 64 }}>
          <img src="/assets/logo.png" alt="blind" style={{ height: 64, objectFit: 'contain' }} />
        </div>

        {/* Main text */}
        <p style={{
          fontFamily: "'Rethink Sans', sans-serif",
          fontWeight: 700,
          fontSize: 145,
          lineHeight: 1.05,
          color: 'white',
          letterSpacing: '-4.35px',
          margin: 0,
          wordBreak: 'break-word',
        }}>
          {values.announcement || '공지 텍스트를 입력하세요'}
        </p>
      </div>

      <div className="absolute" style={{ bottom: 10, right: 10 }}>
        <img src="/assets/logo.png" alt="" style={{ width: 110, height: 110, objectFit: 'contain' }} />
      </div>
    </div>
  )
}
