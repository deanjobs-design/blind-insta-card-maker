import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function Photo01({ values }: Props) {
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

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0" style={{
        height: 684,
        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 100%)',
      }} />

      {/* Headline + subtitle (헤드라인 아래) — 9:16일 때 하단 여백 2배 */}
      <div className="absolute flex flex-col" style={{ left: 40, right: 40, bottom: height === 1920 ? 200 : 100, gap: 20 }}>
        <p style={{
          fontFamily: "'Rethink Sans', sans-serif",
          fontWeight: 600,
          fontSize: 100,
          lineHeight: 1.4,
          color: 'white',
          letterSpacing: '-3px',
          margin: 0,
          wordBreak: 'break-word',
        }}>
          <span style={{
            background: '#f44c4f',
            padding: '2px 20px 6px 20px',
            borderRadius: 24,
            boxDecorationBreak: 'clone',
            WebkitBoxDecorationBreak: 'clone',
          } as React.CSSProperties}>
            {text}
          </span>
        </p>
        {showSubtitle && (
          <p style={{
            fontFamily: "'Rethink Sans', sans-serif",
            fontWeight: 400,
            fontSize: 40,
            lineHeight: 1.3,
            color: '#DDDDDD',
            margin: 0,
            wordBreak: 'break-word',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
          }}>
            {values.subtitle || 'Join it with eyes wide open. I have seen people get 2-3 months to prove their value and then cut'}
          </p>
        )}
      </div>
    </div>
  )
}
