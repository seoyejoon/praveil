import Link from "next/link";

export type Crumb = { label: string; href?: string };

// 밝은 첫 화면 공통 글자
// - 위치(메뉴바 아래, 작게) → 금색 선 · 영문 → 큰 한글 제목 → 설명 → 상담 예약 · 비용 바로가기
export default function LightHeroText({
  en,
  title,
  description,
  facts,
  crumbs,
  className = "md:max-w-[50%]",
  wrap = "",
}: {
  en: string;
  title: string;
  description?: string;
  facts: { label: string; value: string }[];
  crumbs: Crumb[];
  className?: string;
  /** 바깥 틀에 더할 클래스 (세로 위치 등) */
  wrap?: string;
}) {
  const ease = "cubic-bezier(.22,1,.36,1)";
  return (
    <div
      className={`relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-16 md:px-10 md:pb-24 ${wrap}`}
    >
      <div className={className}>
        {crumbs.length > 0 && (
          <nav
            aria-label="현재 위치"
            className="mb-7 hidden flex-wrap items-center gap-2 text-xs text-muted md:flex"
            style={{ animation: `fade-up 1s ${ease} 0.2s both` }}
          >
            <Link href="/" className="hover:text-ink">
              HOME
            </Link>
            {crumbs.map((c) => (
              <span key={c.label} className="flex items-center gap-2">
                <span aria-hidden className="text-ink/30">/</span>
                {c.href ? (
                  <Link href={c.href} className="hover:text-ink">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-ink/80">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <p
          className="font-display text-xs font-light tracking-[0.4em] text-gold uppercase md:text-[13px]"
          style={{ animation: `slide-in 1s ${ease} 0.3s both` }}
        >
          {en}
        </p>
        <h1
          className="mt-4 text-[38px] leading-[1.15] font-semibold tracking-[-0.04em] md:mt-5 md:text-[60px] 2xl:text-[72px]"
          style={{ animation: `slide-in 1.1s ${ease} 0.4s both` }}
        >
          {title}
        </h1>
        {description && (
          <p
            className="mt-3 text-[15px] leading-relaxed text-ink/70 md:mt-5 md:text-lg"
            style={{ animation: `slide-in 1s ${ease} 0.55s both` }}
          >
            {description}
          </p>
        )}
        {/* 바로가기: 상담 예약 · 비용 (시술 페이지 아래 구역) */}
        <div
          className="mt-7 flex flex-wrap gap-2.5 md:mt-10 md:gap-3"
          style={{ animation: `fade-up 1s ${ease} 0.75s both` }}
        >
          <a
            href="#visit"
            className="group inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm text-white transition hover:bg-gold md:h-12 md:px-7"
          >
            상담 예약
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </a>
          <a
            href="#price"
            className="inline-flex h-11 items-center rounded-full border border-ink/20 bg-white/40 px-6 text-sm backdrop-blur-sm transition hover:border-ink md:h-12 md:px-7"
          >
            시술 비용
          </a>
        </div>
        {facts.length > 0 && (
          <dl
            className="mt-7 grid max-w-md grid-cols-3 border-t border-ink/10 pt-5 md:mt-10"
            style={{ animation: `fade-up 1s ${ease} 0.75s both` }}
          >
            {facts.slice(0, 3).map((f, i) => (
              <div
                key={f.label}
                className={i > 0 ? "border-l border-ink/10 pl-4" : "pr-4"}
              >
                <dt className="text-[11px] text-muted">{f.label}</dt>
                <dd className="mt-1 text-[13px] font-medium md:text-sm">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}
