"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";
import type { DeviceStory } from "@/content/device-story";

type Products = NonNullable<DeviceStory["products"]>;

// 쓰는 제품 카드: 옆으로 넘겨 보기 (PC 는 화살표, 모바일은 손가락으로)
// - 제품 사진(image)이 없으면 같은 자리에 옅은 영문 이름
export default function ProductSlider({ products }: { products: Products }) {
  const track = useRef<HTMLUListElement>(null);
  const move = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.clientWidth + 16), behavior: "smooth" });
  };

  // PC 에서 한 번에 3장이 보이므로, 3장 이하면 화살표 숨김
  const total = products.items.length + (products.guide ? 1 : 0);

  return (
    <>
      <div
        className={`mt-8 flex justify-end gap-2 md:-mt-12 ${total <= 3 ? "md:invisible" : ""}`}
      >
        {([-1, 1] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => move(d)}
            aria-label={d < 0 ? "이전 제품" : "다음 제품"}
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
        {products.items.map((it, i) => (
          <li
            key={it.name}
            className="flex w-[82%] shrink-0 snap-start flex-col overflow-hidden rounded-[24px] border border-line bg-white md:w-[calc((100%-2rem)/3)]"
          >
            {/* 제품 사진 */}
            <div className="relative grid aspect-[4/3] place-items-center overflow-hidden bg-ivory">
              {it.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={it.image}
                  alt={`${it.name} 제품`}
                  loading="lazy"
                  className="h-full w-full object-contain p-6"
                />
              ) : (
                <span
                  aria-hidden
                  className="font-display text-[40px] tracking-[0.06em] text-taupe/40 uppercase"
                >
                  {it.en ?? it.name}
                </span>
              )}
              <span className="absolute top-5 left-5 font-display text-xs tracking-[0.3em] text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-7 md:p-8">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-[20px] font-semibold tracking-[-0.02em]">
                  {it.name}
                  {it.en && (
                    <span className="ml-2 font-display text-[13px] font-normal tracking-[0.12em] text-muted uppercase">
                      {it.en}
                    </span>
                  )}
                </h3>
                {it.maker && (
                  <span className="shrink-0 text-[12px] text-muted">
                    {it.maker}
                  </span>
                )}
              </div>
              <p className="mt-4 text-[14px] leading-[1.85] text-muted md:text-[15px]">
                {it.text}
              </p>
              <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-7">
                {it.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-ivory px-3 py-1 text-[12px] text-mocha"
                  >
                    {t}
                  </span>
                ))}
                <a
                  href="#price"
                  className="ml-auto text-[13px] text-ink underline decoration-gold underline-offset-[5px] transition hover:text-gold"
                >
                  가격 보기
                </a>
              </div>
            </div>
          </li>
        ))}

        {products.guide && (
          <li className="flex w-[82%] shrink-0 snap-start flex-col justify-end rounded-[24px] bg-espresso p-7 text-white md:w-[calc((100%-2rem)/3)] md:p-9">
            <p className="font-display text-xs tracking-[0.3em] text-taupe uppercase">
              Consult
            </p>
            <h3 className="mt-4 text-[20px] font-semibold tracking-[-0.02em] md:text-[22px]">
              {products.guide.title}
            </h3>
            <p className="mt-3 text-[14px] leading-[1.85] text-white/65 md:text-[15px]">
              {products.guide.text}
            </p>
          </li>
        )}
      </ul>
    </>
  );
}
