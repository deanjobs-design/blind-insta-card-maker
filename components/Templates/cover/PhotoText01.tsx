import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

function renderWithHighlight(text: string) {
  return text.split(/(\[.*?\])/g).map((part, i) =>
    part.startsWith('[') && part.endsWith(']')
      ? <span key={i} style={{ color: '#f44c4f' }}>{part.slice(1, -1)}</span>
      : <span key={i}>{part}</span>
  )
}

export function PhotoText01({ values }: Props) {
  const bg = values.mainImage || values.sectionImage
  const text = values.title || '2026 Meta hire to fire: [All areas] have minimum 10% cuts at Meta'

  return (
    <div className="relative" style={{ width: 1080, height: 1350, background: '#111' }}>
      {/* Bottom image container — 이미지 없으면 샘플 이미지, 상단 기준 정렬 */}
      <div className="absolute overflow-hidden" style={{ left: 20, top: 546, width: 1040, height: 690, borderRadius: 24 }}>
        <img
          src={bg || '/assets/sample_image.png'}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
        />
      </div>

      {/* Title */}
      <div className="absolute" style={{ left: 50, top: 56, width: 960 }}>
        <p style={{
          fontFamily: "'Rethink Sans', sans-serif",
          fontWeight: 600,
          fontSize: 110,
          lineHeight: 1.0,
          color: 'white',
          letterSpacing: '-3.3px',
          margin: 0,
          wordBreak: 'break-word',
          display: '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
        }}>
          {renderWithHighlight(text)}
        </p>
      </div>

      {/* Blind logo bottom-left */}
      <div className="absolute" style={{ left: 24, bottom: 30 }}>
        <img src="/assets/logo.png" alt="blind" style={{ height: 40, objectFit: 'contain' }} />
      </div>

      {/* Arrow 우하단 */}
      <div className="absolute" style={{ right: 30, bottom: 9 }}>
        <img src="/assets/arrow.png" alt="" style={{ width: 96, height: 96 }} />
      </div>
    </div>
  )
}
