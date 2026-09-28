"use client";

import { ArrowUp } from "lucide-react";
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
  const [atFooter, setAtFooter] = useState(false);
  // 맨 아래(지도 · 푸터)가 보이면 가리지 않도록 숨긴다
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(([e]) => setAtFooter(e.isIntersecting), { threshold: 0.35 });
    io.observe(footer);
    return () => io.disconnect();
  }, []);
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
  // 아이콘만 보이고, 마우스를 올리면 왼쪽에 이름이 나온다
  const cls = "group/q relative grid h-14 w-14 place-items-center text-white transition hover:bg-white hover:text-gold";
  const tip = "pointer-events-none absolute top-1/2 right-full mr-3 -translate-y-1/2 translate-x-2 whitespace-nowrap rounded-full bg-espresso px-3 py-1.5 text-xs text-white opacity-0 transition group-hover/q:translate-x-0 group-hover/q:opacity-100";

  return (
    <aside aria-label="빠른 메뉴" className={`fixed right-6 bottom-8 z-30 hidden flex-col items-center transition-[opacity,transform] duration-500 lg:flex ${atFooter ? "pointer-events-none translate-y-4 opacity-0" : ""}`}>
      <div className="overflow-hidden rounded-[18px] bg-gold shadow-[0_14px_36px_rgba(0,0,0,0.18)]">
        <ul className="divide-y divide-white/10">
          {items.map((item) => (
            <li key={item.label} className="group">
              {item.internal ? (
                <Link href={item.href} className={cls}>
                  <Icon d={item.icon} />
                  <span className={tip}>{item.label}</span>
                </Link>
              ) : (
                <a href={item.href} {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={cls}>
                  <Icon d={item.icon} />
                  <span className={tip}>{item.label}</span>
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
        className={`mt-3 grid h-14 w-14 place-items-center rounded-full border border-black/10 bg-white text-black shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition duration-500 hover:bg-gold hover:text-white ${
          showTop ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <ArrowUp className="h-5 w-5" strokeWidth={1.5} />
      </button>
    </aside>
  );
}
