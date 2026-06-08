import { TemplateConfig, TemplateField } from './types'

const textField = (key: string, label: string, placeholder = ''): TemplateField => ({
  key, label, type: 'text', placeholder,
})
const textareaField = (key: string, label: string, placeholder = ''): TemplateField => ({
  key, label, type: 'textarea', placeholder,
})
const imageField = (key: string, label: string): TemplateField => ({
  key, label, type: 'image', required: false,
})
const toggleField = (key: string, label: string): TemplateField => ({
  key, label, type: 'toggle',
})

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'photo_01',
    name: '사진형 A',
    section: 'cover',
    fields: [
      imageField('mainImage', '배경 사진'),
      textareaField('headline', '헤드라인', '헤드라인 텍스트를 입력하세요'),
      toggleField('showSubtitle', '서브타이틀'),
      textareaField('subtitle', '서브타이틀 텍스트', '서브타이틀을 입력하세요'),
    ],
  },
  {
    id: 'photo_02',
    name: '사진형 B',
    section: 'cover',
    fields: [
      imageField('mainImage', '배경 사진'),
      textareaField('headline', '헤드라인 ([텍스트] = 강조)', '헤드라인 텍스트를 입력하세요'),
      toggleField('showSubtitle', '서브타이틀'),
      textareaField('subtitle', '서브타이틀 텍스트', '서브타이틀을 입력하세요'),
    ],
  },
  {
    id: 'photo_text_01',
    name: '사진+텍스트형 A',
    section: 'cover',
    fields: [
      textareaField('title', '타이틀 ([텍스트] = 하이라이트)', '[하이라이트할 부분]을 대괄호로 감싸세요'),
      imageField('sectionImage', '하단 이미지'),
    ],
  },
  {
    id: 'photo_text_02',
    name: '사진+텍스트형 B',
    section: 'cover',
    fields: [
      imageField('mainImage', '배경 사진'),
      textareaField('headline', '헤드라인', '헤드라인 텍스트'),
      textareaField('body', '본문', '본문 텍스트'),
    ],
  },
  {
    id: 'text_01',
    name: '텍스트형 A',
    section: 'cover',
    fields: [
      textareaField('announcement', '본문 텍스트', '공지/발표 텍스트를 입력하세요'),
    ],
  },
  {
    id: 'text_02',
    name: '텍스트형 B (인용구)',
    section: 'cover',
    fields: [
      textareaField('quote', '인용구', '"큰따옴표 안의 텍스트"'),
      toggleField('showChannelInfo', '채널 정보 표시'),
      textField('channelName', '채널명', '채널 이름'),
      textField('occupation', '직책/소속', '직책 또는 소속'),
      imageField('channelThumbnail', '채널 썸네일'),
    ],
  },
  {
    id: 'photo_comment',
    name: '사진+게시물형',
    section: 'cover',
    fields: [
      imageField('mainImage', '배경 사진'),
      imageField('channelThumbnail', '채널 로고'),
      textField('channelName', '채널명'),
      textField('timestamp', '회사명', 'Ex-Amazon'),
      textareaField('postBody', '게시물 본문', '게시물 내용'),
      textareaField('subText', '서브 텍스트', '추가 설명 (선택사항)'),
    ],
  },
  {
    id: 'post',
    name: '블라인드 게시물',
    section: 'post',
    fields: [
      textField('channelName', '채널명', '채널 이름'),
      imageField('channelThumbnail', '채널 썸네일'),
      textareaField('body', '게시물 본문', '게시물 내용을 입력하세요'),
    ],
  },
  {
    id: 'post_comment',
    name: '게시물+댓글',
    section: 'post_comment',
    fields: [
      textField('authorName', '원글 작성자'),
      imageField('authorThumbnail', '작성자 썸네일'),
      textareaField('postBody', '원글 내용'),
      textField('commenter1Name', '댓글1 작성자'),
      textareaField('comment1', '댓글1 내용'),
      textField('commenter2Name', '댓글2 작성자'),
      textareaField('comment2', '댓글2 내용'),
    ],
  },
  {
    id: 'last_page',
    name: '마지막 페이지',
    section: 'last_page',
    fields: [],
  },
]

export const getTemplate = (id: string): TemplateConfig | undefined =>
  TEMPLATES.find(t => t.id === id)

export const getSectionTemplates = (section: TemplateConfig['section']): TemplateConfig[] =>
  TEMPLATES.filter(t => t.section === section)
