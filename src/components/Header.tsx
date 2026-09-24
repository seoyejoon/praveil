"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navItems } from "@/lib/nav";

// 메인 첫 화면 위에서는 투명(흰 글씨), 스크롤하거나 다른 페이지에서는 크림 배경.
export default function Header({ phone, reservationUrl }: { phone: string; reservationUrl: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const overHero = pathname === "/" && !scrolled && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        overHero ? "text-white" : "border-b border-line bg-cream/95 text-ink backdrop-blur"
      }`}
    >
      <div className="mx-auto grid h-16 max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-5 md:h-20 md:px-10">
        <nav className="hidden items-center gap-8 text-[15px] lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="opacity-90 transition hover:opacity-100 hover:text-gold">
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="flex h-10 w-10 flex-col justify-center gap-1.5 lg:hidden"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`h-px w-6 bg-current transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
          <span className={`h-px w-6 bg-current transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
        </button>

        <Link href="/" className="text-center leading-none">
          <span className="block font-display text-2xl tracking-[0.18em] md:text-[28px]">PRAVEIL</span>
          <span className="mt-1 block text-[10px] tracking-[0.3em] opacity-70 md:text-[11px]">맑고고운의원</span>
        </Link>

        <div className="flex items-center justify-end gap-5 text-[15px]">
          <a href={`tel:${phone}`} className="hidden opacity-90 transition hover:text-gold md:block">
            전화문의
          </a>
          <a
            href={reservationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden rounded-full border px-5 py-2 transition md:block ${
              overHero ? "border-white/60 hover:bg-white hover:text-ink" : "border-ink hover:bg-ink hover:text-cream"
            }`}
          >
            예약하기
          </a>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-cream lg:hidden">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="block border-b border-line px-5 py-4 text-sm">
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
