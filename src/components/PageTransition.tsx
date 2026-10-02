"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// 페이지 이동 효과: 메뉴 · 링크를 누르면 커튼이 아래에서 덮고(로고), 새 페이지가 열리면 위로 걷힘
// - 같은 페이지 안 이동(#), 새 창, 외부 주소, 전화 · 메일은 그대로
type Phase = "idle" | "cover" | "reveal";

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const pending = useRef<string | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest("a");
      if (!a || !a.href || a.target === "_blank" || a.hasAttribute("download"))
        return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return; // 같은 페이지 (# · 걸러 보기)
      if (/\.(pdf|jpg|png|webp|mp4|zip)$/i.test(url.pathname)) return;
      e.preventDefault();
      e.stopPropagation();
      pending.current = url.pathname + url.search + url.hash;
      setPhase("cover");
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, []);

  // 커튼이 다 덮이면 이동
  useEffect(() => {
    if (phase !== "cover" || !pending.current) return;
    const href = pending.current;
    const t = window.setTimeout(() => router.push(href), 520);
    // 이동이 늦거나 실패해도 커튼이 남지 않게
    const safety = window.setTimeout(() => setPhase("reveal"), 6000);
    return () => {
      clearTimeout(t);
      clearTimeout(safety);
    };
  }, [phase, router]);

  // 새 페이지가 열리면 걷힘
  useEffect(() => {
    if (!pending.current) return;
    pending.current = null;
    const t = window.setTimeout(() => setPhase("reveal"), 80);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (phase !== "reveal") return;
    const t = window.setTimeout(() => setPhase("idle"), 800);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[9998] ${phase === "idle" ? "invisible" : ""}`}
    >
      <div
        className={`absolute inset-0 grid place-items-center bg-espresso ${phase === "cover" ? "pointer-events-auto translate-y-0 transition-transform duration-500 ease-[cubic-bezier(.7,0,.3,1)]" : phase === "reveal" ? "-translate-y-full transition-transform duration-700 ease-[cubic-bezier(.7,0,.3,1)]" : "translate-y-full"}`}
      >
        <span
          className={`font-display text-2xl font-light tracking-[0.5em] text-white transition-opacity duration-300 md:text-3xl ${phase === "cover" ? "opacity-100 delay-200" : "opacity-0"}`}
        >
          PRAVEIL
        </span>
      </div>
    </div>
  );
}
