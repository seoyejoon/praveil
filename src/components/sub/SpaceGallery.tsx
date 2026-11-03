"use client";

import { useState } from "react";

type Space = { name: string; text: string; image: string };

// 병원 공간: 큰 사진 한 장 + 공간 목록 (누르면 큰 사진이 바뀜)
// PC: 왼쪽 큰 사진 · 오른쪽 목록 / 모바일: 큰 사진 아래 작은 사진을 옆으로 넘겨 고름
export default function SpaceGallery({
  items,
  alt,
}: {
  items: Space[];
  /** 사진 설명 앞에 붙일 병원 이름 */
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const now = items[active];

  return (
    <div className="mt-12 grid gap-4 md:mt-16 lg:grid-cols-[1.6fr_1fr] lg:gap-6">
      {/* 큰 사진: 모두 겹쳐 두고 고른 것만 보이게 (바뀔 때 부드럽게) */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-sand md:rounded-[28px] lg:aspect-auto lg:min-h-[560px]">
        {items.map((it, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={it.name}
            src={it.image}
            alt={`${alt} ${it.name}`}
            loading={i === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === active ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(24,19,15,0.65))] p-6 text-white md:p-8">
          <p className="font-display text-xs tracking-[0.3em] text-white/70">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(items.length).padStart(2, "0")}
          </p>
          <p className="mt-2 text-xl font-semibold md:text-2xl">{now.name}</p>
          <p className="mt-1 text-sm text-white/80 md:text-[15px]">
            {now.text}
          </p>
        </div>
      </div>

      {/* 공간 목록 */}
      <ul className="no-scrollbar -mx-5 flex snap-x gap-3 overflow-x-auto px-5 lg:mx-0 lg:grid lg:snap-none lg:gap-2 lg:overflow-visible lg:px-0">
        {items.map((it, i) => {
          const on = i === active;
          return (
            <li key={it.name} className="w-[38%] shrink-0 snap-start lg:w-auto">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={on}
                className={`flex w-full flex-col gap-2 rounded-[16px] text-left transition lg:flex-row lg:items-center lg:gap-4 lg:p-2.5 ${on ? "lg:bg-white" : "lg:hover:bg-white/60"}`}
              >
                <span
                  className={`block aspect-[4/3] w-full overflow-hidden rounded-[12px] ring-2 transition lg:w-28 lg:shrink-0 ${on ? "ring-gold" : "ring-transparent"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </span>
                <span>
                  <span
                    className={`block text-[14px] font-semibold md:text-[15px] ${on ? "text-ink" : "text-ink/70"}`}
                  >
                    {it.name}
                  </span>
                  <span className="mt-0.5 hidden text-[13px] text-muted lg:block">
                    {it.text}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
