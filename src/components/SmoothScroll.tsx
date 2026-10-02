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
    // 카카오톡 · 인스타그램 등 앱 안 브라우저는 화면 높이 단위(lvh)를 실제보다 작게 알려 주는 경우가 있어,
    // 실제로 보이는 가장 큰 높이를 따로 기억해 첫 화면 높이에 씀 (아래가 비어 보이지 않게)
    const setAppH = () => {
      const h = Math.max(
        window.innerHeight,
        document.documentElement.clientHeight,
      );
      const prev =
        parseFloat(
          document.documentElement.style.getPropertyValue("--app-h"),
        ) || 0;
      if (h > prev)
        document.documentElement.style.setProperty("--app-h", `${h}px`);
    };
    setAppH();
    window.addEventListener("resize", setAppH);
    if (reducedMotion())
      return () => window.removeEventListener("resize", setAppH);
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
      window.removeEventListener("resize", setAppH);
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
