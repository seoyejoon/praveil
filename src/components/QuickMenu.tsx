"use client";

import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Hospital } from "@/lib/data";

const Icon = ({
  d,
  className = "h-5 w-5",
}: {
  d: string;
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d={d} />
  </svg>
);
const icons = {
  phone:
    "M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z",
  talk: "M12 4C7 4 3 7.1 3 11c0 2.4 1.6 4.6 4 5.9L6 21l4.3-2.7c.6.1 1.1.1 1.7.1 5 0 9-3.1 9-7s-4-7-9-7Z",
  calendar:
    "M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Zm0 4h16M8 3v4m8-4v4",
  pin: "M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
};

// 마우스를 올리면 왼쪽에 나오는 이름표
const tip =
  "pointer-events-none absolute top-1/2 right-full mr-3 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-full bg-espresso/90 px-3 py-1.5 text-xs text-white opacity-0 backdrop-blur transition duration-300 group-hover/q:translate-x-0 group-hover/q:opacity-100";

const RING = 2 * Math.PI * 25; // 맨 위로 버튼 둘레 (반지름 25)

// PC 오른쪽 고정 퀵메뉴 (모바일 · 태블릿은 하단 상담 바 FloatingCta 사용)
// - 반투명 유리 판: 전화 · 카카오톡 · 오시는 길
// - 강조 원: 예약
// - 맨 위로: 페이지를 내린 만큼 금색 테두리가 참
export default function QuickMenu({ hospital }: { hospital: Hospital }) {
  const [progress, setProgress] = useState(0);
  const [atFooter, setAtFooter] = useState(false);

  // 맨 아래(지도 · 푸터)가 보이면 가리지 않도록 숨긴다
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(
      ([e]) => setAtFooter(e.isIntersecting),
      { threshold: 0.35 },
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const items = [
    { href: `tel:${hospital.phone}`, label: "전화 상담", icon: icons.phone },
    {
      href: hospital.kakaoUrl,
      label: "카카오톡 상담",
      icon: icons.talk,
      external: true,
    },
    { href: "/location", label: "오시는 길", icon: icons.pin, internal: true },
  ];
  const cls =
    "group/q relative grid h-12 w-12 place-items-center rounded-full text-ink/70 transition duration-300 hover:bg-gold/15 hover:text-mocha";
  const showTop = progress > 0.04;

  return (
    <aside
      aria-label="빠른 메뉴"
      className={`fixed right-6 bottom-8 z-30 hidden flex-col items-center gap-3 transition-[opacity,translate] duration-500 lg:flex ${atFooter ? "pointer-events-none translate-y-4 opacity-0" : ""}`}
    >
      {/* 반투명 유리 판 */}
      <ul className="flex flex-col items-center gap-1 rounded-full border border-white/60 bg-white/70 p-1.5 shadow-[0_18px_40px_-18px_rgba(29,26,23,0.45)] backdrop-blur-xl">
        {items.map((item, i) => (
          <li key={item.label} className="flex flex-col items-center">
            {i > 0 && <span aria-hidden className="mb-1 h-px w-5 bg-ink/10" />}
            {item.internal ? (
              <Link href={item.href} className={cls} aria-label={item.label}>
                <Icon d={item.icon} />
                <span className={tip}>{item.label}</span>
              </Link>
            ) : (
              <a
                href={item.href}
                {...(item.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className={cls}
                aria-label={item.label}
              >
                <Icon d={item.icon} />
                <span className={tip}>{item.label}</span>
              </a>
            )}
          </li>
        ))}
      </ul>

      {/* 강조: 예약 */}
      <a
        href={hospital.naverReservationUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="네이버 예약"
        className="group/q relative flex h-[60px] w-[60px] flex-col items-center justify-center gap-0.5 rounded-full bg-espresso text-[#f1e2c6] shadow-[0_16px_34px_-14px_rgba(29,26,23,0.8)] transition duration-300 hover:bg-mocha hover:text-white"
      >
        <Icon d={icons.calendar} className="h-[18px] w-[18px]" />
        <span className="text-[10px] font-medium tracking-[0.05em]">예약</span>
        <span className={tip}>네이버 예약</span>
      </a>

      {/* 맨 위로 + 읽은 만큼 금색 테두리 */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="맨 위로"
        className={`group/q relative grid h-[52px] w-[52px] place-items-center rounded-full bg-white/95 text-ink/70 shadow-[0_10px_24px_-12px_rgba(29,26,23,0.4)] backdrop-blur-xl transition duration-500 hover:text-mocha ${
          showTop
            ? "opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <svg
          aria-hidden
          viewBox="0 0 52 52"
          className="absolute inset-0 -rotate-90"
        >
          <circle
            cx="26"
            cy="26"
            r="25"
            fill="none"
            stroke="rgba(29,26,23,0.08)"
            strokeWidth="1"
          />
          <circle
            cx="26"
            cy="26"
            r="25"
            fill="none"
            stroke="#a88e6a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={RING}
            strokeDashoffset={RING * (1 - progress)}
          />
        </svg>
        <ArrowUp
          className="h-[18px] w-[18px] transition-[translate] duration-300 group-hover/q:-translate-y-0.5"
          strokeWidth={1.4}
        />
      </button>
    </aside>
  );
}
