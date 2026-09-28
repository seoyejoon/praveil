"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import Reveal from "@/components/Reveal";
import { gsap, reducedMotion } from "@/lib/gsap";

type Props = { label: string; nameEn: string; name: string; title: string; quote: string[]; text: string; image: string };

// 대표원장: 어두운 배경 위 큰 영문 이름이 스크롤에 따라 옆으로 흐르고, 누끼 사진이 그 앞에 선다.
export default function MainDoctor({ label, nameEn, name, title, quote, text, image }: Props) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reducedMotion() || !rootRef.current) return;
    const ctx = gsap.context(() => {
      const st = { trigger: rootRef.current, start: "top bottom", end: "bottom top", scrub: true };
      gsap.fromTo(".doctor-name", { xPercent: 8 }, { xPercent: -18, ease: "none", scrollTrigger: st });
      gsap.fromTo(".doctor-photo", { yPercent: 10 }, { yPercent: -4, ease: "none", scrollTrigger: st });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-[#0c0c0c] text-white">
      <p
        aria-hidden
        className="doctor-name pointer-events-none absolute top-[12%] left-0 font-display text-[26vw] leading-none font-light whitespace-nowrap text-white/[0.06] uppercase lg:top-[18%] lg:text-[17vw]"
      >
        {nameEn}
      </p>

      <div className="relative mx-auto grid max-w-[1600px] items-end gap-10 px-5 pt-28 md:px-10 lg:min-h-svh lg:grid-cols-2 lg:pt-0">
        <div className="order-2 flex justify-center lg:order-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={`${name} ${title}`} loading="lazy" className="doctor-photo h-[58svh] w-auto max-w-full object-contain lg:h-[86svh]" />
        </div>

        <div className="order-1 lg:order-2 lg:pb-[18vh]">
          <p className="font-display text-xs tracking-[0.35em] text-white/50 uppercase md:text-sm">{label}</p>
          <Reveal variant="line" className="mt-8 text-[26px] leading-[1.4] font-semibold tracking-[-0.04em] md:text-[42px]">
            {quote.map((q) => (
              <span key={q}>
                <span>{q}</span>
              </span>
            ))}
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-8 text-[15px] leading-relaxed whitespace-pre-line text-white/60 md:text-lg">{text}</p>
            <div className="mt-12 flex items-end justify-between border-t border-white/15 pt-6">
              <p>
                <span className="block font-display text-sm tracking-[0.25em] text-white/50 uppercase">{title}</span>
                <span className="mt-1 block text-2xl font-bold md:text-3xl">{name}</span>
              </p>
              <Link href="/about/doctor" className="group flex items-center gap-4 font-display text-sm tracking-[0.25em] uppercase">
                View More
                <span className="grid h-12 w-12 place-items-center rounded-full border border-white/40 transition group-hover:bg-white group-hover:text-black">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
