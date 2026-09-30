import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { sitemap } from "@/content/sitemap";

// 없는 페이지: 큰 404 + 자주 찾는 곳 바로가기
export default function NotFound() {
  const quick = [
    { href: "/", label: "홈" },
    ...sitemap
      .filter((s) => s.treatment)
      .map((s) => ({ href: s.href, label: s.label })),
    { href: "/location", label: "오시는 길" },
  ];
  return (
    <section className="flex min-h-[80svh] items-center px-5 pt-32 pb-24 md:px-10">
      <div className="mx-auto w-full max-w-[1100px]">
        <p className="font-display text-xs tracking-[0.35em] text-gold uppercase">
          Page not found
        </p>
        <p className="mt-6 font-display text-[96px] leading-none font-extralight tracking-[-0.02em] text-ink md:text-[160px]">
          404
        </p>
        <h1 className="mt-6 text-[24px] font-semibold tracking-[-0.03em] md:text-[32px]">
          찾으시는 페이지가 없습니다.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          주소가 바뀌었거나 삭제된 페이지일 수 있습니다. 아래에서 원하시는
          곳으로 이동해 주세요.
        </p>
        <ul className="mt-12 flex flex-wrap gap-2.5">
          {quick.map((q) => (
            <li key={q.href}>
              <Link
                href={q.href}
                className="group inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm transition hover:border-gold hover:bg-ivory"
              >
                {q.label}
                <ArrowRight
                  className="h-3.5 w-3.5 text-muted transition group-hover:text-gold"
                  strokeWidth={1.6}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
