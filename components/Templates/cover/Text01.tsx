import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function Text01({ values }: Props) {
  return (
    <div className="relative" style={{ width: 1080, height: 1350, background: '#111' }}>
      {/* 고정: Blind 로고 좌상단 */}
      <div className="absolute" style={{ left: 64, top: 64 }}>
        <img
          src="/assets/text01_logo.png"
          alt="blind"
          style={{ height: 64, width: 'auto', objectFit: 'contain' }}
        />
      </div>

      {/* 고정: 코너 로고 우하단 */}
      <div className="absolute" style={{ right: 0, bottom: 0 }}>
        <img src="/assets/corner_logo.png" alt="" style={{ width: 110, height: 110 }} />
      </div>

      {/* 편집: 본문 텍스트 */}
      <div className="absolute" style={{ left: 64, top: 168, width: 952 }}>
        <p
          style={{
            fontFamily: "'Rethink Sans', sans-serif",
            fontWeight: 700,
            fontSize: 145,
            lineHeight: 1.0,
            color: 'white',
            letterSpacing: '-4.35px',
            margin: 0,
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          {values.announcement || '2026 Meta hire to fire: All areas have minimum 10% cuts at Meta'}
        </p>
      </div>
    </div>
  )
}
