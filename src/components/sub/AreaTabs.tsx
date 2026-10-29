"use client";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useRef, useState } from "react";
import FaceZoneIcon, { hasFaceZone } from "@/components/sub/FaceZoneIcon";
import type { TreatmentItem } from "@/content/treatments";

// 부위별 시술: 위에서 부위를 고르면 아래 판에 그 부위의 설명 · 시술 포인트 · 권하는 분
// - 모든 부위의 글은 HTML 에 들어 있고 고른 것만 보임 (검색엔진이 다 읽을 수 있게)
export default function AreaTabs({ items }: { items: TreatmentItem[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const go = (i: number, focus = false) => {
    const next = (i + items.length) % items.length;
    setActive(next);
    if (focus) tabs.current[next]?.focus();
  };
  const total = String(items.length).padStart(2, "0");

  return (
    <>
      <div
        role="tablist"
        aria-label="시술 부위"
        className="mt-12 grid grid-cols-4 gap-2 md:mt-16 md:gap-3 lg:grid-cols-8"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(active + 1, true);
          if (e.key === "ArrowLeft") go(active - 1, true);
        }}
      >
        {items.map((it, i) => {
          const on = i === active;
          return (
            <button
              key={it.name}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`area-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls={`area-panel-${i}`}
              tabIndex={on ? 0 : -1}
              onClick={() => go(i)}
              className={`flex flex-col items-center gap-2 rounded-2xl border px-1 pt-4 pb-3 transition duration-300 md:gap-3 md:pt-5 md:pb-4 ${on ? "border-white bg-white text-ink" : "border-white/12 text-white/75 hover:border-gold/60 hover:text-white"}`}
            >
              {hasFaceZone(it.name) && (
                <FaceZoneIcon
                  name={it.name}
                  className="h-9 w-9 md:h-11 md:w-11"
                />
              )}
              <span className="text-[13px] font-medium break-keep md:text-[15px]">
                {it.name}
              </span>
            </button>
          );
        })}
      </div>

      {items.map((it, i) => (
        <div
          key={it.name}
          id={`area-panel-${i}`}
          role="tabpanel"
          aria-labelledby={`area-tab-${i}`}
          hidden={i !== active}
          className="mt-4 grid overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] md:mt-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
        >
          {/* 그림: 아치 안에 부위 표시 + 큰 영문 */}
          <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden border-b border-white/10 px-6 pt-14 pb-16 md:min-h-[420px] lg:border-r lg:border-b-0">
            <p className="absolute top-6 left-6 font-display text-xs tracking-[0.35em] text-taupe md:top-8 md:left-8">
              {String(i + 1).padStart(2, "0")} / {total}
            </p>
            <div
              key={`arch-${active}`}
              className="grid aspect-[4/5] w-[56%] max-w-[260px] animate-[fade-up_0.7s_cubic-bezier(0.22,1,0.36,1)_both] place-items-center rounded-t-full rounded-b-[28px] bg-white/[0.06] ring-1 ring-white/10"
            >
              {hasFaceZone(it.name) && (
                <FaceZoneIcon
                  name={it.name}
                  className="h-[62%] w-[62%] text-white"
                />
              )}
            </div>
            <p
              aria-hidden
              className="pointer-events-none absolute right-0 bottom-3 left-0 truncate px-6 text-center font-display text-[44px] leading-none tracking-[0.06em] text-white/[0.07] uppercase md:text-[64px]"
            >
              {it.en ?? it.name}
            </p>
            {/* 이전 · 다음 */}
            <div className="absolute right-5 bottom-5 flex gap-2 md:right-6 md:bottom-6">
              <button
                type="button"
                onClick={() => go(i - 1)}
                aria-label="이전 부위"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-gold hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => go(i + 1)}
                aria-label="다음 부위"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-gold hover:text-white"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 글 */}
          <div
            key={`text-${active}`}
            className="animate-[fade-up_0.7s_cubic-bezier(0.22,1,0.36,1)_both] px-6 py-10 md:px-12 md:py-14 xl:px-16"
          >
            {it.en && (
              <p className="font-display text-xs tracking-[0.35em] text-gold uppercase">
                {it.en}
              </p>
            )}
            <h3 className="mt-3 text-[28px] font-semibold tracking-[-0.03em] md:text-[34px]">
              {it.name}
            </h3>
            <p className="mt-2 text-[15px] text-white/80 md:text-[17px]">
              {it.text}
            </p>
            {it.detail && (
              <p className="mt-6 text-[15px] leading-[1.9] text-white/60 md:text-[16px]">
                {it.detail}
              </p>
            )}

            {it.points && (
              <ol className="mt-8 border-t border-white/10">
                {it.points.map((p, n) => (
                  <li
                    key={p}
                    className="flex items-baseline gap-5 border-b border-white/10 py-4"
                  >
                    <span className="w-5 shrink-0 font-display text-lg text-gold italic">
                      {n + 1}
                    </span>
                    <span className="text-[15px] leading-relaxed text-white/80">
                      {p}
                    </span>
                  </li>
                ))}
              </ol>
            )}

            {it.recommend && (
              <div className="mt-8">
                <p className="text-xs tracking-[0.2em] text-taupe">
                  이런 분께 권합니다
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {it.recommend.map((r) => (
                    <li
                      key={r}
                      className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[13px] text-white/80 md:text-sm"
                    >
                      <Check className="h-3.5 w-3.5 shrink-0 text-gold" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
