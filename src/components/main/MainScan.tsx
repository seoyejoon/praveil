"use client";

import { Activity, ClipboardCheck, ScanFace, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import FaceScan, { type ScanItem } from "@/components/main/FaceScan";
import Reveal from "@/components/Reveal";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";

type Props = {
  eyebrow: string;
  title: string[];
  text: string;
  items: ScanItem[];
  steps: string[];
  video?: string;
};

const stepIcons = [ScanFace, Activity, ClipboardCheck, Sparkles];

// 두 번째 섹션: 피부를 먼저 읽는다
// - 오른쪽: 3D 얼굴을 스캔하며 분석 항목이 나타남 (FaceScan)
// - 왼쪽: 철학 문구, 아래에 진단 → 분석 → 맞춤 설계 → 시술 단계가 켜짐
// - 스캔 · 단계는 스크롤을 따라 진행 (PC: 화면이 멈춘 채 스크롤 / 모바일: 얼굴이 화면을 지나가는 동안). 올리면 거꾸로
// - 첫 화면이 둥근 카드로 작아지며 이어지도록 흰 배경
export default function MainScan({
  eyebrow,
  title,
  text,
  items,
  steps,
  video,
}: Props) {
  const [step, setStep] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const progress = useRef({ current: 0 }).current;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (reducedMotion()) {
      progress.current = 1;
      setStep(steps.length - 1);
      return;
    }
    const onUpdate = (st: ScrollTrigger) => {
      progress.current = st.progress;
      setStep(
        Math.min(steps.length - 1, Math.floor(st.progress * steps.length)),
      );
    };
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const st = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "+=120%",
        pin: true,
        scrub: true,
        onUpdate,
      });
      return () => st.kill();
    });
    mm.add("(max-width: 1023px)", () => {
      const st = ScrollTrigger.create({
        trigger: faceRef.current,
        start: "top 75%",
        end: "bottom 40%",
        scrub: true,
        onUpdate,
      });
      return () => st.kill();
    });
    return () => mm.revert();
  }, [progress, steps.length]);

  return (
    // 고정(pin)되는 섹션은 한 번 감싸야 페이지 이동 시 오류가 나지 않는다
    <div>
      <section ref={rootRef} className="relative bg-white text-ink">
        <div className="relative overflow-hidden lg:h-svh lg:min-h-[720px]">
          {/* 은은한 베이지 빛 */}
          <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_68%_50%,rgba(236,229,218,0.7),transparent_70%)]" />
          <div className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgba(194,176,150,0.5)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(60%_70%_at_68%_50%,#000,transparent)]" />

          <div className="relative mx-auto grid h-full max-w-[1600px] gap-6 px-5 py-24 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
            {/* 글자 */}
            <div className="flex flex-col justify-center">
              <p className="font-display text-[11px] font-light tracking-[0.4em] text-gold uppercase md:text-xs">
                {eyebrow}
              </p>
              <Reveal
                variant="line"
                className="mt-5 text-[26px] leading-[1.4] font-light tracking-[-0.03em] md:text-[40px]"
              >
                {title.map((t) => (
                  <span key={t}>
                    <span>{t}</span>
                  </span>
                ))}
              </Reveal>
              <Reveal delay={150}>
                <p className="mt-5 max-w-[460px] text-[14px] leading-relaxed text-muted md:text-[15px]">
                  {text}
                </p>
              </Reveal>

              {/* 진료 흐름: 차례로 켜짐 */}
              <Reveal delay={300} className="mt-8 lg:mt-12">
                <ol className="flex flex-wrap gap-2">
                  {steps.map((s, i) => {
                    const Icon = stepIcons[i % stepIcons.length];
                    const on = i === step;
                    return (
                      <li key={s} className="flex items-center gap-2">
                        <span
                          className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs transition duration-500 ${
                            on
                              ? "border-gold/60 bg-sand/70 text-ink"
                              : "border-line text-ink/40"
                          }`}
                        >
                          <Icon className="h-4 w-4" strokeWidth={1.5} />
                          {s}
                        </span>
                        {i < steps.length - 1 && (
                          <span className="hidden h-px w-3 bg-line md:block" />
                        )}
                      </li>
                    );
                  })}
                </ol>
              </Reveal>
            </div>

            {/* 분석 장면 */}
            <div
              ref={faceRef}
              className="relative h-[80vw] max-h-[560px] min-h-[360px] lg:h-auto lg:max-h-none lg:py-6 lg:pr-20"
            >
              <FaceScan
                items={items}
                video={video}
                tone="light"
                progress={progress}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
