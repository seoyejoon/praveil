"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Hospital } from "@/lib/data";

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);
const icons = {
  phone: "M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z",
  talk: "M12 4C7 4 3 7.1 3 11c0 2.4 1.6 4.6 4 5.9L6 21l4.3-2.7c.6.1 1.1.1 1.7.1 5 0 9-3.1 9-7s-4-7-9-7Z",
  calendar: "M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Zm0 4h16M8 3v4m8-4v4",
  pin: "M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
};

// PC 오른쪽 고정 퀵메뉴 (모바일은 하단 상담 바 FloatingCta 사용)
export default function QuickMenu({ hospital }: { hospital: Hospital }) {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = [
    { href: `tel:${hospital.phone}`, label: "전화상담", icon: icons.phone },
    { href: hospital.kakaoUrl, label: "카카오톡", icon: icons.talk, external: true },
    { href: hospital.naverReservationUrl, label: "네이버 예약", icon: icons.calendar, external: true },
    { href: "/location", label: "오시는 길", icon: icons.pin, internal: true },
  ];
  const cls = "flex flex-col items-center gap-1.5 px-2 py-4 text-[11px] tracking-tight text-cream/85 transition hover:bg-white/10 hover:text-white";

  return (
    <aside aria-label="빠른 메뉴" className="fixed top-1/2 right-5 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex">
      <div className="w-[78px] overflow-hidden rounded-full bg-espresso/95 py-3 shadow-[0_14px_36px_rgba(40,28,18,0.22)] backdrop-blur">
        <p className="pb-2 text-center font-display text-[10px] tracking-[0.25em] text-[#ffd899]">QUICK</p>
        <ul className="divide-y divide-cream/10">
          {items.map((item) => (
            <li key={item.label}>
              {item.internal ? (
                <Link href={item.href} className={cls}>
                  <Icon d={item.icon} />
                  {item.label}
                </Link>
              ) : (
                <a href={item.href} {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={cls}>
                  <Icon d={item.icon} />
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="맨 위로"
        className={`grid h-[52px] w-[52px] place-items-center rounded-full border border-ink/10 bg-ivory font-display text-[11px] tracking-[0.15em] text-ink shadow-[0_8px_20px_rgba(40,28,18,0.12)] transition duration-500 hover:bg-ink hover:text-cream ${
          showTop ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        TOP
      </button>
    </aside>
  );
}
