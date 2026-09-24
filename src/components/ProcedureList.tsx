import Link from "next/link";
import type { Procedure } from "@/lib/data";
import Reveal from "./Reveal";

// 시술 목록 (번호 · 이름 · 화살표)
export default function ProcedureList({ procedures, columns = 2 }: { procedures: Procedure[]; columns?: 1 | 2 }) {
  return (
    <ul className={`grid border-t border-ink/15 ${columns === 2 ? "md:grid-cols-2 md:gap-x-12" : ""}`}>
      {procedures.map((p, i) => (
        <Reveal as="li" key={p.slug} delay={(i % 4) * 60} className="border-b border-ink/15">
          <Link href={`/treatments/${p.categorySlug}/${p.slug}`} className="group flex items-center gap-4 py-5 md:py-6">
            <span className="w-7 shrink-0 font-display text-xs text-taupe">{String(i + 1).padStart(2, "0")}</span>
            <span className="flex-1 font-serif text-lg font-medium transition-transform duration-500 group-hover:translate-x-1.5 md:text-xl">
              {p.name}
              {p.isSignature && (
                <span className="ml-2 rounded-full border border-gold/60 px-2 py-0.5 align-middle font-sans text-[10px] text-gold">
                  대표
                </span>
              )}
            </span>
            <span aria-hidden className="text-taupe transition group-hover:translate-x-1 group-hover:text-ink">
              →
            </span>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}
