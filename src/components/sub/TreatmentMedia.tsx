"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, Play, RotateCcw, X } from "lucide-react";
import SectionHead from "@/components/sub/SectionHead";
import type { ProductClip, ProductMedia } from "@/content/treatment-media";

const focusStyle =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mocha";

/** External players are created only after an explicit play action. */
function ClipPlayer({
  item,
  clip,
}: {
  item: ProductMedia;
  clip?: ProductClip;
}) {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const playRef = useRef<HTMLButtonElement>(null);

  function close() {
    setPlaying(false);
    setFailed(false);
    // Focus the control that replaces the removed player.
    requestAnimationFrame(() => playRef.current?.focus());
  }

  return (
    <div className="flex min-w-0 flex-col bg-ivory">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {playing && clip ? (
          failed ? (
            <div
              role="status"
              className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-5 text-center text-ink"
            >
              <p className="max-w-sm text-sm leading-relaxed">
                영상을 불러오지 못했습니다.
                <br />
                다시 시도하거나 공식 사이트에서 확인해 주세요.
              </p>
              <button
                type="button"
                onClick={() => setFailed(false)}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-mocha px-5 py-2 text-sm text-mocha ${focusStyle}`}
              >
                <RotateCcw aria-hidden="true" className="h-4 w-4" /> 다시 시도
              </button>
            </div>
          ) : clip.kind === "vimeo" ? (
            <iframe
              src={`https://player.vimeo.com/video/${clip.videoId}?autoplay=1&dnt=1&title=0&byline=0&portrait=0`}
              title={`${item.name} ${clip.title}`}
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 h-full w-full border-0 bg-espresso"
            />
          ) : (
            <video
              src={clip.src}
              autoPlay
              controls
              playsInline
              preload="metadata"
              aria-label={`${item.name} ${clip.title}`}
              onError={() => setFailed(true)}
              className="absolute inset-0 h-full w-full bg-espresso object-contain"
            >
              영상 재생을 지원하지 않는 브라우저입니다. 공식 사이트에서 확인해
              주세요.
            </video>
          )
        ) : (
          <>
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.image.src}
                alt={item.image.alt}
                loading="lazy"
                decoding="async"
                className={`absolute inset-x-[10%] top-[6%] w-4/5 object-contain ${clip ? "h-[calc(88%_-_60px)]" : "h-[88%]"}`}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-espresso pb-16 text-white">
                <p className="font-display text-[clamp(2rem,6vw,4.5rem)] tracking-[0.08em]">
                  {item.english}
                </p>
                <p className="text-sm text-taupe">제조사 브랜드 영상</p>
              </div>
            )}
            {clip && (
              <div className="absolute inset-x-0 bottom-[6%] flex justify-center px-4">
                <button
                  ref={playRef}
                  type="button"
                  aria-label={`${item.name} ${clip.title} 재생`}
                  onClick={() => setPlaying(true)}
                  className={`inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-mocha px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-espresso ${focusStyle}`}
                >
                  <Play
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="currentColor"
                  />
                  {clip.title} 재생
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex min-h-14 items-center justify-between gap-4 px-5 py-3 text-xs leading-relaxed text-muted md:px-7">
        <p>
          {playing
            ? "영상이 표시되지 않으면 공식 사이트에서 확인해 주세요."
            : (item.image?.credit ?? "쥬베룩 공식 사이트 영상")}
        </p>
        {playing && (
          <button
            type="button"
            onClick={close}
            className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 px-2 text-sm text-mocha ${focusStyle}`}
          >
            <X aria-hidden="true" className="h-4 w-4" /> 영상 닫기
          </button>
        )}
      </div>
    </div>
  );
}

function ProductPanel({ item }: { item: ProductMedia }) {
  const [clipIndex, setClipIndex] = useState(0);
  const clip = item.clips?.[clipIndex];
  return (
    <div
      data-product={item.id}
      className="grid overflow-hidden rounded-[28px] bg-espresso md:rounded-[40px] lg:grid-cols-[1.35fr_1fr]"
    >
      <ClipPlayer key={clip?.id ?? "image"} item={item} clip={clip} />
      <div className="flex min-w-0 flex-col justify-center px-6 py-8 text-white md:p-12">
        <h3 className="text-[24px] leading-snug font-semibold tracking-[-0.03em] md:text-[30px]">
          {item.name}
        </h3>
        <p className="mt-3 font-display text-sm tracking-[0.08em] text-taupe">
          {item.english}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-taupe">{item.maker}</p>
        <p className="mt-6 max-w-prose text-[15px] leading-[1.9] text-white/75">
          {item.description}
        </p>
        {item.clips && item.clips.length > 1 && (
          <div
            role="group"
            aria-label={`${item.name} 영상 선택`}
            className="mt-6 flex flex-wrap gap-2"
          >
            {item.clips.map((entry, index) => (
              <button
                key={entry.id}
                type="button"
                aria-pressed={clipIndex === index}
                onClick={() => setClipIndex(index)}
                className={`min-h-11 rounded-full border px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe ${clipIndex === index ? "border-taupe bg-taupe text-espresso" : "border-white/30 text-white hover:border-taupe"}`}
              >
                {entry.title}
              </button>
            ))}
          </div>
        )}
        <div className="mt-7 border-t border-white/20 pt-5 text-[13px] leading-relaxed text-taupe">
          {item.source.href ? (
            <a
              href={item.source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 underline decoration-taupe/50 underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe"
            >
              {item.source.label}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span className="sr-only"> (새 창)</span>
            </a>
          ) : (
            <p>{item.source.label}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/** Supplements the existing introduction and principle; it does not replace them. */
export default function TreatmentMedia({ items }: { items: ProductMedia[] }) {
  const [selected, setSelected] = useState(0);
  const active = items[selected];
  if (!active) return null;

  return (
    <section
      id="product-media"
      aria-label="장비 · 제품 영상과 사진"
      className="mx-auto max-w-[1400px] scroll-mt-44 px-5 pb-24 md:scroll-mt-60 md:px-10 md:pb-36"
    >
      <SectionHead en="Product media" title="장비 · 제품을 살펴보세요" />
      {items.length > 1 && (
        <div
          role="group"
          aria-label="장비 · 제품 선택"
          className="mt-7 flex flex-wrap gap-2"
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
              className={`min-h-11 rounded-full border px-5 py-2.5 text-sm transition-colors ${focusStyle} ${selected === index ? "border-espresso bg-espresso text-white" : "border-line text-muted hover:border-mocha hover:text-ink"}`}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
      <div className="mt-8 md:mt-10">
        <ProductPanel key={active.id} item={active} />
      </div>
    </section>
  );
}
