import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function PhotoText02({ values }: Props) {
  return (
    <div className="relative overflow-hidden" style={{ width: 1080, height: 1350, background: '#111' }}>
      {values.mainImage ? (
        <img src={values.mainImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-900" />
      )}

      {/* Blind logo top-left */}
      <div className="absolute" style={{ top: 50, left: 49 }}>
        <img src="/assets/logo.png" alt="blind" style={{ height: 40, objectFit: 'contain' }} />
      </div>

      {/* Red content box — bottom 고정 */}
      <div className="absolute left-0 flex items-end justify-between" style={{ bottom: 0, width: 1080 }}>
        <div style={{
          background: '#f44c4f',
          borderTopRightRadius: 48,
          paddingLeft: 56,
          paddingRight: 40,
          paddingTop: 52,
          paddingBottom: 64,
          display: 'flex',
          flexDirection: 'column',
          gap: 26,
          width: 900,
        }}>
          {/* 헤드라인 — 최대 3줄 */}
          <p style={{
            fontFamily: "'Rethink Sans', sans-serif",
            fontWeight: 600,
            fontSize: 110,
            lineHeight: 1,
            color: 'white',
            letterSpacing: '-2.2px',
            margin: 0,
            wordBreak: 'break-word',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
          }}>
            {values.headline || '2026 Meta hire to fire: All areas have minimum 10% cuts at Meta'}
          </p>
          {/* 본문 — 최대 3줄, 항상 표시 */}
          <p style={{
            fontFamily: "'Rethink Sans', sans-serif",
            fontWeight: 400,
            fontSize: 32,
            lineHeight: 1.2,
            color: 'white',
            letterSpacing: '-0.32px',
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
          }}>
            {values.body || 'Our new grading system triple-checks every route using first ascent reports, local consensus, and verified tick data.'}
          </p>
        </div>
        <div style={{ background: '#f44c4f', alignSelf: 'stretch', width: 180, borderTopRightRadius: 48 }} />
      </div>

      {/* Corner logo bottom-right */}
      <div className="absolute" style={{ bottom: 0, right: 0 }}>
        <img src="/assets/corner_logo.png" alt="" style={{ width: 110, height: 110 }} />
      </div>
    </div>
  )
}
