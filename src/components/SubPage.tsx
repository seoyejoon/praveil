import Link from "next/link";
import BestMark from "@/components/BestMark";
import LightHeroText, { type Crumb } from "@/components/sub/LightHeroText";
import SceneHero, { type HeroScene } from "@/components/sub/SceneHero";

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
  scene?: HeroScene;
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
        className="relative z-10 -mt-8 overflow-clip rounded-t-[28px] bg-white shadow-[0_-18px_40px_-24px_rgba(40,30,20,0.18)] md:-mt-12 md:rounded-t-[48px]"
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
