import { FieldValues } from '@/lib/types'
import { renderBolder } from '@/lib/renderHighlight'
import { resolveFont } from '@/lib/textScale'

interface Props { values: FieldValues }

function renderRed(text: string) {
  return text.split(/(\[.*?\])/g).map((part, i) =>
    part.startsWith('[') && part.endsWith(']')
      ? <span key={i} style={{ color: '#f44c4f' }}>{part.slice(1, -1)}</span>
      : <span key={i}>{part}</span>
  )
}

export function Photo02({ values }: Props) {
  const text = values.headline || '2026 Meta hire to fire: All areas have minimum 10% cuts at Meta'
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

      {/* Gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0" style={{
        height: 684,
        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 100%)',
      }} />

      {/* Headline + subtitle (헤드라인 아래) */}
      <div className="absolute left-0 right-0 flex flex-col items-center justify-end" style={{ bottom: 0, paddingBottom: height === 1920 ? 240 : 120, paddingLeft: 40, paddingRight: 40, gap: 20 }}>
        <p style={{
          fontFamily: "'Rethink Sans', sans-serif",
          fontWeight: 600,
          fontSize: resolveFont(110, values, 'headline'),
          lineHeight: 1.05,
          color: 'white',
          letterSpacing: '-3.3px',
          textAlign: 'center',
          margin: 0,
          wordBreak: 'break-word',
          width: '100%',
        }}>
          {renderRed(text)}
        </p>
        {showSubtitle && (
          <p style={{
            fontFamily: "'Rethink Sans', sans-serif",
            fontWeight: 400,
            fontSize: resolveFont(40, values, 'subtitle'),
            lineHeight: 1.3,
            color: '#DDDDDD',
            textAlign: 'center',
            margin: 0,
            wordBreak: 'break-word',
            width: '100%',
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
