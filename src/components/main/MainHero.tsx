"use client";

import { useEffect, useRef, useState } from "react";
import RotatingWord from "@/components/RotatingWord";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";

type Props = {
  eyebrow: string;
  scenes: { title: string[]; words?: string[]; after?: string; sub: string }[];
  /** 밖에서 본 유리문 (닫힘, 가운데가 문 이음새) + 같은 사진에서 문틀 · 손잡이만 지운 것 */
  entrance: { src: string; openSrc: string; width: number; height: number };
};

const POINTS = [0, 0.6, 1]; // 장면이 멈추는 자리 (스크롤 진행 비율)
const LIGHT_FROM = 1.2; // 마우스 조명이 켜지기 시작하는 시각(초)

// 첫 화면
// ● 밖에서 유리문(닫힘)을 바라보며 시작
// ● 마우스: 마우스가 있는 곳만 따뜻한 조명처럼 밝아짐 (PC)
// ● 스크롤: 가운데 문이 양옆으로 열리며 걸어 들어가고 → 인포메이션 데스크로 다가감 → 둥근 카드로 작아지며 다음 섹션으로
export default function MainHero({ eyebrow, scenes, entrance }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const doorLRef = useRef<HTMLDivElement>(null);
  const doorRRef = useRef<HTMLDivElement>(null);
  const facadeRef = useRef<HTMLDivElement>(null);
  const insideRef = useRef<HTMLImageElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef(0); // 스크롤 장면 진행 (0~1)
  const [scene, setScene] = useState(0);
  // 등장 연출은 CSS 애니메이션 대신 GSAP 로 한 번만 재생
  // (스크롤 연출(pin)이 다시 계산될 때마다 CSS 애니메이션이 처음부터 다시 시작돼 사진이 출렁이던 문제)
  const settleRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement[]>([]);

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
      x: root.clientWidth * 0.5,
      y: root.clientHeight * 0.36,
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
      // 마우스가 화면 밖이면 문 안 로고 쪽에 머묾
      if (!L.hover) {
        L.tx = w * 0.5;
        L.ty = h * 0.36;
      }
      const k = 1 - Math.exp(-dt * 4);
      L.x += (L.tx - L.x) * k;
      L.y += (L.ty - L.y) * k;
      spot!.style.setProperty("--lx", `${L.x.toFixed(1)}px`);
      spot!.style.setProperty("--ly", `${L.y.toFixed(1)}px`);
      // 조명은 들어온 뒤 서서히 켜지고, 스크롤로 안에 들어가면 사라짐
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

  // 스크롤 장면: 문이 열리며 안으로
  useEffect(() => {
    const root = rootRef.current;
    const doorL = doorLRef.current;
    const doorR = doorRRef.current;
    const insideImg = insideRef.current;
    const facade = facadeRef.current;
    if (!root || !doorL || !doorR || !insideImg || !facade) return;

    // 사진 속 비율 좌표 → 화면 좌표 (object-cover, 가운데 기준)
    const cover = () => {
      // 사진 틀은 마우스 움직임 여유만큼 화면보다 사방 24px 큼 (-inset-6)
      const W = root.clientWidth + 48,
        H = root.clientHeight + 48;
      const k = Math.max(W / entrance.width, H / entrance.height);
      const dw = entrance.width * k,
        dh = entrance.height * k;
      const ox = (W - dw) / 2,
        oy = (H - dh) / 2;
      return {
        W,
        H,
        at: (u: number, v: number) => ({ x: ox + dw * u, y: oy + dh * v }),
      };
    };
    let C = cover();
    const ease = (x: number) =>
      x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

    // t(0~1): 앞 60% 문이 열리며 한 걸음 들어가고, 뒤쪽은 데스크 쪽으로 더 다가감
    // 배경은 처음부터 끝까지 같은 사진(문틀 · 손잡이만 지운 입구 사진) → 색 · 모양이 바뀌지 않음
    const apply = (t: number) => {
      progressRef.current = t;
      const { W, H, at } = C;
      const d = ease(Math.min(1, t / 0.6));
      const near = ease(Math.max(0, (t - 0.45) / 0.55));
      const cx = W / 2,
        cy = H / 2;
      // 걸어 들어가는 만큼 커짐 (화면 가운데 기준). 끝에는 문 양옆 기둥이 화면 밖으로 나감
      const sF = 1 + 0.22 * d + 0.42 * near;
      // 문 닫힌 원본 사진 → 아주 짧게 겹쳐 사라지고, 같은 자리에 그린 유리문 두 짝이 이어받아 열림
      const photo = 1 - ease(Math.min(1, d / 0.14));
      // 그린 문은 원본 사진이 거의 사라진 뒤부터 움직임 (손잡이가 겹쳐 보이지 않게)
      const open = ease(Math.max(0, (d - 0.12) / 0.88));
      // 데스크로 다가갈 때 로고가 화면 가운데로 오게 옆으로 살짝 이동 (좁은 화면에서 특히)
      const logo = at(0.465, 0);
      const tx = (cx - (cx + sF * (logo.x - cx))) * near;
      insideImg.style.transform = `translateX(${tx}px) scale(${sF})`;
      facade.style.transform = `translateX(${tx}px) scale(${sF})`;
      facade.style.opacity = String(photo);
      const A = at(0.1794, 0),
        S = at(0.4994, 0.894),
        R = at(0.8182, 0);
      const dl = S.x - A.x,
        dr = R.x - S.x;
      const doors = (1 - photo) * (1 - Math.max(0, d - 0.85) / 0.15);
      const place = (el: HTMLDivElement, x: number, w: number, dx: number) => {
        el.style.left = `${cx + sF * (x + dx - cx) + tx}px`;
        el.style.top = `${cy + sF * (A.y - cy)}px`;
        el.style.width = `${w * sF}px`;
        el.style.height = `${(S.y - A.y) * sF}px`;
        el.style.opacity = String(Math.max(0, doors));
      };
      place(doorL, A.x, dl, -open * dl * 1.04);
      place(doorR, S.x, dr, open * dr * 1.04);
    };
    const state = { t: 0 };
    apply(0);
    const onRefresh = () => {
      C = cover();
      apply(state.t);
    };
    ScrollTrigger.addEventListener("refreshInit", onRefresh);
    window.addEventListener("resize", onRefresh);
    // 등장 연출 대상
    const settle = settleRef.current;
    const intro = introRef.current;
    const dots = dotsRef.current.filter(Boolean);
    if (reducedMotion()) {
      gsap.set(settle, { scale: 1 });
      gsap.set([intro, ...dots], { opacity: 1 });
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
        // ① → ② 문이 열리며 안으로
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
    // 처음엔 살짝 크게 → 제자리로, 문구 · 장면 표시가 이어서 들어옴
    const intro0 = gsap.timeline();
    intro0
      .fromTo(
        settle,
        { scale: 1.06 },
        { scale: 1, duration: 2.4, ease: "expo.out" },
        0,
      )
      .fromTo(
        intro,
        {
          opacity: 0,
          x: -56,
          clipPath: "inset(-30% 100% -30% -10%)",
        },
        {
          opacity: 1,
          x: 0,
          clipPath: "inset(-30% -10% -30% -10%)",
          duration: 1.1,
          ease: "expo.out",
        },
        0.6,
      )
      .fromTo(
        dots,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 1, ease: "power1.inOut" },
        1,
      );
    return () => {
      clearTimeout(timer);
      intro0.kill();
      ScrollTrigger.removeEventListener("refreshInit", onRefresh);
      window.removeEventListener("resize", onRefresh);
      ctx.revert();
    };
  }, [entrance]);

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
          <div
            ref={settleRef}
            className="absolute inset-0"
            style={{ transform: "scale(1.06)" }}
          >
            <div
              className="absolute -inset-6 transition-[translate] duration-700 ease-out"
              style={{
                translate:
                  "calc(var(--mx, 0) * -14px) calc(var(--my, 0) * -10px)",
              }}
            >
              {/* 문틀 · 손잡이만 지운 입구 사진 (유리 너머 안쪽이 그대로 이어짐) */}
              <div className="absolute inset-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={insideRef}
                  src={entrance.openSrc}
                  alt="프라베일 인포메이션"
                  className="h-full w-full object-cover will-change-transform"
                />
              </div>

              {/* 밖에서 본 입구 (문 닫힘) */}
              <div
                ref={facadeRef}
                className="absolute inset-0 will-change-transform"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={entrance.src}
                  alt="프라베일 입구"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* 그린 유리문 두 짝: 입구 사진 속 문과 같은 자리 · 같은 모양 (문틀 · 손잡이), 스크롤하면 양옆으로 열림 */}
              {[doorLRef, doorRRef].map((ref, i) => (
                <div
                  key={i}
                  ref={ref}
                  aria-hidden
                  className="absolute top-0 left-0 opacity-0 will-change-[left,opacity]"
                >
                  {/* 유리: 아주 옅은 색 + 비스듬한 반사 */}
                  <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,246,232,0.10),rgba(255,246,232,0.02)_40%,rgba(255,246,232,0.07)_70%,rgba(255,246,232,0.01))]" />
                  {/* 이음새 쪽 문틀 */}
                  <div
                    className={`absolute inset-y-0 w-[0.7%] min-w-[2px] bg-[#16120f] ${i === 0 ? "right-0" : "left-0"}`}
                  />
                  {/* 바깥쪽 얇은 문틀 */}
                  <div
                    className={`absolute inset-y-0 w-[0.4%] min-w-[1px] bg-[#16120f]/70 ${i === 0 ? "left-0" : "right-0"}`}
                  />
                  {/* 손잡이 */}
                  <div
                    className="absolute top-[48%] h-[17.5%] w-[1.9%] min-w-[3px] rounded-full bg-[#16120f] shadow-[0_0_0_1px_rgba(255,240,220,0.08)]"
                    style={i === 0 ? { left: "94.6%" } : { left: "2.8%" }}
                  />
                </div>
              ))}
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
                    ref={i === 0 ? introRef : undefined}
                    style={i === 0 ? { opacity: 0 } : undefined}
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
            ref={(el) => {
              if (el) dotsRef.current[0] = el;
            }}
            style={{ opacity: 0 }}
            className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 items-center gap-2 lg:flex"
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
            ref={(el) => {
              if (el) dotsRef.current[1] = el;
            }}
            style={{ opacity: 0 }}
            className="absolute right-5 bottom-28 flex flex-col items-center gap-2 lg:hidden"
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
