"use client";

import { useEffect, useRef } from "react";
import Reveal from "@/components/Reveal";
import { gsap, reducedMotion } from "@/lib/gsap";

type Props = { eyebrow: string; lines: string[]; title: string; sub: string; image: string };

// 첫 화면: 전체 사진 + 큰 영문 문구가 한 줄씩 올라옴. 스크롤하면 사진은 천천히 확대, 글자는 위로 사라짐.
export default function MainHero({ eyebrow, lines, title, sub, image }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion() || !rootRef.current) return;
    const ctx = gsap.context(() => {
      const st = { trigger: rootRef.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to(mediaRef.current, { scale: 1.18, yPercent: 12, ease: "none", scrollTrigger: st });
      gsap.to(copyRef.current, { yPercent: -35, opacity: 0, ease: "none", scrollTrigger: { ...st, end: "70% top" } });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} data-dark-hero className="relative h-svh min-h-[620px] overflow-hidden bg-black text-white">
      <div ref={mediaRef} className="absolute inset-0 will-change-transform">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" fetchPriority="high" className="animate-[hero-in_2.6s_cubic-bezier(.22,1,.36,1)_both] h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/65" />
      </div>

      <div ref={copyRef} className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-16 md:px-10 md:pb-20">
        <Reveal variant="line" className="font-display text-xs font-light tracking-[0.4em] uppercase opacity-80 md:text-sm">
          <span>
            <span>{eyebrow}</span>
          </span>
        </Reveal>
        <Reveal
          variant="line"
          className="mt-4 font-display text-[17vw] leading-[0.92] font-light tracking-[-0.01em] uppercase md:mt-6 md:text-[9.2vw]"
        >
          {lines.map((line) => (
            <span key={line}>
              <span>{line}</span>
            </span>
          ))}
        </Reveal>

        <div className="mt-10 flex flex-col gap-8 border-t border-white/25 pt-6 md:mt-14 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <p className="text-xl font-semibold tracking-[-0.03em] md:text-[28px]">{title}</p>
            <p className="mt-2 text-sm text-white/70 md:text-base">{sub}</p>
          </Reveal>
          <div className="hidden items-center gap-4 font-display text-xs font-light tracking-[0.35em] uppercase md:flex">
            Scroll
            <span className="relative h-px w-16 overflow-hidden bg-white/30">
              <span className="absolute inset-y-0 left-0 w-full animate-[scroll-line_2.2s_ease-in-out_infinite] bg-white" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
