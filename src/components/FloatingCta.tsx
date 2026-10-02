"use client";

import {
  ArrowUp,
  BotMessageSquare,
  CalendarCheck,
  MapPin,
  MessageCircle,
  Phone,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Hospital } from "@/lib/data";

// 모바일 · 태블릿 퀵메뉴: 오른쪽 아래 맨 위로 버튼 + 그 위 상담 버튼
// - 상담 버튼을 누르면 아이콘 + 이름이 한 덩어리인 알약 버튼들이 차례로 미끄러져 나옴
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
    {
      href: hospital.naverReservationUrl,
      label: "네이버 예약",
      Icon: CalendarCheck,
      external: true,
      accent: true,
    },
    { href: "/location", label: "오시는 길", Icon: MapPin, internal: true },
    {
      href: hospital.kakaoUrl,
      label: "카카오톡 상담",
      Icon: MessageCircle,
      external: true,
    },
    { href: `tel:${hospital.phone}`, label: "전화 상담", Icon: Phone },
  ];

  return (
    <>
      {/* 펼쳤을 때: 뒤 화면을 살짝 흐리게, 바깥을 누르면 닫힘 */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 bg-[#1d1915]/25 backdrop-blur-[3px] transition-opacity duration-500 lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 lg:hidden">
        <ul
          id="quick-menu"
          className="flex flex-col items-end gap-2"
          aria-hidden={!open}
        >
          {items.map(({ href, label, Icon, external, internal, accent }, i) => {
            const order = items.length - 1 - i; // 버튼에 가까운 것부터
            const pill = `flex items-center gap-2.5 rounded-full py-2.5 pr-5 pl-3 text-[14px] font-medium shadow-[0_12px_28px_-14px_rgba(29,26,23,0.55)] transition active:scale-[0.97] ${
              accent
                ? "bg-gold text-white"
                : "bg-white/95 text-ink backdrop-blur"
            }`;
            const body = (
              <>
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full ${accent ? "bg-white/20" : "bg-[#f3eee6] text-mocha"}`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.7} />
                </span>
                {label}
              </>
            );
            return (
              <li
                key={label}
                style={{
                  transitionDelay: open
                    ? `${order * 55}ms`
                    : `${(items.length - 1 - order) * 25}ms`,
                }}
                className={`origin-right transition-[opacity,translate,scale] duration-500 ease-[cubic-bezier(.22,1.3,.36,1)] ${open ? "translate-x-0 translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-x-6 translate-y-3 scale-90 opacity-0"}`}
              >
                {internal ? (
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    tabIndex={open ? 0 : -1}
                    className={pill}
                  >
                    {body}
                  </Link>
                ) : (
                  <a
                    href={href}
                    tabIndex={open ? 0 : -1}
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className={pill}
                  >
                    {body}
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        {/* 상담 열기 / 닫기: 은은하게 퍼지는 금빛 테두리, 누르면 말풍선 → X */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="quick-menu"
          aria-label={open ? "상담 메뉴 닫기" : "상담 메뉴 열기"}
          className="relative grid h-14 w-14 place-items-center rounded-full bg-espresso text-[#f1e2c6] shadow-[0_14px_30px_-12px_rgba(29,26,23,0.8)] transition active:scale-95"
        >
          {!open && (
            <span
              aria-hidden
              className="absolute inset-0 animate-[cta-ping_2.6s_cubic-bezier(.22,1,.36,1)_infinite] rounded-full border border-gold/70 motion-reduce:hidden"
            />
          )}
          <span
            className={`absolute flex flex-col items-center gap-0.5 transition-[opacity,rotate,scale] duration-400 ${open ? "scale-50 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"}`}
          >
            <BotMessageSquare className="h-6 w-6" strokeWidth={1.5} />
          </span>
          <X
            className={`absolute h-6 w-6 transition-[opacity,rotate,scale] duration-400 ${open ? "scale-100 rotate-0 opacity-100" : "scale-50 rotate-90 opacity-0"}`}
            strokeWidth={1.6}
          />
        </button>

        {/* 맨 위로 */}
        <button
          type="button"
          onClick={() => {
            const L = (
              window as unknown as {
                __lenis?: { scrollTo: (y: number) => void };
              }
            ).__lenis;
            if (L) L.scrollTo(0);
            else window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          aria-label="맨 위로"
          className={`mr-1 grid h-12 w-12 place-items-center rounded-full bg-white/95 text-ink/70 shadow-[0_8px_20px_-10px_rgba(29,26,23,0.45)] backdrop-blur transition-[opacity,translate] duration-300 ${showTop && !open ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}
        >
          <ArrowUp className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </button>
      </div>
    </>
  );
}
