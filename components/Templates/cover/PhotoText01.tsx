import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

// [텍스트] → 빨간 하이라이트, 나머지 → 흰색 일반 텍스트
function renderWithHighlight(text: string) {
  const parts = text.split(/(\[.*?\])/g)
  return parts.map((part, i) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      return (
        <span key={i} style={{ color: '#f44c4f' }}>
          {part.slice(1, -1)}
        </span>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export function PhotoText01({ values }: Props) {
  const bg = values.mainImage || values.sectionImage
  const text = values.title || '2026 Meta hire to fire: [All areas] have minimum 10% cuts at Meta'

  return (
    <div className="relative" style={{ width: 1080, height: 1350, background: '#111' }}>
      {/* Bottom image container */}
      <div className="absolute overflow-hidden" style={{ left: 20, top: 546, width: 1040, height: 690, borderRadius: 24 }}>
        {bg ? (
          <img src={bg} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-700" />
        )}
      </div>

      {/* Title with partial highlight — [텍스트] 부분만 빨간 배경 */}
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

      {/* Corner logo bottom-right */}
      <div className="absolute" style={{ bottom: 0, right: 0 }}>
        <img src="/assets/corner_logo.png" alt="" style={{ width: 110, height: 110 }} />
      </div>
    </div>
  )
}
