import Link from "next/link";

type Crumb = { label: string; href?: string };

// 하위 페이지 공통 틀
// 상단 사진 영역은 제자리에 두고, 본문이 둥근 모서리로 위를 덮으며 올라온다 (메인과 같은 방식)
export default function SubPage({
  en,
  title,
  description,
  image,
  crumbs = [],
  children,
}: {
  en: string;
  title: string;
  description?: string;
  image: string;
  crumbs?: Crumb[];
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="sticky top-0">
        <section
          data-dark-hero
          className="relative h-[58svh] min-h-[400px] overflow-hidden bg-[#1f1b18] text-white md:h-[68svh] md:min-h-[520px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" fetchPriority="high" className="animate-hero-zoom absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[#1f1b18]/50" />
          <div className="relative flex h-full flex-col items-center justify-center px-5 pt-10 text-center">
            <p className="animate-rise font-display text-base tracking-[0.15em] text-[#ffd899] md:text-lg">{en}</p>
            <h1 className="animate-rise mt-4 font-serif text-[30px] leading-snug font-medium tracking-[-0.03em] [animation-delay:150ms] md:text-5xl">
              {title}
            </h1>
            {description && (
              <p className="animate-rise mt-4 max-w-xl text-sm leading-relaxed text-cream/80 [animation-delay:300ms] md:text-base">
                {description}
              </p>
            )}
            {crumbs.length > 0 && (
              <nav
                aria-label="현재 위치"
                className="animate-rise mt-8 flex items-center gap-2 text-xs text-cream/60 [animation-delay:450ms]"
              >
                <Link href="/" className="hover:text-cream">
                  HOME
                </Link>
                {crumbs.map((c) => (
                  <span key={c.label} className="flex items-center gap-2">
                    <span aria-hidden>/</span>
                    {c.href ? (
                      <Link href={c.href} className="hover:text-cream">
                        {c.label}
                      </Link>
                    ) : (
                      <span className="text-cream">{c.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            )}
          </div>
        </section>
      </div>
      <div className="relative z-10 -mt-8 overflow-clip rounded-t-[28px] bg-cream md:-mt-12 md:rounded-t-[56px]">{children}</div>
    </div>
  );
}
