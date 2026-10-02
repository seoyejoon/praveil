"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, LogOut, Plus, UserRound } from "lucide-react";
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

// PC 메뉴판 왼쪽 소개 · 오른쪽 사진
const megaIntro: Record<
  string,
  { title: string; text: string; image: string }
> = {
  about: {
    title: "프라베일 소개",
    text: "20년 경력의 대표원장이 상담부터 시술까지 직접 책임지는 프라이빗 클리닉입니다.",
    image: "/images/photos/clinic-1.webp",
  },
  praveil: {
    title: "시술 안내",
    text: "피부 상태와 고민에 맞춰, 꼭 필요한 시술만 1:1로 설계합니다.",
    image: "/images/photos/signature-1.webp",
  },
  community: {
    title: "프라베일 소식",
    text: "공지사항과 이벤트, 전후사진을 확인해 보세요.",
    image: "/images/photos/clinic-3.webp",
  },
};

// 메뉴바 (2026.10 리뉴얼)
// - 어두운 첫 화면([data-dark-hero]) 위에서는 투명 + 흰 글자, 스크롤하면 흰 배경
// - 아래로 스크롤하면 숨고, 위로 올리면 다시 나타남
// - PC: 메뉴에 올리면 그 메뉴 바로 아래에 하위 메뉴만 따로 펼쳐짐 / 태블릿·모바일: 전체 화면 검정 메뉴
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
        } ${light ? "text-white" : clear ? "text-black" : mega ? "bg-white text-black" : "bg-white/95 text-black backdrop-blur-md"} ${scrolled && !mega ? "shadow-[0_1px_0_rgba(0,0,0,0.08)]" : ""}`}
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
            {menu.map((g, i) => {
              const on = mega && active === i;
              return (
                <div
                  key={g.key}
                  className="relative flex"
                  onMouseEnter={() => {
                    setMega(true);
                    setActive(i);
                  }}
                >
                  <Link
                    href={g.href}
                    onFocus={() => {
                      setMega(true);
                      setActive(i);
                    }}
                    aria-expanded={on}
                    className="relative flex items-center font-display text-[17px] tracking-[0.16em]"
                  >
                    {g.label}
                    <span
                      className={`absolute bottom-[24px] left-0 h-px w-full origin-left bg-gold transition-[scale] duration-500 ${
                        (
                          mega
                            ? on
                            : g.columns.some((c) =>
                                c.pages.some((p) => isCurrent(p.href)),
                              )
                        )
                          ? "scale-x-100"
                          : "scale-x-0"
                      }`}
                    />
                  </Link>
                </div>
              );
            })}
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
        {/* PC 하위 메뉴판: 화면 전체 폭 · 메뉴를 옮겨도 같은 판 안에서 내용만 바뀜 */}
        <div
          className={`absolute inset-x-0 top-full hidden overflow-hidden border-t border-black/[0.06] bg-white text-black shadow-[0_30px_60px_-30px_rgba(29,26,23,0.35)] transition-[opacity,translate,visibility] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] xl:block ${
            mega
              ? "visible translate-y-0 opacity-100"
              : "pointer-events-none invisible -translate-y-3 opacity-0"
          }`}
        >
          <div className="mx-auto grid max-w-[1600px] px-10 py-12">
            {menu.map((g, i) => {
              const on = active === i;
              const intro = megaIntro[g.key];
              return (
                <div
                  key={g.key}
                  aria-hidden={!on}
                  className={`grid grid-cols-[240px_1fr_300px] gap-12 transition-[opacity,translate] duration-500 [grid-area:1/1] 2xl:grid-cols-[280px_1fr_340px] 2xl:gap-16 ${
                    on
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none invisible translate-y-2 opacity-0"
                  }`}
                >
                  <div className="flex flex-col">
                    <p className="font-display text-xs tracking-[0.35em] text-gold uppercase">
                      {g.label}
                    </p>
                    <p className="mt-4 text-[26px] leading-snug font-semibold tracking-[-0.03em]">
                      {intro?.title}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-black/55">
                      {intro?.text}
                    </p>
                    <Link
                      href={g.href}
                      onClick={() => setMega(false)}
                      tabIndex={on ? 0 : -1}
                      className="group/more mt-auto inline-flex items-center gap-2 pt-8 text-sm font-medium"
                    >
                      바로가기
                      <span className="grid h-8 w-8 place-items-center rounded-full border border-black/15 transition duration-500 group-hover/more:border-gold group-hover/more:bg-gold group-hover/more:text-white">
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
                      </span>
                    </Link>
                  </div>
                  <div
                    className={`grid gap-x-8 gap-y-8 border-l border-black/[0.07] pl-12 ${g.columns.length > 1 ? "grid-cols-5" : "grid-cols-1"}`}
                  >
                    {g.columns.map((c) => (
                      <div key={c.key}>
                        {g.columns.length > 1 && (
                          <Link
                            href={c.href}
                            onClick={() => setMega(false)}
                            tabIndex={on ? 0 : -1}
                            className="block border-b border-black/[0.07] pb-3 text-[15px] font-semibold whitespace-nowrap transition hover:text-gold"
                          >
                            {c.label}
                          </Link>
                        )}
                        <ul
                          className={`space-y-1 ${g.columns.length > 1 ? "mt-3" : ""}`}
                        >
                          {c.pages.map((p) => (
                            <li key={p.href}>
                              <Link
                                href={p.href}
                                onClick={() => setMega(false)}
                                tabIndex={on ? 0 : -1}
                                className={`group/item flex items-center py-1.5 whitespace-nowrap transition-colors duration-300 hover:text-gold ${g.columns.length > 1 ? "text-[14px]" : "text-[17px]"} ${isCurrent(p.href) ? "text-gold" : p.best ? "font-semibold text-black" : "text-black/65"}`}
                              >
                                <span
                                  aria-hidden
                                  className={`h-1 rounded-full bg-gold transition-all duration-300 ${isCurrent(p.href) ? "mr-2 w-1" : "mr-0 w-0 group-hover/item:mr-2 group-hover/item:w-1"}`}
                                />
                                {p.label}
                                {p.best && (
                                  <span className="ml-2">
                                    <BestMark />
                                  </span>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="relative aspect-[4/3] self-start overflow-hidden rounded-[20px] bg-ivory">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={intro?.image}
                      alt=""
                      loading="lazy"
                      className={`h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.2,.7,.2,1)] ${on && mega ? "scale-100" : "scale-[1.06]"}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* 메뉴판이 열리면 뒤 화면을 살짝 어둡게 (마우스가 닿으면 닫힘) */}
      <div
        aria-hidden
        onMouseEnter={() => setMega(false)}
        className={`fixed inset-0 z-30 hidden bg-black/25 backdrop-blur-[2px] transition-opacity duration-500 xl:block ${
          mega ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

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
