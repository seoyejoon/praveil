import type { MetadataRoute } from "next";
import { sitemap as pages } from "@/content/sitemap";
import { isOpen } from "@/lib/preview-lock";
import { SITE_URL as base } from "@/lib/site-url";

// 검색엔진에 알려 줄 주소 목록: 메뉴(사이트맵)의 모든 페이지 + 전후사진 · 약관
export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = new Set([
    "",
    ...pages.flatMap((s) => s.pages.map((p) => p.href.split("?")[0])),
    "/before-after",
    "/terms",
    "/privacy",
  ]);
  // 컨펌 기간에는 공개 중인 페이지만 (준비 중 페이지는 검색엔진에 알리지 않음)
  return [...paths]
    .filter((path) => isOpen(path))
    .map((path) => ({ url: `${base}${path}` }));
}
