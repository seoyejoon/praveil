import type { MetadataRoute } from "next";
import { getCategories, getProcedures } from "@/lib/data";

const base = "https://praveil.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, procedures] = await Promise.all([getCategories(), getProcedures()]);
  return [
    ...["", "/about", "/treatments", "/notice", "/location"].map((path) => ({ url: `${base}${path}` })),
    ...categories.map((c) => ({ url: `${base}/treatments/${c.slug}` })),
    ...procedures.map((p) => ({ url: `${base}/treatments/${p.categorySlug}/${p.slug}` })),
  ];
}
