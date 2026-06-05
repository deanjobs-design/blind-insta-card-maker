import { FieldValues } from '@/lib/types'
import { Photo01 } from './cover/Photo01'
import { Photo02 } from './cover/Photo02'
import { PhotoText01 } from './cover/PhotoText01'
import { PhotoText02 } from './cover/PhotoText02'
import { Text01 } from './cover/Text01'
import { Text02 } from './cover/Text02'
import { PhotoComment } from './cover/PhotoComment'
import { Post } from './Post'
import { PostComment } from './PostComment'
import { LastPage } from './LastPage'

interface Props {
  templateId: string
  values: FieldValues
}

const TEMPLATE_MAP: Record<string, React.ComponentType<{ values: FieldValues }>> = {
  photo_01: Photo01,
  photo_02: Photo02,
  photo_text_01: PhotoText01,
  photo_text_02: PhotoText02,
  text_01: Text01,
  text_02: Text02,
  photo_comment: PhotoComment,
  post: Post,
  post_comment: PostComment,
  last_page: LastPage,
}

export function TemplateRenderer({ templateId, values }: Props) {
  const Component = TEMPLATE_MAP[templateId]
  if (!Component) {
    return (
      <div
        className="bg-gray-100 flex items-center justify-center text-gray-400"
        style={{ width: 1080, height: 1350 }}
      >
        템플릿을 찾을 수 없습니다
      </div>
    )
  }
  return <Component values={values} />
}
