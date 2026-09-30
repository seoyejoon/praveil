"use client";

import { useEffect, useRef, useState } from "react";
import { logoShapes } from "@/components/Logo";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";

type Spot = { x: number; y: number; w: number }; // 사진 속 로고 자리 (사진 기준 비율)
type Photo = { src: string; logo: Spot; color: string };
type Props = {
  eyebrow: string;
  scenes: { title: string[]; sub: string }[];
  lobby: Photo;
  room: Photo;
};

const LOGO = logoShapes.stacked;
const [, , VBW, VBH] = LOGO.viewBox.split(" ").map(Number);
const IMG_W = 2400,
  IMG_H = 1350;
const PAD = 24; // 마우스 따라 움직일 여유 (사진 가장자리가 보이지 않게)
const CENTER_COLOR = "#efe2c8";

// 첫 화면: 스크롤하는 만큼 장면이 넘어감 (장면 사이에서 멈추면 가까운 장면으로 맞춰짐)
// ① 로비 사진, 벽에 로고
// ② 카메라가 로고 쪽으로 다가가고, 로고가 벽에서 떠올라 화면 가운데로
// ③ 아치 모양으로 시술실 사진이 열리고, 로고는 시술실 벽에 자리 잡음
// ④ 사진이 둥근 카드로 작아지며 다음 섹션(흰 배경)으로 이어짐
export default function MainHero({ eyebrow, scenes, lobby, room }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const lobbyRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<HTMLDivElement>(null);
  const roomImgRef = useRef<HTMLImageElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const [scene, setScene] = useState(0);

  // 마우스 → 사진이 살짝 반대로, 떠오른 로고는 조금 더 움직여 깊이감
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

  // 스크롤 장면
  useEffect(() => {
    const root = rootRef.current;
    const logo = logoRef.current;
    if (!root || !logo) return;

    // 사진이 화면을 덮을 때(object-cover) 사진 속 로고 자리가 어디인지 계산 (사진 틀 기준 좌표, 틀은 화면보다 PAD 만큼 큼)
    const spot = (s: Spot) => {
      const bw = root.clientWidth + PAD * 2,
        bh = root.clientHeight + PAD * 2;
      const k = Math.max(bw / IMG_W, bh / IMG_H);
      const dw = IMG_W * k,
        dh = IMG_H * k;
      const ox = (bw - dw) * s.x,
        oy = (bh - dh) / 2;
      const w = dw * s.w;
      const h = (w * VBH) / VBW;
      return { cx: ox + dw * s.x, cy: oy + dh * s.y, w, h };
    };
    const centerW = () => logo.offsetWidth;
    const logoAt = (s: Spot) => {
      const p = spot(s);
      const k = p.w / centerW();
      return { x: p.cx - p.w / 2, y: p.cy - p.h / 2, scale: k };
    };
    const center = () => ({
      x: PAD + (root.clientWidth - centerW()) / 2,
      y: PAD + root.clientHeight * 0.42 - (centerW() * VBH) / VBW / 2,
      scale: 1,
    });

    const place = () =>
      gsap.set(logo, { ...logoAt(lobby.logo), color: lobby.color });
    place();
    if (reducedMotion()) {
      window.addEventListener("resize", place);
      return () => window.removeEventListener("resize", place);
    }

    // 장면 맞춤: 스크롤이 멈추면, 움직이던 방향의 다음 장면으로 부드럽게 이동 (조금만 내려도 다음 장면으로)
    const POINTS = [0, 0.45, 0.8, 1];
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
            duration: 1.1,
            easing: (x: number) => 1 - Math.pow(1 - x, 3),
          });
        else window.scrollTo({ top: y, behavior: "smooth" });
      }, 160);
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=260%",
          pin: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
          onUpdate: (st) => {
            setScene(st.progress < 0.25 ? 0 : st.progress < 0.65 ? 1 : 2);
            snapLater(st);
          },
        },
      });

      // ① → ② 로비 벽으로 다가가며 어두워지고, 로고는 가운데로
      tl.fromTo(
        lobbyRef.current,
        {
          scale: 1,
          transformOrigin: () =>
            `${spot(lobby.logo).cx}px ${spot(lobby.logo).cy}px`,
        },
        { scale: 1.7, duration: 0.4 },
        0,
      )
        .fromTo(
          shadeRef.current,
          { opacity: 0 },
          { opacity: 0.7, duration: 0.4 },
          0,
        )
        .fromTo(
          logo,
          { ...logoAt(lobby.logo), color: lobby.color, "--detach": 0 },
          {
            ...center(),
            x: () => center().x,
            y: () => center().y,
            color: CENTER_COLOR,
            "--detach": 1,
            duration: 0.4,
            ease: "power1.inOut",
          },
          0,
        )
        .to(copyRefs.current[0], { opacity: 0, y: -40, duration: 0.15 }, 0.05)
        .fromTo(
          copyRefs.current[1],
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.15 },
          0.25,
        )

        // ② → ③ 아치 모양으로 시술실이 열리고, 로고는 시술실 벽으로
        .fromTo(
          roomRef.current,
          { clipPath: "inset(100% 50% 0% 50% round 999px 999px 0px 0px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)",
            duration: 0.3,
            ease: "power2.inOut",
          },
          0.5,
        )
        .fromTo(
          roomImgRef.current,
          { scale: 1.3 },
          { scale: 1, duration: 0.3, ease: "power2.out" },
          0.5,
        )
        .to(
          logo,
          {
            x: () => logoAt(room.logo).x,
            y: () => logoAt(room.logo).y,
            scale: () => logoAt(room.logo).scale,
            color: room.color,
            "--detach": 0,
            duration: 0.3,
            ease: "power2.inOut",
          },
          0.5,
        )
        .to(copyRefs.current[1], { opacity: 0, y: -40, duration: 0.12 }, 0.5)
        .fromTo(
          copyRefs.current[2],
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.15 },
          0.65,
        )

        // ③ → ④ 둥근 카드로 작아지며 다음 섹션으로
        .fromTo(
          stageRef.current,
          { clipPath: "inset(0% 0% 0% 0% round 0px)" },
          {
            clipPath: "inset(6% 4% 6% 4% round 32px)",
            duration: 0.2,
            ease: "power1.inOut",
          },
          0.8,
        )
        .to(copyRefs.current[2], { opacity: 0, duration: 0.12 }, 0.86)
        .to(eyebrowRef.current, { autoAlpha: 0, duration: 0.12 }, 0.86);
    }, root);
    ScrollTrigger.refresh();
    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [lobby, room]);

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
          className="absolute inset-0 overflow-hidden bg-[#1b1714]"
        >
          {/* 사진 두 장 + 로고 (마우스 따라 살짝 반대로 움직임). 처음엔 크게 시작해 제자리로 */}
          <div className="absolute inset-0 animate-[hero-in_2.2s_cubic-bezier(.22,1,.36,1)_both]">
            <div
              className="absolute -inset-6 transition-[translate] duration-700 ease-out"
              style={{
                translate:
                  "calc(var(--mx, 0) * -14px) calc(var(--my, 0) * -10px)",
              }}
            >
              <div
                ref={lobbyRef}
                className="absolute inset-0 will-change-transform"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lobby.src}
                  alt=""
                  className="h-full w-full object-cover"
                  style={{ objectPosition: `${lobby.logo.x * 100}% 50%` }}
                />
                <div
                  ref={shadeRef}
                  className="absolute inset-0 bg-[#15110d] opacity-0"
                />
              </div>
              <div
                ref={roomRef}
                className="absolute inset-0 overflow-hidden [clip-path:inset(100%_50%_0%_50%_round_999px_999px_0px_0px)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={roomImgRef}
                  src={room.src}
                  alt=""
                  className="h-full w-full object-cover"
                  style={{ objectPosition: `${room.logo.x * 100}% 50%` }}
                />
              </div>

              {/* 로고: 벽에 붙어 있다가 떠오름. 처음 한 번 빛이 지나감 */}
              <div
                ref={logoRef}
                className="absolute top-0 left-0 w-[66vw] origin-top-left md:w-[30vw] md:max-w-[560px] md:min-w-[320px]"
                style={{ color: lobby.color }}
              >
                <div
                  style={{
                    translate:
                      "calc(var(--mx, 0) * 18px * var(--detach, 0)) calc(var(--my, 0) * 12px * var(--detach, 0))",
                  }}
                >
                  <svg
                    viewBox={LOGO.viewBox}
                    role="img"
                    aria-label="PRAVEIL 프라베일 맑고고운의원"
                    className="block h-auto w-full drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]"
                  >
                    <defs>
                      <linearGradient
                        id="hero-logo-shine"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0.35"
                      >
                        <stop offset="0" stopColor="currentColor" />
                        <stop offset="0.42" stopColor="currentColor" />
                        <stop offset="0.5" stopColor="#fff6e4" />
                        <stop offset="0.58" stopColor="currentColor" />
                        <stop offset="1" stopColor="currentColor" />
                        <animateTransform
                          attributeName="gradientTransform"
                          type="translate"
                          from="-1.2 0"
                          to="1.2 0"
                          begin="1.2s"
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
            </div>
          </div>

          {/* 글자가 잘 보이도록 위 · 아래 어둡게 */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(20,16,12,0.45),transparent_22%,transparent_55%,rgba(20,16,12,0.7))]" />

          {/* 장면별 문구 */}
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1600px] px-5 pb-28 md:px-10 md:pb-20">
            <p
              ref={eyebrowRef}
              className="animate-[slide-in_1s_cubic-bezier(.22,1,.36,1)_0.9s_both] font-display text-[11px] font-light tracking-[0.4em] text-[#e3cfae] uppercase md:text-xs"
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
                    <p className="mt-3 text-[13px] text-white/60 md:text-sm">
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
                className={`h-1 rounded-full transition-all duration-500 ${i === scene ? "w-7 bg-white" : "w-1.5 bg-white/40"}`}
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
                className={`w-1 rounded-full transition-all duration-500 ${i === scene ? "h-6 bg-white" : "h-1.5 bg-white/40"}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
