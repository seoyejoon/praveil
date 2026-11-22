import type { MetadataRoute } from "next";
import { sitemap as pages } from "@/content/sitemap";
import { isOpen } from "@/lib/preview-lock";
import { getNotices, getWebsiteInfo } from "@/lib/data";
import { postHref } from "@/lib/notice";
import { SITE_URL as base } from "@/lib/site-url";

// 검색엔진에 알려 줄 주소 목록: 메뉴(사이트맵)의 모든 페이지 + 전후사진 · 약관
// 공지 글은 DB에서 읽으므로 빌드 때가 아니라 요청 때 만든다 (DB 조회는 source-db.ts 에서 캐시)
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 관리자 > 웹사이트 정보에서 사이트맵을 끄면 주소 목록을 알리지 않는다
  if (!(await getWebsiteInfo()).sitemapEnabled) return [];
  const paths = new Set([
    "",
    ...pages.flatMap((s) =>
      s.pages.map((p) =>
        p.href === "/notice?type=notice" ? "/notice" : p.href,
      ),
    ),
    "/before-after",
    "/terms",
    "/privacy",
    ...(await getNotices()).map((n) => postHref(n)),
  ]);
  // 컨펌 기간에는 공개 중인 페이지만 (준비 중 페이지는 검색엔진에 알리지 않음)
  return [...paths]
    .filter((path) => isOpen(new URL(path || "/", base).pathname))
    .map((path) => ({ url: `${base}${path}` }));
}
