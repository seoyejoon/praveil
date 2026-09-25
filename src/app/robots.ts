import type { MetadataRoute } from "next";
import { isPreviewHost, SITE_URL } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  // 임시 확인용(Vercel)에서는 검색엔진 수집을 막는다
  if (isPreviewHost) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
