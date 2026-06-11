import type { Metadata } from 'next'
import { Rethink_Sans } from 'next/font/google'
import './globals.css'
import { AccessGate } from '@/components/AccessGate'

const rethinkSans = Rethink_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-rethink-sans',
})

export const metadata: Metadata = {
  title: '블라인드 SNS 카드 메이커',
  description: '인스타그램 카드 템플릿 자동화',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={rethinkSans.variable}>
        <AccessGate>{children}</AccessGate>
      </body>
    </html>
  )
}
