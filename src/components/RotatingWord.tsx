"use client";

import { useEffect, useRef, useState } from "react";
import { reducedMotion } from "@/lib/gsap";

// [ 단어 ] 가 위로 넘어가며 바뀜. 괄호 폭은 지금 단어 길이에 맞춰 늘고 줄어듦
export default function RotatingWord({
  words,
  interval = 2500,
  className = "",
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const [word, setWord] = useState(0);
  const refs = useRef<(HTMLSpanElement | null)[]>([]);
  const [widths, setWidths] = useState<number[]>([]);

  useEffect(() => {
    if (reducedMotion() || words.length < 2) return;
    const t = setInterval(
      () => setWord((w) => (w + 1) % words.length),
      interval,
    );
    return () => clearInterval(t);
  }, [words.length, interval]);

  useEffect(() => {
    const measure = () =>
      setWidths(refs.current.map((el) => el?.offsetWidth ?? 0));
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <span className={`inline-flex items-center gap-2 md:gap-3 ${className}`}>
      <span aria-hidden className="font-extralight opacity-50">
        [
      </span>
      <span
        className="relative inline-grid h-[1.4em] overflow-hidden transition-[width] duration-500 ease-[cubic-bezier(.76,0,.24,1)]"
        style={widths[word] ? { width: widths[word] } : undefined}
      >
        {words.map((w, i) => (
          <span
            key={w}
            ref={(el) => {
              refs.current[i] = el;
            }}
            aria-hidden={i !== word}
            className={`col-start-1 row-start-1 w-max font-semibold whitespace-nowrap transition-[translate,opacity] duration-[700ms,350ms] ease-[cubic-bezier(.76,0,.24,1)] ${
              i === word
                ? "translate-y-0 opacity-100"
                : i === (word - 1 + words.length) % words.length
                  ? "-translate-y-full opacity-0"
                  : "translate-y-full opacity-0"
            }`}
          >
            {w}
          </span>
        ))}
      </span>
      <span aria-hidden className="font-extralight opacity-50">
        ]
      </span>
    </span>
  );
}
