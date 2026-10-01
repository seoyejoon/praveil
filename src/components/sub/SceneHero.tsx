"use client";

import { useEffect, useRef } from "react";
import LightHeroText, { type Crumb } from "@/components/sub/LightHeroText";

export type HeroScene = {
  src: string;
  /** 움직이는 손 + 핸드피스 (넓은 화면)
   *  layer: 손 · 핸드피스만 떼어낸 사진, plate: 그 자리를 지운 바닥 패치
   *  box: 두 사진이 놓이는 자리 (사진 속 %, [왼쪽, 위, 너비, 높이]) */
  hand?: {
    layer: string;
    plate: string;
    box: [number, number, number, number];
  };
};

// 시술 장면 첫 화면: 밝은 벽 사진 (오른쪽에 원장 · 장비), 왼쪽 벽 위에 글자
// - 넓은 화면: 사진과 같은 가로 비율(3:1) + 메뉴바 높이, 사진은 메뉴바 아래부터 꽉 차게
// - 좁은 화면: 위에 사진, 아래 글자
// 움직임
// - 스크롤: 사진은 천천히 다가오고, 글자는 위로 사라짐
// - 손 + 핸드피스가 볼 위를 한 칸씩 옮기며 시술하듯 움직임 (넓은 화면)
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={scene.src}
            alt={`${title} 시술 장면`}
            fetchPriority="high"
            className="h-full w-full animate-[hero-settle_2.4s_cubic-bezier(.22,1,.36,1)_both] object-cover object-[74%_center]"
          />
          {/* 손 + 핸드피스: 바닥 패치 위에서 볼을 따라 한 칸씩 이동 */}
          {scene.hand && (
            <div
              aria-hidden
              className="pointer-events-none absolute hidden motion-reduce:hidden xl:block"
              style={{
                left: `${scene.hand.box[0]}%`,
                top: `${scene.hand.box[1]}%`,
                width: `${scene.hand.box[2]}%`,
                height: `${scene.hand.box[3]}%`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={scene.hand.plate}
                alt=""
                className="absolute inset-0 h-full w-full"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={scene.hand.layer}
                alt=""
                className="absolute inset-0 h-full w-full animate-[handpiece-glide_5.2s_ease-in-out_1.6s_infinite]"
              />
            </div>
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
