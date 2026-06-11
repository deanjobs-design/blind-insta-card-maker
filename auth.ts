import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

// 허용 도메인 (회사 이메일만 로그인 가능). 환경변수로 덮어쓸 수 있음.
const ALLOWED_DOMAINS = (process.env.ALLOWED_EMAIL_DOMAINS || 'teamblind.com')
  .split(',')
  .map(d => d.trim().toLowerCase())
  .filter(Boolean)

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [Google],
  callbacks: {
    // 회사 도메인 계정만 로그인 허용
    async signIn({ profile }) {
      const email = (profile?.email || '').toLowerCase()
      const hd = (profile?.hd as string | undefined)?.toLowerCase()
      const emailDomain = email.split('@')[1]
      const ok =
        (hd && ALLOWED_DOMAINS.includes(hd)) ||
        (emailDomain && ALLOWED_DOMAINS.includes(emailDomain))
      return Boolean(ok)
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
})
