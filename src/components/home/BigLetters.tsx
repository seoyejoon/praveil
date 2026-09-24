"use client";

import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";

// 아주 큰 문구가 한 글자씩 아래에서 올라온다
export default function BigLetters({ text, caption }: { text: string; caption: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || reducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 75%", toggleActions: "play none none reverse" },
      });
      tl.from("[data-char]", { yPercent: 110, duration: 1.1, ease: "power4.out", stagger: 0.045 }).from(
        "[data-caption]",
        { opacity: 0, y: 20, duration: 0.8, ease: "power2.out" },
        "-=0.6",
      );
      gsap.fromTo("[data-line]", { xPercent: 3 }, {
        xPercent: -3,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="overflow-hidden py-24 text-center md:py-40">
      <p
        data-line
        aria-label={text}
        className="px-5 font-display text-[19vw] leading-[1.05] text-ink md:text-[9.5vw] md:whitespace-nowrap"
      >
        {/* 단어 단위로 묶어서 모바일에서는 단어 사이에서만 줄바꿈 */}
        {text.split(" ").map((word, w) => (
          <span key={w} className="inline-block whitespace-nowrap">
            {word.split("").map((ch, i) => (
              <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom">
                <span data-char className={`inline-block ${ch === "&" ? "text-gold" : ""}`}>
                  {ch}
                </span>
              </span>
            ))}
            {w < text.split(" ").length - 1 && <span className="inline-block w-[0.25em]" />}
          </span>
        ))}
      </p>
      <p data-caption className="mt-6 font-serif text-lg text-muted md:mt-10 md:text-2xl">
        {caption}
      </p>
    </div>
  );
}
