"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger };

/**
 * 장면 맞춤용 부드러운 이동.
 * PC(마우스)는 Lenis 로, 휴대폰(터치)은 브라우저 기본 부드러운 스크롤로 움직인다.
 * (터치 스크롤 중 Lenis 가 예전 위치를 기억하고 있다가 맨 위로 튀는 문제 방지)
 */
export function smoothScrollTo(y: number, duration = 1.2) {
  const touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const lenis = (
    window as unknown as {
      __lenis?: { scrollTo: (y: number, o: object) => void };
    }
  ).__lenis;
  if (!touch && lenis) {
    lenis.scrollTo(y, {
      duration,
      easing: (x: number) =>
        x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
    });
  } else {
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}
