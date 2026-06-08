import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

interface CommentEntry {
  logo?: string
  company: string
  text: string
}

function CommentRow({ logo, company, text }: CommentEntry) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Header */}
      <div style={{ height: 94, display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {/* Logo thumbnail */}
          <div style={{
            width: 56, height: 56, borderRadius: 36,
            background: 'rgba(163,163,163,0.3)',
            border: '1.4px solid rgba(163,163,163,0.3)',
            overflow: 'hidden', flexShrink: 0,
          }}>
            {logo ? (
              <img src={logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/assets/logo.png" alt="" style={{ height: 20, objectFit: 'contain', opacity: 0.5 }} />
              </div>
            )}
          </div>
          {/* Company name */}
          <span style={{
            fontFamily: "'Rethink Sans', sans-serif",
            fontWeight: 500,
            fontSize: 36,
            color: '#e9e9e9',
            whiteSpace: 'nowrap',
          }}>{company}</span>
        </div>
      </div>
      {/* Comment text — Regular */}
      <p style={{
        fontFamily: "'Rethink Sans', sans-serif",
        fontWeight: 400,
        fontSize: 54,
        lineHeight: 1.22,
        color: 'white',
        letterSpacing: '-1.08px',
        margin: 0,
        wordBreak: 'break-word',
        width: '100%',
      }}>
        {text}
      </p>
    </div>
  )
}

export function PostComment({ values }: Props) {
  const slots = [
    { logo: values.c1Logo, company: values.c1Company || 'Google', text: values.c1Text || 'Rotating out for cheaper cost employees' },
    { logo: values.c2Logo, company: values.c2Company || 'Amazon', text: values.c2Text || "All the people in the comments mocking you are heartless. I've been laid off before. It was done over a teams call...My boss was cold. No emotions. No compassion.You're a good person for caring. You should reach out to your former colleagues...I'm sure they will appreciate it." },
    ...(values.c3Company || values.c3Text ? [{ logo: values.c3Logo, company: values.c3Company || '', text: values.c3Text || '' }] : []),
    ...(values.c4Company || values.c4Text ? [{ logo: values.c4Logo, company: values.c4Company || '', text: values.c4Text || '' }] : []),
  ]

  return (
    <div className="relative" style={{ width: 1080, height: 1350, background: '#1a1a1a' }}>
      {/* Threading line */}
      <div className="absolute" style={{ left: 45, top: 0, width: 61, height: 1089 }}>
        <img src="/assets/thread_line.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'fill' }} />
      </div>

      {/* Content */}
      <div className="absolute" style={{
        left: 120, right: 80, top: 40, bottom: 110,
        display: 'flex', flexDirection: 'column', gap: 40,
        overflow: 'hidden',
      }}>
        {slots.map((s, i) => (
          <CommentRow key={i} {...s} />
        ))}
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center" style={{ height: 110, paddingLeft: 24 }}>
        <img src="/assets/logo.png" alt="blind" style={{ height: 40, objectFit: 'contain' }} />
        <div className="flex-1" />
        <img src="/assets/corner_logo.png" alt="" style={{ width: 110, height: 110 }} />
      </div>
    </div>
  )
}
