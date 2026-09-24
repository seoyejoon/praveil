"use client";

import { useEffect, useRef } from "react";

type Stat = { value: number | null; unit: string; label: string; note: string };

// 화면에 들어오면 0부터 목표 숫자까지 올라간다. 값이 없으면 "○"
export default function Stats({ items }: { items: Stat[] }) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const nums = Array.from(root.querySelectorAll<HTMLElement>("[data-count]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 1800);
        const eased = 1 - Math.pow(1 - t, 4);
        nums.forEach((el) => (el.textContent = String(Math.round(Number(el.dataset.count) * eased))));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (reduce) return;
    nums.forEach((el) => (el.textContent = "0"));
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <ul ref={ref} className="grid grid-cols-2 border-t border-ink/15 lg:grid-cols-4">
      {items.map((s, i) => (
        <li
          key={s.label}
          className={`border-b border-ink/15 px-2 py-10 md:px-8 md:py-14 lg:border-b-0 ${i % 2 ? "border-l" : ""} lg:border-l lg:first:border-l-0`}
        >
          <p className="flex items-baseline gap-1">
            {s.value === null ? (
              <span className="font-display text-6xl text-taupe md:text-8xl">○</span>
            ) : (
              <span data-count={s.value} className="font-display text-6xl text-ink tabular-nums md:text-8xl">
                {s.value}
              </span>
            )}
            <span className="font-serif text-xl text-mocha md:text-2xl">{s.unit}</span>
          </p>
          <p className="mt-4 font-medium md:mt-6 md:text-lg">{s.label}</p>
          <p className="mt-1 text-sm text-muted">{s.note}</p>
        </li>
      ))}
    </ul>
  );
}
