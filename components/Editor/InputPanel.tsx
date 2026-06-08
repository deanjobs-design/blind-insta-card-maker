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
      <Button onClick={onAddToSet} className="mt-auto w-full">
        + 세트에 추가
      </Button>
    </div>
  )
}
