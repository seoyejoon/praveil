"use client";

import { ArrowRight } from "lucide-react";
import { useRef } from "react";

// 상담 예약 버튼: 마우스를 따라 살짝 끌려오고(자석), 올리면 금색이 원형으로 차오르며 화살표가 빠져나갔다 다시 들어옴
export default function MagneticButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.25;
    const y = (e.clientY - r.top - r.height / 2) * 0.35;
    el.style.translate = `${x}px ${y}px`;
    el.style.setProperty("--fx", `${e.clientX - r.left}px`);
    el.style.setProperty("--fy", `${e.clientY - r.top}px`);
  };
  const leave = () => {
    ref.current!.style.translate = "0 0";
  };
  return (
    <a
      ref={ref}
      href={href}
      onPointerMove={move}
      onPointerEnter={move}
      onPointerLeave={leave}
      className={`group relative isolate inline-flex h-12 items-center gap-4 overflow-hidden rounded-full bg-ink py-1.5 pr-1.5 pl-7 text-[15px] text-white shadow-[0_14px_30px_-14px_rgba(21,19,17,0.6)] transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:shadow-[0_18px_40px_-14px_rgba(168,142,106,0.7)] md:h-14 md:text-base ${className}`}
    >
      {/* 금색이 마우스 자리에서 원형으로 차오름 */}
      <span
        aria-hidden
        className="absolute -z-10 h-[300%] w-[300%] -translate-1/2 scale-0 rounded-full bg-gold transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-100"
        style={{ left: "var(--fx, 50%)", top: "var(--fy, 50%)" }}
      />
      <span className="relative">{children}</span>
      {/* 화살표: 오른쪽으로 빠져나가고 왼쪽에서 다시 들어옴 */}
      <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-white text-ink md:h-11 md:w-11">
        <ArrowRight
          className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-8"
          strokeWidth={1.8}
        />
        <ArrowRight
          className="absolute h-4 w-4 -translate-x-8 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-0"
          strokeWidth={1.8}
        />
      </span>
    </a>
  );
}
