"use client";

import { useEffect, useRef } from "react";
import type { Feature } from "@/lib/data";
import { gsap, reducedMotion } from "@/lib/gsap";

// 강점 카드
// PC: 화면이 멈춘 채 스크롤하면 카드가 옆으로 지나감 / 모바일: 손가락으로 옆으로 넘김
export default function WhyHorizontal({
  features,
  images,
  heading,
}: {
  features: Feature[];
  images: string[];
  heading: React.ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || reducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const distance = () => track.scrollWidth - track.clientWidth;
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-cream py-24 lg:flex lg:h-svh lg:flex-col lg:justify-center lg:py-0">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
        <div className="flex items-end justify-between gap-6">
          {heading}
          <div className="hidden w-60 pb-3 lg:block">
            <div className="h-px bg-ink/15">
              <div ref={barRef} className="h-px origin-left scale-x-0 bg-ink" />
            </div>
          </div>
        </div>
      </div>
      <ul
        ref={trackRef}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory scroll-px-5 gap-6 overflow-x-auto px-5 md:px-10 lg:mt-16 lg:snap-none lg:overflow-visible lg:pl-[max(2.5rem,calc((100vw-1440px)/2+2.5rem))]"
      >
        {features.map((f, i) => (
          <li key={f.title} className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[400px]">
            <div className="overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images[i]} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover" />
            </div>
            <p className="mt-6 font-display text-sm tracking-[0.15em] text-gold">0{i + 1}</p>
            <p className="mt-2 font-serif text-xl font-medium md:text-2xl">{f.title}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{f.description}</p>
          </li>
        ))}
        <li aria-hidden className="w-px shrink-0 lg:w-10" />
      </ul>
    </section>
  );
}
