"use client";

import { useEffect, useRef, useState } from "react";
import LogoWall from "@/components/main/LogoWall";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";

type Props = {
  eyebrow: string;
  before: string;
  words: string[];
  after: string;
  sub: string;
};

// 첫 화면: 어두운 질감 벽 + 금속 간판 로고 (LogoWall)
// - 조명이 켜지듯 밝아진 뒤, 아래 왼쪽에 짧은 문구가 옆에서 밀려 들어옴
// - 제목 속 [ 단어 ] 가 2.5초마다 바뀌고, 아래 진행 막대가 함께 참
// - 스크롤하면 로고 쪽으로 천천히 다가가며 글자가 위로 사라짐
export default function MainHero({ eyebrow, before, words, after, sub }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const [word, setWord] = useState(0);

  // 괄호 속 단어 바꾸기
  useEffect(() => {
    if (reducedMotion()) return;
    const t = setInterval(() => setWord((w) => (w + 1) % words.length), 2500);
    return () => clearInterval(t);
  }, [words.length]);

  // 스크롤: 로고 쪽으로 다가가며 살짝 어두워지고, 글자는 위로 사라짐
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion()) return;
    const ctx = gsap.context(() => {
      const st = { trigger: root, start: "top top", end: "bottom top", scrub: true };
      gsap.to(frameRef.current, { scale: 1.18, yPercent: 8, filter: "brightness(0.6)", ease: "none", scrollTrigger: st });
      gsap.to(copyRef.current, { yPercent: -40, opacity: 0, ease: "none", scrollTrigger: { ...st, end: "55% top" } });
    }, root);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  // 괄호 속 단어 폭: 지금 단어 길이에 맞춰 괄호가 늘고 줄어듦
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [widths, setWidths] = useState<number[]>([]);
  useEffect(() => {
    const measure = () => setWidths(wordRefs.current.map((el) => el?.offsetWidth ?? 0));
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div>
      <section ref={rootRef} data-dark-hero className="relative h-svh min-h-[620px] overflow-hidden bg-[#1b1714] text-white">
        <div ref={frameRef} className="absolute inset-0 origin-[50%_44%]">
          <LogoWall />
        </div>

        <div ref={copyRef} className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-28 md:px-10 md:pb-24">
          <p className="animate-[slide-in_1s_cubic-bezier(.22,1,.36,1)_2.2s_both] font-display text-[11px] font-light tracking-[0.4em] text-[#e3cfae] uppercase md:text-xs">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-[22px] leading-[1.45] font-light tracking-[-0.03em] md:text-[30px] 2xl:text-[34px]">
            <span className="block animate-[slide-in_1.1s_cubic-bezier(.22,1,.36,1)_2.3s_both]">{before}</span>
            <span className="flex animate-[slide-in_1.1s_cubic-bezier(.22,1,.36,1)_2.45s_both] items-center gap-2 md:gap-2.5">
              <span className="font-extralight text-white/40">[</span>
              <span
                className="relative inline-grid h-[1.45em] overflow-hidden transition-[width] duration-500 ease-[cubic-bezier(.76,0,.24,1)]"
                style={widths[word] ? { width: widths[word] } : undefined}
              >
                {words.map((w, i) => (
                  <span
                    key={w}
                    ref={(el) => {
                      wordRefs.current[i] = el;
                    }}
                    aria-hidden={i !== word}
                    className={`col-start-1 row-start-1 w-max whitespace-nowrap text-[#e3cfae] transition-[transform,opacity] duration-[700ms,350ms] ease-[cubic-bezier(.76,0,.24,1)] ${
                      i === word ? "translate-y-0 opacity-100" : i === (word - 1 + words.length) % words.length ? "-translate-y-full opacity-0" : "translate-y-full opacity-0"
                    }`}
                  >
                    {w}
                  </span>
                ))}
              </span>
              <span className="font-extralight text-white/40">]</span>
              <span>{after}</span>
            </span>
          </h1>
          <p className="mt-3 animate-[slide-in_1s_cubic-bezier(.22,1,.36,1)_2.6s_both] text-[13px] text-white/55 md:text-sm">{sub}</p>

          {/* 진행 막대: 단어가 바뀔 때마다 한 칸씩 참 */}
          <div aria-hidden className="mt-7 flex w-[160px] animate-[fade-up_1s_ease_2.8s_both] gap-1.5 md:w-[200px]">
            {words.map((w, i) => (
              <span key={w} className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/15">
                <span
                  key={i === word ? `on-${word}` : "off"}
                  className={`block h-full rounded-full bg-[#e3cfae] ${i < word ? "w-full" : i === word ? "animate-[hero-progress_2.5s_linear_both]" : "w-0"}`}
                />
              </span>
            ))}
          </div>
        </div>

        <span aria-hidden className="absolute bottom-10 left-1/2 hidden h-11 w-7 -translate-x-1/2 animate-[fade-up_1s_ease_3s_both] justify-center rounded-full border border-white/30 pt-2 lg:flex">
          <span className="h-2 w-[3px] animate-[scroll-dot_1.8s_ease-in-out_infinite] rounded-full bg-white/70" />
        </span>
      </section>
    </div>
  );
}
