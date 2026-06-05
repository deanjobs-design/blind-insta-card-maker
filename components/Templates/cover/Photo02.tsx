import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function Photo02({ values }: Props) {
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

      {/* Gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0" style={{
        height: 684,
        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 100%)',
      }} />

      {/* Centered headline */}
      <div className="absolute left-0 right-0 flex items-end justify-center" style={{ bottom: 0, paddingBottom: 140, paddingLeft: 40, paddingRight: 40, paddingTop: 24 }}>
        <p style={{
          fontFamily: "'Rethink Sans', sans-serif",
          fontWeight: 600,
          fontSize: 110,
          lineHeight: 1.05,
          color: 'white',
          letterSpacing: '-3.3px',
          textAlign: 'center',
          margin: 0,
          wordBreak: 'break-word',
          flex: 1,
        }}>
          {values.headline || '2026 Meta hire to fire: All areas have minimum 10% cuts at Meta'}
        </p>
      </div>


    </div>
  )
}
