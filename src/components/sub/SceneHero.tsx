"use client";

import { useEffect, useRef } from "react";
import LightHeroText, { type Crumb } from "@/components/sub/LightHeroText";

export type HeroScene = {
  /** 사진 (영상이 있으면 영상 첫 장면 · 영상을 못 틀 때 대신 보임) */
  src: string;
  /** 짧은 반복 영상 (소리 없음, 사진과 같은 구도 3:1) */
  video?: string;
};

// 시술 장면 첫 화면: 밝은 벽 사진 (오른쪽에 원장 · 장비), 왼쪽 벽 위에 글자
// - 넓은 화면: 사진과 같은 가로 비율(3:1) + 메뉴바 높이, 사진은 메뉴바 아래부터 꽉 차게
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
}: {
  en: string;
  title: string;
  description?: string;
  scene: HeroScene;
  facts: { label: string; value: string }[];
  crumbs: Crumb[];
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

  return (
    <section
      ref={rootRef}
      data-dark-hero
      data-light-hero
      className="relative h-[82svh] min-h-[620px] overflow-hidden bg-[linear-gradient(180deg,#efebe7,#e3ded9_55%,#d8d2cb)] text-ink xl:h-[calc(33.34vw+132px)] xl:min-h-0"
    >
      <div
        ref={stageRef}
        className="absolute inset-x-0 top-0 h-[58%] origin-[64%_80%] [mask-image:linear-gradient(180deg,#000_70%,transparent)] will-change-transform xl:top-[84px] xl:h-auto xl:aspect-[3/1] xl:[mask-image:linear-gradient(180deg,transparent,#000_12%)]"
      >
        <div className="absolute inset-0">
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
              className="h-full w-full animate-[hero-settle_2.4s_cubic-bezier(.22,1,.36,1)_both] object-cover object-[74%_center]"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={scene.src}
              alt={`${title} 시술 장면`}
              fetchPriority="high"
              className="h-full w-full animate-[hero-settle_2.4s_cubic-bezier(.22,1,.36,1)_both] object-cover object-[74%_center]"
            />
          )}
        </div>
      </div>
      {/* 넓은 화면: 글자 쪽(왼쪽)을 벽색으로 살짝 덮어 잘 읽히게 */}
      <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(236,232,227,0.7),rgba(236,232,227,0.35)_24%,transparent_40%)] xl:block" />
      <div ref={textRef} className="relative h-full will-change-transform">
        <LightHeroText
          en={en}
          title={title}
          description={description}
          facts={facts}
          crumbs={crumbs}
          className="xl:ml-[9vw] xl:max-w-[36%]"
          wrap="xl:justify-center xl:pt-32 xl:pb-20"
        />
      </div>
    </section>
  );
}
