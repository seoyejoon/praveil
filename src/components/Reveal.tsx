"use client";

import { useEffect, useRef } from "react";

// 화면에 들어오면 한 번 떠오른다. delay(ms)로 순차 등장.
export default function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
  variant = "rise",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
  /** rise: 아래에서 떠오름 / zoom: 크게 있다가 제자리 크기로 줄어들며 나타남 */
  variant?: "rise" | "zoom";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      className={`${variant === "zoom" ? "reveal-zoom" : "reveal"} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
