"use client";

import { useEffect, useRef } from "react";
import LightHeroText, { type Crumb } from "@/components/sub/LightHeroText";

export type HeroScene = {
  /** 사진 (영상이 있으면 영상 첫 장면 · 영상을 못 틀 때 대신 보임) */
  src: string;
  /** 장비 원본을 자르지 않고 같은 첫 화면 틀 안에 표시 */
  imageLayout?: "device";
  /** 시술 장면이 아닌 사진은 실제 내용을 설명 */
  alt?: string;
  /** 짧은 반복 영상 (소리 없음, 사진과 같은 구도 3:1) */
  video?: string;
  /** 모바일 전용 세로형 사진 (원장 · 장비가 한 화면에) */
  mobileSrc?: string;
  /** 세로 화면에서 새 원본의 얼굴 · 손 · 접촉 부위를 기준으로 위치를 조정 */
  mobilePosition?: string;
  /** 핸드피스가 피부에 닿는 자리 (사진 속 %, [가로, 세로]) — 여기서 초음파 파장이 피부 쪽으로 퍼짐 */
  pulse?: [number, number];
  /** PC 사진 위치 (object-position, 기본 "92% center") */
  position?: string;
  /** 3:1보다 세로가 긴 원본은 태블릿부터 높이에 맞춰 오른쪽에 배치해 얼굴 · 시술 부위를 보존 */
  desktopFit?: "contain";
  /** 사진 위 유리 카드 (x: 카드 오른쪽 끝, y: 카드 위 · 사진 속 %, 1280px~) */
  chips?: { x: number; y: number; en: string; label: string }[];
  /** 병원 원본 사진: 글자와 사진을 분리하고 확대 · 마스크 없이 전체 구도를 표시 */
  photoLayout?: "full-frame";
  photoAlt?: string;
  photoAspect?: "portrait-mobile";
};

