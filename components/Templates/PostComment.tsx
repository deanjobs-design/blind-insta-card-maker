import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

function CommentRow({ name, thumbnail, text }: { name: string; thumbnail?: string; text: string }) {
  return (
    <div className="flex gap-4">
      {thumbnail ? (
        <img src={thumbnail} alt="" className="rounded-full object-cover flex-shrink-0" style={{ width: 56, height: 56 }} />
      ) : (
        <div className="rounded-full bg-gray-200 flex-shrink-0" style={{ width: 56, height: 56 }} />
      )}
      <div>
        <div className="font-semibold text-gray-900 mb-1" style={{ fontSize: 30 }}>{name || '작성자'}</div>
        <div className="text-gray-800 leading-relaxed" style={{ fontSize: 32, lineHeight: 1.5 }}>{text}</div>
      </div>
    </div>
  )
}

export function PostComment({ values }: Props) {
  return (
    <div
      className="relative bg-white flex flex-col"
      style={{ width: 1080, height: 1350 }}
    >
      <div className="flex-1 overflow-hidden" style={{ padding: '40px 60px 0' }}>
        <CommentRow
          name={values.authorName}
          thumbnail={values.authorThumbnail}
          text={values.postBody || '원글 내용을 입력하세요.'}
        />

        <div className="my-8 border-t border-gray-100" />

        <div className="flex flex-col gap-8">
          {values.comment1 && (
            <CommentRow name={values.commenter1Name} text={values.comment1} />
          )}
          {values.comment2 && (
            <CommentRow name={values.commenter2Name} text={values.comment2} />
          )}
        </div>
      </div>

      <div className="flex items-center px-6 pb-6" style={{ height: 110 }}>
        <img src="/assets/logo.png" alt="blind" className="h-10 object-contain" />
      </div>
    </div>
  )
}
