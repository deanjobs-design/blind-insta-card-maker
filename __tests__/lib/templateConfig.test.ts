import { describe, it, expect } from 'vitest'
import { TEMPLATES, getTemplate, getSectionTemplates } from '@/lib/templateConfig'

describe('templateConfig', () => {
  it('전체 템플릿이 10개여야 한다', () => {
    expect(TEMPLATES).toHaveLength(10)
  })

  it('각 템플릿은 id, name, section, fields를 가져야 한다', () => {
    TEMPLATES.forEach(t => {
      expect(t.id).toBeTruthy()
      expect(t.name).toBeTruthy()
      expect(t.section).toMatch(/^(cover|post|post_comment|last_page)$/)
      expect(Array.isArray(t.fields)).toBe(true)
    })
  })

  it('getTemplate은 id로 템플릿을 반환한다', () => {
    const t = getTemplate('photo_01')
    expect(t?.id).toBe('photo_01')
  })

  it('getTemplate은 없는 id에 undefined를 반환한다', () => {
    expect(getTemplate('nonexistent')).toBeUndefined()
  })

  it('getSectionTemplates는 섹션 필터링이 된다', () => {
    const covers = getSectionTemplates('cover')
    expect(covers.length).toBe(7)
    covers.forEach(t => expect(t.section).toBe('cover'))
  })
})
