import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "준비 중입니다",
  robots: { index: false, follow: false },
};

// 컨펌 기간: 아직 공개하지 않은 페이지는 모두 이 화면으로 (src/middleware.ts)
export default function Preparing() {
  const quick = [
    { href: "/", label: "홈" },
    { href: "/lifting/coolsonic", label: "쿨소닉" },
    { href: "/notice", label: "공지사항" },
    { href: "/before-after", label: "전후사진" },
  ];
  return (
    <section className="flex min-h-[80svh] items-center px-5 pt-32 pb-24 md:px-10">
      <div className="mx-auto w-full max-w-[1100px]">
        <p className="font-display text-xs tracking-[0.35em] text-gold uppercase">
          Coming soon
        </p>
        <h1 className="mt-6 text-[30px] leading-snug font-semibold tracking-[-0.03em] md:text-[44px]">
          페이지를 준비하고 있습니다.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted md:text-[17px]">
          더 정확하고 알찬 내용으로 곧 찾아뵙겠습니다.
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
