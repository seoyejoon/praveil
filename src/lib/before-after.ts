import { sitemap } from "@/content/sitemap";
import type { BeforeAfterCase } from "@/lib/data";

// 관리자 '분류' 글자를 시술 분야(사이트맵)와 맞춤: "여드름 · 모공" = "여드름·모공" = "acne-pore"
const norm = (s: string) => s.replace(/[\s·・,/]/g, "").toLowerCase();

export const baCategories = sitemap
  .filter((s) => s.treatment)
  .map((s) => ({ key: s.key, label: s.label, href: s.href }));

export function withCategoryKey(c: BeforeAfterCase): BeforeAfterCase {
  const n = norm(c.category);
  const hit = baCategories.find(
    (x) =>
      norm(x.label) === n ||
      x.key === n ||
      sitemap
        .find((s) => s.key === x.key)!
        .pages.some((p) => norm(p.label) === n),
  );
  return { ...c, category: hit?.key ?? c.category };
}
