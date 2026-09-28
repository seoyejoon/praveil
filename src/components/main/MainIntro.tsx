"use client";

import { useEffect, useRef } from "react";
import Reveal from "@/components/Reveal";
import { gsap, reducedMotion } from "@/lib/gsap";

type Props = { label: string; text: string; keywords: { en: string; ko: string }[] };

// 병원 철학: 스크롤에 맞춰 글자가 한 단어씩 진해진다.
export default function MainIntro({ label, text, keywords }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    if (reducedMotion() || !rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".intro-word",
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: ".intro-text", start: "top 78%", end: "bottom 45%", scrub: true },
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="bg-white px-5 py-32 md:px-10 md:py-48">
      <div className="mx-auto max-w-[1600px]">
        <p className="font-display text-xs tracking-[0.35em] text-black/50 uppercase md:text-sm">{label}</p>
        <p className="intro-text mt-8 max-w-[1180px] text-[28px] leading-[1.45] font-semibold tracking-[-0.04em] md:mt-12 md:text-[54px] md:leading-[1.35]">
          {words.map((w, i) => (
            <span key={i} className="intro-word">
              {w}{" "}
            </span>
          ))}
        </p>

        <ul className="mt-24 grid border-t border-black md:mt-36 md:grid-cols-3">
          {keywords.map((k, i) => (
            <Reveal as="li" key={k.en} delay={i * 120} className="flex items-baseline justify-between border-b border-black/10 py-7 md:block md:border-b-0 md:border-l md:px-8 md:py-10 md:first:border-l-0 md:first:pl-0">
              <span className="font-display text-[44px] leading-none font-light uppercase md:text-[72px]">{k.en}</span>
              <span className="text-sm text-black/60 md:mt-5 md:block md:text-base">{k.ko}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
