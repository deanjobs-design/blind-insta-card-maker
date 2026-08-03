import { FieldValues } from '@/lib/types'
import { resolveFont } from '@/lib/textScale'

interface Props { values: FieldValues }

export function PhotoComment({ values }: Props) {
  const height = values.tallRatio === 'true' ? 1920 : 1350
  return (
    <div className="relative overflow-hidden" style={{ width: 1080, height, background: '#111' }}>
      <img
        src={values.mainImage || '/assets/sample_image.png'}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Blind logo top-left */}
      <div className="absolute" style={{ top: 50, left: 49 }}>
        <img src="/assets/logo.png" alt="blind" style={{ height: 40, objectFit: 'contain' }} />
      </div>

      {/* Gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0" style={{
        height: 684,
        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 100%)',
      }} />

      {/* Post card — 9:16일 때 하단 여백 2배 */}
      <div className="absolute" style={{
        left: 80,
        right: 80,
        bottom: height === 1920 ? 162 : 81,
        background: 'white',
        borderRadius: 40,
        overflow: 'hidden',
        boxShadow: '0px 0px 75px 0px rgba(0,0,0,0.5)',
      }}>
        {/* Post header — 구분선 없음 */}
        <div style={{ padding: '24px 24px 16px 40px', background: 'white' }}>
          <div className="flex items-center" style={{ gap: 17, paddingTop: 16 }}>
            <div style={{ width: 84, height: 84, borderRadius: 42, background: '#f0f0f0', overflow: 'hidden', flexShrink: 0 }}>
              {values.channelThumbnail && (
                <img src={values.channelThumbnail} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <div>
              <p style={{
                fontFamily: "'Pretendard', 'Rethink Sans', sans-serif",
                fontWeight: 600, fontSize: 29, color: '#222',
                letterSpacing: '0.58px', margin: 0, lineHeight: 1.3,
              }}>
                {values.channelName || 'Tech Industry'}
              </p>
              <p style={{
                fontFamily: "'Pretendard', 'Rethink Sans', sans-serif",
                fontWeight: 400, fontSize: 25, color: '#54545a', margin: 0,
              }}>
                {values.timestamp || 'Ex-Amazon'}
              </p>
            </div>
          </div>
        </div>

        {/* Post body */}
        <div style={{ padding: '4px 40px 12px 40px', background: 'white' }}>
          <p style={{
            fontFamily: "'Pretendard', 'Rethink Sans', sans-serif",
            fontWeight: 600, fontSize: resolveFont(46, values, 'postBody'), lineHeight: 1.22,
            color: '#222', letterSpacing: '0.46px', margin: 0,
            wordBreak: 'break-word',
          }}>
            {values.postBody || '2026 Meta hire to fire: All areas have minimum 10% cuts at Meta'}
          </p>
        </div>

        {/* 서브 텍스트 */}
        <div style={{ padding: '0 40px 24px 40px', background: 'white' }}>
          <p style={{
            fontFamily: "'Pretendard', 'Rethink Sans', sans-serif",
            fontWeight: 400, fontSize: resolveFont(32, values, 'subText'), lineHeight: 1.4,
            color: '#54545a', margin: 0, wordBreak: 'break-word',
          }}>
            {values.subText || 'All of the sudden everyone has a dentist appointment, or they got sick, or they have some other random thing, hahah.'}
          </p>
        </div>

        {/* Action 이미지 */}
        <div style={{ padding: '0 40px 32px 40px', background: 'white' }}>
          <img src="/assets/Action.png" alt="" style={{ height: 60, objectFit: 'contain' }} />
        </div>
      </div>
    </div>
  )
}
