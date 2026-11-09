"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

// 카드 옆으로 넘겨 보기
// - 카드가 화면 오른쪽 끝까지 이어짐 (왼쪽은 본문 줄에 맞춤)
// - PC: 마우스로 끌어서 좌우로 넘김 + 화살표 / 모바일: 손가락으로 밀어서
// children 은 <li> 들. 카드 폭은 각 <li> 에서 정함 (예: w-[82%] md:w-[400px])
export default function CardSlider({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const track = useRef<HTMLUListElement>(null);

  const move = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.clientWidth + 16), behavior: "smooth" });
  };

  // 마우스로 끌어 넘기기 (끄는 동안에는 칸 맞춤을 잠시 끔, 끌었으면 링크 클릭은 막음)
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let drag: { x: number; left: number; moved: boolean } | null = null;
    // 끄는 동안 위치는 화면 새로 그릴 때 한 번만 반영 (마우스 이벤트마다 바꾸면 버벅임)
    let frame = 0;
    let target = 0;
    let settle = 0;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      cancelAnimationFrame(frame);
      clearTimeout(settle);
      drag = { x: e.clientX, left: el.scrollLeft, moved: false };
      el.style.scrollSnapType = "none";
      el.style.cursor = "grabbing";
    };
    const moveDrag = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (Math.abs(dx) > 4) drag.moved = true;
      target = drag.left - dx;
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0;
          el.scrollLeft = target;
        });
    };
    const up = () => {
      if (!drag) return;
      const moved = drag.moved;
      drag = null;
      el.style.cursor = "";
      // 손을 뗀 자리에서 가까운 카드로 부드럽게 미끄러진 뒤에 칸 맞춤을 다시 켠다
      // (바로 켜면 카드가 순간이동하듯 튐)
      const cards = el.querySelectorAll("li");
      const step =
        cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 0;
      if (step > 0) {
        const max = el.scrollWidth - el.clientWidth;
        const left = Math.min(max, Math.round(el.scrollLeft / step) * step);
        el.scrollTo({ left, behavior: "smooth" });
      }
      settle = window.setTimeout(() => (el.style.scrollSnapType = ""), 450);
      if (moved) {
        const stop = (ev: MouseEvent) => {
          ev.preventDefault();
          ev.stopPropagation();
        };
        el.addEventListener("click", stop, { capture: true, once: true });
        setTimeout(() => el.removeEventListener("click", stop, true), 0);
      }
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", moveDrag);
    window.addEventListener("pointerup", up);
    // 끄는 중에 사진이 따로 끌려 나오지 않게
    const noDrag = (e: DragEvent) => e.preventDefault();
    el.addEventListener("dragstart", noDrag);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", moveDrag);
      window.removeEventListener("pointerup", up);
      el.removeEventListener("dragstart", noDrag);
      cancelAnimationFrame(frame);
      clearTimeout(settle);
    };
  }, []);

  return (
    <>
      <div className="mt-8 flex justify-end gap-2 md:-mt-12">
        {([-1, 1] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => move(d)}
            aria-label={d < 0 ? `이전 ${label}` : `다음 ${label}`}
            className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink/70 transition hover:border-gold hover:text-ink"
          >
            {d < 0 ? (
              <ArrowLeft className="h-4 w-4" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </button>
        ))}
      </div>
      {/* 오른쪽은 화면 끝까지 (본문 폭 밖으로) */}
      <ul
        ref={track}
        className="no-scrollbar -mx-5 mt-6 flex cursor-grab md:mt-14 snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto overscroll-x-contain px-5 pb-2 select-none md:mr-[calc(50%-50vw)] md:ml-0 md:scroll-px-0 md:pr-10 md:pl-0"
      >
        {children}
      </ul>
    </>
  );
}
