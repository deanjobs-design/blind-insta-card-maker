import { auth } from '@/auth'
import { NextResponse } from 'next/server'

// 로그인하지 않은 사용자는 /login으로 리다이렉트
export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  // 인증 관련 경로와 로그인 페이지는 항상 허용
  const isPublic =
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/auth')

  if (!isLoggedIn && !isPublic) {
    const loginUrl = new URL('/login', req.nextUrl.origin)
    return NextResponse.redirect(loginUrl)
  }

  // 로그인 상태에서 /login 접근 시 메인으로
  if (isLoggedIn && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/', req.nextUrl.origin))
  }

  return NextResponse.next()
})

export const config = {
  // 정적 파일/이미지 제외한 모든 경로 보호
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets).*)'],
}
