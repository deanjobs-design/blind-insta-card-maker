import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function PhotoText02({ values }: Props) {
  const showBody = values.showBody === 'true'
  return (
    <div className="relative overflow-hidden" style={{ width: 1080, height: 1350, background: '#111' }}>
      {/* 배경 이미지 — 없으면 샘플 */}
      <img
        src={values.mainImage || '/assets/sample_image.png'}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

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
          {/* 본문 — 토글 ON일 때만, 최대 3줄 */}
          {showBody && (
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
          )}
        </div>
        <div style={{ alignSelf: 'stretch', width: 180, paddingTop: 150 }}>
          <div style={{ background: '#f44c4f', height: '100%', borderTopRightRadius: 48 }} />
        </div>
      </div>

      {/* Arrow 우하단 */}
      <div className="absolute" style={{ right: 14, bottom: 14 }}>
        <img src="/assets/arrow.png" alt="" style={{ width: 96, height: 96 }} />
      </div>
    </div>
  )
}
