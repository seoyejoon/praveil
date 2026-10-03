"use client";

import { MessagesSquare, ScanFace, ShieldCheck, Sofa, Stethoscope } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";

type Item = { icon: string; title: string; text: string; image: string };
const icons = { doctor: Stethoscope, consult: MessagesSquare, genuine: ShieldCheck, device: ScanFace, space: Sofa };

// 특장점: PC는 왼쪽 제목 · 사진이 멈춰 있고, 오른쪽 항목을 스크롤하면 사진이 바뀐다.
export default function MainWhy({ title, items }: { label?: string; title: string[]; items: Item[] }) {
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
          <p className="mb-4 font-display text-[11px] font-light tracking-[0.4em] text-gold uppercase md:mb-5 md:text-xs">
            Why Praveil
          </p>
          <Reveal variant="line" className="text-[34px] leading-[1.2] font-bold tracking-[-0.04em] md:text-[56px]">
            {title.map((t) => (
              <span key={t}>
                <span>{t}</span>
              </span>
            ))}
          </Reveal>
          <div className="relative mt-12 hidden aspect-[4/3] overflow-hidden rounded-[28px] bg-ivory lg:block">
            {items.map((item, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={item.image}
                src={item.image}
                alt={`프라베일 맑고고운의원 ${item.title}`}
                loading="lazy"
                className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1.1s] ease-[cubic-bezier(.22,1,.36,1)] ${
                  active === i ? "scale-100 opacity-100" : "scale-110 opacity-0"
                }`}
              />
            ))}
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
                active === i ? "lg:opacity-100" : "lg:opacity-40"
              }`}
            >
              <div className="flex gap-6 md:gap-10">
                {(() => {
                  const Icon = icons[item.icon as keyof typeof icons] ?? ShieldCheck;
                  return (
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ivory text-gold md:h-16 md:w-16">
                      <Icon className="h-6 w-6 md:h-7 md:w-7" strokeWidth={1.4} />
                    </span>
                  );
                })()}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold tracking-[-0.03em] md:text-[34px]">{item.title}</h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-black/60 md:text-lg">{item.text}</p>
                  <div className="mt-6 aspect-[16/10] overflow-hidden rounded-[18px] lg:hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={`프라베일 맑고고운의원 ${item.title}`} loading="lazy" className="h-full w-full object-cover" />
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
