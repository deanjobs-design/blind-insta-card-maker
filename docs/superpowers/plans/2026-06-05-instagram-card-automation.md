# Instagram 카드 자동화 사이트 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 팀원들이 텍스트/이미지를 입력하고 템플릿을 선택해 인스타그램 카드를 ZIP으로 다운로드할 수 있는 Next.js 내부 툴을 만든다.

**Architecture:** Next.js 14 App Router + Tailwind CSS 단일 페이지 앱. 카드는 HTML/CSS 컴포넌트로 픽셀퍼펙트 재현하고 html2canvas로 1080×1350 PNG 캡처, JSZip으로 묶어 다운로드. 백엔드 없이 전부 클라이언트 사이드.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, html2canvas, JSZip, file-saver, Vitest

---

## File Map

```
app/
  layout.tsx              ← 루트 레이아웃 (메타데이터, 폰트)
  page.tsx                ← 메인 페이지 (Editor 전체 조합)

components/
  Editor/
    TemplateSelector.tsx  ← 상단 탭 + 템플릿 썸네일 그리드
    InputPanel.tsx        ← 좌측 동적 입력 폼
    PreviewPanel.tsx      ← 우측 카드 미리보기 (스케일 축소)
    DownloadBar.tsx       ← 하단 세트 구성 + ZIP 다운로드
  
  Templates/
    cover/
      Photo01.tsx         ← 사진형 A
      Photo02.tsx         ← 사진형 B
      PhotoText01.tsx     ← 사진+텍스트형 A
      PhotoText02.tsx     ← 사진+텍스트형 B
      Text01.tsx          ← 텍스트형 A
      Text02.tsx          ← 텍스트형 B (인용구)
      PhotoComment.tsx    ← 사진+게시물형
    Post.tsx              ← 블라인드 게시물
    PostComment.tsx       ← 게시물+댓글
    LastPage.tsx          ← 마지막 페이지

lib/
  types.ts                ← 공유 TypeScript 타입
  templateConfig.ts       ← 템플릿 메타데이터 + 필드 정의
  exportCard.ts           ← html2canvas 래퍼
  createZip.ts            ← JSZip + file-saver 래퍼

public/
  assets/
    logo.png              ← 블라인드 로고 (별도 전달 예정, placeholder 사용)

__tests__/
  lib/
    templateConfig.test.ts
    exportCard.test.ts
    createZip.test.ts
```

---

## Task 1: 프로젝트 초기 세팅

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`
- Create: `app/layout.tsx`, `app/page.tsx`

- [ ] **Step 1: Next.js 14 프로젝트 생성**

```bash
cd /Users/tbkr_lt_mac_064/ai_projects/instagram
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --yes
```

- [ ] **Step 2: 추가 패키지 설치**

```bash
npm install html2canvas jszip file-saver
npm install -D @types/file-saver vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 3: vitest 설정 파일 추가**

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
})
```

`vitest.setup.ts`:
```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 4: package.json에 test 스크립트 추가**

`package.json`의 `scripts`에 추가:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: 기본 layout.tsx 작성**

`app/layout.tsx`:
```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '블라인드 카드 메이커',
  description: '인스타그램 카드 템플릿 자동화',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

- [ ] **Step 6: 빈 page.tsx 작성 (placeholder)**

`app/page.tsx`:
```tsx
export default function Home() {
  return <main className="min-h-screen bg-gray-100 p-4">카드 메이커</main>
}
```

- [ ] **Step 7: 개발 서버 확인**

```bash
npm run dev
```
Expected: `http://localhost:3000` 에서 "카드 메이커" 텍스트 확인

- [ ] **Step 8: 커밋**

```bash
git init
git add .
git commit -m "feat: initial Next.js 14 project setup"
```

---

## Task 2: 공유 타입 정의

**Files:**
- Create: `lib/types.ts`
- Test: `__tests__/lib/templateConfig.test.ts` (Task 3에서 함께 검증)

- [ ] **Step 1: lib/types.ts 작성**

```ts
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
  id: string           // 세트에 추가된 카드의 고유 ID (crypto.randomUUID)
  templateId: string
  values: FieldValues
  label: string        // 다운로드 파일명에 사용 (예: "01_photo_01")
}
```

- [ ] **Step 2: 커밋**

```bash
git add lib/types.ts
git commit -m "feat: add shared TypeScript types"
```

---

## Task 3: 템플릿 설정 (templateConfig)

