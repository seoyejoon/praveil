"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ProcedureCategory } from "@/lib/data";

// 시술 카테고리 목록. PC에서 마우스를 올리면 커서 옆에 해당 사진이 따라다닌다
export default function TreatmentIndex({ categories, images }: { categories: ProcedureCategory[]; images: string[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const float = floatRef.current;
    if (!root || !float || !window.matchMedia("(pointer: fine)").matches) return;
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let raf = 0;
    const loop = () => {
      pos.x += (target.x - pos.x) * 0.12;
      pos.y += (target.y - pos.y) * 0.12;
      float.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
    };
    root.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative" onPointerLeave={() => setHover(null)}>
      <ul className="border-t border-ink/20">
        {categories.map((c, i) => (
          <li key={c.slug} className="border-b border-ink/20" onPointerEnter={() => setHover(i)}>
            <Link
              href={`/treatments/${c.slug}`}
              className="group flex items-center gap-4 py-6 transition-colors md:gap-10 md:py-8"
            >
              <span className="w-8 shrink-0 font-display text-sm text-taupe md:w-12">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1 font-serif text-xl font-medium transition-transform duration-500 group-hover:translate-x-2 md:text-4xl">
                {c.name}
              </span>
              <span className="hidden font-display text-sm tracking-[0.15em] text-gold md:block">{c.nameEn.toUpperCase()}</span>
              <span aria-hidden className="text-taupe transition group-hover:translate-x-1 group-hover:text-ink">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div
        ref={floatRef}
        aria-hidden
        className={`pointer-events-none absolute top-0 left-0 z-10 hidden h-[300px] w-[240px] overflow-hidden transition-opacity duration-300 lg:block ${
          hover === null ? "opacity-0" : "opacity-100"
        }`}
      >
        {images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt=""
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
              hover === i ? "scale-100 opacity-100" : "scale-110 opacity-0"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
