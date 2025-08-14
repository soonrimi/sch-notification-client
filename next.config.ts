import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Static export 설정 (GitHub Actions에서 out 폴더 생성용)
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },

  // TypeScript 설정
  typescript: {
    // 빌드 시 타입 에러를 무시하지 않음
    ignoreBuildErrors: false,
  },

  // ESLint 설정
  eslint: {
    // 빌드 시 ESLint 에러를 무시하지 않음
    ignoreDuringBuilds: false,
  },

  // 실험적 기능 (필요시)
  experimental: {
    // CSS 모듈 최적화
    optimizePackageImports: [
      "@mui/material",
      "@emotion/react",
      "@emotion/styled",
    ],
  },
}

export default nextConfig
