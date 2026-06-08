import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

interface CommentEntry {
  logo?: string
  company: string
  text: string
}

// 스레드 라인 — 엘보 PNG(144x144, #cccccc)를 72px 박스로 표시
// 144px 기준: 세로획 x≈7, 가로획 y≈98, 가로획 끝 x≈129 → 0.5배 표시
const LINE_COLOR = '#cccccc'
const THREAD_W = 64        // 스레드 컬럼 너비 (엘보 가로획 끝 64.5에 맞춤)
const RAIL_X = 3           // 수직 레일 x = 엘보 세로획 위치(7*0.5≈3.5)
const RAIL_STROKE = 3      // 레일 두께
const HEADER_H = 94        // 헤더(썸네일 행) 높이
const THUMB_CENTER = HEADER_H / 2  // 썸네일 세로 중심 = 47
const ELBOW_DISP = 72      // 엘보 표시 크기(144 → 72)
const ELBOW_HSTROKE_Y = 49 // 표시 좌표에서 가로획 세로 위치(98*0.5)
const ROW_GAP = 40         // 댓글 사이 간격

function CommentRow({ entry, isFirst, isLast }: { entry: CommentEntry; isFirst: boolean; isLast: boolean }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'stretch',
      paddingBottom: isLast ? 0 : ROW_GAP,
    }}>
      {/* Thread column */}
      <div style={{ width: THREAD_W, flexShrink: 0, position: 'relative' }}>
        {/* 수직 레일 — 줄을 연속으로 이어줌 */}
        <div style={{
          position: 'absolute',
          left: RAIL_X,
          width: RAIL_STROKE,
          background: LINE_COLOR,
          top: isFirst ? -6 : 0,
          // 마지막 행은 썸네일 중심까지만, 나머지는 행 끝까지
          ...(isLast ? { height: THUMB_CENTER + 6 } : { bottom: 0 }),
        }} />
        {/* 엘보 곡선 — 썸네일로 휘어 들어감 */}
        <img
          src="/assets/thread_line.png"
          alt=""
          style={{
            position: 'absolute',
            left: 0,
            top: THUMB_CENTER - ELBOW_HSTROKE_Y,
            width: ELBOW_DISP,
            height: ELBOW_DISP,
          }}
        />
      </div>

      {/* Content column */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ height: HEADER_H, display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 36,
              background: 'rgba(163,163,163,0.3)',
              border: '1.4px solid rgba(163,163,163,0.3)',
              overflow: 'hidden', flexShrink: 0,
            }}>
              {entry.logo ? (
                <img src={entry.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/assets/logo.png" alt="" style={{ height: 20, objectFit: 'contain', opacity: 0.5 }} />
                </div>
              )}
            </div>
            <span style={{
              fontFamily: "'Rethink Sans', sans-serif",
              fontWeight: 500,
              fontSize: 36,
              color: '#e9e9e9',
              whiteSpace: 'nowrap',
            }}>{entry.company}</span>
          </div>
        </div>
        {/* Comment text */}
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
          {entry.text}
        </p>
      </div>
    </div>
  )
}

export function PostComment({ values }: Props) {
  const slots: CommentEntry[] = [
    { logo: values.c1Logo, company: values.c1Company || 'Google', text: values.c1Text || 'Rotating out for cheaper cost employees' },
    { logo: values.c2Logo, company: values.c2Company || 'Amazon', text: values.c2Text || "All the people in the comments mocking you are heartless. I've been laid off before. It was done over a teams call...My boss was cold. No emotions. No compassion.You're a good person for caring. You should reach out to your former colleagues...I'm sure they will appreciate it." },
    ...(values.c3Company || values.c3Text ? [{ logo: values.c3Logo, company: values.c3Company || '', text: values.c3Text || '' }] : []),
    ...(values.c4Company || values.c4Text ? [{ logo: values.c4Logo, company: values.c4Company || '', text: values.c4Text || '' }] : []),
  ]

  return (
    <div className="relative" style={{ width: 1080, height: 1350, background: '#1a1a1a' }}>
      {/* Content */}
      <div className="absolute" style={{
        left: 40, right: 80, top: 40, bottom: 110,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {slots.map((s, i) => (
          <CommentRow key={i} entry={s} isFirst={i === 0} isLast={i === slots.length - 1} />
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
