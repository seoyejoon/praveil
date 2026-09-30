import Link from "next/link";
import BestMark from "@/components/BestMark";

type Crumb = { label: string; href?: string };
export type SubTab = { href: string; label: string; best?: boolean };

// 하위 페이지 공통 틀 (메인과 같은 톤)
// - 위: 사진 전체 화면 폭, 아래쪽 어둡게, 왼쪽 아래에 위치 · 영문 · 제목 · 설명
// - 탭: 같은 분류의 다른 페이지 (스크롤해도 위에 붙어 있음, 지금 페이지는 골드 밑줄)
// - 본문: 둥근 모서리로 사진 위를 덮으며 올라옴
export default function SubPage({
  en,
  title,
  description,
  image,
  crumbs = [],
  tabs,
  current,
  children,
}: {
  en: string;
  title: string;
  description?: string;
  image: string;
  crumbs?: Crumb[];
  tabs?: SubTab[];
  /** 지금 페이지 주소 (탭 표시용) */
  current?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="sticky top-0">
        <section
          data-dark-hero
          className="relative h-[60svh] min-h-[420px] overflow-hidden bg-[#1f1b18] text-white md:h-[72svh] md:min-h-[560px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            fetchPriority="high"
            className="absolute inset-0 h-full w-full animate-[hero-settle_2.4s_cubic-bezier(.22,1,.36,1)_both] object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,19,15,0.45),rgba(24,19,15,0.15)_35%,rgba(24,19,15,0.75))]" />
          <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-16 md:px-10 md:pb-24">
            {crumbs.length > 0 && (
              <nav
                aria-label="현재 위치"
                className="flex animate-[slide-in_1s_cubic-bezier(.22,1,.36,1)_0.2s_both] items-center gap-2 text-xs text-white/55"
              >
                <Link href="/" className="hover:text-white">
                  HOME
                </Link>
                {crumbs.map((c) => (
                  <span key={c.label} className="flex items-center gap-2">
                    <span aria-hidden className="h-px w-3 bg-white/35" />
                    {c.href ? (
                      <Link href={c.href} className="hover:text-white">
                        {c.label}
                      </Link>
                    ) : (
                      <span className="text-white/85">{c.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            )}
            <p className="mt-8 animate-[slide-in_1s_cubic-bezier(.22,1,.36,1)_0.3s_both] font-display text-[11px] font-light tracking-[0.4em] text-[#f1e2c6] uppercase md:text-xs">
              {en}
            </p>
            <h1 className="mt-4 animate-[slide-in_1.1s_cubic-bezier(.22,1,.36,1)_0.4s_both] text-[34px] leading-tight font-light tracking-[-0.03em] md:text-[56px] 2xl:text-[64px]">
              {title}
            </h1>
            {description && (
              <p className="mt-4 max-w-xl animate-[slide-in_1s_cubic-bezier(.22,1,.36,1)_0.55s_both] text-sm leading-relaxed text-white/70 md:text-base">
                {description}
              </p>
            )}
          </div>
        </section>
      </div>

      <div className="relative z-10 -mt-8 overflow-clip rounded-t-[28px] bg-white md:-mt-12 md:rounded-t-[48px]">
        {tabs && tabs.length > 1 && (
          <nav
            aria-label="같은 분류의 페이지"
            className="sticky top-0 z-20 border-b border-line bg-white/90 backdrop-blur-md"
          >
            <ul className="no-scrollbar mx-auto flex max-w-[1600px] gap-8 overflow-x-auto px-5 whitespace-nowrap md:justify-center md:gap-14 md:px-10">
              {tabs.map((t) => {
                const on = t.href === current;
                return (
                  <li key={t.href}>
                    <Link
                      href={t.href}
                      aria-current={on ? "page" : undefined}
                      className={`relative flex items-center gap-1.5 py-5 text-[15px] transition md:py-6 md:text-base ${on ? "font-semibold text-ink" : "text-muted hover:text-ink"}`}
                    >
                      {t.label}
                      {t.best && <BestMark />}
                      <span
                        className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gold transition-[scale] duration-500 ${on ? "scale-x-100" : "scale-x-0"}`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
        {children}
      </div>
    </div>
  );
}
