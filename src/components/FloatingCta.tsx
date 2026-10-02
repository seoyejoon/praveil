"use client";

import {
  ArrowUp,
  CalendarCheck,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Hospital } from "@/lib/data";

// 모바일 · 태블릿 퀵메뉴: 오른쪽 아래 맨 위로 버튼 + 그 위 접힌 상담 버튼
// - 상담 버튼을 누르면 위로 전화 · 카카오톡 · 오시는 길 · 예약이 펼쳐짐
export default function FloatingCta({ hospital }: { hospital: Hospital }) {
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 400);
      setOpen(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = [
    { href: hospital.naverReservationUrl, label: "네이버 예약", Icon: CalendarCheck, external: true },
    { href: "/location", label: "오시는 길", Icon: MapPin, internal: true },
    { href: hospital.kakaoUrl, label: "카카오톡 상담", Icon: MessageCircle, external: true },
    { href: `tel:${hospital.phone}`, label: "전화 상담", Icon: Phone },
  ];

  return (
    <>
      {/* 펼쳤을 때 바깥을 누르면 닫힘 */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 bg-black/20 transition-opacity duration-300 lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-2.5 lg:hidden">
        <ul id="quick-menu" className="flex flex-col items-end gap-2.5" aria-hidden={!open}>
          {items.map(({ href, label, Icon, external, internal }, i) => {
            const cls = `flex items-center gap-2.5 transition-[opacity,translate] duration-300 ${open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`;
            const body = (
              <>
                <span className="rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-ink shadow-[0_6px_16px_-8px_rgba(0,0,0,0.4)]">
                  {label}
                </span>
                <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-mocha shadow-[0_8px_20px_-10px_rgba(0,0,0,0.5)]">
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
              </>
            );
            return (
              <li key={label} style={{ transitionDelay: open ? `${(items.length - 1 - i) * 40}ms` : "0ms" }} className={cls}>
                {internal ? (
                  <Link href={href} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1} className="flex items-center gap-2.5">
                    {body}
                  </Link>
                ) : (
                  <a
                    href={href}
                    tabIndex={open ? 0 : -1}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex items-center gap-2.5"
                  >
                    {body}
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        {/* 상담 열기 / 닫기 */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="quick-menu"
          aria-label={open ? "상담 메뉴 닫기" : "상담 메뉴 열기"}
          className="flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-full bg-espresso text-[#f1e2c6] shadow-[0_12px_28px_-12px_rgba(29,26,23,0.8)]"
        >
          <Plus className={`h-5 w-5 transition-transform duration-300 ${open ? "rotate-45" : ""}`} strokeWidth={1.6} />
          <span className="text-[10px] font-medium">{open ? "닫기" : "상담"}</span>
        </button>

        {/* 맨 위로 */}
        <button
          type="button"
          onClick={() => {
            const L = (window as unknown as { __lenis?: { scrollTo: (y: number) => void } }).__lenis;
            if (L) L.scrollTo(0);
            else window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          aria-label="맨 위로"
          className={`grid h-12 w-12 place-items-center self-end mr-1 rounded-full bg-white/95 text-ink/70 shadow-[0_8px_20px_-10px_rgba(29,26,23,0.45)] backdrop-blur transition-[opacity,translate] duration-300 ${showTop ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}
        >
          <ArrowUp className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </button>
      </div>
    </>
  );
}
