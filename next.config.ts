import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 서버에는 빌드 결과물만 올린다 (2GB 서버에서 빌드하지 않음)
  output: "standalone",
  // 서버에서 실시간 이미지 변환을 하지 않는다 (메모리 절약)
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
