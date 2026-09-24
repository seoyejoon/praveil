import Link from "next/link";
import type { ProcedureCategory } from "@/lib/data";

export default function CategoryTabs({ categories, active }: { categories: ProcedureCategory[]; active?: string }) {
  return (
    <nav className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
      <ul className="flex gap-2 whitespace-nowrap md:flex-wrap md:justify-center">
        <li>
          <Link
            href="/treatments"
            className={`block rounded-full border px-4 py-2 text-sm ${!active ? "border-espresso bg-espresso text-ivory" : "border-line hover:border-taupe"}`}
          >
            전체
          </Link>
        </li>
        {categories.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/treatments/${c.slug}`}
              className={`block rounded-full border px-4 py-2 text-sm ${active === c.slug ? "border-espresso bg-espresso text-ivory" : "border-line hover:border-taupe"}`}
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
