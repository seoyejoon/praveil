"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";

// 페이지 전체를 미끄러지듯 부드럽게 스크롤 (Lenis). GSAP 스크롤 효과와 같은 시계로 움직인다.
export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // 휴대폰 주소창이 나타났다 사라질 때 화면 높이가 바뀌어도 스크롤 효과를 다시 계산하지 않음
    // (다시 계산하면 고정된 장면 — 첫 화면 문 · 시그니처 — 이 툭 튀는 문제)
    ScrollTrigger.config({ ignoreMobileResize: true });
    // 카카오톡 · 인스타그램 등 앱 안 브라우저: 스크롤하면 아래 도구막대가 사라져 화면이 길어지는데,
    // 고정 장면(첫 화면 · 시그니처)을 그때 다시 맞추면 화면이 튐.
    // → 처음부터 기기 화면 전체 높이로 만들어 두고, 도구막대에 가리는 만큼 글자만 위로 올려 둠 (다시 맞출 필요 없음)
    const inApp = /KAKAOTALK|Instagram|FBAN|FBAV|NAVER|Line\/|DaumApps/i.test(
      navigator.userAgent,
    );
    if (inApp && window.matchMedia("(max-width: 1023px)").matches) {
      const full = Math.max(window.screen.height, window.innerHeight);
      const root = document.documentElement.style;
      root.setProperty("--app-h", `${full}px`);
      root.setProperty(
        "--app-pad",
        `${Math.max(0, full - window.innerHeight)}px`,
      );
    }
    if (reducedMotion()) return;
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      touchMultiplier: 1.2,
    });
    lenisRef.current = lenis;
    // 다른 효과(첫 화면 장면 맞춤)에서 부드럽게 이동할 때 쓰도록 꺼내 둠
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      lenisRef.current = null;
    };
  }, []);

  // 페이지를 옮기면 맨 위에서 시작
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
