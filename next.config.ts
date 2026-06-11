import type { NextConfig } from "next";

const securityHeaders = [
  // 클릭재킹 방지 (iframe 임베드 차단)
  { key: "X-Frame-Options", value: "DENY" },
  // MIME 스니핑 방지
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Referrer 정보 최소화
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // HTTPS 강제 (HSTS) — Vercel은 HTTPS 제공
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // 불필요한 브라우저 기능 차단
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // 콘텐츠 보안 정책 — 자체 리소스 + 인라인 스타일 허용, data/blob 이미지 허용
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "img-src 'self' data: blob:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // 기술스택 정보 노출 헤더 제거 (X-Powered-By)
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
