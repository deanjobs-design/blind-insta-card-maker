import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function PhotoComment({ values }: Props) {
  return (
    <div className="relative overflow-hidden" style={{ width: 1080, height: 1350, background: '#111' }}>
      {values.mainImage ? (
        <img src={values.mainImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-900" />
      )}

      {/* Blind logo */}
      <div className="absolute" style={{ top: 50, left: 49 }}>
        <img src="/assets/logo.png" alt="blind" style={{ height: 40, objectFit: 'contain' }} />
      </div>

      {/* Gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0" style={{
        height: 684,
        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 100%)',
      }} />

      {/* Post card */}
      <div className="absolute" style={{
        left: 80,
        right: 80,
        bottom: 81,
        background: 'white',
        borderRadius: 40,
        overflow: 'hidden',
        boxShadow: '0px 0px 75px 0px rgba(0,0,0,0.5)',
      }}>
        {/* Post header */}
        <div style={{ padding: '24px 24px 16px 40px', background: 'white', borderBottom: '1.84px solid #e9ebee' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center" style={{ gap: 17, paddingTop: 16 }}>
              <div style={{ width: 84, height: 84, borderRadius: 42, background: '#f0f0f0', overflow: 'hidden', flexShrink: 0 }}>
                {values.channelThumbnail && (
                  <img src={values.channelThumbnail} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div>
                <p style={{
                  fontFamily: "'Pretendard', 'Rethink Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 29,
                  color: '#222',
                  letterSpacing: '0.58px',
                  margin: 0,
                  lineHeight: 1.3,
                }}>
                  {values.channelName || '채널명'}
                </p>
                <p style={{
                  fontFamily: "'Pretendard', 'Rethink Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: 25,
                  color: '#54545a',
                  margin: 0,
                }}>
                  {values.timestamp || '방금 전'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Post body */}
        <div style={{ padding: '4px 40px 40px 40px', background: 'white' }}>
          <p style={{
            fontFamily: "'Pretendard', 'Rethink Sans', sans-serif",
            fontWeight: 600,
            fontSize: 46,
            lineHeight: 1.22,
            color: '#222',
            letterSpacing: '0.46px',
            margin: 0,
            wordBreak: 'break-word',
          }}>
            {values.postBody || '게시물 본문 내용이 여기에 표시됩니다.'}
          </p>
        </div>
      </div>
    </div>
  )
}
