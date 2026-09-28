"use client";

import { Activity, ClipboardCheck, ScanFace, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import FaceScan, { type ScanItem } from "@/components/main/FaceScan";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";

type Props = { eyebrow: string; title: string; sub: string; line: string; items: ScanItem[]; steps: string[]; video?: string };

const STRIPS = 6; // 첫 등장 커튼 줄 수
const stepIcons = [ScanFace, Activity, ClipboardCheck, Sparkles];

// 첫 화면: 피부를 먼저 읽는다
// - 오른쪽: 3D 얼굴을 스캔하며 분석 항목이 나타남 (FaceScan)
// - 왼쪽: 차분한 제목, 아래에 진단 → 분석 → 맞춤 설계 → 시술 단계가 차례로 켜짐
// - 첫 등장 커튼, 스크롤하면 둥근 액자로 작아지며 다음 화면으로 (PC)
export default function MainHero({ eyebrow, title, sub, line, items, steps, video }: Props) {
  const pinRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reducedMotion()) return;
    const t = setInterval(() => setStep((s) => (s + 1) % steps.length), 2250);
    return () => clearInterval(t);
  }, [steps.length]);

  useEffect(() => {
    const pin = pinRef.current;
    if (!pin || reducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: pin, start: "top top", end: "+=70%", pin: true, scrub: 0.6 } });
      tl.to(frameRef.current, { clipPath: "inset(8% 5% 8% 5% round 36px)", ease: "none" }, 0).to(copyRef.current, { yPercent: -25, opacity: 0, ease: "none" }, 0);
      return () => tl.scrollTrigger?.kill();
    });
    ScrollTrigger.refresh();
    return () => mm.revert();
  }, []);

  return (
    // 고정(pin)되는 섹션은 한 번 감싸야 페이지 이동 시 오류가 나지 않는다
    <div>
      <section ref={pinRef} data-dark-hero className="relative h-svh min-h-[680px] overflow-hidden bg-black text-white">
        <div ref={frameRef} className="absolute inset-0 overflow-hidden bg-espresso [clip-path:inset(0%_0%_0%_0%_round_0px)]">
          {/* 은은한 베이지 빛 */}
          <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_68%_45%,rgba(168,142,106,0.28),transparent_70%)]" />
          <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(rgba(227,207,174,1)_1px,transparent_1px)] [background-size:28px_28px]" />

          <div className="relative mx-auto grid h-full max-w-[1600px] grid-rows-[1fr_auto] px-5 pt-20 pb-28 md:px-10 md:pt-24 md:pb-12 lg:grid-cols-[0.9fr_1.1fr] lg:grid-rows-1">
            {/* 분석 장면 */}
            <div className="relative order-1 min-h-0 animate-[fade-up_1.4s_cubic-bezier(.22,1,.36,1)_0.6s_both] lg:order-2 lg:py-6 lg:pr-20">
              <FaceScan items={items} video={video} />
            </div>

            {/* 글자 */}
            <div ref={copyRef} className="order-2 flex flex-col justify-end lg:order-1 lg:justify-center">
              <div className="animate-[fade-up_1.2s_cubic-bezier(.22,1,.36,1)_0.9s_both]">
                <p className="font-display text-[11px] font-light tracking-[0.4em] text-[#e3cfae] uppercase md:text-xs">{eyebrow}</p>
                <h1 className="mt-5 text-[26px] leading-[1.4] font-light tracking-[-0.03em] md:text-[40px]">{title}</h1>
                <p className="mt-3 text-[13px] text-white/60 md:text-[15px]">{sub}</p>
                <p className="mt-5 hidden font-display text-[11px] font-light tracking-[0.3em] text-white/40 uppercase md:block">{line}</p>
              </div>

              {/* 진료 흐름: 차례로 켜짐 */}
              <ol className="mt-8 hidden gap-2 animate-[fade-up_1.2s_cubic-bezier(.22,1,.36,1)_1.1s_both] md:flex lg:mt-14">
                {steps.map((s, i) => {
                  const Icon = stepIcons[i % stepIcons.length];
                  const on = i === step;
                  return (
                    <li key={s} className="flex items-center gap-2">
                      <span
                        className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs transition duration-500 ${
                          on ? "border-[#e3cfae]/70 bg-[#e3cfae]/15 text-white" : "border-white/10 text-white/45"
                        }`}
                      >
                        <Icon className="h-4 w-4" strokeWidth={1.5} />
                        {s}
                      </span>
                      {i < steps.length - 1 && <span className="h-px w-3 bg-white/20" />}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>

        {/* 첫 등장 커튼 */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-50 flex">
          {Array.from({ length: STRIPS }).map((_, i) => (
            <span
              key={i}
              className="h-full flex-1 animate-[curtain-up_1.1s_cubic-bezier(.76,0,.24,1)_both] bg-[#121010]"
              style={{ animationDelay: `${0.15 + i * 0.08}s` }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
