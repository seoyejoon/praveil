"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";

// 카드 옆으로 넘겨 보기 (PC 는 화살표, 모바일은 손가락으로) — 제품 슬라이드(ProductSlider)와 같은 모양
// children 은 <li> 들. 카드 폭은 각 <li> 에서 정함 (예: w-[82%] md:w-[calc((100%-2rem)/3)])
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
      <ul
        ref={track}
        className="no-scrollbar -mx-5 mt-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto overscroll-x-contain px-5 pb-2 md:mx-0 md:scroll-px-0 md:px-0"
      >
        {children}
      </ul>
    </>
  );
}
