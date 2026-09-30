import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 서버에는 빌드 결과물만 올린다 (2GB 서버에서 빌드하지 않음)
  output: "standalone",
  // 서버에서 실시간 이미지 변환을 하지 않는다 (메모리 절약)
  images: { unoptimized: true },
  poweredByHeader: false,
  // 예전 시술 주소(/treatments/…)로 들어오면 새 시술 페이지로 보냄 (검색엔진에도 '영구 이동'으로 알림)
  // 새 사이트맵에 없는 분류(색소 · 토닝, 피부관리, 주사)는 옮길 곳이 정해지면 추가
  async redirects() {
    const to = (source: string, destination: string) => ({ source, destination, permanent: true });
    return [
      to("/treatments", "/lifting/coolsonic"),
      to("/treatments/lifting", "/lifting/coolsonic"),
      to("/treatments/lifting/coolsonic", "/lifting/coolsonic"),
      to("/treatments/lifting/coolphase", "/lifting/coolphase"),
      to("/treatments/lifting/thread-lifting", "/lifting/thread"),
      to("/treatments/lifting/:slug", "/lifting/laser"),
      to("/treatments/botox/:slug*", "/petit/botox"),
      to("/treatments/filler/:slug*", "/petit/filler"),
      to("/treatments/skin-booster/retuo", "/skin/retuo"),
      to("/treatments/skin-booster/juvelook-skin", "/skin/collagen"),
      to("/treatments/skin-booster/ultracol", "/skin/collagen"),
      to("/treatments/skin-booster/:slug*", "/skin/booster"),
      to("/treatments/scar-pore/:slug*", "/acne-pore"),
      to("/treatments/acne/:slug*", "/acne-pore"),
      to("/treatments/hair-removal/:slug*", "/removal/hair"),
      to("/treatments/tattoo-removal/:slug*", "/removal/tattoo"),
    ];
  },
};

export default nextConfig;
