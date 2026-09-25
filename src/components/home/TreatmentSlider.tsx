"use client";

import Link from "next/link";
import { useRef, useState } from "react";

type Slide = {
  slug: string;
  name: string;
  nameEn: string;
  body: string;
  image: string;
  procedures: { href: string; name: string }[];
};
type Props = { en: string; title: readonly string[]; description: string; slides: Slide[] };

// 진료분야: 위 제목 + 좌우 버튼, 아래 큰 사진 + 설명이 한 장씩 넘어감 (모바일은 손가락으로 넘김)
export default function TreatmentSlider({ en, title, description, slides }: Props) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  const go = (next: number) => {
    const track = trackRef.current;
    if (!track) return;
    const i = (next + slides.length) % slides.length;
    track.scrollTo({ left: (track.children[i] as HTMLElement).offsetLeft - track.offsetLeft, behavior: "smooth" });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track || !track.clientWidth) return;
    setIndex(Math.min(slides.length - 1, Math.max(0, Math.round(track.scrollLeft / track.clientWidth))));
  };

  const circle = (dir: 1 | -1) => (
    <button
      type="button"
      onClick={() => go(index + dir)}
      aria-label={dir === -1 ? "이전 진료분야" : "다음 진료분야"}
      className="grid h-12 w-12 place-items-center rounded-full border border-ink/70 transition hover:bg-ink hover:text-cream md:h-14 md:w-14"
    >
      <svg width="9" height="14" viewBox="0 0 9 14" fill="none" aria-hidden className={dir === -1 ? "" : "rotate-180"}>
        <path d="M8 1 2 7l6 6" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </button>
  );

  return (
    <section className="bg-ivory py-28 md:py-40">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-base tracking-[0.12em] text-gold md:text-lg">{en}</p>
            <h2 className="mt-5 font-serif text-[30px] leading-[1.35] font-medium tracking-[-0.04em] md:text-[44px]">
              {title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed whitespace-pre-line text-muted md:text-base">{description}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="mr-4 font-display text-sm tracking-[0.2em] text-taupe">
              <span className="text-ink">{String(index + 1).padStart(2, "0")}</span> / {String(slides.length).padStart(2, "0")}
            </p>
            {circle(-1)}
            {circle(1)}
          </div>
        </div>

        <ul ref={trackRef} onScroll={onScroll} className="no-scrollbar mt-12 flex snap-x snap-mandatory overflow-x-auto md:mt-16">
          {slides.map((s) => (
            <li key={s.slug} className="grid w-full shrink-0 snap-start gap-8 md:grid-cols-[1.05fr_1fr] md:items-center md:gap-16">
              <div className="aspect-[16/11] overflow-hidden rounded-[28px] bg-sand md:rounded-[36px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.image} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="pr-1">
                <p className="font-display text-sm tracking-[0.2em] text-gold uppercase">{s.nameEn}</p>
                <p className="mt-3 font-serif text-[28px] font-medium tracking-tight md:text-[40px]">{s.name}</p>
                <p className="mt-5 text-[15px] leading-[1.9] text-muted md:text-base">{s.body}</p>
                <ul className="mt-7 flex flex-wrap gap-2">
                  {s.procedures.slice(0, 6).map((p) => (
                    <li key={p.href}>
                      <Link href={p.href} className="block rounded-full border border-ink/15 px-4 py-1.5 text-[13px] text-muted transition hover:border-ink hover:text-ink">
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/treatments/${s.slug}`}
                  className="mt-9 inline-flex items-center gap-3 rounded-full bg-sand/70 px-7 py-3.5 text-sm text-mocha transition hover:bg-ink hover:text-cream"
                >
                  View More <span aria-hidden>›</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
