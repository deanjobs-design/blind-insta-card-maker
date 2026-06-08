import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function Post({ values }: Props) {
  return (
    <div className="relative" style={{ width: 1080, height: 1350, background: '#1a1a1a' }}>
      <div className="absolute" style={{ left: 60, right: 60, top: 80, bottom: 110 }}>
        {/* Company header — 52pt */}
        <div className="flex items-center" style={{ gap: 16, marginBottom: 32 }}>
          <div style={{ width: 72, height: 72, borderRadius: 36, background: 'rgba(163,163,163,0.3)', overflow: 'hidden', flexShrink: 0 }}>
            {values.channelThumbnail && (
              <img src={values.channelThumbnail} alt="" className="w-full h-full object-cover" />
            )}
          </div>
          <div>
            <span style={{
              fontFamily: "'Rethink Sans', sans-serif",
              fontWeight: 400,
              fontSize: 52,
              color: '#e9e9e9',
              lineHeight: 1.2,
            }}>
              {values.channelName || 'Amazon'}
            </span>
            <span style={{
              fontFamily: "'Rethink Sans', sans-serif",
              fontWeight: 400,
              fontSize: 52,
              color: '#c1c2c3',
              lineHeight: 1.2,
              marginLeft: 8,
            }}>
              employee said
            </span>
          </div>
        </div>

        {/* Body text — regular, 16줄 초과 시 말줄임 */}
        <p style={{
          fontFamily: "'Rethink Sans', sans-serif",
          fontWeight: 400,
          fontSize: 54,
          lineHeight: 1.22,
          color: 'white',
          letterSpacing: '-1.08px',
          margin: 0,
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
          display: '-webkit-box',
          WebkitLineClamp: 16,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
        }}>
          {values.body || "Some of these people think they can entirely build things just through vibecoding, and while I know that is possible, I find it a bit concerning how little some of these people know about the actual code that is going into building what they want to build. I've seen people vibe code and build things without really understanding any of the mechanics of how anything is doing anything... Does anyone else find this concerning?"}
        </p>
      </div>

      {/* Bottom bar — corner_logo 오른쪽 여백 없이 */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center" style={{ height: 110, paddingLeft: 24 }}>
        <img src="/assets/logo.png" alt="blind" style={{ height: 40, objectFit: 'contain' }} />
        <div className="flex-1" />
        <img src="/assets/corner_logo.png" alt="" style={{ width: 110, height: 110 }} />
      </div>
    </div>
  )
}
