"use client";

import { useRef, useState } from "react";
import type { Feature } from "@/lib/data";
import ImageSlot from "../ImageSlot";

// 가로로 넘기는 강점 카드 (라이브러리 없이 CSS 스크롤 스냅)
export default function WhySlider({ features }: { features: Feature[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    if (!card) return;
    setIndex(Math.min(features.length - 1, Math.round(el.scrollLeft / (card.offsetWidth + 24))));
  };

  const go = (dir: 1 | -1) => {
    const el = ref.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (el && card) el.scrollBy({ left: dir * (card.offsetWidth + 24), behavior: "smooth" });
  };

  return (
    <div>
      <ul
        ref={ref}
        onScroll={onScroll}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-6 overflow-x-auto px-5 md:mx-0 md:scroll-px-0 md:px-0"
      >
        {features.map((f, i) => (
          <li key={f.title} className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[calc((100%-48px)/3)]">
            <ImageSlot label={`0${i + 1}`} className="aspect-[4/5]" />
            <p className="mt-6 font-display text-sm tracking-[0.15em] text-gold">0{i + 1}</p>
            <p className="mt-2 font-serif text-xl font-medium md:text-2xl">{f.title}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{f.description}</p>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex items-center gap-6">
        <p className="font-display text-sm tracking-widest">
          <span className="text-ink">0{index + 1}</span>
          <span className="text-taupe"> / 0{features.length}</span>
        </p>
        <div className="h-px flex-1 bg-line">
          <div
            className="h-px bg-ink transition-all duration-500"
            style={{ width: `${((index + 1) / features.length) * 100}%` }}
          />
        </div>
        <div className="flex gap-2">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => go(dir)}
              aria-label={dir < 0 ? "이전" : "다음"}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/30 transition hover:bg-ink hover:text-cream"
            >
              {dir < 0 ? "←" : "→"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
