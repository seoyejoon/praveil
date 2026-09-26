import type { MetadataRoute } from "next";
import { getCategories, getProcedures } from "@/lib/data";
import { SITE_URL as base } from "@/lib/site-url";

// 관리자에서 시술을 추가 · 숨김하면 사이트맵에도 반영되도록 1시간마다 새로 만든다.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, procedures] = await Promise.all([getCategories(), getProcedures()]);
  return [
    ...["", "/about/philosophy", "/about/doctor", "/about/why", "/about/tour", "/about/equipment", "/treatments", "/notice", "/location", "/terms", "/privacy"].map((path) => ({ url: `${base}${path}` })),
    ...categories.map((c) => ({ url: `${base}/treatments/${c.slug}` })),
    ...procedures.map((p) => ({ url: `${base}/treatments/${p.categorySlug}/${p.slug}` })),
  ];
}
