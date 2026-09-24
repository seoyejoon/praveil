"use client";

import Link from "next/link";
import { useState } from "react";
import { navItems } from "@/lib/nav";

export default function Header({ phone }: { phone: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ivory/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-20 md:px-8">
        <Link href="/" className="font-serif text-lg tracking-wide md:text-xl" onClick={() => setOpen(false)}>
          PRAVEIL
          <span className="ml-2 align-middle text-xs tracking-normal text-mocha">프라베일 맑고고운의원</span>
        </Link>

        <nav className="hidden items-center gap-10 text-sm md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-mocha">
              {item.label}
            </Link>
          ))}
          <a href={`tel:${phone}`} className="rounded-full bg-espresso px-5 py-2 text-ivory hover:bg-mocha">
            상담 전화
          </a>
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`h-px w-6 bg-espresso transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
          <span className={`h-px w-6 bg-espresso transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-ivory md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block border-b border-line px-5 py-4 text-sm"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