**Files:**
- Create: `lib/templateConfig.ts`
- Test: `__tests__/lib/templateConfig.test.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`__tests__/lib/templateConfig.test.ts`:
```ts
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
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
npm test
```
Expected: FAIL — `Cannot find module '@/lib/templateConfig'`

- [ ] **Step 3: templateConfig.ts 구현**

`lib/templateConfig.ts`:
```ts
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

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'photo_01',
    name: '사진형 A',
    section: 'cover',
    fields: [
      imageField('mainImage', '배경 사진'),
      textareaField('headline', '헤드라인', '헤드라인 텍스트를 입력하세요'),
    ],
  },
  {
    id: 'photo_02',
    name: '사진형 B',
    section: 'cover',
    fields: [
      imageField('mainImage', '배경 사진'),
      textareaField('headline', '헤드라인', '헤드라인 텍스트를 입력하세요'),
    ],
  },
  {
    id: 'photo_text_01',
    name: '사진+텍스트형 A',
    section: 'cover',
    fields: [
      textareaField('title', '타이틀', '큰 타이틀 텍스트'),
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
      textField('channelName', '채널명'),
      textField('timestamp', '시간', '방금 전'),
      textareaField('postBody', '게시물 본문', '게시물 내용'),
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
    fields: [
      textareaField('ctaText', 'CTA 텍스트', 'Follow us for more breaking news and stories!'),
    ],
  },
]

export const getTemplate = (id: string): TemplateConfig | undefined =>
  TEMPLATES.find(t => t.id === id)

export const getSectionTemplates = (section: TemplateConfig['section']): TemplateConfig[] =>
  TEMPLATES.filter(t => t.section === section)
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
npm test
```
Expected: PASS (5 tests)

- [ ] **Step 5: 커밋**

```bash
git add lib/templateConfig.ts __tests__/lib/templateConfig.test.ts
git commit -m "feat: add template config with 10 templates"
```

---

## Task 4: exportCard 유틸리티

**Files:**
- Create: `lib/exportCard.ts`
- Test: `__tests__/lib/exportCard.test.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`__tests__/lib/exportCard.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

// html2canvas는 브라우저 API 의존 — mock 처리
vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: vi.fn().mockReturnValue('data:image/png;base64,abc123'),
  }),
}))

import { captureCard } from '@/lib/exportCard'

describe('captureCard', () => {
  let el: HTMLElement

  beforeEach(() => {
    el = document.createElement('div')
    el.id = 'card-preview'
    document.body.appendChild(el)
  })

  it('html2canvas를 호출하고 dataURL 문자열을 반환한다', async () => {
    const result = await captureCard(el)
    expect(result).toBe('data:image/png;base64,abc123')
  })

  it('엘리먼트가 null이면 에러를 던진다', async () => {
    await expect(captureCard(null as unknown as HTMLElement)).rejects.toThrow('카드 엘리먼트가 없습니다')
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
npm test
```
Expected: FAIL

- [ ] **Step 3: exportCard.ts 구현**

`lib/exportCard.ts`:
```ts
import html2canvas from 'html2canvas'

export const CARD_WIDTH = 1080
export const CARD_HEIGHT = 1350

export async function captureCard(element: HTMLElement): Promise<string> {
  if (!element) throw new Error('카드 엘리먼트가 없습니다')

  const canvas = await html2canvas(element, {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    scale: 1,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
  })

  return canvas.toDataURL('image/png')
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
npm test
```
Expected: PASS

- [ ] **Step 5: 커밋**

```bash
git add lib/exportCard.ts __tests__/lib/exportCard.test.ts
git commit -m "feat: add html2canvas captureCard utility"
```

---

## Task 5: createZip 유틸리티

**Files:**
- Create: `lib/createZip.ts`
- Test: `__tests__/lib/createZip.test.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`__tests__/lib/createZip.test.ts`:
```ts
import { describe, it, expect, vi } from 'vitest'

vi.mock('file-saver', () => ({ saveAs: vi.fn() }))

import { downloadZip } from '@/lib/createZip'
import { saveAs } from 'file-saver'

