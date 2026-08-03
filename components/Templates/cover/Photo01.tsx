import { FieldValues } from '@/lib/types'
import { renderBolder } from '@/lib/renderHighlight'
import { scaledFont } from '@/lib/textScale'

interface Props { values: FieldValues }

// [텍스트] → 빨간 박스 하이라이트(글자 뒤 배경), 나머지 → 흰색 일반 텍스트
function renderBoxHighlight(text: string) {
  return text.split(/(\[.*?\])/g).map((part, i) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      return (
        <span
          key={i}
          style={{
            background: '#f44c4f',
            color: 'white',
            padding: '0 18px 6px 18px',
            borderRadius: 12,
            boxDecorationBreak: 'clone',
            WebkitBoxDecorationBreak: 'clone',
          } as React.CSSProperties}
        >
          {part.slice(1, -1)}
        </span>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export function Photo01({ values }: Props) {
  const text = values.headline || 'Is [Alexandr wang] the [Worst Hire in Meta] History?'
  const showSubtitle = values.showSubtitle === 'true'
  const height = values.tallRatio === 'true' ? 1920 : 1350

  return (
    <div className="relative overflow-hidden" style={{ width: 1080, height, background: '#111' }}>
      <img
        src={values.mainImage || '/assets/sample_image.png'}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Blind logo top-left */}
      <div className="absolute" style={{ top: 50, left: 49 }}>
        <img src="/assets/logo.png" alt="blind" style={{ height: 40, objectFit: 'contain' }} />
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0" style={{
        height: 684,
        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 100%)',
      }} />

      {/* Headline + subtitle (헤드라인 아래) — 9:16일 때 하단 여백 2배 */}
      <div className="absolute flex flex-col" style={{ left: 40, right: 40, bottom: height === 1920 ? 200 : 100, gap: 20 }}>
        <p style={{
          fontFamily: "'Libre Baskerville', serif",
          fontWeight: 700,
          fontSize: scaledFont(96, values, 'headline'),
          lineHeight: 1.3,
          color: 'white',
          margin: 0,
          wordBreak: 'break-word',
        }}>
          {renderBoxHighlight(text)}
        </p>
        {showSubtitle && (
          <p style={{
            fontFamily: "'Rethink Sans', sans-serif",
            fontWeight: 400,
            fontSize: scaledFont(40, values, 'subtitle'),
            lineHeight: 1.3,
            color: '#DDDDDD',
            margin: 0,
            wordBreak: 'break-word',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
          }}>
            {renderBolder(values.subtitle || 'Join it with eyes wide open. I have seen people get 2-3 months to prove their value and then cut')}
          </p>
        )}
      </div>
    </div>
  )
}
