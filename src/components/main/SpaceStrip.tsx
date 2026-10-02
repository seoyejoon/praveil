"use client";

import { useEffect, useRef } from "react";

// 병원 공간 사진 줄: 천천히 저절로 흐르고,
// PC는 마우스로 잡아 끌어서 · 모바일은 손가락으로 밀어서 좌우로 움직일 수 있음 (끝없이 이어짐)
// - 스크롤 위치를 1px씩 바꾸면 휴대폰에서 떨려 보여서, 사진 줄 전체를 transform 으로 부드럽게 옮김
// - 손을 떼면 밀던 속도대로 미끄러지다가 다시 천천히 흐름
export default function SpaceStrip({ images }: { images: string[] }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    const track = trackRef.current;
    if (!box || !track) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const AUTO = reduce ? 0 : 0.035; // px / ms
    let x = 0; // 왼쪽으로 옮긴 거리
    let v = 0; // 손을 뗀 뒤 남은 속도 (px / ms)
    let hover = false;
    let drag: {
      id: number;
      startX: number;
      startY: number;
      lastX: number;
      lastT: number;
      axis: "x" | "y" | null;
    } | null = null;
    let moved = false;
    let last = performance.now();
    let raf = 0;

    // 사진 한 벌의 너비 (사이 간격 포함)
    const half = () =>
      (track.scrollWidth +
        parseFloat(getComputedStyle(track).columnGap || "0")) /
      2;
    const render = () => {
      const h = half();
      if (h > 0) x = ((x % h) + h) % h;
      track.style.transform = `translate3d(${-x}px,0,0)`;
    };

    const tick = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      if (!drag) {
        if (Math.abs(v) > 0.002) {
          x += v * dt;
          v *= Math.pow(0.94, dt / 16);
        } else {
          v = 0;
          if (!hover) x += AUTO * dt;
        }
        render();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const down = (e: PointerEvent) => {
      drag = {
        id: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        lastT: performance.now(),
        axis: e.pointerType === "mouse" ? "x" : null,
      };
      moved = false;
      v = 0;
      if (e.pointerType === "mouse") {
        box.setPointerCapture(e.pointerId);
        box.style.cursor = "grabbing";
      }
    };
    const move = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      // 손가락: 처음 움직인 방향이 세로면 페이지 스크롤에 맡김
      if (!drag.axis) {
        const dx = Math.abs(e.clientX - drag.startX);
        const dy = Math.abs(e.clientY - drag.startY);
        if (dx < 6 && dy < 6) return;
        drag.axis = dx > dy ? "x" : "y";
        if (drag.axis === "y") {
          drag = null;
          return;
        }
        box.setPointerCapture(e.pointerId);
      }
      const now = performance.now();
      const dx = e.clientX - drag.lastX;
      if (Math.abs(e.clientX - drag.startX) > 3) moved = true;
      x -= dx;
      v = -dx / Math.max(1, now - drag.lastT);
      drag.lastX = e.clientX;
      drag.lastT = now;
      render();
    };
    const up = () => {
      if (!drag) return;
      drag = null;
      box.style.cursor = "";
      v = Math.max(-1.6, Math.min(1.6, v));
    };
    const stopClick = (e: MouseEvent) => {
      if (moved) e.preventDefault();
    };
    const enter = () => (hover = true);
    const leave = () => (hover = false);

    box.addEventListener("pointerdown", down);
    box.addEventListener("pointermove", move);
    box.addEventListener("pointerup", up);
    box.addEventListener("pointercancel", up);
    box.addEventListener("click", stopClick, true);
    box.addEventListener("mouseenter", enter);
    box.addEventListener("mouseleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      box.removeEventListener("pointerdown", down);
      box.removeEventListener("pointermove", move);
      box.removeEventListener("pointerup", up);
      box.removeEventListener("pointercancel", up);
      box.removeEventListener("click", stopClick, true);
      box.removeEventListener("mouseenter", enter);
      box.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div
      ref={boxRef}
      data-cursor="드래그"
      className="cursor-grab touch-pan-y overflow-hidden select-none"
    >
      <div
        ref={trackRef}
        className="flex w-max gap-4 will-change-transform md:gap-6"
      >
        {[0, 1].map((set) =>
          images.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${set}-${i}`}
              src={src}
              alt=""
              loading="lazy"
              draggable={false}
              aria-hidden={set === 1}
              className={`h-[60svh] max-h-[640px] w-auto shrink-0 rounded-[18px] object-cover md:h-[58svh] md:max-h-[720px] md:rounded-[24px] ${i % 2 ? "aspect-[4/5]" : "aspect-[3/2]"}`}
            />
          )),
        )}
      </div>
    </div>
  );
}
