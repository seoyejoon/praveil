"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { LogOut, Plus, UserRound } from "lucide-react";
import Logo from "@/components/Logo";
import MemberModal, { type SignupConfig } from "@/components/MemberModal";
import BestMark from "@/components/BestMark";
import { menu } from "@/content/sitemap";

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
export default function Header({
  phone,
  reservationUrl,
  member,
  signup,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hasHero, setHasHero] = useState(true);
  const [lightHero, setLightHero] = useState(false); // 밝은 첫 화면(흰 배경 영상) 위: 투명 + 검정 글자
  const [loginOpen, setLoginOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [loginTab, setLoginTab] = useState<"login" | "signup">("login");

  // 다른 곳(전후사진 등)에서 로그인 창을 열 때: window.dispatchEvent(new Event("praveil:login"))
  useEffect(() => {
    const onOpen = () => {
      setLoginTab("login");
      setLoginOpen(true);
    };
    window.addEventListener("praveil:login", onOpen);
    return () => window.removeEventListener("praveil:login", onOpen);
  }, []);
  const closeLogin = useCallback(() => setLoginOpen(false), []);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      // 어두운 첫 화면이 화면을 덮고 있는 동안(스크롤로 장면이 넘어가는 중)은 투명 유지
      // 하위 페이지는 사진이 제자리에 붙어 있고 본문이 덮으며 올라오므로, 본문 윗선([data-hero-end])으로 판단
      const end = document.querySelector("[data-hero-end]");
      const hero = document.querySelector("[data-dark-hero]");
      const overHero = end
        ? end.getBoundingClientRect().top > 80
        : hero
          ? hero.getBoundingClientRect().bottom > 80
          : false;
      setScrolled(y > 40 && !overHero);
      if (y > 240 && y > last + 2) setHidden(true);
      else if (y < last - 2 || y <= 240) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 메뉴바가 보이는지 알려 줌: 하위 페이지 탭(.sub-tabs)이 메뉴바 바로 아래에 붙거나, 숨으면 맨 위로 올라감
  const shown = !hidden || mega;
  useEffect(() => {
    document.documentElement.dataset.header = shown ? "shown" : "hidden";
  }, [shown]);

  useEffect(() => {
    setOpen(false);
    setMega(false);
    setExpanded(null);
    setHasHero(Boolean(document.querySelector("[data-dark-hero]")));
    setLightHero(Boolean(document.querySelector("[data-light-hero]")));
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
    await fetch("/api/member/logout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    });
    router.refresh();
  }

  function openLogin(tab: "login" | "signup") {
    setOpen(false);
    setMega(false);
    setLoginTab(tab);
    setLoginOpen(true);
  }

  const light = hasHero && !lightHero && !scrolled && !mega && !open; // 어두운 첫 화면 위: 흰 글자
  const clear = lightHero && !scrolled && !mega && !open; // 밝은 첫 화면 위: 투명 + 검정 글자
  const isCurrent = (href: string) => {
    const base = href.split("?")[0].split("/").slice(0, 2).join("/");
    return (
      base !== "" && (pathname === base || pathname.startsWith(`${base}/`))
    );
  };

  return (
    <>
      <header
        onMouseLeave={() => setMega(false)}
        className={`fixed inset-x-0 top-0 z-40 transition-[translate,transform,background-color,color,box-shadow] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] ${
          hidden && !mega ? "-translate-y-full" : ""
        } ${light ? "text-white" : clear ? "text-black" : "bg-white/95 text-black backdrop-blur-md"} ${scrolled && !mega ? "shadow-[0_1px_0_rgba(0,0,0,0.08)]" : ""}`}
      >
        <div className="relative mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 md:h-[84px] md:px-10">
          <Link
            href="/"
            aria-label="프라베일 맑고고운의원 홈"
            className="relative z-10 shrink-0"
          >
            <Logo className="h-[18px] w-auto md:h-[24px]" />
          </Link>

          {/* PC 메뉴: ABOUT / PRAVEIL / COMMUNITY */}
          <nav
            aria-label="주 메뉴"
            className="absolute inset-y-0 left-1/2 hidden -translate-x-1/2 gap-20 xl:flex 2xl:gap-28"
          >
            {menu.map((g, i) => (
              <Link
                key={g.key}
                href={g.href}
                onMouseEnter={() => {
                  setMega(true);
                  setActive(i);
                }}
                onFocus={() => {
                  setMega(true);
                  setActive(i);
                }}
                className="relative flex items-center font-display text-[17px] tracking-[0.16em]"
              >
                {g.label}
                <span
                  className={`absolute bottom-[24px] left-0 h-px w-full origin-left bg-gold transition-transform duration-500 ${
                    (mega && active === i) ||
                    g.columns.some((c) =>
                      c.pages.some((p) => isCurrent(p.href)),
                    )
                      ? "scale-x-100"
                      : "scale-x-0"
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
                onClick={() =>
                  member ? setUserMenu((v) => !v) : openLogin("login")
                }
                aria-label={
                  member ? `${member.name}님 회원 메뉴` : "로그인 · 회원가입"
                }
                aria-expanded={member ? userMenu : undefined}
                className="relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-current/10"
              >
                <UserRound className="h-[21px] w-[21px]" strokeWidth={1.5} />
                {member && (
                  <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </button>
              {member && userMenu && (
                <div className="absolute top-full right-0 mt-2 w-44 overflow-hidden rounded-2xl bg-white py-2 text-sm text-black shadow-[0_16px_40px_rgba(0,0,0,0.14)]">
                  <p className="px-4 py-2 text-black/50">{member.name}님</p>
                  <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left hover:bg-black/5"
                  >
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

        {/* PC 하위 메뉴: 올린 메뉴의 분류가 칸으로 펼쳐진다 (PRAVEIL은 시술 분류 5칸) */}
        <div
          className={`hidden overflow-hidden bg-white transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] xl:grid ${
            mega ? "grid-rows-[1fr] border-t border-black/5" : "grid-rows-[0fr]"
          }`}
        >
          <div className="min-h-0">
            {active !== null && (
              <div
                key={active}
                className="mx-auto flex max-w-[1400px] justify-center px-10 pt-9 pb-12 animate-[fade-up_.5s_cubic-bezier(.2,.7,.2,1)_both]"
              >
                {menu[active].columns.map((c) => (
                  <div
                    key={c.key}
                    className="w-[220px] border-l border-black/8 px-7 first:border-l-0 2xl:w-[250px]"
                  >
                    {menu[active].columns.length > 1 && (
                      <Link
                        href={c.href}
                        onClick={() => setMega(false)}
                        className="block text-[15px] font-semibold transition hover:text-gold"
                      >
                        {c.label}
                      </Link>
                    )}
                    <ul
                      className={`space-y-3 ${menu[active].columns.length > 1 ? "mt-5" : ""}`}
                    >
                      {c.pages.map((p) => (
                        <li key={p.href}>
                          <Link
                            href={p.href}
                            onClick={() => setMega(false)}
                            className={`inline-flex items-center gap-2 text-[14px] transition hover:text-gold ${p.best ? "font-semibold text-black" : "text-black/65"}`}
                          >
                            {p.label}
                            {p.best && <BestMark />}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 태블릿 · 모바일 전체 화면 메뉴 */}
      <div
        id="site-menu"
        className={`fixed inset-0 z-[60] flex flex-col bg-espresso text-white transition-[clip-path] duration-700 ease-[cubic-bezier(.76,0,.24,1)] xl:hidden ${
          open
            ? "[clip-path:inset(0_0_0_0)]"
            : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
        aria-hidden={!open}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-5 md:h-[84px] md:px-10">
          <Logo className="h-[18px] w-auto md:h-[24px]" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="메뉴 닫기"
            className="relative h-10 w-8"
          >
            <span className="absolute top-1/2 right-0 h-px w-7 rotate-45 bg-white" />
            <span className="absolute top-1/2 right-0 h-px w-7 -rotate-45 bg-white" />
          </button>
        </div>
        <nav
          aria-label="전체 메뉴"
          className="flex-1 overflow-y-auto px-5 pt-4 md:px-10"
        >
          {menu.map((g, i) => {
            const isOpen = expanded === i;
            return (
              <div
                key={g.key}
                className={`border-b border-white/10 transition-[opacity,transform] duration-700 ${open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                style={{ transitionDelay: open ? `${200 + i * 80}ms` : "0ms" }}
              >
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between py-6 text-left"
                >
                  <span className="font-display text-[30px] font-light tracking-[0.12em] md:text-4xl">
                    {g.label}
                  </span>
                  <Plus
                    className={`h-5 w-5 text-taupe transition-transform duration-500 ${isOpen ? "rotate-45" : ""}`}
                    strokeWidth={1.5}
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-500 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div
                      className={`grid gap-x-6 gap-y-6 pb-7 ${g.columns.length > 1 ? "grid-cols-2" : ""}`}
                    >
                      {g.columns.map((c) => (
                        <div key={c.key}>
                          {g.columns.length > 1 && (
                            <p className="mb-2 text-sm font-semibold text-taupe">
                              {c.label}
                            </p>
                          )}
                          <ul>
                            {c.pages.map((p) => (
                              <li key={p.href}>
                                <Link
                                  href={p.href}
                                  onClick={() => setOpen(false)}
                                  className={`inline-flex items-center gap-2 py-1.5 text-[16px] ${p.best ? "font-semibold text-white" : "text-white/70"}`}
                                >
                                  {p.label}
                                  {p.best && <BestMark />}
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
            );
          })}
        </nav>
        <div className="grid shrink-0 grid-cols-2 gap-px border-t border-white/10 bg-white/10">
          <a
            href={`tel:${phone}`}
            className="bg-espresso py-5 text-center text-sm"
          >
            전화 상담
          </a>
          <a
            href={reservationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gold py-5 text-center text-sm text-white"
          >
            네이버 예약
          </a>
        </div>
      </div>

      <MemberModal
        open={loginOpen}
        initialTab={loginTab}
        config={signup}
        onClose={closeLogin}
      />
    </>
  );
}
