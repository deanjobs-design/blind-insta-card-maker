import { FieldValues } from '@/lib/types'
import { resolveFont } from '@/lib/textScale'
import { LogoCircle } from '@/components/Templates/LogoCircle'

interface Props { values: FieldValues }

interface CommentEntry {
  logoKey: string
  company: string
  text: string
  fontSize: number
  companyFontSize: number
}

// 스레드 라인 — 엘보 PNG(144x144, #cccccc)를 72px 박스로 표시
// 144px 기준: 세로획 x≈7, 가로획 y≈98, 가로획 끝 x≈129 → 0.5배 표시
const LINE_COLOR = '#cccccc'
const THREAD_W = 80        // 스레드 컬럼 너비 (라인 끝~로고 16px 간격)
const RAIL_X = 2           // 수직 레일 x = 엘보 세로획 중심(3.5)에 정렬
const RAIL_STROKE = 3      // 레일 두께
const HEADER_H = 94        // 헤더(썸네일 행) 높이
const THUMB_CENTER = HEADER_H / 2  // 썸네일 세로 중심 = 47
const ELBOW_DISP = 72      // 엘보 표시 크기(144 → 72)
const ELBOW_HSTROKE_Y = 49 // 표시 좌표에서 가로획 세로 위치(98*0.5)
const ROW_GAP = 40         // 댓글 사이 간격
const CONTENT_TOP = 40     // 첫 댓글 상단 여백 (아이콘 위치용)

function CommentRow({ entry, values, isFirst, isLast }: { entry: CommentEntry; values: FieldValues; isFirst: boolean; isLast: boolean }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'stretch',
      paddingTop: isFirst ? CONTENT_TOP : 0,
      paddingBottom: isLast ? 0 : ROW_GAP,
    }}>
      {/* Thread column */}
      <div style={{ width: THREAD_W, flexShrink: 0, position: 'relative' }}>
        {/* 수직 레일 — 줄을 연속으로 이어줌. 마지막 행은 레일 없이 엘보 곡선만
            (직선 꼬리가 아이콘 아래로 튀어나오지 않게) */}
        {!isLast && (
          <div style={{
            position: 'absolute',
            left: RAIL_X,
            width: RAIL_STROKE,
            background: LINE_COLOR,
            top: isFirst ? -CONTENT_TOP : 0, // 첫 댓글은 카드 맨 위까지 레일 연장
            bottom: -ROW_GAP, // 다음 행까지(paddingBottom 간격 포함) 이어줌
          }} />
        )}
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
            <LogoCircle values={values} fieldKey={entry.logoKey} size={56} fallbackSrc="/assets/comment_thumbnail.png" />
            <span style={{
              fontFamily: "'Rethink Sans', sans-serif",
              fontWeight: 500,
              fontSize: entry.companyFontSize,
              whiteSpace: 'nowrap',
            }}>
              <span style={{ color: '#989A9E' }}>Employee from </span>
              <span style={{ color: '#e9e9e9' }}>{entry.company}</span>
            </span>
          </div>
        </div>
        {/* Comment text */}
        <p style={{
          fontFamily: "'Rethink Sans', sans-serif",
          fontWeight: 400,
          fontSize: entry.fontSize,
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
    // 댓글1 — 항상 표시
    { logoKey: 'c1Logo', company: values.c1Company || 'Google', text: values.c1Text || 'Rotating out for cheaper cost employees', fontSize: resolveFont(54, values, 'c1Text'), companyFontSize: resolveFont(36, values, 'c1Company') },
    // 댓글2~4 — 토글 ON일 때만
    ...(values.showC2 === 'true' ? [{ logoKey: 'c2Logo', company: values.c2Company || 'Amazon', text: values.c2Text || "All the people in the comments mocking you are heartless. I've been laid off before. It was done over a teams call...My boss was cold. No emotions. No compassion.You're a good person for caring. You should reach out to your former colleagues...I'm sure they will appreciate it.", fontSize: resolveFont(54, values, 'c2Text'), companyFontSize: resolveFont(36, values, 'c2Company') }] : []),
    ...(values.showC3 === 'true' ? [{ logoKey: 'c3Logo', company: values.c3Company || 'Meta', text: values.c3Text || 'umm...', fontSize: resolveFont(54, values, 'c3Text'), companyFontSize: resolveFont(36, values, 'c3Company') }] : []),
    ...(values.showC4 === 'true' ? [{ logoKey: 'c4Logo', company: values.c4Company || '', text: values.c4Text || '', fontSize: resolveFont(54, values, 'c4Text'), companyFontSize: resolveFont(36, values, 'c4Company') }] : []),
  ]

  return (
    <div className="relative" style={{ width: 1080, height: 1350, background: '#1a1a1a' }}>
      {/* Content */}
      <div className="absolute" style={{
        left: 40, right: 80, top: 0, bottom: 110,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {slots.map((s, i) => (
          <CommentRow key={i} entry={s} values={values} isFirst={i === 0} isLast={i === slots.length - 1} />
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
