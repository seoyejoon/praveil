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
                className="mt-5 text-[min(28px,6.9vw)] leading-[1.35] font-light tracking-[-0.04em] md:text-[46px] xl:text-[52px]"
              >
                {/* 첫 줄은 얇게, 마지막 줄(핵심)은 굵게 */}
                {title.map((t, i) => (
                  <span key={t}>
                    <span
                      className={
                        i === title.length - 1 ? "font-bold" : undefined
                      }
                    >
                      {t}
                    </span>
                  </span>
                ))}
              </Reveal>
              <Reveal delay={150}>
                <p className="mt-6 max-w-[560px] text-[15px] leading-[1.75] text-muted md:text-[17px] md:whitespace-pre-line">
                  {text}
                </p>
              </Reveal>

              {/* 진료 흐름: 스크롤을 따라 01 → 04 차례로 켜짐
                  - 첫 원이 글과 같은 왼쪽 선에서 시작, 원 아래 번호 · 이름도 왼쪽 맞춤
                  - 원과 원 사이는 짧은 선 (원을 관통하지 않게 양쪽에 여백), 지난 구간은 금색 */}
              <Reveal delay={300} className="mt-10 lg:mt-12">
                <ol className="grid max-w-[640px] grid-cols-4">
                  {steps.map((s, i) => {
                    const Icon = stepIcons[i % stepIcons.length];
                    const on = i === step;
                    const done = i < step;
                    const last = i === steps.length - 1;
                    return (
                      <li key={s} className="relative min-w-0">
                        {!last && (
                          <span
                            aria-hidden
                            className="absolute top-6 right-3 left-[60px] h-px overflow-hidden bg-line md:top-[30px] md:left-[72px]"
                          >
                            <span
                              className={`block h-full origin-left bg-gold transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${done ? "scale-x-100" : "scale-x-0"}`}
                            />
                          </span>
                        )}
                        <span
                          className={`grid h-12 w-12 place-items-center rounded-full border transition-colors duration-500 md:h-[60px] md:w-[60px] ${
                            on
                              ? "border-gold bg-gold text-white shadow-[0_10px_24px_-12px_rgba(168,142,106,0.9)]"
                              : done
                                ? "border-gold/50 bg-white text-gold"
                                : "border-line bg-white text-ink/30"
                          }`}
                        >
                          <Icon
                            className="h-5 w-5 md:h-6 md:w-6"
                            strokeWidth={1.4}
                          />
                        </span>
                        <span
                          className={`mt-4 block font-display text-[11px] tracking-[0.2em] md:text-[12px] transition-colors duration-500 ${on || done ? "text-gold" : "text-ink/30"}`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`mt-1 block pr-2 text-[13px] font-semibold tracking-[-0.02em] break-keep transition-colors duration-500 md:text-[17px] ${
                            on
                              ? "text-ink"
                              : done
                                ? "text-ink/60"
                                : "text-ink/35"
                          }`}
                        >
                          {s}
                        </span>
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
