"use client";

import { useEffect, useRef, useState } from "react";
import { logoShapes } from "@/components/Logo";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";

type Spot = { x: number; y: number; w?: number }; // 사진 속 자리 (사진 기준 비율)
type Props = {
  eyebrow: string;
  scenes: { title: string[]; sub: string }[];
  lobby: { src: string; logo: Spot & { w: number }; door: Spot; color: string };
  consult: { src: string };
};

const LOGO = logoShapes.wordmark; // 영문 PRAVEIL 만
const [, , VBW, VBH] = LOGO.viewBox.split(" ").map(Number);
const IMG_W = 2400,
  IMG_H = 1350; // 로비 사진 크기
const PAD = 24; // 마우스 따라 움직일 여유 (사진 가장자리가 보이지 않게)
const POINTS = [0, 0.6, 1]; // 장면이 멈추는 자리 (스크롤 진행 비율)

// 첫 화면: 스크롤하는 만큼 장면이 넘어감 (멈추면 움직이던 방향의 다음 장면으로 맞춰짐)
// ① 로비, 벽에 로고
// ② 카메라가 오른쪽 유리 상담실로 다가가다가, 그 안의 원장 상담 장면으로 이어짐
// ③ 사진이 둥근 카드로 작아지며 다음 섹션(흰 배경)으로
export default function MainHero({ eyebrow, scenes, lobby, consult }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const lobbyRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const consultRef = useRef<HTMLDivElement>(null);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const [scene, setScene] = useState(0);

  // 마우스 → 사진이 살짝 반대로 움직여 깊이감
  useEffect(() => {
    const el = rootRef.current;
    if (!el || reducedMotion() || !window.matchMedia("(pointer: fine)").matches)
      return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty(
          "--mx",
          (e.clientX / window.innerWidth - 0.5).toFixed(3),
        );
        el.style.setProperty(
          "--my",
          (e.clientY / window.innerHeight - 0.5).toFixed(3),
        );
      });
    };
    el.addEventListener("pointermove", onMove);
    return () => {
      el.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const logo = logoRef.current;
    if (!root || !logo) return;

    // 사진이 틀을 덮을 때(object-cover) 사진 속 자리가 틀의 어디인지 (틀은 화면보다 PAD 만큼 큼)
    const spot = (s: Spot) => {
      const bw = root.clientWidth + PAD * 2,
        bh = root.clientHeight + PAD * 2;
      const k = Math.max(bw / IMG_W, bh / IMG_H);
      const dw = IMG_W * k,
        dh = IMG_H * k;
      const ox = (bw - dw) * lobby.logo.x,
        oy = (bh - dh) / 2;
      return { x: ox + dw * s.x, y: oy + dh * s.y, w: dw * (s.w ?? 0) };
    };
    // 로고는 로비 사진 벽에 붙어 사진과 함께 움직임
    const placeLogo = () => {
      const p = spot(lobby.logo);
      const h = (p.w * VBH) / VBW;
      gsap.set(logo, { x: p.x - p.w / 2, y: p.y - h / 2, width: p.w });
    };
    placeLogo();
    ScrollTrigger.addEventListener("refreshInit", placeLogo);
    if (reducedMotion()) {
      window.addEventListener("resize", placeLogo);
      return () => {
        window.removeEventListener("resize", placeLogo);
        ScrollTrigger.removeEventListener("refreshInit", placeLogo);
      };
    }

    // 장면 맞춤: 스크롤이 멈추면 움직이던 방향의 다음 장면으로 부드럽게 (조금만 내려도 다음 장면으로)
    let timer = 0;
    const snapLater = (st: ScrollTrigger) => {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        const p = st.progress;
        if (!st.isActive || p <= 0 || p >= 1) return;
        const target =
          st.direction > 0
            ? POINTS.find((v) => v >= p - 0.002)!
            : [...POINTS].reverse().find((v) => v <= p + 0.002)!;
        if (Math.abs(target - p) < 0.004) return;
        const y = st.start + (st.end - st.start) * target;
        const lenis = (
          window as unknown as {
            __lenis?: { scrollTo: (y: number, o: object) => void };
          }
        ).__lenis;
        if (lenis)
          lenis.scrollTo(y, {
            duration: 1.2,
            easing: (x: number) => 1 - Math.pow(1 - x, 3),
          });
        else window.scrollTo({ top: y, behavior: "smooth" });
      }, 160);
    };

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=220%",
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
            onUpdate: (st) => {
              setScene(st.progress < 0.3 ? 0 : 1);
              snapLater(st);
            },
          },
        })
        // ① → ② 유리 상담실 쪽으로 다가감
        .fromTo(
          lobbyRef.current,
          {
            scale: 1,
            filter: "blur(0px)",
            transformOrigin: () =>
              `${Math.min(spot(lobby.door).x, root.clientWidth + PAD)}px ${spot(lobby.door).y}px`,
          },
          { scale: 2.6, duration: 0.55, ease: "power1.in" },
          0,
        )
        .to(lobbyRef.current, { filter: "blur(6px)", duration: 0.2 }, 0.35)
        // 상담실 안 장면이 겹쳐지며 드러남
        .fromTo(
          consultRef.current,
          { opacity: 0, scale: 1.18, filter: "blur(10px)" },
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.25,
            ease: "power2.out",
          },
          0.33,
        )
        .to(copyRefs.current[0], { opacity: 0, y: -40, duration: 0.15 }, 0.05)
        .fromTo(
          copyRefs.current[1],
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.15 },
          0.42,
        )
        // ② → ③ 둥근 카드로 작아지며 다음 섹션으로
        .fromTo(
          stageRef.current,
          { clipPath: "inset(0% 0% 0% 0% round 0px)" },
          {
            clipPath: "inset(6% 4% 6% 4% round 32px)",
            duration: 0.25,
            ease: "power1.inOut",
          },
          0.75,
        )
        .to(
          [copyRefs.current[1], eyebrowRef.current],
          { autoAlpha: 0, duration: 0.12 },
          0.82,
        );
    }, root);
    ScrollTrigger.refresh();
    return () => {
      clearTimeout(timer);
      ScrollTrigger.removeEventListener("refreshInit", placeLogo);
      ctx.revert();
    };
  }, [lobby]);

  return (
    // 고정(pin)되는 섹션은 한 번 감싸야 페이지 이동 시 오류가 나지 않는다
    <div>
      <section
        ref={rootRef}
        data-dark-hero
        className="relative h-svh min-h-[600px] overflow-hidden bg-white text-white"
      >
        <div
          ref={stageRef}
          className="absolute inset-0 overflow-hidden bg-[#2a241e]"
        >
          {/* 처음엔 크게 시작해 제자리로 */}
          <div className="absolute inset-0 animate-[hero-in_2.2s_cubic-bezier(.22,1,.36,1)_both]">
            <div
              className="absolute -inset-6 transition-[translate] duration-700 ease-out"
              style={{
                translate:
                  "calc(var(--mx, 0) * -14px) calc(var(--my, 0) * -10px)",
              }}
            >
              {/* 로비 + 벽의 로고 */}
              <div
                ref={lobbyRef}
                className="absolute inset-0 will-change-transform"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lobby.src}
                  alt="프라베일 로비"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: `${lobby.logo.x * 100}% 50%` }}
                />
                <div
                  ref={logoRef}
                  className="absolute top-0 left-0"
                  style={{ color: lobby.color }}
                >
                  <svg
                    viewBox={LOGO.viewBox}
                    role="img"
                    aria-label="PRAVEIL 프라베일 맑고고운의원"
                    className="block h-auto w-full drop-shadow-[0_1px_1px_rgba(255,248,236,0.6)]"
                  >
                    <defs>
                      {/* 처음 한 번 로고 위로 빛이 지나감 */}
                      <linearGradient
                        id="hero-logo-shine"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0.35"
                      >
                        <stop offset="0" stopColor="currentColor" />
                        <stop offset="0.42" stopColor="currentColor" />
                        <stop offset="0.5" stopColor="#fff3dc" />
                        <stop offset="0.58" stopColor="currentColor" />
                        <stop offset="1" stopColor="currentColor" />
                        <animateTransform
                          attributeName="gradientTransform"
                          type="translate"
                          from="-1.2 0"
                          to="1.2 0"
                          begin="1.4s"
                          dur="1.8s"
                          fill="freeze"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d={LOGO.d}
                      fill="url(#hero-logo-shine)"
                      fillRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* 상담 장면 */}
              <div ref={consultRef} className="absolute inset-0 opacity-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={consult.src}
                  alt="대표원장 1:1 상담"
                  className="h-full w-full object-cover object-[58%_40%]"
                />
              </div>
            </div>
          </div>

          {/* 글자가 잘 보이도록 아래쪽만 어둡게 */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(30,24,18,0.28),transparent_18%,transparent_52%,rgba(30,24,18,0.72))]" />

          {/* 장면별 문구 */}
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1600px] px-5 pb-28 md:px-10 md:pb-20">
            <p
              ref={eyebrowRef}
              className="animate-[slide-in_1s_cubic-bezier(.22,1,.36,1)_0.9s_both] font-display text-[11px] font-light tracking-[0.4em] text-[#f1e2c6] uppercase md:text-xs"
            >
              {eyebrow}
            </p>
            <div className="relative mt-4 grid">
              {scenes.map((s, i) => (
                <div
                  key={s.sub}
                  ref={(el) => {
                    copyRefs.current[i] = el;
                  }}
                  aria-hidden={i !== scene}
                  className={`col-start-1 row-start-1 ${i === 0 ? "" : "opacity-0"}`}
                >
                  {/* 등장 효과는 안쪽에 (바깥은 스크롤 효과가 씀) */}
                  <div
                    className={
                      i === 0
                        ? "animate-[slide-in_1.1s_cubic-bezier(.22,1,.36,1)_1s_both]"
                        : ""
                    }
                  >
                    <h2 className="text-[24px] leading-[1.4] font-light tracking-[-0.03em] md:text-[34px] 2xl:text-[40px]">
                      {s.title.map((t) => (
                        <span key={t} className="block">
                          {t}
                        </span>
                      ))}
                    </h2>
                    <p className="mt-3 text-[13px] text-white/70 md:text-sm">
                      {s.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 장면 위치 표시 */}
          <div
            aria-hidden
            className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 animate-[fade-up_1s_ease_1.4s_both] items-center gap-2 lg:flex"
          >
            {scenes.map((s, i) => (
              <span
                key={s.sub}
                className={`h-1 rounded-full transition-all duration-500 ${i === scene ? "w-7 bg-white" : "w-1.5 bg-white/45"}`}
              />
            ))}
          </div>
          <div
            aria-hidden
            className="absolute right-5 bottom-28 flex animate-[fade-up_1s_ease_1.4s_both] flex-col items-center gap-2 lg:hidden"
          >
            {scenes.map((s, i) => (
              <span
                key={s.sub}
                className={`w-1 rounded-full transition-all duration-500 ${i === scene ? "h-6 bg-white" : "h-1.5 bg-white/45"}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
