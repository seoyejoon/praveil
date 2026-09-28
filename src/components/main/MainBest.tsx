"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";

type Item = { en: string; name: string; category: string; href: string; text: string; image: string };

// 대표 시술 4종. PC: 화면이 멈춘 채 스크롤하면 카드가 옆으로 흘러간다
// 모바일 · 태블릿: 제목은 위에, 카드는 손가락으로 옆으로 넘김 (아래 점으로 위치 표시)
export default function MainBest({ label, title, items }: { label: string; title: string; items: Item[] }) {
  const pinRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track || reducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const distance = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => setProgress(self.progress),
        },
      });
      // 모바일: 옆으로 넘긴 위치 → 점 표시
  const onSwipe = () => {
    const track = trackRef.current;
    if (!track || window.innerWidth >= 1024) return;
    const cards = [...track.querySelectorAll<HTMLElement>("[data-card]")];
    const at = (c: HTMLElement) => Math.abs(c.offsetLeft - cards[0].offsetLeft - track.scrollLeft);
    let best = 0;
    cards.forEach((c, i) => {
      if (at(c) < at(cards[best])) best = i;
    });
    setSlide(best);
  };

  return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });
    ScrollTrigger.refresh();
    // 모바일: 옆으로 넘긴 위치 → 점 표시
  const onSwipe = () => {
    const track = trackRef.current;
    if (!track || window.innerWidth >= 1024) return;
    const cards = [...track.querySelectorAll<HTMLElement>("[data-card]")];
    const at = (c: HTMLElement) => Math.abs(c.offsetLeft - cards[0].offsetLeft - track.scrollLeft);
    let best = 0;
    cards.forEach((c, i) => {
      if (at(c) < at(cards[best])) best = i;
    });
    setSlide(best);
  };

  return () => mm.revert();
  }, []);

  // 모바일: 옆으로 넘긴 위치 → 점 표시
  const onSwipe = () => {
    const track = trackRef.current;
    if (!track || window.innerWidth >= 1024) return;
    const cards = [...track.querySelectorAll<HTMLElement>("[data-card]")];
    const at = (c: HTMLElement) => Math.abs(c.offsetLeft - cards[0].offsetLeft - track.scrollLeft);
    let best = 0;
    cards.forEach((c, i) => {
      if (at(c) < at(cards[best])) best = i;
    });
    setSlide(best);
  };

  return (
    // 고정(pin)되는 섹션은 한 번 감싸야 페이지 이동 시 오류가 나지 않는다
    <div>
      <section ref={pinRef} className="relative overflow-hidden bg-espresso pt-20 pb-16 text-white md:pt-24 lg:h-svh lg:py-0">
        {/* 모바일 · 태블릿 제목 */}
        <div className="px-5 md:px-10 lg:hidden">
          <p className="font-display text-xs tracking-[0.35em] text-taupe uppercase md:text-sm">{label}</p>
          <h2 className="mt-4 text-[28px] leading-tight font-bold tracking-[-0.04em] md:text-[40px]">{title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/60">프라베일이 가장 자신 있게 권하는 네 가지 시술입니다.</p>
        </div>

        <div
          onScroll={onSwipe}
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory scroll-px-5 gap-4 md:scroll-px-10 overflow-x-auto px-5 pt-8 will-change-transform md:gap-5 md:px-10 lg:h-full lg:snap-none lg:items-center lg:gap-10 lg:overflow-visible lg:px-10 lg:py-0"
        >
          <div className="hidden w-[30vw] shrink-0 flex-col justify-between lg:flex lg:h-[72vh]">
            <div>
              <p className="font-display text-xs tracking-[0.35em] text-taupe uppercase md:text-sm">{label}</p>
              <h2 className="mt-6 text-[52px] leading-tight font-bold tracking-[-0.04em]">{title}</h2>
              <p className="mt-6 text-base leading-relaxed text-white/60">
                프라베일이 가장 자신 있게 권하는
                <br />
                네 가지 시술입니다.
              </p>
            </div>
            <p className="mt-10 font-display text-[180px] leading-none font-extralight text-white/15">04</p>
          </div>

          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-card
              className="group relative w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:h-[72vh] lg:w-[34vw]"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-white/5 lg:aspect-auto lg:h-[calc(100%-150px)] lg:rounded-[28px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="h-full w-full object-cover grayscale-[35%] transition duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105 group-hover:grayscale-0"
                />
                              </div>
              <div className="flex items-end justify-between gap-4 pt-6">
                <div>
                  <p className="font-display text-[34px] leading-none font-light uppercase md:text-[44px]">{item.en}</p>
                  <p className="mt-3 text-sm text-white/60">{item.name}</p>
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/30 transition duration-500 group-hover:rotate-45 group-hover:border-gold group-hover:bg-gold group-hover:text-white">
                  <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} />
                </span>
              </div>
              <p className="mt-3 hidden text-sm leading-relaxed text-white/50 lg:block lg:pr-16">{item.text}</p>
            </Link>
          ))}
          <div className="w-1 shrink-0 lg:w-[6vw]" aria-hidden />
        </div>

        {/* 넘김 위치 점 (모바일 · 태블릿) */}
        <div aria-hidden className="mt-8 flex justify-center gap-2 lg:hidden">
          {items.map((item, i) => (
            <span key={item.href} className={`h-1.5 rounded-full transition-all duration-500 ${i === slide ? "w-6 bg-gold" : "w-1.5 bg-white/25"}`} />
          ))}
        </div>

        {/* 진행 막대 (PC) */}
        <div className="absolute inset-x-10 bottom-8 hidden h-px bg-white/15 lg:block">
          <span className="absolute inset-y-0 left-0 bg-gold" style={{ width: `${Math.max(4, progress * 100)}%` }} />
        </div>
      </section>
    </div>
  );
}
