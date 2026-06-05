import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

function CommentItem({ name, username, text, thumbnail }: { name: string; username?: string; text: string; thumbnail?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Author row */}
      <div className="flex items-center" style={{ height: 94, gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: 28, background: 'rgba(163,163,163,0.3)', overflow: 'hidden', flexShrink: 0 }}>
          {thumbnail && <img src={thumbnail} alt="" className="w-full h-full object-cover" />}
        </div>
        <div className="flex items-center" style={{ gap: 4 }}>
          <p style={{ fontFamily: "'Rethink Sans', sans-serif", fontWeight: 500, fontSize: 36, color: '#e9e9e9', margin: 0, whiteSpace: 'nowrap' }}>
            {name || '작성자'}
          </p>
          <p style={{ fontFamily: "'Rethink Sans', sans-serif", fontWeight: 400, fontSize: 36, color: '#c1c2c3', opacity: 0.5, margin: '0 4px' }}>∙</p>
          <p style={{ fontFamily: "'Rethink Sans', sans-serif", fontWeight: 400, fontSize: 36, color: '#c1c2c3', margin: 0, whiteSpace: 'nowrap' }}>
            {username || 'name'}
          </p>
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
      }}>
        {text}
      </p>
    </div>
  )
}

export function PostComment({ values }: Props) {
  return (
    <div className="relative" style={{ width: 1080, height: 1350, background: '#1a1a1a' }}>
      <div className="absolute" style={{ left: 120, right: 80, top: 40, bottom: 110 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40, width: 890 }}>
          {/* Original post */}
          <CommentItem
            name={values.authorName || '작성자'}
            username="name"
            text={values.postBody || '원글 내용을 입력하세요.'}
            thumbnail={values.authorThumbnail}
          />

          {/* Comment 1 */}
          {(values.comment1 || true) && (
            <CommentItem
              name={values.commenter1Name || '댓글 작성자 1'}
              username="name"
              text={values.comment1 || '댓글 내용을 입력하세요.'}
            />
          )}

          {/* Comment 2 */}
          {values.comment2 && (
            <CommentItem
              name={values.commenter2Name || '댓글 작성자 2'}
              username="name"
              text={values.comment2}
            />
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center" style={{ height: 110, padding: '0 24px' }}>
        <img src="/assets/logo.png" alt="blind" style={{ height: 40, objectFit: 'contain' }} />
        <div className="flex-1" />
        <img src="/assets/logo.png" alt="" style={{ width: 110, height: 110, objectFit: 'contain' }} />
      </div>
    </div>
  )
}
