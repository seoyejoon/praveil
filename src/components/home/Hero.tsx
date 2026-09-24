"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

type Props = {
  eyebrow: string;
  title: readonly string[];
  description: string;
  image: string;
  /** 영상이 생기면 지정. 있으면 사진 대신 재생된다 (사진은 로딩 전 대표 이미지로 사용) */
  video?: { src: string; mobileSrc?: string };
  reservationUrl: string;
};

// 첫 화면 인터랙션
// 1) 등장: 가운데 아치 모양에서 화면 전체로 펼쳐짐 (CSS 애니메이션)
// 2) 스크롤: 배경이 천천히 확대 · 어두워지고, 글자는 느리게 올라가며 사라짐
// 3) 마우스(PC): 커서를 따라 은은한 빛 + 배경이 살짝 따라 움직임
// 움직임 줄이기 설정이면 2) 3)은 동작하지 않는다.
export default function Hero({ eyebrow, title, description, image, video, reservationUrl }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let progress = 0; // 스크롤 진행도 0~1
    const mouse = { x: 0, y: 0 }; // 목표값 -1~1
    const eased = { x: 0, y: 0 }; // 부드럽게 따라가는 값

    const render = () => {
      raf = 0;
      eased.x += (mouse.x - eased.x) * 0.08;
      eased.y += (mouse.y - eased.y) * 0.08;

      const scale = 1.06 + progress * 0.14;
      if (mediaRef.current) {
        mediaRef.current.style.transform = `translate3d(${eased.x * -14}px, ${eased.y * -10 + progress * 60}px, 0) scale(${scale})`;
      }
      if (shadeRef.current) shadeRef.current.style.opacity = String(0.4 + progress * 0.4);
      if (copyRef.current) {
        copyRef.current.style.transform = `translate3d(0, ${progress * -80}px, 0)`;
        copyRef.current.style.opacity = String(1 - progress * 1.4);
      }

      // 마우스가 아직 목표에 도달하지 않았으면 계속 그린다
      if (Math.abs(mouse.x - eased.x) > 0.001 || Math.abs(mouse.y - eased.y) > 0.001) {
        raf = requestAnimationFrame(render);
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    const onScroll = () => {
      progress = Math.min(1, Math.max(0, window.scrollY / root.offsetHeight));
      schedule();
    };

    const onMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      if (lightRef.current) {
        lightRef.current.style.opacity = "1";
        lightRef.current.style.background = `radial-gradient(600px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(255, 216, 153, 0.16), transparent 60%)`;
      }
      schedule();
    };
    const onLeave = () => {
      mouse.x = 0;
      mouse.y = 0;
      if (lightRef.current) lightRef.current.style.opacity = "0";
      schedule();
    };

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    window.addEventListener("scroll", onScroll, { passive: true });
    if (finePointer) {
      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerleave", onLeave);
    }
    onScroll();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative h-[calc(100svh-3.5rem)] min-h-[560px] overflow-hidden bg-[#1f1b18] text-white md:h-svh md:min-h-[680px]"
    >
      {/* 1) 아치 → 전체 화면 */}
      <div className="animate-hero-reveal absolute inset-0">
        <div ref={mediaRef} className="absolute inset-0 scale-[1.06] will-change-transform">
          {video ? (
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={image}
            >
              {video.mobileSrc && <source src={video.mobileSrc} media="(max-width: 767px)" type="video/mp4" />}
              <source src={video.src} type="video/mp4" />
            </video>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" fetchPriority="high" className="h-full w-full object-cover" />
          )}
        </div>
        <div ref={shadeRef} className="absolute inset-0 bg-[#1f1b18] opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.35)_100%)]" />
        <div ref={lightRef} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700" />
      </div>

      <div ref={copyRef} className="relative flex h-full flex-col items-center justify-center px-5 text-center will-change-transform">
        <p className="animate-rise font-display text-base tracking-[0.12em] text-[#ffd899] [animation-delay:900ms] md:text-xl">
          {eyebrow}
        </p>
        <h1 className="animate-rise mt-4 font-serif text-[28px] leading-[1.35] font-medium tracking-[-0.03em] [animation-delay:1050ms] md:mt-5 md:text-[44px] md:leading-[1.3]">
          {title[0]}
          <br />
          {title[1]}
        </h1>
        <p className="animate-rise mt-5 text-sm leading-relaxed whitespace-pre-line text-cream/85 [animation-delay:1200ms] md:mt-6 md:text-base">
          {description}
        </p>
        <div className="animate-rise mt-8 flex gap-2.5 [animation-delay:1350ms] md:mt-10">
          <Link
            href="/treatments"
            className="rounded-full border border-white/60 px-6 py-2.5 text-[13px] transition hover:bg-white hover:text-ink md:px-7 md:text-sm"
          >
            시술 안내
          </Link>
          <a
            href={reservationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white px-6 py-2.5 text-[13px] text-ink transition hover:bg-[#ffd899] md:px-7 md:text-sm"
          >
            예약하기
          </a>
        </div>
      </div>

      <div className="animate-rise absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-display text-[11px] tracking-[0.3em] text-cream/70 [animation-delay:1600ms] md:flex">
        SCROLL
        <span className="h-12 w-px bg-cream/60 [animation:scroll-line_2s_ease-in-out_infinite]" />
      </div>
    </section>
  );
}
