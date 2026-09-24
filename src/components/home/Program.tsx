"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";

export type ProgramItem = {
  href: string;
  name: string;
  category: string;
  image: string;
  description: string;
  tags: string[];
};

// 대표 시술 프로그램 (어두운 배경)
// PC: 화면이 멈춘 채 스크롤하면 01 → 04로 넘어감 / 모바일: 탭을 눌러 전환
export default function Program({ items }: { items: ProgramItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      triggerRef.current = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${items.length * 70}%`,
        pin: true,
        onUpdate: (self) => setActive(Math.min(items.length - 1, Math.floor(self.progress * items.length))),
      });
      return () => {
        triggerRef.current = null;
      };
    });
    return () => mm.revert();
  }, [items.length]);

  // PC에서 탭을 누르면 해당 위치로 스크롤
  const select = (i: number) => {
    const st = triggerRef.current;
    if (st) window.scrollTo({ top: st.start + ((st.end - st.start) * (i + 0.5)) / items.length, behavior: "smooth" });
    else setActive(i);
  };

  const item = items[active];

  return (
    <section ref={sectionRef} className="overflow-hidden bg-espresso text-cream lg:h-svh">
      <div className="mx-auto grid h-full max-w-[1440px] items-center gap-10 px-5 py-24 md:px-10 lg:grid-cols-2 lg:gap-20 lg:py-0">
        {/* 사진: 겹쳐 두고 선택된 것만 보이게 */}
        <div className="relative aspect-[4/5] overflow-hidden lg:aspect-auto lg:h-[72vh]">
          {items.map((it, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={it.href}
              src={it.image}
              alt=""
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-out ${
                i === active ? "scale-100 opacity-100" : "scale-110 opacity-0"
              }`}
            />
          ))}
          <p className="absolute bottom-5 left-5 font-display text-sm tracking-[0.2em] text-cream/80">
            0{active + 1} / 0{items.length}
          </p>
        </div>

        <div>
          <p className="font-display text-base tracking-[0.15em] text-[#ffd899] md:text-lg">Signature Program</p>
          <h2 className="mt-4 font-serif text-[28px] leading-snug font-medium tracking-tight md:text-[40px]">
            프라베일이 자신 있게
            <br />
            권하는 네 가지 시술
          </h2>

          <div className="mt-10 flex gap-6 border-b border-cream/15 md:mt-14">
            {items.map((it, i) => (
              <button
                key={it.href}
                type="button"
                onClick={() => select(i)}
                className={`relative -mb-px pb-3 font-display text-lg tracking-widest transition md:text-xl ${
                  i === active ? "text-cream" : "text-cream/35 hover:text-cream/70"
                }`}
              >
                0{i + 1}
                <span
                  className={`absolute inset-x-0 bottom-0 h-px bg-[#ffd899] transition-transform duration-500 ${
                    i === active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            ))}
          </div>

          <div key={active} className="animate-rise mt-10 md:mt-12">
            <p className="text-sm text-taupe">{item.category}</p>
            <p className="mt-2 font-serif text-4xl font-medium md:text-5xl">{item.name}</p>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-cream/70 md:text-base">{item.description}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {item.tags.map((t) => (
                <li key={t} className="rounded-full border border-cream/25 px-4 py-1.5 text-[13px] text-cream/80">
                  #{t}
                </li>
              ))}
            </ul>
            <Link
              href={item.href}
              className="mt-10 inline-block border-b border-cream/40 pb-1 font-display text-xs tracking-[0.2em] transition hover:border-[#ffd899] hover:text-[#ffd899]"
            >
              VIEW MORE
            </Link>
          </div>

          <div className="mt-12 h-px bg-cream/15">
            <div
              className="h-px bg-[#ffd899] transition-all duration-500"
              style={{ width: `${((active + 1) / items.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
