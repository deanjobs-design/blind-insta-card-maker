import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function LastPage({ values }: Props) {
  return (
    <div className="relative overflow-hidden" style={{ width: 1080, height: 1350, background: 'black' }}>
      {/* Top card with gradient */}
      <div className="absolute overflow-hidden" style={{ left: 20, top: 20, width: 1040, height: 982, borderRadius: 24 }}>
        {/* Red gradient background */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(117deg, rgb(255,32,32) 0%, rgba(17,31,0,0.47) 100%)',
        }} />
        {/* Blind logo badge centered top */}
        <div className="absolute flex items-center justify-center" style={{
          background: 'black',
          padding: '14px 22px',
          left: '50%',
          transform: 'translateX(-50%)',
          top: 80,
        }}>
          <img src="/assets/logo.png" alt="blind" style={{ height: 42, objectFit: 'contain' }} />
        </div>

        {/* Phone mockup placeholder */}
        <div className="absolute flex items-center justify-center" style={{
          left: 220,
          top: 212,
          width: 640,
          height: 789,
          background: 'white',
          borderTopLeftRadius: 63,
          borderTopRightRadius: 63,
        }}>
          <p style={{ color: '#999', fontSize: 80 }}>📱</p>
        </div>

        {/* Follow button */}
        <div className="absolute flex items-center justify-center" style={{
          background: '#455eff',
          borderRadius: 20,
          width: 366,
          height: 72,
          left: 155,
          top: 715,
          padding: 24,
        }}>
          <p style={{
            fontFamily: "'Rethink Sans', sans-serif",
            fontWeight: 500,
            fontSize: 37,
            color: '#f8f9f9',
            margin: 0,
          }}>Follow</p>
        </div>
      </div>

      {/* Bottom CTA text */}
      <div className="absolute left-0 right-0" style={{
        bottom: 0,
        height: 348,
        background: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 44,
        paddingRight: 44,
        paddingTop: 62,
        paddingBottom: 72,
      }}>
        <p style={{
          fontFamily: "'Rethink Sans', sans-serif",
          fontWeight: 600,
          fontSize: 88,
          lineHeight: 1.05,
          color: '#f5f5f5',
          textAlign: 'center',
          letterSpacing: '-2.64px',
          margin: 0,
          wordBreak: 'break-word',
        }}>
          {values.ctaText || 'Follow us for more breaking news and stories!'}
        </p>
      </div>
    </div>
  )
}
