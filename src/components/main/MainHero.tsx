"use client";

import { useEffect, useRef, useState } from "react";
import HeroFaceScan, { type HeroPoint } from "@/components/main/HeroFaceScan";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";

type Props = {
  eyebrow: string;
  before: string;
  words: string[];
  after: string;
  sub: string;
  video: { src: string; webm: string; poster: string; face: string };
  points: HeroPoint[];
};

// 첫 화면: 모델 영상 전체 화면 (흰 배경 영상이라 글자는 어둡게)
// - 등장: 가운데 원에서 영상이 퍼져 나오며 열리고, 글자는 옆에서 밀려 들어옴
// - 영상 속 얼굴 위에 피부 분석 효과 (HeroFaceScan, 10초 반복)
// - 제목 속 [ 단어 ] 가 2.5초마다 바뀌고, 아래 진행 막대가 함께 참
// - 마우스를 따라 영상이 살짝 움직임
// - 스크롤하면 영상이 살짝 확대되며 글자가 위로 사라짐
export default function MainHero({ eyebrow, before, words, after, sub, video, points }: Props) {
  const pinRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [word, setWord] = useState(0);

  // 괄호 속 단어 바꾸기
  useEffect(() => {
    if (reducedMotion()) return;
    const t = setInterval(() => setWord((w) => (w + 1) % words.length), 2500);
    return () => clearInterval(t);
  }, [words.length]);

  // 마우스 → 영상 살짝 움직임
  useEffect(() => {
    const el = pinRef.current;
    if (!el || reducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", (e.clientX / window.innerWidth - 0.5).toFixed(3));
        el.style.setProperty("--my", (e.clientY / window.innerHeight - 0.5).toFixed(3));
      });
    };
    el.addEventListener("pointermove", onMove);
    return () => {
      el.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // 스크롤: 영상은 살짝 확대되며 천천히 올라가고, 글자는 위로 사라짐
  useEffect(() => {
    const root = pinRef.current;
    if (!root || reducedMotion()) return;
    const ctx = gsap.context(() => {
      const st = { trigger: root, start: "top top", end: "bottom top", scrub: true };
      gsap.to(frameRef.current, { scale: 1.12, yPercent: 10, ease: "none", scrollTrigger: st });
      gsap.to(copyRef.current, { yPercent: -35, opacity: 0, ease: "none", scrollTrigger: { ...st, end: "60% top" } });
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
    // 고정(pin)되는 섹션은 한 번 감싸야 페이지 이동 시 오류가 나지 않는다
    <div>
      <section ref={pinRef} data-light-hero className="relative h-svh min-h-[620px] overflow-hidden bg-white text-ink">
        <div
          ref={frameRef}
          className="absolute inset-0 overflow-hidden bg-[#f4f3f1] [clip-path:inset(0%_0%_0%_0%_round_0px)] animate-[iris-open_1.6s_cubic-bezier(.76,0,.24,1)_both]"
        >
          <div
            className="absolute -inset-5 animate-[ken-burns_2.4s_cubic-bezier(.22,1,.36,1)_both] transition-[translate] duration-700 ease-out"
            style={{ translate: "calc(var(--mx, 0) * -20px) calc(var(--my, 0) * -14px)" }}
          >
            <video
              ref={videoRef}
              className="h-full w-full object-cover object-[52%_center] lg:object-center"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={video.poster}
            >
              <source src={video.webm} type="video/webm" />
              <source src={video.src} type="video/mp4" />
            </video>
            <HeroFaceScan videoRef={videoRef} dataUrl={video.face} points={points} />
          </div>
          {/* 글자가 잘 보이도록 왼쪽 · 아래를 옅게 밝힘 */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/80 to-transparent lg:h-1/3 lg:from-white/40" />
        </div>

        <div ref={copyRef} className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-28 md:px-10 md:pb-32 lg:justify-center lg:pb-0">
          <div>
            <p className="animate-[slide-in_1s_cubic-bezier(.22,1,.36,1)_1s_both] font-display text-[11px] font-light tracking-[0.4em] text-mocha uppercase md:text-xs">{eyebrow}</p>
            <h1 className="mt-5 text-[26px] leading-[1.45] font-light tracking-[-0.03em] md:text-[42px] 2xl:text-[50px]">
              <span className="block animate-[slide-in_1.1s_cubic-bezier(.22,1,.36,1)_1.1s_both]">{before}</span>
              <span className="flex animate-[slide-in_1.1s_cubic-bezier(.22,1,.36,1)_1.25s_both] items-center gap-2 md:gap-3">
                <span className="font-extralight text-mocha/60">[</span>
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
                      className={`col-start-1 row-start-1 w-max font-normal whitespace-nowrap text-mocha transition-[transform,opacity] duration-[700ms,350ms] ease-[cubic-bezier(.76,0,.24,1)] ${
                        i === word ? "translate-y-0 opacity-100" : i === (word - 1 + words.length) % words.length ? "-translate-y-full opacity-0" : "translate-y-full opacity-0"
                      }`}
                    >
                      {w}
                    </span>
                  ))}
                </span>
                <span className="font-extralight text-mocha/60">]</span>
                <span>{after}</span>
              </span>
            </h1>
            <p className="mt-4 animate-[slide-in_1s_cubic-bezier(.22,1,.36,1)_1.4s_both] text-[13px] text-ink/60 md:text-[15px] 2xl:text-[17px]">{sub}</p>

            {/* 진행 막대: 단어가 바뀔 때마다 한 칸씩 참 */}
            <div aria-hidden className="mt-8 flex w-[180px] animate-[fade-up_1s_ease_1.6s_both] gap-1.5 md:mt-10 md:w-[220px]">
              {words.map((w, i) => (
                <span key={w} className="h-[2px] flex-1 overflow-hidden rounded-full bg-ink/10">
                  <span
                    key={i === word ? `on-${word}` : "off"}
                    className={`block h-full rounded-full bg-gold ${i < word ? "w-full" : i === word ? "animate-[hero-progress_2.5s_linear_both]" : "w-0"}`}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>

        <span aria-hidden className="absolute bottom-10 left-1/2 hidden h-11 w-7 -translate-x-1/2 justify-center rounded-full border border-ink/30 pt-2 lg:flex">
          <span className="h-2 w-[3px] animate-[scroll-dot_1.8s_ease-in-out_infinite] rounded-full bg-ink/60" />
        </span>
      </section>
    </div>
  );
}
