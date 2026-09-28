"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";

type Props = { eyebrow: string; lines: string[]; title: string; sub: string; images: string[] };

const STRIPS = 6; // 첫 등장 커튼 줄 수
const DURATION = 6000; // 사진 한 장 보여주는 시간

// 첫 화면
// 1) 등장: 커튼 여러 줄이 차례로 걷히며 사진이 드러남
// 2) 사진 여러 장이 옆으로 닦아내듯 넘어가고, 넘어온 사진은 천천히 확대에서 제자리로
// 3) 마우스를 따라 사진이 살짝 움직이고 베이지 빛이 따라다님
// 4) 스크롤하면 사진이 둥근 액자처럼 작아지며 다음 화면으로 (PC)
export default function MainHero({ eyebrow, lines, title, sub, images }: Props) {
  const pinRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  // 자동 넘김
  useEffect(() => {
    const t = setTimeout(() => {
      setPrev(index);
      setIndex((index + 1) % images.length);
    }, DURATION);
    return () => clearTimeout(t);
  }, [index, images.length]);

  // 마우스 위치 → CSS 변수 (사진 움직임 · 빛)
  useEffect(() => {
    const el = pinRef.current;
    if (!el || reducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
        el.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
        el.style.setProperty("--px", `${e.clientX - r.left}px`);
        el.style.setProperty("--py", `${e.clientY - r.top}px`);
      });
    };
    el.addEventListener("pointermove", onMove);
    return () => {
      el.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // 스크롤: 사진이 둥근 액자로 작아짐 (PC만 화면 고정)
  useEffect(() => {
    const pin = pinRef.current;
    if (!pin || reducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: pin, start: "top top", end: "+=70%", pin: true, scrub: 0.6 },
      });
      tl.to(frameRef.current, { clipPath: "inset(9% 6% 9% 6% round 36px)", ease: "none" }, 0)
        .to(".hero-slides", { scale: 1.08, ease: "none" }, 0)
        .to(copyRef.current, { yPercent: -40, opacity: 0, ease: "none" }, 0);
      return () => tl.scrollTrigger?.kill();
    });
    mm.add("(max-width: 1023px)", () => {
      const tw = gsap.to(copyRef.current, {
        yPercent: -30,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: pin, start: "top top", end: "bottom top", scrub: true },
      });
      return () => tw.scrollTrigger?.kill();
    });
    ScrollTrigger.refresh();
    return () => mm.revert();
  }, []);

  return (
    // 고정(pin)되는 섹션은 한 번 감싸야 페이지 이동 시 오류가 나지 않는다
    <div>
      <section ref={pinRef} data-dark-hero className="hero relative h-svh min-h-[620px] overflow-hidden bg-espresso text-white">
        <div ref={frameRef} className="absolute inset-0 overflow-hidden [clip-path:inset(0%_0%_0%_0%_round_0px)]">
          {/* 사진들: 마우스 따라 살짝 움직임 */}
          <div
            className="hero-slides absolute -inset-6 transition-transform duration-700 ease-out"
            style={{ translate: "calc(var(--mx, 0) * -24px) calc(var(--my, 0) * -18px)" }}
          >
            {images.map((src, i) => (
              <div
                key={src}
                className={`absolute inset-0 ${i === index ? "z-20 animate-[slide-wipe_1.5s_cubic-bezier(.76,0,.24,1)_both]" : i === prev ? "z-10" : "z-0 opacity-0"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  fetchPriority={i === 0 ? "high" : "low"}
                  className={`h-full w-full object-cover ${i === index ? "animate-[ken-burns_7.5s_cubic-bezier(.22,1,.36,1)_both]" : ""}`}
                />
              </div>
            ))}
          </div>

          <div className="absolute inset-0 z-30 bg-gradient-to-b from-black/40 via-black/10 to-black/60" />
          {/* 마우스를 따라다니는 베이지 빛 */}
          <div
            className="pointer-events-none absolute inset-0 z-30 mix-blend-soft-light"
            style={{ background: "radial-gradient(520px circle at var(--px, 70%) var(--py, 40%), rgba(214,190,152,0.35), transparent 60%)" }}
          />
        </div>

        {/* 첫 등장 커튼 */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-50 flex">
          {Array.from({ length: STRIPS }).map((_, i) => (
            <span
              key={i}
              className="h-full flex-1 bg-espresso animate-[curtain-up_1.1s_cubic-bezier(.76,0,.24,1)_both]"
              style={{ animationDelay: `${0.15 + i * 0.08}s` }}
            />
          ))}
        </div>

        {/* 글자: 차분하게 */}
        <div ref={copyRef} className="relative z-40 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-28 md:px-10 md:pb-16">
          <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
            <div className="animate-[fade-up_1.2s_cubic-bezier(.22,1,.36,1)_0.9s_both]">
              <p className="font-display text-[11px] font-light tracking-[0.4em] text-[#e3cfae] uppercase md:text-xs">{eyebrow}</p>
              <h1 className="mt-5 text-[26px] leading-[1.4] font-light tracking-[-0.03em] md:text-[40px]">{title}</h1>
              <p className="mt-3 text-[13px] text-white/65 md:text-[15px]">{sub}</p>
              <p className="mt-6 font-display text-[11px] font-light tracking-[0.3em] text-white/45 uppercase">{lines.join(" ")}</p>
            </div>

            {/* 사진 순서 표시 + 스크롤 안내 */}
            <div className="flex items-end gap-8 animate-[fade-up_1.2s_cubic-bezier(.22,1,.36,1)_1.1s_both]">
              <div className="flex gap-2">
                {images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    aria-label={`${i + 1}번째 사진`}
                    onClick={() => {
                      if (i === index) return;
                      setPrev(index);
                      setIndex(i);
                    }}
                    className="relative h-[2px] w-10 overflow-hidden bg-white/25 md:w-14"
                  >
                    {i === index && (
                      <span className="absolute inset-y-0 left-0 bg-[#e3cfae]" style={{ animation: `hero-progress ${DURATION}ms linear both` }} />
                    )}
                  </button>
                ))}
              </div>
              <span aria-hidden className="hidden h-11 w-7 justify-center rounded-full border border-white/50 pt-2 md:flex">
                <span className="h-2 w-[3px] animate-[scroll-dot_1.8s_ease-in-out_infinite] rounded-full bg-white" />
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
