"use client";

import { useEffect, useRef } from "react";

// 병원 공간 사진 줄: 천천히 저절로 흐르고,
// PC는 마우스로 잡아 끌어서 · 모바일은 손가락으로 밀어서 좌우로 움직일 수 있음 (끝없이 이어짐)
export default function SpaceStrip({ images }: { images: string[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let paused = false;
    let resumeAt = 0;
    let pos = el.scrollLeft;
    let drag: { x: number; left: number } | null = null;
    let moved = false;

    // 사진 두 벌 중 한 벌 너비만큼 넘어가면 처음으로 (이음매 없이)
    const wrap = () => {
      const half = el.scrollWidth / 2;
      if (half <= 0) return;
      if (el.scrollLeft >= half) el.scrollLeft -= half;
      else if (el.scrollLeft <= 0) el.scrollLeft += half;
    };

    const tick = () => {
      if (!reduce && !paused && !drag && performance.now() > resumeAt) {
        pos += 0.5;
        el.scrollLeft = pos;
        wrap();
      }
      pos = el.scrollLeft;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const hold = () => (resumeAt = performance.now() + 1800);

    // PC: 마우스로 잡아 끌기
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      drag = { x: e.clientX, left: el.scrollLeft };
      moved = false;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (Math.abs(dx) > 3) moved = true;
      el.scrollLeft = drag.left - dx;
      wrap();
      drag.left = el.scrollLeft + dx;
    };
    const up = () => {
      if (!drag) return;
      drag = null;
      el.style.cursor = "";
      hold();
    };
    const stopClick = (e: MouseEvent) => {
      if (moved) e.preventDefault();
    };
    // 모바일: 손가락으로 밀면 그동안 멈춤
    const touch = () => hold();
    const enter = () => (paused = true);
    const leave = () => {
      paused = false;
      hold();
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("click", stopClick, true);
    el.addEventListener("touchstart", touch, { passive: true });
    el.addEventListener("touchmove", touch, { passive: true });
    el.addEventListener("scroll", wrap, { passive: true });
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("click", stopClick, true);
      el.removeEventListener("touchstart", touch);
      el.removeEventListener("touchmove", touch);
      el.removeEventListener("scroll", wrap);
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-cursor="드래그"
      className="no-scrollbar cursor-grab overflow-x-auto overscroll-x-contain select-none"
    >
      <div className="flex w-max gap-4 px-5 md:gap-6 md:px-10">
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
