"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { LogOut, UserRound } from "lucide-react";
import Logo from "@/components/Logo";
import MemberModal, { type SignupConfig } from "@/components/MemberModal";
import { sitemap } from "@/content/sitemap";

type Props = {
  phone: string;
  reservationUrl: string;
  member: { name: string } | null;
  signup: SignupConfig;
};

// 메뉴바 (2026.10 리뉴얼)
// - 어두운 첫 화면([data-dark-hero]) 위에서는 투명 + 흰 글자, 스크롤하면 흰 배경
// - 아래로 스크롤하면 숨고, 위로 올리면 다시 나타남
// - PC: 메뉴에 올리면 각 메뉴 바로 아래 칸에 하위 메뉴 / 태블릿·모바일: 전체 화면 검정 메뉴
export default function Header({ phone, reservationUrl, member, signup }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hasHero, setHasHero] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [loginTab, setLoginTab] = useState<"login" | "signup">("login");
  const closeLogin = useCallback(() => setLoginOpen(false), []);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > 240 && y > last + 2) setHidden(true);
      else if (y < last - 2 || y <= 240) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMega(false);
    setExpanded(null);
    setHasHero(Boolean(document.querySelector("[data-dark-hero]")));
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMega(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function logout() {
    setUserMenu(false);
    await fetch("/api/member/logout", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
    router.refresh();
  }

  function openLogin(tab: "login" | "signup") {
    setOpen(false);
    setMega(false);
    setLoginTab(tab);
    setLoginOpen(true);
  }

  const light = hasHero && !scrolled && !mega && !open; // 첫 화면 위: 흰 글자
  const isCurrent = (href: string) => {
    const base = href.split("?")[0].split("/").slice(0, 2).join("/");
    return base !== "" && (pathname === base || pathname.startsWith(`${base}/`));
  };

  return (
    <>
      <header
        onMouseLeave={() => setMega(false)}
        className={`fixed inset-x-0 top-0 z-40 transition-[transform,background-color,color,box-shadow] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] ${
          hidden && !mega ? "-translate-y-full" : ""
        } ${light ? "text-white" : "bg-white/95 text-black backdrop-blur-md"} ${scrolled && !mega ? "shadow-[0_1px_0_rgba(0,0,0,0.08)]" : ""}`}
      >
        <div className="relative mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 md:h-[84px] md:px-10">
          <Link href="/" aria-label="프라베일 맑고고운의원 홈" className="relative z-10 shrink-0">
            <Logo className="h-[18px] w-auto md:h-[24px]" />
          </Link>

          {/* PC 메뉴 */}
          <nav aria-label="주 메뉴" className="absolute inset-y-0 left-1/2 hidden -translate-x-1/2 xl:flex">
            {sitemap.map((s, i) => (
              <Link
                key={s.key}
                href={s.href}
                onMouseEnter={() => {
                  setMega(true);
                  setActive(i);
                }}
                onFocus={() => {
                  setMega(true);
                  setActive(i);
                }}
                className={`relative flex w-[108px] 2xl:w-[124px] items-center justify-center ${
                  s.key === "praveil" ? "font-display text-[16px] tracking-[0.14em]" : "text-[15px] font-medium tracking-[-0.01em]"
                }`}
              >
                {s.label}
                <span
                  className={`absolute bottom-[24px] left-1/2 h-px w-6 -translate-x-1/2 bg-current transition-transform duration-500 ${
                    (mega && active === i) || isCurrent(s.href) ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            ))}
          </nav>

          <div className="relative z-10 flex items-center gap-2 text-[13px] md:text-sm">
            {/* 회원: 사람 아이콘 하나. 비로그인이면 로그인 · 회원가입 팝업, 로그인 상태면 작은 메뉴 */}
            <div className="relative">
              <button
                type="button"
                onClick={() => (member ? setUserMenu((v) => !v) : openLogin("login"))}
                aria-label={member ? `${member.name}님 회원 메뉴` : "로그인 · 회원가입"}
                aria-expanded={member ? userMenu : undefined}
                className="relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-current/10"
              >
                <UserRound className="h-[21px] w-[21px]" strokeWidth={1.5} />
                {member && <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-current" />}
              </button>
              {member && userMenu && (
                <div className="absolute top-full right-0 mt-2 w-44 overflow-hidden rounded-2xl bg-white py-2 text-sm text-black shadow-[0_16px_40px_rgba(0,0,0,0.14)]">
                  <p className="px-4 py-2 text-black/50">{member.name}님</p>
                  <button type="button" onClick={logout} className="flex w-full items-center gap-2 px-4 py-2.5 text-left hover:bg-black/5">
                    <LogOut className="h-4 w-4" strokeWidth={1.5} />
                    로그아웃
                  </button>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="메뉴 열기"
              aria-expanded={open}
              aria-controls="site-menu"
              className="flex h-10 w-8 flex-col items-end justify-center gap-[7px] xl:hidden"
            >
              <span className="h-px w-7 bg-current" />
              <span className="h-px w-5 bg-current" />
            </button>
          </div>
        </div>

        {/* PC 하위 메뉴: 각 메뉴와 같은 폭의 칸에 세로로 */}
        <div
          className={`hidden overflow-hidden bg-white transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] xl:grid ${
            mega ? "grid-rows-[1fr] border-t border-black/5" : "grid-rows-[0fr]"
          }`}
        >
          <div className="min-h-0">
            <div className="flex justify-center pt-8 pb-11">
              {sitemap.map((s, i) => (
                <ul
                  key={s.key}
                  onMouseEnter={() => setActive(i)}
                  className={`w-[108px] 2xl:w-[124px] space-y-3 text-center transition-opacity duration-300 ${active === i ? "opacity-100" : "opacity-45"}`}
                >
                  {s.pages.map((p) => (
                    <li key={p.href}>
                      <Link href={p.href} onClick={() => setMega(false)} className="text-[14px] text-black/70 transition hover:text-black">
                        {p.label}
                        {p.best && <sup className="ml-0.5 font-display text-[9px] tracking-wider text-black">BEST</sup>}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* 태블릿 · 모바일 전체 화면 메뉴 */}
      <div
        id="site-menu"
        className={`fixed inset-0 z-[60] flex flex-col bg-black text-white transition-[clip-path] duration-700 ease-[cubic-bezier(.76,0,.24,1)] xl:hidden ${
          open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
        aria-hidden={!open}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-5 md:h-[84px] md:px-10">
          <Logo className="h-[18px] w-auto md:h-[24px]" />
          <button type="button" onClick={() => setOpen(false)} aria-label="메뉴 닫기" className="relative h-10 w-8">
            <span className="absolute top-1/2 right-0 h-px w-7 rotate-45 bg-white" />
            <span className="absolute top-1/2 right-0 h-px w-7 -rotate-45 bg-white" />
          </button>
        </div>
        <nav aria-label="전체 메뉴" className="flex-1 overflow-y-auto px-5 pt-4 md:px-10">
          {sitemap.map((s, i) => {
            const isOpen = expanded === i;
            return (
              <div
                key={s.key}
                className={`border-b border-white/10 transition-[opacity,transform] duration-700 ${open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                style={{ transitionDelay: open ? `${200 + i * 60}ms` : "0ms" }}
              >
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-baseline justify-between py-5 text-left"
                >
                  <span className="text-[26px] font-semibold tracking-[-0.03em] md:text-4xl">{s.label}</span>
                  <span className="font-display text-xs font-light tracking-[0.25em] text-white/40 uppercase">{s.en}</span>
                </button>
                <div className={`grid transition-[grid-template-rows] duration-500 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <ul className="min-h-0 overflow-hidden">
                    {s.pages.map((p) => (
                      <li key={p.href}>
                        <Link href={p.href} onClick={() => setOpen(false)} className="block py-2 text-[16px] text-white/70">
                          {p.label}
                          {p.best && <span className="ml-2 font-display text-[10px] tracking-[0.2em] text-white">BEST</span>}
                        </Link>
                      </li>
                    ))}
                    <li className="h-5" aria-hidden />
                  </ul>
                </div>
              </div>
            );
          })}
        </nav>
        <div className="grid shrink-0 grid-cols-2 gap-px border-t border-white/10 bg-white/10">
          <a href={`tel:${phone}`} className="bg-black py-5 text-center text-sm">
            전화 상담
          </a>
          <a href={reservationUrl} target="_blank" rel="noopener noreferrer" className="bg-white py-5 text-center text-sm text-black">
            네이버 예약
          </a>
        </div>
      </div>

      <MemberModal open={loginOpen} initialTab={loginTab} config={signup} onClose={closeLogin} />
    </>
  );
}
