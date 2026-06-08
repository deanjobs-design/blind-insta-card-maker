import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

interface CommentEntry {
  company: string
  user: string
  text: string
}

function CommentRow({ company, user, text }: CommentEntry) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Header row */}
      <div style={{ height: 94, display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {/* Thumbnail */}
          <div style={{
            width: 56, height: 56, borderRadius: 36,
            background: 'rgba(163,163,163,0.3)',
            border: '1.4px solid rgba(163,163,163,0.3)',
            overflow: 'hidden', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img src="/assets/logo.png" alt="" style={{ height: 20, objectFit: 'contain', opacity: 0.6 }} />
          </div>
          {/* Company · name */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <span style={{
              fontFamily: "'Rethink Sans', sans-serif",
              fontWeight: 500,
              fontSize: 36,
              color: '#e9e9e9',
              whiteSpace: 'nowrap',
            }}>{company}</span>
            <span style={{
              fontFamily: "'Rethink Sans', sans-serif",
              fontWeight: 400,
              fontSize: 36,
              color: '#c1c2c3',
              opacity: 0.5,
              width: 20,
              textAlign: 'center',
            }}>∙</span>
            <span style={{
              fontFamily: "'Rethink Sans', sans-serif",
              fontWeight: 400,
              fontSize: 36,
              color: '#c1c2c3',
              whiteSpace: 'nowrap',
            }}>{user}</span>
          </div>
        </div>
      </div>
      {/* Text */}
      <p style={{
        fontFamily: "'Rethink Sans', sans-serif",
        fontWeight: 500,
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
  const entries: CommentEntry[] = [
    {
      company: values.origCompany || 'Google',
      user: values.origUser || 'name',
      text: values.origText || 'Rotating out for cheaper cost employees',
    },
    {
      company: values.c1Company || 'Amazon',
      user: values.c1User || 'name',
      text: values.c1Text || "All the people in the comments mocking you are heartless. I've been laid off before. It was done over a teams call...My boss was cold. No emotions. No compassion.You're a good person for caring. You should reach out to your former colleagues...I'm sure they will appreciate it.",
    },
    ...(values.c2Company || values.c2Text ? [{
      company: values.c2Company || '',
      user: values.c2User || 'name',
      text: values.c2Text || '',
    }] : []),
    ...(values.c3Company || values.c3Text ? [{
      company: values.c3Company || '',
      user: values.c3User || 'name',
      text: values.c3Text || '',
    }] : []),
  ]

  return (
    <div className="relative" style={{ width: 1080, height: 1350, background: '#1a1a1a' }}>
      {/* Threading line — 왼쪽 스레드 */}
      <div className="absolute" style={{ left: 45, top: 0, width: 61, height: 1089 }}>
        <img src="/assets/thread_line.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'fill' }} />
      </div>

      {/* Content area */}
      <div className="absolute" style={{
        left: 120, right: 80, top: 40, bottom: 110,
        display: 'flex', flexDirection: 'column', gap: 40,
        overflow: 'hidden',
      }}>
        {entries.map((entry, i) => (
          <CommentRow key={i} {...entry} />
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
