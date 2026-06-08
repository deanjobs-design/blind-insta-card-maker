import { TemplateConfig, TemplateField, SelectOption } from './types'

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
const selectField = (key: string, label: string, options: SelectOption[]): TemplateField => ({
  key, label, type: 'select', options,
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
      toggleField('showBody', '본문'),
      textareaField('body', '본문 텍스트', '본문 텍스트'),
    ],
  },
  {
    id: 'text_01',
    name: '텍스트형 A',
    section: 'cover',
    fields: [
      textareaField('announcement', '본문 텍스트 ([텍스트] = 강조)', '공지/발표 텍스트를 입력하세요'),
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
      textField('channelName', '회사명', 'Amazon'),
      imageField('channelThumbnail', '회사 썸네일'),
      textareaField('body', '게시물 본문', '게시물 내용을 입력하세요'),
    ],
  },
  {
    id: 'post_comment',
    name: '댓글',
    section: 'post_comment',
    fields: [
      // 댓글 1 (항상 표시)
      imageField('c1Logo', '댓글1 로고'),
      textField('c1Company', '댓글1 회사명', 'Google'),
      textareaField('c1Text', '댓글1 내용', '댓글 내용을 입력하세요'),
      // 댓글 2 (토글)
      toggleField('showC2', '댓글2 표시'),
      imageField('c2Logo', '댓글2 로고'),
      textField('c2Company', '댓글2 회사명', 'Amazon'),
      textareaField('c2Text', '댓글2 내용', '댓글 내용을 입력하세요'),
      // 댓글 3 (토글)
      toggleField('showC3', '댓글3 표시'),
      imageField('c3Logo', '댓글3 로고'),
      textField('c3Company', '댓글3 회사명', 'Meta'),
      textareaField('c3Text', '댓글3 내용', '댓글 내용을 입력하세요'),
      // 댓글 4 (토글)
      toggleField('showC4', '댓글4 표시'),
      imageField('c4Logo', '댓글4 로고'),
      textField('c4Company', '댓글4 회사명'),
      textareaField('c4Text', '댓글4 내용'),
    ],
  },
  {
    id: 'last_page',
    name: '마지막 페이지',
    section: 'last_page',
    fields: [
      selectField('variant', '이미지 선택', [
        { value: 'a', label: '이미지 A' },
        { value: 'b', label: '이미지 B' },
      ]),
    ],
  },
]

export const getTemplate = (id: string): TemplateConfig | undefined =>
  TEMPLATES.find(t => t.id === id)

export const getSectionTemplates = (section: TemplateConfig['section']): TemplateConfig[] =>
  TEMPLATES.filter(t => t.section === section)
