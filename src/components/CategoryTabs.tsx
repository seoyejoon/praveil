import Link from "next/link";
import type { ProcedureCategory } from "@/lib/data";

// 시술 카테고리 탭. 스크롤해도 헤더 아래에 붙어 있다
export default function CategoryTabs({ categories, active }: { categories: ProcedureCategory[]; active?: string }) {
  const tabs = [{ slug: "", name: "전체", href: "/treatments" }, ...categories.map((c) => ({ ...c, href: `/treatments/${c.slug}` }))];

  return (
    <nav className="sticky top-16 z-20 border-b border-line bg-cream/95 backdrop-blur md:top-20">
      <ul className="no-scrollbar mx-auto flex max-w-[1440px] gap-7 overflow-x-auto px-5 whitespace-nowrap md:gap-9 md:px-10">
        {tabs.map((t) => {
          const on = (active ?? "") === t.slug;
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                aria-current={on ? "page" : undefined}
                className={`relative block py-5 text-[15px] transition ${on ? "text-ink" : "text-muted hover:text-ink"}`}
              >
                {t.name}
                <span
                  className={`absolute inset-x-0 bottom-0 h-0.5 bg-gold transition-transform duration-500 ${on ? "scale-x-100" : "scale-x-0"}`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
