/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // 기존 svg 처리 rule 제거
    const fileLoaderRule = config.module.rules.find((rule) => {
      if (!rule.test) return false;
      if (rule.test instanceof RegExp) {
        return rule.test.test('.svg');
      }
      if (typeof rule.test === 'function') {
        return rule.test('.svg');
      }
      return false;
    });

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    // svg를 React 컴포넌트로 불러오도록 새 규칙 추가
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

module.exports = nextConfig;
