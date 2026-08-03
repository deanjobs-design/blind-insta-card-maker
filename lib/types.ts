export type FieldType = 'text' | 'textarea' | 'image' | 'color' | 'toggle' | 'select'

export interface SelectOption {
  value: string
  label: string
}

export interface TemplateField {
  key: string
  label: string
  type: FieldType
  placeholder?: string
  required?: boolean
  options?: SelectOption[]   // type==='select'
  baseFontSize?: number      // 이 필드 텍스트의 기본 px (크기 조절 UI 기준값)
}

export interface TemplateConfig {
  id: string
  name: string
  section: 'cover' | 'post' | 'post_comment' | 'last_page'
  fields: TemplateField[]
}

export type FieldValues = Record<string, string>

export interface CardItem {
  id: string
  templateId: string
  values: FieldValues
  label: string
}
