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
  const [loginTab, setLoginTab] = useState<"login" | "signup">("login");
  const closeLogin = useCallback(() => setLoginOpen(false), []);
  const router = useRouter();

  async function logout() {
    await fetch("/api/member/logout", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
    router.refresh();
  }

  function openLogin(tab: "login" | "signup") {
    closeAll();
    setLoginTab(tab);
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
  const pillLine = overHero ? "border-white/70 hover:bg-white hover:text-ink" : "border-ink/25 hover:border-ink";
  const pillFill = overHero ? "bg-white text-ink hover:bg-cream" : "bg-ink text-cream hover:bg-mocha";
  // 상위 메뉴와 하위 메뉴 칸 너비 (시술안내처럼 하위가 많으면 두 줄로 넓게)
  const colWidth = (item: { children: unknown[] }) => (item.children.length > 6 ? 250 : 170);
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
        <div className="relative mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-5 md:h-20 md:px-10">
          <Link href="/" className="shrink-0 leading-none" onClick={closeAll} aria-label="프라베일 맑고고운의원 홈">
            <span className="block font-display text-[22px] font-semibold tracking-[0.18em] md:text-[26px]">PRAVEIL</span>
            <span className="mt-1 block text-[10px] tracking-[0.3em] opacity-70 md:text-[11px]">맑고고운의원</span>
          </Link>

          {/* PC 상위 메뉴 (가운데). 하위 메뉴 패널의 칸 너비와 같게 맞춘다 */}
          <nav className="absolute left-1/2 hidden h-full -translate-x-1/2 items-stretch lg:flex" aria-label="주 메뉴">
            {nav.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => openMega(i)}
                onFocus={() => openMega(i)}
                onClick={closeAll}
                aria-expanded={mega}
                style={{ width: colWidth(item) }}
                className={`flex items-center justify-center text-[16px] font-semibold transition hover:text-gold ${
                  isCurrent(item.href) || (mega && active === i) ? "text-gold" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 text-sm">
            {member ? (
              <>
                <span className="mr-2 hidden opacity-80 md:inline">{member.name}님</span>
                <button type="button" onClick={logout} className={`rounded-full border px-4 py-2 font-medium transition md:px-5 ${pillLine}`}>
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => openLogin("signup")} className={`hidden rounded-full border px-5 py-2 font-medium transition md:block ${pillLine}`}>
                  회원가입
                </button>
                <button type="button" onClick={() => openLogin("login")} className={`rounded-full px-4 py-2 font-medium transition md:px-5 ${pillFill}`}>
                  로그인
                </button>
              </>
            )}

            {/* 모바일 메뉴 버튼 */}
            <button
              type="button"
              className="ml-1 flex h-10 w-10 flex-col items-end justify-center gap-1.5 lg:hidden"
              aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span className={`h-px w-6 bg-current transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`h-px w-6 bg-current transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>

        {/* PC 하위 메뉴 패널: 각 메뉴 바로 아래에 하위 메뉴가 세로로 */}
        <div
          className={`hidden overflow-hidden transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] lg:grid ${
            mega ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
          onMouseEnter={() => setMega(true)}
        >
          <div className="min-h-0">
            <div className="border-t border-line bg-cream">
              <div className="flex justify-center pt-7 pb-10">
                {nav.map((item, i) => (
                  <ul
                    key={item.href}
                    onMouseEnter={() => setActive(i)}
                    style={{ width: colWidth(item) }}
                    className={`text-center ${item.children.length > 6 ? "grid grid-cols-2 content-start gap-x-2" : ""}`}
                  >
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={closeAll}
                          className="inline-block py-2 text-[15px] text-muted transition hover:text-gold"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </div>
        </div>

      </header>

      <MemberModal open={loginOpen} initialTab={loginTab} config={signup} onClose={closeLogin} />

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
