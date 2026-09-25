"use client";

import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";

// 흐린 문장이 스크롤에 맞춰 한 단어씩 진하게 칠해진다 (title이 있으면 위에 큰 제목을 둔다)
export default function ScrollStatement({ en, title, text }: { en: string; title?: string; text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!ref.current || reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-word]",
        { opacity: 0.15 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 45%", scrub: 0.6 },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-5 text-center md:px-10">
      <p className="font-display text-base tracking-[0.15em] text-gold md:text-lg">{en}</p>
      {title && (
        <h2 className="mt-6 font-serif text-[34px] leading-tight font-medium tracking-[-0.04em] text-ink md:mt-8 md:text-[64px]">
          {title}
        </h2>
      )}
      <p
        ref={ref}
        className={`font-serif font-medium tracking-[-0.03em] text-ink ${
          title
            ? "mt-8 text-[19px] leading-[1.75] md:mt-12 md:text-[30px] md:leading-[1.7]"
            : "mt-8 text-[26px] leading-[1.6] md:mt-12 md:text-[46px] md:leading-[1.55]"
        }`}
      >
        {text.split(" ").map((word, i) => (
          <span key={i} data-word className="inline-block opacity-100">
            {word}&nbsp;
          </span>
        ))}
      </p>
    </div>
  );
}
