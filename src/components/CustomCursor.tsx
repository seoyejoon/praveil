"use client";

import { useEffect, useRef } from "react";

// 마우스를 부드럽게 따라오는 금색 커서 (마우스가 있는 PC만)
// - 링크 · 버튼 위: 링이 커짐
// - 사진 링크 · data-cursor="보기" 위: 링 안에 글자
// - 글 입력칸 위: 숨김 (기본 커서 사용)
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const label = labelRef.current!;
    const img = imgRef.current!;
    const html = document.documentElement;
    html.classList.add("has-cursor");

    let x = -100,
      y = -100,
      rx = -100,
      ry = -100,
      raf = 0,
      idle = 0,
      shown = false,
      last = performance.now();
    // 원이 따라오는 속도: 화면 주사율과 상관없이 같은 빠르기 (빨리 움직여도 크게 뒤처지지 않게)
    const tick = (now: number) => {
      const k = 1 - Math.pow(1 - 0.38, Math.min(64, now - last) / 16.7);
      last = now;
      rx += (x - rx) * k;
      ry += (y - ry) * k;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!shown) {
        rx = x;
        ry = y;
        shown = true;
        html.dataset.cur = "on";
      }
      clearTimeout(idle);
      const t = e.target as Element | null;
      const field = t?.closest("input, textarea, select, [contenteditable]");
      const tagged = t?.closest<HTMLElement>("[data-cursor]");
      const link = t?.closest("a, button, [role='tab'], label, summary");
      const media = link && link.querySelector("img, video");
      const text = tagged?.dataset.cursor || (media ? "보기" : "");
      html.dataset.cur = field ? "off" : text ? "label" : link ? "hover" : "on";
      if (text && label.textContent !== text) label.textContent = text;
      // 멈춰 있을 때만 글자가 뜨는 곳 (data-cursor-idle): 움직이면 기본, 잠시 멈추면 글자
      const idleEl =
        !field && !tagged
          ? t?.closest<HTMLElement>("[data-cursor-idle]")
          : null;
      if (idleEl && !(link && link !== idleEl)) {
        html.dataset.cur = "on";
        idle = window.setTimeout(() => {
          label.textContent = idleEl.dataset.cursorIdle ?? "";
          // 제품 사진이 있으면 원 안에 사진 + 아래 글자
          const src = idleEl.dataset.cursorImage ?? "";
          if (src) {
            if (img.getAttribute("src") !== src) img.src = src;
            html.dataset.cur = "image";
          } else html.dataset.cur = "label-lg";
        }, 140);
      }
    };
    const onLeave = () => {
      html.dataset.cur = "off";
      shown = false;
    };
    const onDown = () => html.classList.add("cursor-down");
    const onUp = () => html.classList.remove("cursor-down");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(idle);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      html.classList.remove("has-cursor");
      delete html.dataset.cur;
    };
  }, []);

  return (
    <div
      aria-hidden
      className="cursor-layer pointer-events-none fixed inset-0 z-[9999]"
    >
      <div ref={ringRef} className="cursor-ring absolute top-0 left-0">
        <div className="cursor-ring-shape grid place-items-center rounded-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={imgRef} alt="" className="cursor-img" />
          <span
            ref={labelRef}
            className="cursor-label font-display text-[11px] tracking-[0.2em] text-white"
          />
        </div>
      </div>
      <div ref={dotRef} className="cursor-dot absolute top-0 left-0">
        <div className="cursor-dot-shape rounded-full bg-gold" />
      </div>
    </div>
  );
}
