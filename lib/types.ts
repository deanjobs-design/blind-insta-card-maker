export type FieldType = 'text' | 'textarea' | 'image' | 'color'

export interface TemplateField {
  key: string
  label: string
  type: FieldType
  placeholder?: string
  required?: boolean
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
