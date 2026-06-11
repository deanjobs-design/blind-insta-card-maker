'use client'
import { useEffect, useState } from 'react'

// 허용 도메인 (이 도메인 이메일만 통과)
const ALLOWED_DOMAIN = 'teamblind.com'
const STORAGE_KEY = 'access_ok'

export function AccessGate({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null) // null = 확인 중
  const [email, setEmail] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    setAuthorized(localStorage.getItem(STORAGE_KEY) === 'true')
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const ok = email.trim().toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`)
    if (ok) {
      localStorage.setItem(STORAGE_KEY, 'true')
      setAuthorized(true)
    } else {
      setError(true)
    }
  }

  // 확인 중에는 아무것도 그리지 않음 (깜빡임 방지)
  if (authorized === null) return null

  if (!authorized) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm p-10 w-full max-w-sm flex flex-col gap-5"
        >
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">블라인드 SNS 카드 메이커</h1>
            <p className="text-sm text-gray-400 mt-2">
              회사 이메일로 입장하세요
            </p>
          </div>

          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(false) }}
            placeholder="회사 이메일을 입력하세요"
            autoFocus
            className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error && (
            <p className="text-sm text-red-500 text-center">
              입장할 수 없는 이메일이에요.
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            입장하기
          </button>
        </form>
      </main>
    )
  }

  return <>{children}</>
}
