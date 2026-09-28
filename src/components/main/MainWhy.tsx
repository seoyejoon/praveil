"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";

type Item = { title: string; text: string; image: string };

// 특장점: PC는 왼쪽 제목 · 사진이 멈춰 있고, 오른쪽 항목을 스크롤하면 사진이 바뀐다.
export default function MainWhy({ label, title, items }: { label: string; title: string[]; items: Item[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-white px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-2 lg:gap-24">
        <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:justify-center">
          <p className="font-display text-xs tracking-[0.35em] text-black/50 uppercase md:text-sm">{label}</p>
          <Reveal variant="line" className="mt-6 text-[34px] leading-[1.2] font-bold tracking-[-0.04em] md:text-[56px]">
            {title.map((t) => (
              <span key={t}>
                <span>{t}</span>
              </span>
            ))}
          </Reveal>
          <div className="relative mt-12 hidden aspect-[4/3] overflow-hidden bg-ivory lg:block">
            {items.map((item, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={item.image}
                src={item.image}
                alt=""
                loading="lazy"
                className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1.1s] ease-[cubic-bezier(.22,1,.36,1)] ${
                  active === i ? "scale-100 opacity-100" : "scale-110 opacity-0"
                }`}
              />
            ))}
            <span className="absolute right-5 bottom-5 font-display text-sm tracking-[0.2em] text-white mix-blend-difference">
              0{active + 1} / 0{items.length}
            </span>
          </div>
        </div>

        <ol className="lg:py-[30vh]">
          {items.map((item, i) => (
            <li
              key={item.title}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-index={i}
              className={`border-t border-black/10 py-10 transition-opacity duration-500 last:border-b md:py-14 lg:py-16 ${
                active === i ? "lg:opacity-100" : "lg:opacity-25"
              }`}
            >
              <div className="flex gap-6 md:gap-10">
                <span className="font-display text-lg font-light md:text-2xl">0{i + 1}</span>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold tracking-[-0.03em] md:text-[34px]">{item.title}</h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-black/60 md:text-lg">{item.text}</p>
                  <div className="mt-6 aspect-[16/10] overflow-hidden lg:hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
