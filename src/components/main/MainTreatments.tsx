"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import type { SiteSection } from "@/content/sitemap";
import { gsap } from "@/lib/gsap";

// 진료 분야 5개: 큰 목록. PC는 줄에 마우스를 올리면 그 분야 사진이 마우스를 따라다닌다.
export default function MainTreatments({ sections, images }: { sections: SiteSection[]; images: Record<string, string> }) {
  const floatRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    const el = floatRef.current;
    if (!el) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
    const move = (e: MouseEvent) => {
      xTo(e.clientX + 24);
      yTo(e.clientY - 150);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <section className="bg-white px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-xs tracking-[0.35em] text-black/50 uppercase md:text-sm">Treatment</p>
            <Reveal variant="line" className="mt-6 text-[34px] leading-[1.2] font-bold tracking-[-0.04em] md:text-[56px]">
              <span>
                <span>진료 분야</span>
              </span>
            </Reveal>
          </div>
          <p className="text-[15px] text-black/55 md:text-lg">피부 고민에 맞는 분야를 먼저 골라 보세요.</p>
        </div>

        <ul className="mt-14 border-t border-black md:mt-20" onMouseLeave={() => setHover(null)}>
          {sections.map((s, i) => (
            <li key={s.key} className="border-b border-black/12" onMouseEnter={() => setHover(s.key)}>
              <Link href={s.href} className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-7 md:gap-10 md:py-10">
                <span className="font-display text-sm font-light text-black/40 md:text-base">0{i + 1}</span>
                <span className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-8">
                  <span className="text-[28px] font-bold tracking-[-0.04em] transition-transform duration-500 group-hover:translate-x-3 md:text-[52px]">
                    {s.label}
                  </span>
                  <span className="font-display text-sm font-light tracking-[0.2em] text-black/40 uppercase md:text-lg">{s.en}</span>
                </span>
                <span className="grid h-11 w-11 place-items-center rounded-full border border-black/20 transition duration-500 group-hover:bg-black group-hover:text-white md:h-14 md:w-14">
                  →
                </span>
                <span className="col-span-3 flex flex-wrap gap-2 md:col-start-2 md:col-span-1 md:-mt-4">
                  {s.pages.map((p, j) => (
                    <span key={p.href} className="text-[13px] text-black/50 md:text-sm">
                      {p.label}
                      {p.best && <sup className="ml-0.5 font-display text-[9px] tracking-wider text-black">BEST</sup>}
                      {j < s.pages.length - 1 && <span className="ml-2 text-black/20">/</span>}
                    </span>
                  ))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 마우스를 따라다니는 사진 (PC) */}
      <div
        ref={floatRef}
        aria-hidden
        className={`pointer-events-none fixed top-0 left-0 z-30 hidden h-[300px] w-[240px] overflow-hidden transition-[opacity,scale] duration-500 lg:block ${
          hover ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        {sections.map((s) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={s.key}
            src={images[s.key]}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${hover === s.key ? "opacity-100" : "opacity-0"}`}
          />
        ))}
      </div>
    </section>
  );
}
