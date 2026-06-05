import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function Photo01({ values }: Props) {
  const text = values.headline || '2026 Meta hire to fire: All areas have minimum 10% cuts at Meta'

  return (
    <div className="relative overflow-hidden" style={{ width: 1080, height: 1350, background: '#111' }}>
      {/* Background image */}
      {values.mainImage ? (
        <img src={values.mainImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
      )}

      {/* Blind logo top-left */}
      <div className="absolute" style={{ top: 50, left: 49 }}>
        <img src="/assets/logo.png" alt="blind" style={{ height: 40, objectFit: 'contain' }} />
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0" style={{
        height: 684,
        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 100%)',
      }} />

      {/* Per-line highlight headline — bottom area */}
      <div className="absolute" style={{ left: 40, right: 40, bottom: 80 }}>
        {/* box-decoration-break: clone 으로 줄마다 배경색 */}
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
      </div>
    </div>
  )
}
