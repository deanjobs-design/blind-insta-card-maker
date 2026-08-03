'use client'
import { TemplateConfig, FieldValues } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { SIZE_SUFFIX, MIN_PX, MAX_PX, resolveFont } from '@/lib/textScale'

interface Props {
  template: TemplateConfig | null
  values: FieldValues
  onChange: (key: string, value: string) => void
  onAddToSet: () => void
  onDownloadPng: () => void
  isDownloadingPng: boolean
}

// 글자 크기(px) 직접 조절/입력
function FontSizeControl({
  fieldKey, base, values, onChange,
}: { fieldKey: string; base: number; values: FieldValues; onChange: (k: string, v: string) => void }) {
  const sizeKey = `${fieldKey}${SIZE_SUFFIX}`
  const current = resolveFont(base, values, fieldKey)
  const raw = values[sizeKey]
  const isCustom = raw != null && raw !== ''
  const setPx = (n: number) => {
    const clamped = Math.min(MAX_PX, Math.max(MIN_PX, Math.round(n)))
    onChange(sizeKey, String(clamped))
  }
  return (
    <div className="flex items-center gap-1.5 mt-1">
      <span className="text-xs text-gray-400">글자 크기</span>
      <button
        type="button"
        onClick={() => setPx(current - 1)}
        className="w-6 h-6 rounded border border-gray-300 text-gray-600 text-sm leading-none hover:bg-gray-100"
      >
        −
      </button>
      <div className="flex items-center border border-gray-300 rounded px-1.5 h-6">
        <input
          type="number"
          value={current}
          onChange={e => {
            const v = e.target.value
            if (v === '') { onChange(sizeKey, ''); return }
            const n = parseInt(v, 10)
            if (isFinite(n)) setPx(n)
          }}
          className="w-9 text-xs text-gray-700 text-center tabular-nums focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="text-xs text-gray-400">px</span>
      </div>
      <button
        type="button"
        onClick={() => setPx(current + 1)}
        className="w-6 h-6 rounded border border-gray-300 text-gray-600 text-sm leading-none hover:bg-gray-100"
      >
        +
      </button>
      {isCustom && (
        <button
          type="button"
          onClick={() => onChange(sizeKey, '')}
          className="text-xs text-gray-400 underline hover:text-gray-600 ml-1"
        >
          초기화
        </button>
      )}
    </div>
  )
}

export function InputPanel({ template, values, onChange, onAddToSet, onDownloadPng, isDownloadingPng }: Props) {
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
    // 실제 이미지 타입 검증 (확장자/UI 힌트가 아닌 MIME 기준)
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있어요.')
      e.target.value = ''
      return
    }
    // 크기 제한 (15MB) — 과도한 메모리 사용 방지
    const MAX_BYTES = 15 * 1024 * 1024
    if (file.size > MAX_BYTES) {
      alert('이미지 크기는 15MB 이하만 가능해요.')
      e.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = ev => onChange(key, ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
      <h2 className="text-base font-semibold text-gray-800">{template.name}</h2>
      {template.fields.length === 0 && (
        <p className="text-sm text-gray-400">
          이 템플릿은 고정 이미지입니다. 그대로 세트에 추가하세요.
        </p>
      )}
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
            <>
              <textarea
                placeholder={field.placeholder}
                value={values[field.key] ?? ''}
                onChange={e => onChange(field.key, e.target.value)}
                rows={4}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FontSizeControl fieldKey={field.key} base={field.baseFontSize ?? 40} values={values} onChange={onChange} />
            </>
          )}
          {field.type === 'image' && (
            <div className="flex flex-col gap-2">
              <input
                id={`file-${field.key}`}
                type="file"
                accept="image/*"
                onChange={e => handleImageChange(field.key, e)}
                className="hidden"
              />
              <label
                htmlFor={`file-${field.key}`}
                className="cursor-pointer inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-colors"
              >
                📎 {values[field.key] ? '이미지 변경하기' : '이미지 첨부하기'}
              </label>
              {values[field.key] && (
                <img
                  src={values[field.key]}
                  alt="preview"
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
              )}
            </div>
          )}
          {field.type === 'select' && (
            <div className="flex gap-2">
              {field.options?.map(opt => {
                const current = values[field.key] ?? field.options?.[0]?.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(field.key, opt.value)}
                    className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      current === opt.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          )}
          {field.type === 'toggle' && (
            <button
              type="button"
              onClick={() => onChange(field.key, values[field.key] === 'true' ? 'false' : 'true')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                values[field.key] === 'true' ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                values[field.key] === 'true' ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          )}
        </div>
      ))}
      <div className="mt-auto flex flex-col gap-2">
        <Button onClick={onAddToSet} className="w-full">
          + 세트에 추가
        </Button>
        <Button onClick={onDownloadPng} variant="secondary" disabled={isDownloadingPng} className="w-full">
          {isDownloadingPng ? '저장 중...' : '⬇ PNG 다운로드'}
        </Button>
      </div>
    </div>
  )
}
