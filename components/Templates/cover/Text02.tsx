import { FieldValues } from '@/lib/types'
import { resolveFont } from '@/lib/textScale'
import { LogoCircle } from '@/components/Templates/LogoCircle'

interface Props { values: FieldValues }

export function Text02({ values }: Props) {
  const showChannelInfo = values.showChannelInfo === 'true'
  return (
    <div className="relative overflow-hidden" style={{ width: 1080, height: 1350, background: 'black' }}>
      {/* 고정: 빨간 그라데이션 배경 텍스처 */}
      <img
        src="/assets/text02_bg.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* 고정: 큰따옴표 */}
      <div className="absolute" style={{ left: 80, top: 80 }}>
        <img src="/assets/text02_quote.png" alt="" style={{ height: 64, width: 'auto' }} />
      </div>

      {/* 고정: 코너 로고 우하단 */}
      <div className="absolute" style={{ right: 0, bottom: 0 }}>
        <img src="/assets/corner_logo.png" alt="" style={{ width: 110, height: 110 }} />
      </div>

      {/* 편집: 인용구 텍스트 */}
      <div className="absolute" style={{ left: 80, top: 175, width: 817 }}>
        <p
          style={{
            fontFamily: "'Rethink Sans', sans-serif",
            fontWeight: 700,
            fontSize: resolveFont(140, values, 'quote'),
            lineHeight: 1.0,
            color: 'white',
            letterSpacing: '-4.2px',
            margin: 0,
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          {values.quote || '2026 Meta hire to fire: All areas have minimum 10% cuts at Meta'}
        </p>
      </div>

      {/* 편집: 채널 정보 — 토글 ON일 때만 표시 */}
      {showChannelInfo && (
        <div className="absolute flex items-center" style={{ left: 80, bottom: 80, gap: 20 }}>
          <LogoCircle values={values} fieldKey="channelThumbnail" size={96} />
          <div>
            <p style={{
              fontFamily: "'Pretendard', 'Rethink Sans', sans-serif",
              fontWeight: 600, fontSize: resolveFont(38, values, 'channelName'), color: 'white',
              letterSpacing: '0.76px', margin: 0, lineHeight: 1.2,
            }}>
              {values.channelName || 'Tech Industry'}
            </p>
            <p style={{
              fontFamily: "'Pretendard', 'Rethink Sans', sans-serif",
              fontWeight: 400, fontSize: resolveFont(30, values, 'occupation'), color: '#bec1c5',
              letterSpacing: '0.6px', margin: 0,
            }}>
              {values.occupation || 'Ex-Amazon'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