describe('downloadZip', () => {
  it('PNG dataURL 배열을 받아 saveAs를 호출한다', async () => {
    const cards = [
      { filename: '01_photo_01.png', dataUrl: 'data:image/png;base64,abc' },
      { filename: '02_post.png', dataUrl: 'data:image/png;base64,def' },
    ]
    await downloadZip(cards, 'test.zip')
    expect(saveAs).toHaveBeenCalledOnce()
  })

  it('카드가 없으면 에러를 던진다', async () => {
    await expect(downloadZip([], 'empty.zip')).rejects.toThrow('다운로드할 카드가 없습니다')
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
npm test
```
Expected: FAIL

- [ ] **Step 3: createZip.ts 구현**

`lib/createZip.ts`:
```ts
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export interface ZipEntry {
  filename: string
  dataUrl: string
}

export async function downloadZip(cards: ZipEntry[], zipName = 'cards.zip'): Promise<void> {
  if (cards.length === 0) throw new Error('다운로드할 카드가 없습니다')

  const zip = new JSZip()

  for (const { filename, dataUrl } of cards) {
    const base64 = dataUrl.replace(/^data:image\/png;base64,/, '')
    zip.file(filename, base64, { base64: true })
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  saveAs(blob, zipName)
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
npm test
```
Expected: PASS

- [ ] **Step 5: 커밋**

```bash
git add lib/createZip.ts __tests__/lib/createZip.test.ts
git commit -m "feat: add JSZip downloadZip utility"
```

---

## Task 6: 공통 UI — Button, Tabs

**Files:**
- Create: `components/ui/Button.tsx`
- Create: `components/ui/Tabs.tsx`

- [ ] **Step 1: Button.tsx 작성**

`components/ui/Button.tsx`:
```tsx
import { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function Button({ variant = 'primary', className = '', children, ...props }: Props) {
  const base = 'px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50'
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    ghost: 'text-gray-600 hover:bg-gray-100',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
```

- [ ] **Step 2: Tabs.tsx 작성**

`components/ui/Tabs.tsx`:
```tsx
interface Tab {
  id: string
  label: string
}

interface Props {
  tabs: Tab[]
  activeTab: string
  onChange: (id: string) => void
}

export function Tabs({ tabs, activeTab, onChange }: Props) {
  return (
    <div className="flex gap-1 border-b border-gray-200">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === tab.id
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: 커밋**

```bash
git add components/ui/
git commit -m "feat: add Button and Tabs UI components"
```

---

## Task 7: TemplateSelector 컴포넌트

**Files:**
- Create: `components/Editor/TemplateSelector.tsx`

- [ ] **Step 1: TemplateSelector.tsx 작성**

`components/Editor/TemplateSelector.tsx`:
```tsx
'use client'
import { useState } from 'react'
import { Tabs } from '@/components/ui/Tabs'
import { TEMPLATES, getSectionTemplates } from '@/lib/templateConfig'
import { TemplateConfig } from '@/lib/types'

const SECTION_TABS = [
  { id: 'cover', label: '표지' },
  { id: 'post', label: '게시물' },
  { id: 'post_comment', label: '게시물+댓글' },
  { id: 'last_page', label: '마지막 페이지' },
] as const

interface Props {
  selectedId: string
  onSelect: (template: TemplateConfig) => void
}

export function TemplateSelector({ selectedId, onSelect }: Props) {
  const [activeSection, setActiveSection] = useState<string>('cover')
  const templates = getSectionTemplates(activeSection as TemplateConfig['section'])

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <Tabs
        tabs={SECTION_TABS.map(t => ({ id: t.id, label: t.label }))}
        activeTab={activeSection}
        onChange={setActiveSection}
      />
      <div className="grid grid-cols-3 gap-3 mt-4">
        {templates.map(t => (
          <button
            key={t.id}
            onClick={() => onSelect(t)}
            className={`aspect-[4/5] rounded-lg border-2 transition-all text-xs font-medium flex items-center justify-center ${
              selectedId === t.id
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-500'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 커밋**

```bash
git add components/Editor/TemplateSelector.tsx
git commit -m "feat: add TemplateSelector component"
```

---

## Task 8: InputPanel 컴포넌트

**Files:**
- Create: `components/Editor/InputPanel.tsx`

- [ ] **Step 1: InputPanel.tsx 작성**

`components/Editor/InputPanel.tsx`:
```tsx
'use client'
import { TemplateConfig, FieldValues } from '@/lib/types'
import { Button } from '@/components/ui/Button'

interface Props {
  template: TemplateConfig | null
  values: FieldValues
  onChange: (key: string, value: string) => void
  onAddToSet: () => void
}

export function InputPanel({ template, values, onChange, onAddToSet }: Props) {
  if (!template) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-center text-gray-400 text-sm h-full">
        왼쪽에서 템플릿을 선택하세요
      </div>
    )
  }

  function handleImageChange(key: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => onChange(key, ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
      <h2 className="text-base font-semibold text-gray-800">{template.name}</h2>
      {template.fields.map(field => (
        <div key={field.key} className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">{field.label}</label>
          {field.type === 'text' && (
            <input
              type="text"
              placeholder={field.placeholder}
              value={values[field.key] ?? ''}
              onChange={e => onChange(field.key, e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          {field.type === 'textarea' && (
            <textarea
              placeholder={field.placeholder}
              value={values[field.key] ?? ''}
              onChange={e => onChange(field.key, e.target.value)}
              rows={4}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          {field.type === 'image' && (
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={e => handleImageChange(field.key, e)}
                className="text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-gray-100 file:text-sm file:font-medium hover:file:bg-gray-200"
              />
              {values[field.key] && (
                <img
                  src={values[field.key]}
                  alt="preview"
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
              )}
            </div>
          )}
        </div>
      ))}
      <Button onClick={onAddToSet} className="mt-auto w-full">
        + 세트에 추가
      </Button>
    </div>
  )
}
```

- [ ] **Step 2: 커밋**

```bash
git add components/Editor/InputPanel.tsx
git commit -m "feat: add InputPanel component with dynamic form fields"
```

---

## Task 9: 템플릿 컴포넌트 — cover/Photo01, Photo02

**Files:**
- Create: `components/Templates/cover/Photo01.tsx`
- Create: `components/Templates/cover/Photo02.tsx`

카드는 항상 1080×1350px 기준. 미리보기 시에는 부모가 CSS transform: scale로 축소.

- [ ] **Step 1: Photo01.tsx 작성 (사진형 A — 하단 박스 헤드라인)**

`components/Templates/cover/Photo01.tsx`:
```tsx
import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function Photo01({ values }: Props) {
  return (
    <div
      className="relative overflow-hidden bg-gray-300"
      style={{ width: 1080, height: 1350 }}
    >
      {/* 배경 이미지 */}
      {values.mainImage ? (
        <img src={values.mainImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600" />
      )}

      {/* 블라인드 로고 */}
      <div className="absolute top-12 left-12">
        <img src="/assets/logo.png" alt="blind" className="h-10 object-contain" />
      </div>

      {/* 하단 헤드라인 박스 */}
      <div className="absolute bottom-0 left-0 right-0 bg-white px-24 pt-10 pb-16">
        <div
          className="text-gray-900 font-bold leading-tight"
          style={{ fontSize: 72, lineHeight: 1.2 }}
        >
          {values.headline || '헤드라인 텍스트'}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Photo02.tsx 작성 (사진형 B — 그라데이션 오버레이 헤드라인)**

`components/Templates/cover/Photo02.tsx`:
```tsx
import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function Photo02({ values }: Props) {
  return (
    <div
      className="relative overflow-hidden bg-gray-300"
      style={{ width: 1080, height: 1350 }}
    >
      {values.mainImage ? (
        <img src={values.mainImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-500 to-gray-800" />
      )}

      {/* 하단 그라데이션 오버레이 */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: 684,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* 블라인드 로고 */}
      <div className="absolute top-12 left-12">
        <img src="/assets/logo.png" alt="blind" className="h-10 object-contain" />
      </div>

      {/* 헤드라인 */}
      <div className="absolute left-10 right-10" style={{ bottom: 100 }}>
        <div
          className="text-white font-bold leading-tight"
          style={{ fontSize: 72, lineHeight: 1.2 }}
        >
          {values.headline || '헤드라인 텍스트'}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 커밋**

```bash
git add components/Templates/cover/Photo01.tsx components/Templates/cover/Photo02.tsx
git commit -m "feat: add Photo01 and Photo02 cover templates"
```

---

## Task 10: 템플릿 컴포넌트 — cover/PhotoText01, PhotoText02

**Files:**
- Create: `components/Templates/cover/PhotoText01.tsx`
- Create: `components/Templates/cover/PhotoText02.tsx`

- [ ] **Step 1: PhotoText01.tsx 작성 (상단 큰 타이틀 + 하단 이미지)**

`components/Templates/cover/PhotoText01.tsx`:
```tsx
import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function PhotoText01({ values }: Props) {
  return (
    <div
      className="relative bg-white flex flex-col"
      style={{ width: 1080, height: 1350 }}
    >
      {/* 상단 타이틀 영역 */}
      <div className="px-12 pt-14" style={{ height: 546 }}>
        <div
          className="text-gray-900 font-bold leading-tight"
          style={{ fontSize: 88, lineHeight: 1.15 }}
        >
          {values.title || '타이틀 텍스트'}
        </div>
      </div>

      {/* 하단 이미지 */}
      <div className="mx-5" style={{ height: 690, borderRadius: 20, overflow: 'hidden' }}>
        {values.sectionImage ? (
          <img src={values.sectionImage} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl">
            이미지
          </div>
        )}
      </div>

      {/* 하단 로고 */}
      <div className="absolute bottom-6 right-8">
        <img src="/assets/logo.png" alt="blind" className="h-10 object-contain" />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: PhotoText02.tsx 작성 (전체 사진 + 오버레이 텍스트 박스)**

`components/Templates/cover/PhotoText02.tsx`:
```tsx
import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function PhotoText02({ values }: Props) {
  return (
    <div
      className="relative overflow-hidden bg-gray-300"
      style={{ width: 1080, height: 1350 }}
    >
      {values.mainImage ? (
        <img src={values.mainImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-700" />
      )}

      {/* 블라인드 로고 */}
      <div className="absolute top-12 left-12">
        <img src="/assets/logo.png" alt="blind" className="h-10 object-contain" />
      </div>

      {/* 하단 텍스트 박스 */}
      <div className="absolute bottom-0 left-0 right-0 bg-white" style={{ height: 586 }}>
        <div className="px-14 pt-14">
          <div
            className="text-gray-900 font-bold leading-tight"
            style={{ fontSize: 66, lineHeight: 1.2 }}
          >
            {values.headline || '헤드라인 텍스트'}
          </div>
          {values.body && (
            <div
              className="text-gray-600 mt-10 leading-relaxed"
              style={{ fontSize: 36 }}
            >
              {values.body}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 커밋**

```bash
git add components/Templates/cover/PhotoText01.tsx components/Templates/cover/PhotoText02.tsx
git commit -m "feat: add PhotoText01 and PhotoText02 cover templates"
```

---

## Task 11: 템플릿 컴포넌트 — cover/Text01, Text02

**Files:**
- Create: `components/Templates/cover/Text01.tsx`
- Create: `components/Templates/cover/Text02.tsx`

- [ ] **Step 1: Text01.tsx 작성 (로고 + 본문 텍스트)**

`components/Templates/cover/Text01.tsx`:
```tsx
import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function Text01({ values }: Props) {
  return (
    <div
      className="relative bg-white"
      style={{ width: 1080, height: 1350 }}
    >
      <div className="px-16 pt-16">
        {/* 로고 */}
        <img src="/assets/logo.png" alt="blind" className="h-16 object-contain" />

        {/* 본문 텍스트 */}
        <div
          className="mt-24 text-gray-900 font-semibold leading-relaxed"
          style={{ fontSize: 52, lineHeight: 1.45 }}
        >
          {values.announcement || '공지 텍스트를 입력하세요'}
        </div>
      </div>

      {/* 하단 우측 로고 */}
      <div className="absolute bottom-6 right-8">
        <img src="/assets/logo.png" alt="blind" className="h-10 object-contain" />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Text02.tsx 작성 (인용구 + 채널 정보)**

`components/Templates/cover/Text02.tsx`:
```tsx
import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function Text02({ values }: Props) {
  return (
    <div
      className="relative bg-gray-50"
      style={{ width: 1080, height: 1350 }}
    >
      {/* 인용구 영역 */}
      <div className="absolute left-20 right-20" style={{ top: 80 }}>
        {/* 큰따옴표 */}
        <div className="text-blue-600 font-black" style={{ fontSize: 120, lineHeight: 1 }}>"</div>
        <div
          className="text-gray-900 font-bold leading-snug mt-8"
          style={{ fontSize: 60, lineHeight: 1.3 }}
        >
          {values.quote || '인용구 텍스트를 입력하세요'}
        </div>
      </div>

      {/* 채널 정보 */}
      <div className="absolute flex items-center gap-6" style={{ bottom: 176, left: 80 }}>
        {values.channelThumbnail ? (
          <img
            src={values.channelThumbnail}
            alt=""
            className="rounded-full object-cover"
            style={{ width: 96, height: 96 }}
          />
        ) : (
          <div className="rounded-full bg-gray-300" style={{ width: 96, height: 96 }} />
        )}
        <div>
          <div className="text-gray-900 font-semibold" style={{ fontSize: 40 }}>
            {values.channelName || '채널명'}
          </div>
          <div className="text-gray-500" style={{ fontSize: 36 }}>
            {values.occupation || '직책'}
          </div>
        </div>
      </div>

      {/* 하단 로고 */}
      <div className="absolute bottom-6 right-8">
        <img src="/assets/logo.png" alt="blind" className="h-10 object-contain" />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 커밋**

```bash
git add components/Templates/cover/Text01.tsx components/Templates/cover/Text02.tsx
git commit -m "feat: add Text01 and Text02 cover templates"
```

---

## Task 12: 템플릿 컴포넌트 — cover/PhotoComment

**Files:**
- Create: `components/Templates/cover/PhotoComment.tsx`

- [ ] **Step 1: PhotoComment.tsx 작성 (사진 배경 + 블라인드 게시물 카드)**

`components/Templates/cover/PhotoComment.tsx`:
```tsx
import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function PhotoComment({ values }: Props) {
  return (
    <div
      className="relative overflow-hidden bg-gray-300"
      style={{ width: 1080, height: 1350 }}
    >
      {values.mainImage ? (
        <img src={values.mainImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-500 to-gray-800" />
      )}

      {/* 하단 그라데이션 */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: 684,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* 블라인드 로고 */}
      <div className="absolute top-12 left-12">
        <img src="/assets/logo.png" alt="blind" className="h-10 object-contain" />
      </div>

      {/* 게시물 카드 */}
      <div
        className="absolute left-20 right-20 bg-white rounded-2xl p-10"
        style={{ bottom: 120 }}
      >
        {/* 채널 헤더 */}
        <div className="flex items-center gap-4 mb-6">
          <div className="rounded-full bg-gray-200" style={{ width: 60, height: 60 }} />
          <div>
            <div className="font-semibold text-gray-900" style={{ fontSize: 30 }}>
              {values.channelName || '채널명'}
            </div>
            <div className="text-gray-400" style={{ fontSize: 26 }}>
              {values.timestamp || '방금 전'}
            </div>
          </div>
        </div>
        {/* 본문 */}
        <div
          className="text-gray-800 leading-relaxed"
          style={{ fontSize: 32, lineHeight: 1.5 }}
        >
          {values.postBody || '게시물 본문 내용이 여기에 표시됩니다.'}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 커밋**

```bash
git add components/Templates/cover/PhotoComment.tsx
git commit -m "feat: add PhotoComment cover template"
```

---

## Task 13: 템플릿 컴포넌트 — Post, PostComment, LastPage

**Files:**
- Create: `components/Templates/Post.tsx`
- Create: `components/Templates/PostComment.tsx`
- Create: `components/Templates/LastPage.tsx`

- [ ] **Step 1: Post.tsx 작성 (블라인드 게시물)**

`components/Templates/Post.tsx`:
```tsx
import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function Post({ values }: Props) {
  return (
    <div
      className="relative bg-white flex flex-col"
      style={{ width: 1080, height: 1350 }}
    >
      {/* 게시물 본문 영역 */}
      <div className="flex-1 px-15 pt-20" style={{ paddingLeft: 60, paddingRight: 60 }}>
        {/* 채널 헤더 */}
        <div className="flex items-center gap-6 mb-12">
          {values.channelThumbnail ? (
            <img
              src={values.channelThumbnail}
              alt=""
              className="rounded-full object-cover"
              style={{ width: 72, height: 72 }}
            />
          ) : (
            <div className="rounded-full bg-gray-200" style={{ width: 72, height: 72 }} />
          )}
          <div className="font-semibold text-gray-900" style={{ fontSize: 36 }}>
            {values.channelName || '채널명'}
          </div>
        </div>

        {/* 본문 */}
        <div
          className="text-gray-900 leading-relaxed"
          style={{ fontSize: 44, lineHeight: 1.6 }}
        >
          {values.body || '게시물 내용을 입력하세요.'}
        </div>
      </div>

      {/* 하단 로고 바 */}
      <div className="flex items-center justify-between px-6 pb-6" style={{ height: 110 }}>
        <img src="/assets/logo.png" alt="blind" className="h-10 object-contain" />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: PostComment.tsx 작성 (원글 + 댓글)**

`components/Templates/PostComment.tsx`:
```tsx
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
        {/* 원글 */}
        <CommentRow
          name={values.authorName}
          thumbnail={values.authorThumbnail}
          text={values.postBody || '원글 내용을 입력하세요.'}
        />

        {/* 구분선 */}
        <div className="my-8 border-t border-gray-100" />

        {/* 댓글들 */}
        <div className="flex flex-col gap-8">
          {values.comment1 && (
            <CommentRow name={values.commenter1Name} text={values.comment1} />
          )}
          {values.comment2 && (
            <CommentRow name={values.commenter2Name} text={values.comment2} />
          )}
        </div>
      </div>

      {/* 하단 로고 바 */}
      <div className="flex items-center px-6 pb-6" style={{ height: 110 }}>
        <img src="/assets/logo.png" alt="blind" className="h-10 object-contain" />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: LastPage.tsx 작성 (팔로우 CTA)**

`components/Templates/LastPage.tsx`:
```tsx
import { FieldValues } from '@/lib/types'

interface Props { values: FieldValues }

export function LastPage({ values }: Props) {
  return (
    <div
      className="relative bg-white flex flex-col items-center justify-center"
      style={{ width: 1080, height: 1350 }}
    >
      {/* 일러스트 플레이스홀더 */}
      <div
        className="rounded-2xl bg-gray-100 flex items-center justify-center mb-16"
        style={{ width: 640, height: 640 }}
      >
        <div className="text-gray-300 text-8xl">📱</div>
      </div>

      {/* CTA 텍스트 */}
      <div
        className="text-gray-900 font-bold text-center leading-snug px-20"
        style={{ fontSize: 52, lineHeight: 1.35 }}
      >
        {values.ctaText || 'Follow us for more breaking news and stories!'}
      </div>

      {/* 하단 로고 */}
      <div className="absolute bottom-10 right-10">
        <img src="/assets/logo.png" alt="blind" className="h-10 object-contain" />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 커밋**

```bash
git add components/Templates/Post.tsx components/Templates/PostComment.tsx components/Templates/LastPage.tsx
git commit -m "feat: add Post, PostComment, LastPage templates"
```

---

## Task 14: 템플릿 렌더러 (라우팅)

**Files:**
- Create: `components/Templates/TemplateRenderer.tsx`

- [ ] **Step 1: TemplateRenderer.tsx 작성**

`components/Templates/TemplateRenderer.tsx`:
```tsx
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
```

- [ ] **Step 2: 커밋**

```bash
git add components/Templates/TemplateRenderer.tsx
git commit -m "feat: add TemplateRenderer router component"
```

---

## Task 15: PreviewPanel 컴포넌트

**Files:**
- Create: `components/Editor/PreviewPanel.tsx`

- [ ] **Step 1: PreviewPanel.tsx 작성**

카드(1080×1350)를 컨테이너에 맞게 CSS transform: scale로 축소 표시. `data-card-preview` 속성을 달아두면 exportCard에서 `querySelector`로 잡을 수 있다.

`components/Editor/PreviewPanel.tsx`:
```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { TemplateRenderer } from '@/components/Templates/TemplateRenderer'
import { FieldValues } from '@/lib/types'

const CARD_W = 1080
const CARD_H = 1350

interface Props {
  templateId: string | null
  values: FieldValues
}

export function PreviewPanel({ templateId, values }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.3)

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      const scaleW = width / CARD_W
      const scaleH = height / CARD_H
      setScale(Math.min(scaleW, scaleH) * 0.95)
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  if (!templateId) {
    return (
      <div
        ref={containerRef}
        className="bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 text-sm h-full"
      >
        템플릿을 선택하면 미리보기가 표시됩니다
      </div>
    )
  }

  return (
    <div ref={containerRef} className="bg-gray-100 rounded-xl shadow-sm flex items-center justify-center overflow-hidden h-full">
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: CARD_W,
          height: CARD_H,
          flexShrink: 0,
        }}
      >
        <div data-card-preview="true">
          <TemplateRenderer templateId={templateId} values={values} />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 커밋**

```bash
git add components/Editor/PreviewPanel.tsx
git commit -m "feat: add PreviewPanel with responsive scaling"
```

---

## Task 16: DownloadBar 컴포넌트

**Files:**
- Create: `components/Editor/DownloadBar.tsx`

- [ ] **Step 1: DownloadBar.tsx 작성**

`components/Editor/DownloadBar.tsx`:
```tsx
'use client'
import { CardItem } from '@/lib/types'
import { Button } from '@/components/ui/Button'

interface Props {
  cards: CardItem[]
  onRemove: (id: string) => void
  onDownload: () => void
  isDownloading: boolean
}

export function DownloadBar({ cards, onRemove, onDownload, isDownloading }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm px-6 py-4 flex items-center gap-4">
      <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
        다운로드 세트
      </span>

      <div className="flex-1 flex gap-2 overflow-x-auto">
        {cards.length === 0 ? (
          <span className="text-sm text-gray-400">카드를 추가하세요</span>
        ) : (
          cards.map((card, i) => (
            <div
              key={card.id}
              className="flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1 text-sm text-blue-700 whitespace-nowrap"
            >
              <span>{String(i + 1).padStart(2, '0')}. {card.label}</span>
              <button
                onClick={() => onRemove(card.id)}
                className="ml-1 text-blue-400 hover:text-blue-700 font-bold"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      <Button
        onClick={onDownload}
        disabled={cards.length === 0 || isDownloading}
        className="whitespace-nowrap"
      >
        {isDownloading ? '렌더링 중...' : '⬇ ZIP 다운로드'}
      </Button>
    </div>
  )
}
```

- [ ] **Step 2: 커밋**

```bash
git add components/Editor/DownloadBar.tsx
git commit -m "feat: add DownloadBar component"
```

---

## Task 17: 메인 페이지 조합 및 ZIP 다운로드 연결

**Files:**
- Modify: `app/page.tsx`
- Create: `components/Editor/CardSetRenderer.tsx` (숨겨진 렌더링용)

- [ ] **Step 1: CardSetRenderer.tsx 작성**

ZIP 다운로드 시 숨겨진 div에 모든 카드를 실제 크기로 렌더링하고 캡처한다.

`components/Editor/CardSetRenderer.tsx`:
```tsx
import { forwardRef } from 'react'
import { CardItem } from '@/lib/types'
import { TemplateRenderer } from '@/components/Templates/TemplateRenderer'

interface Props {
  cards: CardItem[]
}

export const CardSetRenderer = forwardRef<HTMLDivElement, Props>(({ cards }, ref) => {
  return (
    <div ref={ref} className="absolute -left-[99999px] top-0 pointer-events-none">
      {cards.map(card => (
        <div
          key={card.id}
          data-card-id={card.id}
          style={{ width: 1080, height: 1350 }}
        >
          <TemplateRenderer templateId={card.templateId} values={card.values} />
        </div>
      ))}
    </div>
  )
})
CardSetRenderer.displayName = 'CardSetRenderer'
```

- [ ] **Step 2: app/page.tsx 작성**

`app/page.tsx`:
```tsx
'use client'
import { useState, useRef, useCallback } from 'react'
import { TemplateSelector } from '@/components/Editor/TemplateSelector'
import { InputPanel } from '@/components/Editor/InputPanel'
import { PreviewPanel } from '@/components/Editor/PreviewPanel'
import { DownloadBar } from '@/components/Editor/DownloadBar'
import { CardSetRenderer } from '@/components/Editor/CardSetRenderer'
import { TemplateConfig, FieldValues, CardItem } from '@/lib/types'
import { captureCard } from '@/lib/exportCard'
import { downloadZip } from '@/lib/createZip'

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateConfig | null>(null)
  const [fieldValues, setFieldValues] = useState<FieldValues>({})
  const [cardSet, setCardSet] = useState<CardItem[]>([])
  const [isDownloading, setIsDownloading] = useState(false)
  const renderRef = useRef<HTMLDivElement>(null)

  const handleTemplateSelect = useCallback((t: TemplateConfig) => {
    setSelectedTemplate(t)
    setFieldValues({})
  }, [])

  const handleFieldChange = useCallback((key: string, value: string) => {
    setFieldValues(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleAddToSet = useCallback(() => {
    if (!selectedTemplate) return
    const idx = cardSet.length + 1
    setCardSet(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        templateId: selectedTemplate.id,
        values: { ...fieldValues },
        label: selectedTemplate.name,
      },
    ])
  }, [selectedTemplate, fieldValues, cardSet.length])

  const handleRemoveFromSet = useCallback((id: string) => {
    setCardSet(prev => prev.filter(c => c.id !== id))
  }, [])

  const handleDownload = useCallback(async () => {
    if (!renderRef.current || cardSet.length === 0) return
    setIsDownloading(true)
    try {
      const entries = []
      const cardEls = renderRef.current.querySelectorAll('[data-card-id]')
      for (let i = 0; i < cardEls.length; i++) {
        const el = cardEls[i] as HTMLElement
        const cardId = el.getAttribute('data-card-id')!
        const card = cardSet.find(c => c.id === cardId)!
        const dataUrl = await captureCard(el)
        entries.push({
          filename: `${String(i + 1).padStart(2, '0')}_${card.templateId}.png`,
          dataUrl,
        })
      }
      await downloadZip(entries, 'blind_cards.zip')
    } finally {
      setIsDownloading(false)
    }
  }, [cardSet])

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <h1 className="text-xl font-bold text-gray-900">블라인드 카드 메이커</h1>
      </header>

      <div className="flex flex-col gap-4 p-6 max-w-7xl mx-auto" style={{ height: 'calc(100vh - 64px)' }}>
        {/* 템플릿 선택 */}
        <TemplateSelector
          selectedId={selectedTemplate?.id ?? ''}
          onSelect={handleTemplateSelect}
        />

        {/* 편집 영역 */}
        <div className="flex gap-4 flex-1 min-h-0">
          {/* 입력 폼 */}
          <div className="w-80 flex-shrink-0 overflow-y-auto">
            <InputPanel
              template={selectedTemplate}
              values={fieldValues}
              onChange={handleFieldChange}
              onAddToSet={handleAddToSet}
            />
          </div>

          {/* 미리보기 */}
          <div className="flex-1">
            <PreviewPanel
              templateId={selectedTemplate?.id ?? null}
              values={fieldValues}
            />
          </div>
        </div>

        {/* 다운로드 바 */}
        <DownloadBar
          cards={cardSet}
          onRemove={handleRemoveFromSet}
          onDownload={handleDownload}
          isDownloading={isDownloading}
        />
      </div>

      {/* 숨겨진 렌더링 영역 */}
      <CardSetRenderer ref={renderRef} cards={cardSet} />
    </main>
  )
}
```

- [ ] **Step 3: 개발 서버에서 전체 플로우 확인**

```bash
npm run dev
```

확인 항목:
1. 템플릿 탭 전환 → 썸네일 그리드 변경
2. 템플릿 클릭 → 입력 폼 변경
3. 텍스트 입력 → 우측 미리보기 실시간 반영
4. "+ 세트에 추가" → 하단 바에 카드 추가
5. "ZIP 다운로드" → `blind_cards.zip` 파일 저장

- [ ] **Step 4: 커밋**

```bash
git add app/page.tsx components/Editor/CardSetRenderer.tsx
git commit -m "feat: wire up main page with full card creation and ZIP download flow"
```

---

## Task 18: 로고 플레이스홀더 및 폴더 정리

**Files:**
- Create: `public/assets/.gitkeep`
- Create: `public/assets/logo.png` (placeholder)

- [ ] **Step 1: assets 폴더 생성**

```bash
mkdir -p public/assets
touch public/assets/.gitkeep
```

- [ ] **Step 2: placeholder 로고 생성 (실제 로고 전달 전까지)**

`public/assets/logo.png` 자리에 1×1 투명 PNG 생성:
```bash
# base64로 투명 1x1 PNG 생성
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > public/assets/logo.png
```

실제 로고 파일을 전달받으면 `public/assets/logo.png`에 덮어쓰기.

- [ ] **Step 3: next.config.ts에 이미지 도메인 설정 확인**

`next.config.ts`:
```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {}

export default nextConfig
```

- [ ] **Step 4: 커밋**

```bash
git add public/assets/
git commit -m "feat: add public assets folder with logo placeholder"
```

---

## Task 19: Vercel 배포

- [ ] **Step 1: GitHub 저장소 생성 및 push**

```bash
git remote add origin https://github.com/<org>/blind-card-maker.git
git push -u origin main
```

- [ ] **Step 2: Vercel 배포**

1. [vercel.com](https://vercel.com) → "New Project"
2. GitHub 저장소 연결
3. Framework Preset: **Next.js** (자동 감지됨)
4. 환경변수 없음 → "Deploy" 클릭

- [ ] **Step 3: 배포 URL 팀원들에게 공유**

배포 완료 후 `https://<project>.vercel.app` 링크를 팀원들에게 전달.

---

## 자체 검토 (Spec Coverage)

| 스펙 요구사항 | 해당 Task |
|---|---|
| Next.js 14 + Tailwind | Task 1 |
| 10개 템플릿 | Task 3, 9–13 |
| 입력 폼 (text/textarea/image) | Task 8 |
| 실시간 미리보기 | Task 15 |
| "+ 세트에 추가" | Task 8, 17 |
| ZIP 다운로드 | Task 5, 16, 17 |
| 1080×1350 PNG 캡처 | Task 4, 17 |
| 블라인드 로고 | Task 9–13, 18 |
| Vercel 배포 | Task 19 |