// 시술 장면 첫 화면: 밝은 벽 사진 (오른쪽에 원장 · 장비), 왼쪽 벽 위에 글자
// - 넓은 화면(1024~): 사진과 같은 가로 비율(3:1) + 메뉴바 높이, 사진은 메뉴바 아래부터 꽉 차게
// - 좁은 화면: 위에 사진, 아래 글자
// 움직임
// - 스크롤: 사진은 천천히 다가오고, 글자는 위로 사라짐
export default function SceneHero({
  en,
  title,
  description,
  scene,
  facts,
  crumbs,
  switcher,
}: {
  en: string;
  title: string;
  description?: string;
  scene: HeroScene;
  facts: { label: string; value: string }[];
  crumbs: Crumb[];
  switcher?: React.ReactNode;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const text = textRef.current;
    if (!root || !stage || !text) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const p = Math.min(1, Math.max(0, window.scrollY / root.offsetHeight));
        stage.style.transform = `translate3d(0, ${-p * 30}px, 0) scale(${1 + p * 0.08})`;
        text.style.transform = `translate3d(0, ${-p * 70}px, 0)`;
        text.style.opacity = String(Math.max(0, 1 - p * 1.6));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (scene.photoLayout === "full-frame") {
    return (
      <FullFrameScene
        en={en}
        title={title}
        description={description}
        scene={scene}
        facts={facts}
        crumbs={crumbs}
        switcher={switcher}
      />
    );
  }

  return (
    <section
      ref={rootRef}
      data-dark-hero
      data-light-hero
      className="relative h-[82svh] min-h-[620px] overflow-hidden bg-[#dcd7d3] text-ink lg:h-[calc(33.34vw+132px)] lg:min-h-0"
    >
      <div
        ref={stageRef}
        className={`absolute inset-x-0 top-0 aspect-[9/10] origin-[64%_80%] md:top-16 md:aspect-[2/1] will-change-transform lg:top-[84px] lg:aspect-[3/1] ${scene.imageLayout === "device" ? "" : "[mask-image:linear-gradient(180deg,#000_70%,transparent)] lg:[mask-image:linear-gradient(180deg,transparent,#000_12%,#000_78%,transparent)]"}`}
      >
        {/* 모바일: 세로형 사진 한 장 (가로 영상은 휴대폰에서 원장 · 장비가 잘림) */}
        {scene.mobileSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={scene.mobileSrc}
            alt={scene.alt ?? `${title} 시술 장면`}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full animate-[fade-in_1s_ease_both] object-cover md:hidden"
            style={
              scene.mobilePosition
                ? { objectPosition: scene.mobilePosition }
                : undefined
            }
          />
        )}
        <div
          className={`absolute inset-0 ${scene.mobileSrc ? "max-md:hidden" : ""}`}
        >
          {scene.video ? (
            <video
              src={scene.video}
              poster={scene.src}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label={`${title} 시술 장면`}
              className="h-full w-full animate-[fade-in_1s_ease_both] object-cover object-[92%_center]"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={scene.src}
              alt={scene.alt ?? `${title} 시술 장면`}
              fetchPriority="high"
              className={
                scene.imageLayout === "device"
                  ? "absolute top-20 right-[18%] h-[64%] w-auto animate-[fade-in_1s_ease_both] object-contain md:top-8 md:right-[16%] md:h-[80%] lg:top-2 lg:h-[90%]"
                  : `h-full w-full animate-[hero-settle_2.4s_cubic-bezier(.22,1,.36,1)_both] object-cover object-[92%_center] ${scene.desktopFit === "contain" ? "md:absolute md:right-0 md:w-auto md:max-w-none md:object-contain md:[mask-image:linear-gradient(90deg,transparent,#000_20%)]" : ""}`
              }
              style={
                scene.position ? { objectPosition: scene.position } : undefined
              }
            />
          )}
          {/* 유리 카드: 장비 특징을 한 줄씩, 차례로 떠오른 뒤 천천히 둥실 */}
          {scene.chips?.map((c, i) => (
            <div
              key={c.label}
              aria-hidden
              className="pointer-events-none absolute hidden -translate-x-full xl:block"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
            >
              <div
                className="animate-[chip-in_1s_cubic-bezier(.22,1,.36,1)_both]"
                style={{ animationDelay: `${1.2 + i * 0.35}s` }}
              >
                <div
                  className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/55 py-2.5 pr-5 pl-3 shadow-[0_18px_40px_-20px_rgba(40,30,20,0.45)] backdrop-blur-md animate-[chip-float_6s_ease-in-out_infinite]"
                  style={{ animationDelay: `${i * 1.4}s` }}
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-gold/90 font-display text-[11px] text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-display text-[10px] tracking-[0.25em] text-gold uppercase">
                      {c.en}
                    </span>
                    <span className="mt-0.5 block text-[13px] font-semibold whitespace-nowrap text-ink xl:text-sm">
                      {c.label}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
          {/* 초음파 파장: 접촉면에서 볼 쪽으로 은은하게 퍼짐 (사진 비율과 화면 비율이 같은 1024px~ 에서만) */}
          {scene.pulse && (
            <div
              aria-hidden
              className="pointer-events-none absolute hidden motion-reduce:hidden lg:block"
              style={{ left: `${scene.pulse[0]}%`, top: `${scene.pulse[1]}%` }}
            >
              <span className="absolute h-[2.6vw] w-[1.8vw] -translate-1/2 animate-[sonic-core_2.8s_ease-in-out_infinite] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,1),rgba(244,205,150,0.55)_55%,transparent)]" />
              {[0, 0.93, 1.86].map((d) => (
                <span
                  key={d}
                  className="absolute h-[7vw] w-[5vw] animate-[sonic-wave_2.8s_cubic-bezier(.25,.6,.35,1)_infinite] rounded-[50%] border-2 border-white opacity-0 [mask-image:linear-gradient(90deg,transparent_46%,#000_62%)] shadow-[0_0_0_1px_rgba(196,150,90,0.35),0_0_16px_rgba(240,200,140,0.75),inset_0_0_12px_rgba(255,236,205,0.8)]"
                  style={{ animationDelay: `${d + 1}s` }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <div ref={textRef} className="relative h-full will-change-transform">
        <LightHeroText
          en={en}
          title={title}
          description={description}
          facts={facts}
          crumbs={crumbs}
          switcher={switcher}
          className="lg:ml-[5vw] lg:max-w-[42%] xl:ml-[9vw] xl:max-w-[36%]"
          wrap="lg:justify-center lg:pt-24 lg:pb-14 xl:pt-32 xl:pb-20"
        />
      </div>
    </section>
  );
}

// 3:2 촬영 원본을 3:1 배경으로 확대하지 않습니다. 안내 카드도 사진 밖에 둡니다.
function FullFrameScene({
  en,
  title,
  description,
  scene,
  facts,
  crumbs,
  switcher,
}: {
  en: string;
  title: string;
  description?: string;
  scene: HeroScene;
  facts: { label: string; value: string }[];
  crumbs: Crumb[];
  switcher?: React.ReactNode;
}) {
  return (
    <section
      data-dark-hero
      data-light-hero
      className="relative overflow-hidden bg-sand pt-24 pb-12 text-ink md:pt-32 lg:pb-20"
    >
      <div className="mx-auto grid max-w-[1600px] items-center gap-8 px-5 md:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
        <div className="order-2 lg:order-1">
          <LightHeroText
            en={en}
            title={title}
            description={description}
            facts={facts}
            crumbs={crumbs}
            switcher={switcher}
            className="max-w-xl"
            wrap="!px-0 !pb-0"
          />
          {scene.chips && (
            <ul className="mt-8 flex flex-wrap gap-3">
              {scene.chips.map((chip, i) => (
                <li
                  key={chip.en}
                  className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/55 px-4 py-3"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold font-display text-xs text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-display text-[10px] tracking-[0.25em] text-gold uppercase">
                      {chip.en}
                    </span>
                    <span className="mt-0.5 block text-sm font-medium">
                      {chip.label}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <picture className="order-1 flex justify-center overflow-hidden rounded-[24px] lg:order-2 md:rounded-[32px]">
          {scene.mobileSrc && (
            <source
              media="(max-width: 767px)"
              srcSet={scene.mobileSrc}
              width={scene.photoAspect === "portrait-mobile" ? 4672 : 7008}
              height={scene.photoAspect === "portrait-mobile" ? 7008 : 4672}
            />
          )}
          <img
            src={scene.src}
            alt={scene.photoAlt ?? `${title} 시술 장면`}
            width={7008}
            height={4672}
            fetchPriority="high"
            className={`block h-auto w-full rounded-[24px] object-contain md:rounded-[32px] ${scene.photoAspect === "portrait-mobile" ? "max-md:max-h-[420px] max-md:w-auto" : ""}`}
          />
        </picture>
      </div>
    </section>
  );
}
