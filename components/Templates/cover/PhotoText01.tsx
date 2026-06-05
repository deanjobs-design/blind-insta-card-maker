import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function PhotoText01({ values }: Props) {
  const bg = values.mainImage || values.sectionImage
  return (
    <div className="relative" style={{ width: 1080, height: 1350, background: '#111' }}>
      {/* Bottom image container — 공유 배경 이미지 */}
      <div className="absolute overflow-hidden" style={{ left: 20, top: 546, width: 1040, height: 690, borderRadius: 24 }}>
        {bg ? (
          <img src={bg} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-700" />
        )}
      </div>

      {/* Large title */}
      <p className="absolute" style={{
        fontFamily: "'Rethink Sans', sans-serif",
        fontWeight: 600,
        fontSize: 110,
        lineHeight: 1.05,
        color: 'white',
        letterSpacing: '-3.3px',
        left: 50,
        top: 56,
        width: 960,
        margin: 0,
        wordBreak: 'break-word',
      }}>
        {values.title || '2026 Meta hire to fire: All areas have minimum 10% cuts at Meta'}
      </p>

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
