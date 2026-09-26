"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import MemberModal, { type SignupConfig } from "@/components/MemberModal";
import { buildNav } from "@/lib/nav";

type Props = {
  phone: string;
  reservationUrl: string;
  categories: { slug: string; name: string }[];
  member: { name: string } | null;
  signup: SignupConfig;
};

// 어두운 상단 사진([data-dark-hero]) 위에서는 투명(흰 글씨), 스크롤하거나 메뉴를 열면 크림 배경.
// PC: 메뉴에 마우스를 올리면 전체 하위 메뉴 패널이 내려온다. 모바일: 전체 화면 메뉴 + 펼침 목록.
export default function Header({ phone, reservationUrl, categories, member, signup }: Props) {
  const nav = buildNav(categories);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false); // 모바일 메뉴
  const [mega, setMega] = useState(false); // PC 하위 메뉴 패널
  const [active, setActive] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null); // 모바일에서 펼친 메뉴
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const closeLogin = useCallback(() => setLoginOpen(false), []);
  const router = useRouter();

  async function logout() {
    await fetch("/api/member/logout", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
    router.refresh();
  }

  function openLogin() {
    closeAll();
    setLoginOpen(true);
  }
  // 첫 렌더에서 깜빡이지 않도록: 상단 사진이 없는 페이지(공지 상세)만 처음부터 크림 배경
  const [hasHero, setHasHero] = useState(!/^\/notice\/.+/.test(pathname));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    closeAll();
    setHasHero(Boolean(document.querySelector("[data-dark-hero]")));
  }, [pathname]);

  // 모바일 메뉴가 열려 있으면 뒤 페이지 스크롤을 막는다.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeAll();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function closeAll() {
    setOpen(false);
    setMega(false);
    setActive(null);
  }

  function openMega(index: number) {
    setMega(true);
    setActive(index);
  }

  const overHero = hasHero && !scrolled && !open && !mega;
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        ref={headerRef}
        onMouseLeave={() => setMega(false)}
        onBlur={(e) => {
          if (!headerRef.current?.contains(e.relatedTarget as Node | null)) setMega(false);
        }}
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
          overHero ? "text-white" : "border-b border-line bg-cream/95 text-ink backdrop-blur"
        }`}
      >
        <div className="mx-auto grid h-16 max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-5 md:h-20 md:px-10">
          {/* PC 상위 메뉴 */}
          <nav className="hidden h-full items-stretch gap-9 text-[15px] lg:flex" aria-label="주 메뉴">
            {nav.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => openMega(i)}
                onFocus={() => openMega(i)}
                onClick={closeAll}
                aria-expanded={mega}
                className={`relative flex items-center transition hover:text-gold ${
                  isCurrent(item.href) || (mega && active === i) ? "text-gold" : "opacity-90"
                }`}
              >
                {item.label}
                <span
                  className={`absolute inset-x-0 bottom-0 h-px origin-left bg-gold transition-transform duration-500 ${
                    mega && active === i ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <button
            type="button"
            className="flex h-10 w-10 flex-col justify-center gap-1.5 lg:hidden"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`h-px w-6 bg-current transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`h-px w-6 bg-current transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </button>

          <Link href="/" className="text-center leading-none" onClick={closeAll}>
            <span className="block font-display text-2xl tracking-[0.18em] md:text-[28px]">PRAVEIL</span>
            <span className="mt-1 block text-[10px] tracking-[0.3em] opacity-70 md:text-[11px]">맑고고운의원</span>
          </Link>

          <div className="flex items-center justify-end gap-5 text-[15px]">
            {member ? (
              <span className="flex items-center gap-3 text-sm md:text-[15px]">
                <span className="hidden opacity-80 md:inline">{member.name}님</span>
                <button type="button" onClick={logout} className="opacity-90 transition hover:text-gold">
                  로그아웃
                </button>
              </span>
            ) : (
              <button type="button" onClick={openLogin} className="text-sm opacity-90 transition hover:text-gold md:text-[15px]">
                로그인
              </button>
            )}
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

        {/* PC 하위 메뉴 패널 */}
        <div
          className={`hidden overflow-hidden transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] lg:grid ${
            mega ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
          onMouseEnter={() => setMega(true)}
        >
          <div className="min-h-0">
            <div className="border-t border-line">
              <div className="mx-auto grid max-w-[1440px] grid-cols-[1.1fr_1fr_1.7fr_1fr_1fr] gap-10 px-10 pt-12 pb-14">
                <div className="border-r border-line pr-10">
                  <p className="font-display text-sm tracking-[0.2em] text-gold">Clear &amp; Graceful</p>
                  <p className="mt-4 font-serif text-[22px] leading-snug font-medium tracking-tight">
                    나에게 맞는 방법,
                    <br />
                    상담에서 시작됩니다.
                  </p>
                  <a href={`tel:${phone}`} className="mt-7 block font-serif text-xl tracking-wide transition hover:text-gold">
                    {phone}
                  </a>
                  <a
                    href={reservationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-block rounded-full bg-ink px-6 py-2.5 text-sm text-cream transition hover:bg-mocha"
                  >
                    네이버 예약하기
                  </a>
                </div>
                {nav.map((item, i) => (
                  <div key={item.href} onMouseEnter={() => setActive(i)}>
                    <Link href={item.href} onClick={closeAll} className="group block">
                      <span className={`font-display text-xs tracking-[0.2em] transition ${active === i ? "text-gold" : "text-taupe"}`}>
                        {item.en.toUpperCase()}
                      </span>
                      <span className="mt-1.5 block font-serif text-lg font-medium">{item.label}</span>
                    </Link>
                    <ul className={`mt-5 gap-x-8 ${item.children.length > 6 ? "grid grid-cols-2" : ""}`}>
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={closeAll}
                            className="inline-block py-1.5 text-[14px] text-muted transition hover:translate-x-1 hover:text-ink"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </header>

      <MemberModal open={loginOpen} config={signup} onClose={closeLogin} />

      {/* 모바일 전체 화면 메뉴 (header의 blur 효과 밖에 두어야 화면 전체를 덮는다) */}
      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 top-16 bottom-0 z-[55] flex flex-col overflow-y-auto bg-cream text-ink lg:hidden">
          <nav className="px-5 pt-2" aria-label="모바일 메뉴">
            {nav.map((item, i) => {
              const isOpen = expanded === i;
              return (
                <div key={item.href} className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between py-5 text-left"
                  >
                    <span>
                      <span className="block font-display text-[11px] tracking-[0.2em] text-gold">{item.en.toUpperCase()}</span>
                      <span className="mt-1 block font-serif text-xl font-medium">{item.label}</span>
                    </span>
                    <span className="relative h-4 w-4" aria-hidden>
                      <span className="absolute top-1/2 left-0 h-px w-4 bg-ink" />
                      <span className={`absolute top-0 left-1/2 h-4 w-px bg-ink transition-transform duration-300 ${isOpen ? "scale-y-0" : ""}`} />
                    </span>
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-400 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <ul className={`min-h-0 overflow-hidden ${item.children.length > 6 ? "grid grid-cols-2 gap-x-4" : ""}`}>
                      <li className="col-span-2">
                        <Link href={item.href} onClick={closeAll} className="block py-2 text-[15px] text-ink">
                          {item.label} 전체 보기 →
                        </Link>
                      </li>
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link href={child.href} onClick={closeAll} className="block py-2 text-[15px] text-muted">
                            {child.label}
                          </Link>
                        </li>
                      ))}
                      <li className="col-span-2 h-4" aria-hidden />
                    </ul>
                  </div>
                </div>
              );
            })}
          </nav>
          <div className="mt-auto grid grid-cols-2 gap-3 px-5 pt-10 pb-8">
            <a href={`tel:${phone}`} className="rounded-full border border-ink py-3.5 text-center text-sm">
              전화 문의
            </a>
            <a href={reservationUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-ink py-3.5 text-center text-sm text-cream">
              네이버 예약
            </a>
          </div>
        </div>
      )}
    </>
  );
}
