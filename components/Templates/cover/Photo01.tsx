import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function Photo01({ values }: Props) {
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

      {/* Headline pill box */}
      <div className="absolute left-0 right-0 flex items-end justify-center" style={{ bottom: 0, paddingBottom: 140, paddingLeft: 40, paddingRight: 40, paddingTop: 24 }}>
        <div style={{
          background: '#f44c4f',
          borderRadius: '12px 54px 54px 54px',
          paddingLeft: 64,
          paddingRight: 64,
          paddingTop: 40,
          paddingBottom: 40,
          flex: 1,
        }}>
          <p style={{
            fontFamily: "'Rethink Sans', sans-serif",
            fontWeight: 600,
            fontSize: 100,
            lineHeight: 1.05,
            color: 'white',
            letterSpacing: '-3px',
            margin: 0,
            wordBreak: 'break-word',
          }}>
            {values.headline || '2026 Meta hire to fire: All areas have minimum 10% cuts at Meta'}
          </p>
        </div>
      </div>

      {/* Company logo bottom-right */}
      <div className="absolute" style={{ bottom: 10, right: 10 }}>
        <img src="/assets/logo.png" alt="" style={{ width: 110, height: 110, objectFit: 'contain' }} />
      </div>
    </div>
  )
}
