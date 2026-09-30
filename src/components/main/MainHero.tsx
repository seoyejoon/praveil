"use client";

import { useEffect, useRef, useState } from "react";
import RotatingWord from "@/components/RotatingWord";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";

type Box = { x0: number; y0: number; x1: number; y1: number };
type Props = {
  eyebrow: string;
  scenes: { title: string[]; words?: string[]; after?: string; sub: string }[];
  lobby: {
    src: string;
    width: number;
    height: number;
    focusX: number;
    glass: Box;
  };
  consult: { src: string };
};

const PAD = 24; // 마우스 따라 움직일 여유 (사진 가장자리가 보이지 않게)
const POINTS = [0, 0.6, 1]; // 장면이 멈추는 자리 (스크롤 진행 비율)
const LIGHT_FROM = 1.2; // 마우스 조명이 켜지기 시작하는 시각(초)

// 첫 화면
// ● 들어오면: 로비가 어둡게 시작 → 천장 조명이 하나씩 톡톡 켜지고, 선반 · 데스크 조명 → 로고에 빛이 스침
// ● 마우스: 마우스가 있는 곳만 따뜻한 조명처럼 밝아지고, 로고 근처를 지나면 글자에 금속 반사 (터치 기기는 조명이 저절로 천천히 움직임)
// ● 유리 상담실: 마우스를 올리면 유리 너머로 상담 장면이 비치고 "1:1 상담실 보기", 누르면 안으로 들어감
// ● 스크롤: 유리 상담실 쪽으로 다가가 상담 장면으로 들어가고(모바일은 가운데 아치 문), 둥근 카드로 작아지며 다음 섹션으로
export default function MainHero({ eyebrow, scenes, lobby, consult }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const lobbyRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const consultImgRef = useRef<HTMLImageElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef(0); // 스크롤 장면 진행 (0~1)
  const [scene, setScene] = useState(0);

  // 마우스 조명 + 로고 반사 + 사진 살짝 반대로 움직임
  useEffect(() => {
    const root = rootRef.current;
    const spot = spotRef.current;
    // 마우스가 있는 PC 에서만
    if (
      !root ||
      !spot ||
      reducedMotion() ||
      !window.matchMedia("(pointer: fine)").matches
    )
      return;
    const L = {
      x: root.clientWidth * 0.45,
      y: root.clientHeight * 0.32,
      tx: 0,
      ty: 0,
      hover: false,
    };
    L.tx = L.x;
    L.ty = L.y;
    let raf = 0,
      last = performance.now();
    const start = last;

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      L.tx = e.clientX - r.left;
      L.ty = e.clientY - r.top;
      L.hover = true;
      root.style.setProperty(
        "--mx",
        (e.clientX / window.innerWidth - 0.5).toFixed(3),
      );
      root.style.setProperty(
        "--my",
        (e.clientY / window.innerHeight - 0.5).toFixed(3),
      );
    };
    const onLeave = () => (L.hover = false);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);

    function tick(now: number) {
      raf = requestAnimationFrame(tick);
      // 첫 화면이 화면 밖이면 계산만 쉼 (고정(pin) 중에는 늘 화면 안)
      if (root!.getBoundingClientRect().bottom < 0) return;
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const t = (now - start) / 1000;
      const w = root!.clientWidth,
        h = root!.clientHeight;
      // 마우스가 화면 밖이면 로고 쪽에 머묾
      if (!L.hover) {
        L.tx = w * 0.45;
        L.ty = h * 0.32;
      }
      const k = 1 - Math.exp(-dt * 4);
      L.x += (L.tx - L.x) * k;
      L.y += (L.ty - L.y) * k;
      spot!.style.setProperty("--lx", `${L.x.toFixed(1)}px`);
      spot!.style.setProperty("--ly", `${L.y.toFixed(1)}px`);
      // 조명은 켜짐이 끝난 뒤 서서히, 스크롤로 상담실에 들어가면 사라짐
      const on = Math.min(1, Math.max(0, (t - LIGHT_FROM) / 1.2));
      spot!.style.opacity = String(
        on * Math.max(0, 1 - progressRef.current * 4),
      );
    }
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // 스크롤 장면: 유리 상담실 안으로
  useEffect(() => {
    const root = rootRef.current;
    const lobbyEl = lobbyRef.current;
    const win = windowRef.current;
    if (!root || !lobbyEl || !win) return;

    // 사진 틀(화면보다 PAD 만큼 큼) 기준으로, 사진 속 비율 좌표 → 틀 좌표
    const frame = () => {
      const bw = root.clientWidth + PAD * 2,
        bh = root.clientHeight + PAD * 2;
      const k = Math.max(bw / lobby.width, bh / lobby.height);
      const dw = lobby.width * k,
        dh = lobby.height * k;
      const ox = (bw - dw) * lobby.focusX,
        oy = (bh - dh) / 2;
      const g = lobby.glass;
      const rect = {
        x0: ox + dw * g.x0,
        y0: oy + dh * g.y0,
        x1: ox + dw * g.x1,
        y1: oy + dh * g.y1,
      };
      // 좁은 화면(모바일)에서는 유리 상담실이 화면 밖이라, 가운데에 문 모양 창을 두고 열림 (옆으로 돌지 않음)
      const narrow = rect.x0 > bw * 0.9;
      return {
        bw,
        bh,
        pan: !narrow,
        rect: narrow
          ? { x0: bw * 0.26, y0: bh * 0.3, x1: bw * 0.74, y1: bh * 0.7 }
          : rect,
      };
    };

    // t(0~1)에 따라: 유리창 가운데를 화면 가운데로 돌리며(pan) 확대(s). 창 밖 로비는 어두워지고, 창은 화면을 채울 때까지 커짐
    let F = frame();
    const apply = (t: number) => {
      progressRef.current = t;
      const { bw, bh, rect, pan } = F;
      const ox = (rect.x0 + rect.x1) / 2,
        oy = (rect.y0 + rect.y1) / 2; // 확대 기준 = 유리창 가운데
      const cx = bw / 2,
        cy = bh / 2;
      const sEnd =
        Math.max(bw / (rect.x1 - rect.x0), bh / (rect.y1 - rect.y0)) * 1.08; // 창이 화면을 다 덮는 배율
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const s = 1 + (sEnd - 1) * Math.pow(t, 1.6);
      const px = pan ? (cx - ox) * e : 0,
        py = pan ? (cy - oy) * e : 0;
      lobbyEl.style.transformOrigin = `${ox}px ${oy}px`;
      lobbyEl.style.transform = `translate(${px}px, ${py}px) scale(${s})`;
      const map = (x: number, y: number) => [
        ox + px + (x - ox) * s,
        oy + py + (y - oy) * s,
      ];
      const [x0, y0] = map(rect.x0, rect.y0);
      const [x1, y1] = map(rect.x1, rect.y1);
      // 유리창 = 상담실. 창 크기 그대로 상담 사진을 담아, 창이 커지는 만큼 방이 가까워짐 (끝나면 화면 가득)
      const L = Math.max(0, x0),
        T = Math.max(0, y0),
        R = Math.min(bw, x1),
        B = Math.min(bh, y1);
      win.style.left = `${L}px`;
      win.style.top = `${T}px`;
      win.style.width = `${Math.max(0, R - L)}px`;
      win.style.height = `${Math.max(0, B - T)}px`;
      const rad = Math.max(0, 1 - t * 1.2) * 44 * Math.min(s, 2.5);
      const arch = (Math.max(0, 1 - t * 1.1) * (R - L)) / 2;
      // 모바일은 아치 문 모양 (위쪽 양 모서리 둥글게)
      win.style.borderRadius = pan
        ? `${rad}px 0 0 0`
        : `${arch}px ${arch}px 0 0`;
      // 안쪽 사진은 창보다 조금 덜 커지게 (깊이감)
      if (consultImgRef.current)
        consultImgRef.current.style.transform = `scale(${1.15 - 0.15 * e})`;
      // 로비 사진 속 유리 너머 공간과 겹치듯 서서히 드러나고, 유리 반사는 들어갈수록 사라짐
      win.style.opacity = String(Math.min(1, t * 3.2));
      if (glareRef.current)
        glareRef.current.style.opacity = String(Math.max(0, 1 - t * 2.2));
      if (shadeRef.current)
        shadeRef.current.style.opacity = String(0.55 * Math.min(1, t * 2));
    };
    const state = { t: 0 };
    apply(0);
    const onRefresh = () => {
      F = frame();
      apply(state.t);
    };
    ScrollTrigger.addEventListener("refreshInit", onRefresh);
    window.addEventListener("resize", onRefresh);
    if (reducedMotion()) {
      return () => {
        ScrollTrigger.removeEventListener("refreshInit", onRefresh);
        window.removeEventListener("resize", onRefresh);
      };
    }

    // 장면 맞춤: 스크롤이 멈추면 움직이던 방향의 다음 장면으로 부드럽게 (조금만 내려도 다음 장면으로)
    let timer = 0;
    const snapLater = (st: ScrollTrigger) => {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        const p = st.progress;
        // window.__noHeroSnap: 화면 점검(캡처)용으로 장면 맞춤을 끌 때
        if (
          !st.isActive ||
          p <= 0 ||
          p >= 1 ||
          (window as unknown as { __noHeroSnap?: boolean }).__noHeroSnap
        )
          return;
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
            duration: 1.4,
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
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (st) => {
              setScene(st.progress < 0.3 ? 0 : 1);
              snapLater(st);
            },
          },
        })
        // ① → ② 유리 상담실 안으로
        .to(state, { t: 1, duration: 0.6, onUpdate: () => apply(state.t) }, 0)
        .to(copyRefs.current[0], { opacity: 0, y: -40, duration: 0.15 }, 0.05)
        .fromTo(
          copyRefs.current[1],
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.15 },
          0.45,
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
        .to(copyRefs.current[1], { autoAlpha: 0, duration: 0.12 }, 0.82);
    }, root);
    ScrollTrigger.refresh();
    return () => {
      clearTimeout(timer);
      ScrollTrigger.removeEventListener("refreshInit", onRefresh);
      window.removeEventListener("resize", onRefresh);
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
          className="absolute inset-0 overflow-hidden bg-[#cbbfae]"
        >
          {/* 처음엔 살짝 크게 시작해 제자리로 */}
          <div className="absolute inset-0 animate-[hero-settle_2.4s_cubic-bezier(.22,1,.36,1)_both]">
            <div
              className="absolute -inset-6 transition-[translate] duration-700 ease-out"
              style={{
                translate:
                  "calc(var(--mx, 0) * -14px) calc(var(--my, 0) * -10px)",
              }}
            >
              {/* 로비 (로고는 사진 속 벽에 있음) */}
              <div
                ref={lobbyRef}
                className="absolute inset-0 overflow-hidden will-change-transform"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lobby.src}
                  alt="프라베일 로비"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: `${lobby.focusX * 100}% 50%` }}
                />

                <div
                  ref={shadeRef}
                  className="pointer-events-none absolute inset-0 bg-[#1f1914] opacity-0"
                />
              </div>

              {/* 유리창 속 상담 장면 → 화면 가득 */}
              <div
                ref={windowRef}
                className="pointer-events-none absolute top-0 left-0 overflow-hidden opacity-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={consultImgRef}
                  src={consult.src}
                  alt="대표원장 1:1 상담"
                  className="h-full w-full object-cover object-[55%_40%] will-change-transform"
                />
                {/* 유리 반사 · 테두리 (들어갈수록 사라짐) */}
                <div
                  ref={glareRef}
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,244,226,0.28),transparent_35%,transparent_60%,rgba(255,244,226,0.12))] shadow-[inset_0_0_0_1px_rgba(255,240,215,0.45)]"
                />
              </div>
            </div>
          </div>

          {/* 마우스 조명: 마우스 주변만 따뜻하게 밝고 둘레는 살짝 어둡게 */}
          <div
            ref={spotRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 motion-reduce:hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--lx,50%)_var(--ly,35%),transparent_0,transparent_9vmax,rgba(18,13,9,0.42)_50vmax)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--lx,50%)_var(--ly,35%),rgba(255,220,165,0.42)_0,rgba(255,220,165,0.14)_8vmax,transparent_20vmax)] mix-blend-screen" />
          </div>

          {/* 글자가 잘 보이도록 아래쪽만 어둡게 */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(30,24,18,0.28),transparent_18%,transparent_52%,rgba(30,24,18,0.72))]" />

          {/* 장면별 문구 */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto max-w-[1600px] px-5 pb-28 md:px-10 md:pb-20">
            <div className="relative grid">
              {scenes.map((s, i) => (
                <div
                  key={s.sub}
                  ref={(el) => {
                    copyRefs.current[i] = el;
                  }}
                  aria-hidden={i !== scene}
                  className={`col-start-1 row-start-1 ${i === 0 ? "" : "opacity-0"}`}
                >
                  {/* 등장 효과는 안쪽에 (바깥은 스크롤 효과가 씀). 조명이 켜진 뒤 들어옴 */}
                  <div
                    className={
                      i === 0
                        ? "animate-[slide-in_1.1s_cubic-bezier(.22,1,.36,1)_1s_both]"
                        : ""
                    }
                  >
                    {i === 0 && (
                      <p className="mb-4 font-display text-[11px] font-light tracking-[0.4em] text-[#f1e2c6] uppercase md:text-xs">
                        {eyebrow}
                      </p>
                    )}
                    <h2 className="text-[24px] leading-[1.4] font-light tracking-[-0.03em] md:text-[34px] 2xl:text-[40px]">
                      {s.title.map((t) => (
                        <span key={t} className="block">
                          {t}
                        </span>
                      ))}
                      {s.words && (
                        <span className="flex items-center gap-2 md:gap-3">
                          <RotatingWord
                            words={s.words}
                            className="text-[#f1e2c6]"
                          />
                          {s.after}
                        </span>
                      )}
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
