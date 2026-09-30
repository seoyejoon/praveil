import type { MetadataRoute } from "next";
import { sitemap as pages } from "@/content/sitemap";
import { SITE_URL as base } from "@/lib/site-url";

// 검색엔진에 알려 줄 주소 목록: 메뉴(사이트맵)의 모든 페이지 + 전후사진 · 약관
export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = new Set([
    "",
    ...pages.flatMap((s) => s.pages.map((p) => p.href.split("?")[0])),
    "/about/why",
    "/about/tour",
    "/about/equipment",
    "/before-after",
    "/terms",
    "/privacy",
  ]);
  return [...paths].map((path) => ({ url: `${base}${path}` }));
}
