import Link from "next/link";
import BestMark from "@/components/BestMark";

type Crumb = { label: string; href?: string };
export type HeroDevice = { src: string; name: string; type: string };
export type SubTab = { href: string; label: string; best?: boolean };

// 하위 페이지 공통 틀 (메인과 같은 톤)
// - 위: 사진 전체 화면 폭, 아래쪽 어둡게, 왼쪽 아래에 위치 · 영문 · 제목 · 설명
// - 탭: 같은 분류의 다른 페이지 (스크롤해도 메뉴바 바로 아래에 붙어 있음, 지금 페이지는 골드 밑줄)
// - 본문: 둥근 모서리로 사진 위를 덮으며 올라옴
export default function SubPage({
  en,
  title,
  description,
  image,
  device,
  scene,
  facts = [],
  crumbs = [],
  tabs,
  current,
  children,
}: {
  en: string;
  title: string;
  description?: string;
  image: string;
  /** 장비 시술: 사진 대신 아치 배경 + 장비 (배경 없는 제품 사진) */
  device?: HeroDevice;
  /** 밝은 시술 장면 사진 (왼쪽이 빈 벽인 가로 사진): 왼쪽 글자 · 오른쪽 장면 */
  scene?: string;
  /** 밝은 첫 화면 아래 핵심 정보 (앞 3개) */
  facts?: { label: string; value: string }[];
  crumbs?: Crumb[];
  tabs?: SubTab[];
  /** 지금 페이지 주소 (탭 표시용) */
  current?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="sticky top-0">
        {scene ? (
          <SceneHero
            en={en}
            title={title}
            description={description}
            scene={scene}
            facts={facts}
            crumbs={crumbs}
          />
        ) : device ? (
          <DeviceHero
            en={en}
            title={title}
            description={description}
            device={device}
            facts={facts}
            crumbs={crumbs}
          />
        ) : (
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
        )}
      </div>

      <div
        data-hero-end
        className="relative z-10 -mt-8 overflow-clip rounded-t-[28px] bg-white md:-mt-12 md:rounded-t-[48px]"
      >
        {tabs && tabs.length > 1 && (
          <nav
            aria-label="같은 분류의 페이지"
            className="sub-tabs sticky z-20 border-b border-line bg-white/90 backdrop-blur-md"
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

// 장비 시술 첫 화면: 밝은 배경 · 은은한 조명 · 아치 위 장비 (메뉴바는 투명 + 검정 글자)
function DeviceHero({
  en,
  title,
  description,
  device,
  facts,
  crumbs,
}: {
  en: string;
  title: string;
  description?: string;
  device: HeroDevice;
  facts: { label: string; value: string }[];
  crumbs: Crumb[];
}) {
  const ease = "cubic-bezier(.22,1,.36,1)";
  return (
    <section
      data-dark-hero
      data-light-hero
      className="relative h-[82svh] min-h-[620px] overflow-hidden bg-[#ece5da] text-ink md:h-[80svh] md:min-h-[640px]"
    >
      {/* 조명: 장비 쪽이 밝고 가장자리는 따뜻하게 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,#fcfaf6_0,#f2ece2_40%,#e3d8c8_100%)] max-md:bg-[radial-gradient(ellipse_at_70%_28%,#fcfaf6_0,#f2ece2_40%,#e3d8c8_100%)]" />
      {/* 아치 + 장비 */}
      <div className="absolute top-20 right-[-6%] h-[41%] w-[64%] md:top-auto md:right-[8%] md:bottom-0 md:h-[86%] md:w-auto md:aspect-[0.66] xl:right-[12%]">
        <div
          className="absolute inset-x-[6%] top-[6%] bottom-0 origin-bottom rounded-t-full bg-[linear-gradient(180deg,#fffdf9,#f1e9dc_70%,#e9dfcf)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.9),0_40px_90px_-50px_rgba(90,60,30,0.45)] max-md:inset-x-[14%] max-md:[mask-image:linear-gradient(180deg,#000_45%,transparent_92%)]"
          style={{ animation: `arch-rise 1.4s ${ease} both` }}
        />
        {/* 바닥 그림자 */}
        <div className="absolute bottom-[8%] left-1/2 h-[4%] w-[52%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(60,40,20,0.28),transparent)] max-md:hidden" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={device.src}
          alt={`${device.name} 장비`}
          fetchPriority="high"
          className="absolute bottom-[9%] left-1/2 h-[82%] w-auto max-w-none -translate-x-1/2 drop-shadow-[0_24px_30px_rgba(60,40,20,0.18)] max-md:bottom-0 max-md:h-[96%]"
          style={{ animation: `fade-up 1.3s ${ease} 0.35s both` }}
        />
        {/* 장비 이름표 */}
        <div
          className="absolute top-[34%] left-[-34%] hidden rounded-2xl border border-white/80 bg-white/55 px-5 py-4 shadow-[0_20px_50px_-30px_rgba(60,40,20,0.5)] backdrop-blur-md lg:block"
          style={{ animation: `slide-in 1.1s ${ease} 0.9s both` }}
        >
          <p className="font-display text-[10px] tracking-[0.3em] text-gold uppercase">
            Device
          </p>
          <p className="mt-1.5 font-display text-lg tracking-[0.04em]">
            {device.name}
          </p>
          <p className="mt-0.5 text-xs text-muted">{device.type}</p>
        </div>
      </div>

      <LightHeroText
        en={en}
        title={title}
        description={description}
        facts={facts}
        crumbs={crumbs}
      />
    </section>
  );
}

// 밝은 첫 화면 공통 글자
// - 위치(메뉴바 아래, 작게) → 금색 선 · 영문 → 큰 한글 제목 → 설명 → 상담 예약 · 비용 바로가기
function LightHeroText({
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
                <span aria-hidden className="h-px w-3 bg-ink/25" />
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
          className="flex items-center gap-3 font-display text-xs font-light tracking-[0.4em] text-gold uppercase md:text-[13px]"
          style={{ animation: `slide-in 1s ${ease} 0.3s both` }}
        >
          <span aria-hidden className="h-px w-10 bg-gold/70" />
          {en}
        </p>
        <h1
          className="mt-4 text-[38px] leading-[1.15] font-light tracking-[-0.04em] md:mt-5 md:text-[60px] 2xl:text-[72px]"
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

// 시술 장면 첫 화면: 밝은 벽 사진 (오른쪽에 원장 · 장비), 왼쪽은 사진 벽색으로 자연스럽게 이어지고 그 위에 글자
// 넓은 화면: 사진과 같은 가로 비율(3:1) + 메뉴바 높이, 사진은 메뉴바 아래부터 꽉 차고 왼쪽 벽 위에 글자 / 좁은 화면: 위에 사진, 아래 글자
function SceneHero({
  en,
  title,
  description,
  scene,
  facts,
  crumbs,
}: {
  en: string;
  title: string;
  description?: string;
  scene: string;
  facts: { label: string; value: string }[];
  crumbs: Crumb[];
}) {
  return (
    <section
      data-dark-hero
      data-light-hero
      className="relative h-[82svh] min-h-[620px] overflow-hidden bg-[linear-gradient(180deg,#efebe7,#e3ded9_55%,#d8d2cb)] text-ink xl:h-[calc(33.34vw+132px)] xl:min-h-0"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={scene}
        alt={`${title} 시술 장면`}
        fetchPriority="high"
        className="absolute inset-x-0 top-0 h-[58%] w-full animate-[hero-settle_2.4s_cubic-bezier(.22,1,.36,1)_both] object-cover object-[74%_center] [mask-image:linear-gradient(180deg,#000_70%,transparent)] xl:top-[84px] xl:h-auto xl:[mask-image:linear-gradient(180deg,transparent,#000_12%)]"
      />
      {/* 넓은 화면: 글자 쪽(왼쪽)을 벽색으로 살짝 덮어 잘 읽히게 */}
      <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(236,232,227,0.7),rgba(236,232,227,0.35)_24%,transparent_40%)] xl:block" />
      <LightHeroText
        en={en}
        title={title}
        description={description}
        facts={facts}
        crumbs={crumbs}
        className="xl:ml-[9vw] xl:max-w-[36%]"
        wrap="xl:justify-center xl:pt-32 xl:pb-20"
      />
    </section>
  );
}
