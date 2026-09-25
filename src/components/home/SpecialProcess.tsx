"use client";

import { useEffect, useRef, useState } from "react";

type Item = { title: string; body: string; image: string };
type Props = { en: string; title: string; description: string; items: Item[] };

// 프라베일만의 특별함: 왼쪽 제목 + 이전/다음, 오른쪽 아치형 사진 카드가 옆으로 넘어감
export default function SpecialProcess({ en, title, description, items }: Props) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () =>
      setEdge({ start: track.scrollLeft < 8, end: track.scrollLeft + track.clientWidth > track.scrollWidth - 8 });
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const move = (dir: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.querySelector("li");
    if (!track || !card) return;
    track.scrollBy({ left: dir * (card.getBoundingClientRect().width + 32), behavior: "smooth" });
  };

  const arrow = (dir: 1 | -1) => (
    <button
      type="button"
      onClick={() => move(dir)}
      disabled={dir === -1 ? edge.start : edge.end}
      aria-label={dir === -1 ? "이전" : "다음"}
      className="flex h-12 items-center gap-3 rounded-full bg-ivory px-6 font-display text-xs tracking-[0.2em] text-mocha shadow-[0_6px_20px_rgba(52,47,42,0.06)] transition hover:bg-white hover:text-ink disabled:opacity-40"
    >
      {dir === -1 && (
        <svg width="40" height="10" viewBox="0 0 40 10" fill="none" aria-hidden>
          <path d="M40 9H1L8.5 1" stroke="currentColor" />
        </svg>
      )}
      {dir === -1 ? "PREV" : "NEXT"}
      {dir === 1 && (
        <svg width="40" height="10" viewBox="0 0 40 10" fill="none" aria-hidden>
          <path d="M0 9h39L31.5 1" stroke="currentColor" />
        </svg>
      )}
    </button>
  );

  return (
    <section className="relative overflow-hidden bg-cream py-28 md:py-40">
      {/* 양옆 가는 세로선 */}
      <span aria-hidden className="absolute inset-y-0 left-5 w-px bg-ink/[0.06] md:left-10" />
      <span aria-hidden className="absolute inset-y-0 right-5 w-px bg-ink/[0.06] md:right-10" />

      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 md:px-10 lg:grid-cols-[minmax(280px,380px)_1fr] lg:gap-16">
        <div className="lg:pt-24">
          <p className="font-display text-base tracking-[0.12em] text-gold md:text-lg">( {en} )</p>
          <h2 className="mt-4 font-serif text-[30px] leading-tight font-medium tracking-[-0.04em] md:text-[44px]">{title}</h2>
          <p className="mt-6 text-[15px] leading-relaxed whitespace-pre-line text-muted md:text-base">{description}</p>
          <div className="mt-10 hidden gap-3 lg:flex">
            {arrow(-1)}
            {arrow(1)}
          </div>
        </div>

        <ul
          ref={trackRef}
          className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-8 overflow-x-auto px-5 pb-2 md:-mx-10 md:scroll-px-10 md:px-10 lg:mx-0 lg:scroll-px-0 lg:pr-10 lg:pl-0"
        >
          {items.map((item, i) => (
            <li key={item.title} className="w-[74%] shrink-0 snap-start sm:w-[44%] lg:w-[340px] xl:w-[380px]">
              <div className="relative pt-8 pl-6">
                {/* 뒤쪽 아치 선 */}
                <span aria-hidden className="absolute top-3 left-0 h-[calc(100%-1rem)] w-[calc(100%-1.5rem)] rounded-t-full border border-taupe/40" />
                <div className="relative aspect-[4/5] overflow-hidden rounded-t-full bg-sand">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-1000 hover:scale-105" />
                </div>
                <p className="pointer-events-none absolute top-0 left-2 font-display text-[64px] leading-none font-light text-mocha/70 md:text-[76px]">
                  {String(i + 1).padStart(2, "0")}
                </p>
              </div>
              <div className="mt-7 pl-6">
                <p className="font-serif text-xl font-medium tracking-tight md:text-2xl">{item.title}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 flex justify-center gap-3 lg:hidden">
        {arrow(-1)}
        {arrow(1)}
      </div>
    </section>
  );
}
