"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger, reducedMotion } from "@/lib/gsap";

type Item = {
  en: string;
  name: string;
  category: string;
  href: string;
  text: string;
  image: string;
  /** 큰 문장 (첫 줄 얇게, 마지막 줄 굵게) */
  headline?: string[];
  /** 모바일 전용 사진 (1080×1200, 없으면 PC 사진) */
  mobileImage?: string;
  /** 제목 둘째 줄에서 색을 넣을 시술명 */
  accent?: string;
  /** 마우스를 멈추면 커서 원 안에 뜨는 제품 사진 (배경 없는 사진) */
  product?: string;
  /** 핵심 세 가지 (원형 배지) */
  points?: string[];
};

// 대표 시술 4종: 화면 전체를 덮은 채 멈추고, 스크롤할 때마다 다음 시술로 넘어감
// - 배경: 시술 사진이 아래에서 위로 걷히며 바뀜 (천천히 다가오는 움직임)
// - 왼쪽 아래: 분류 · 큰 문장 (화면 아무 곳이나 누르면 그 시술 페이지로)
// - 맨 아래: 시술 이름 탭 (지금 시술은 선이 차오름, 누르면 그 시술로 이동)
// - 움직임 줄이기 설정이면 고정 없이 첫 시술만 보이고 탭으로 바꿔 봄
export default function MainBest({
  label,
  title,
  items,
}: {
  label: string;
  title: string;
  items: Item[];
}) {
  const rootRef = useRef<HTMLElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const [local, setLocal] = useState(0); // 지금 시술 안에서의 진행 (0~1)
  const n = items.length;

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion()) return;
    const st = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: () => `+=${window.innerHeight * (n - 1) * 0.9}`,
      pin: true,
      invalidateOnRefresh: true,
      snap: {
        snapTo: 1 / (n - 1),
        duration: { min: 0.3, max: 0.8 },
        delay: 0.12,
        ease: "power2.inOut",
      },
      onUpdate: (self) => {
        const p = self.progress * (n - 1);
        const i = Math.min(n - 1, Math.round(p));
        setActive(i);
        setLocal(Math.min(1, Math.max(0, p - i + 0.5)));
      },
    });
    stRef.current = st;
    return () => {
      st.kill();
      stRef.current = null;
    };
  }, [n]);

  // 탭: 그 시술 자리로 스크롤 (고정이 없으면 바로 바꿈)
  const go = (i: number) => {
    const st = stRef.current;
    if (!st) return setActive(i);
    const y = st.start + ((st.end - st.start) * i) / (n - 1);
    const lenis = (
      window as unknown as {
        __lenis?: { scrollTo: (y: number, o: object) => void };
      }
    ).__lenis;
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const it = items[active];

  return (
    // 고정(pin)되는 섹션은 한 번 감싸야 페이지 이동 시 오류가 나지 않는다
    <div>
      <section
        ref={rootRef}
        aria-label={title}
        className="relative h-svh min-h-[640px] overflow-hidden bg-[#ecebe8] text-ink"
      >
        {/* 배경 사진: 옆으로 넘김 — 다음 사진은 오른쪽에서 밀려 들어오며 나타나고, 지난 사진은 왼쪽으로 밀려나며 사라짐 */}
        {items.map((x, i) => (
          <div
            key={x.href}
            aria-hidden={i !== active}
            className="absolute inset-x-0 top-[78px] bottom-[208px] overflow-hidden max-md:[mask-image:linear-gradient(180deg,#000_80%,transparent)] transition-opacity duration-[900ms] ease-[cubic-bezier(.45,0,.2,1)] md:top-24 md:bottom-auto md:h-[58%] lg:inset-0 lg:h-auto"
            style={{
              opacity: i === active ? 1 : 0,
              zIndex: i === active ? 2 : 1,
            }}
          >
            <picture className="block h-full w-full">
              {x.mobileImage && (
                <source media="(max-width: 1023px)" srcSet={x.mobileImage} />
              )}
              <img
                src={x.image}
                alt={`${x.name} 시술 장면`}
                loading={i === 0 ? "eager" : "lazy"}
                className="h-full w-full object-cover object-[center_30%] transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] lg:object-[72%_center]"
                style={{
                  transform: `translateX(${i === active ? 0 : i < active ? -6 : 6}%) scale(1.06)`,
                }}
              />
            </picture>
          </div>
        ))}
        {/* 글자가 잘 보이도록: 왼쪽 · 아래를 어둡게 */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(238,237,234,0.75),rgba(238,237,234,0.25)_38%,transparent_58%),linear-gradient(0deg,rgba(238,237,234,0.9),transparent_26%)] max-lg:bg-none" />

        {/* 화면 아무 곳이나 누르면 지금 시술 페이지로 (마우스를 멈추면 커서가 '자세히 보기'로 바뀜) */}
        <Link
          href={it.href}
          aria-label={`${it.name} 자세히 보기`}
          data-cursor-idle="자세히 보기"
          data-cursor-image={it.product}
          className="absolute inset-0 z-[15]"
        />
        <div className="pointer-events-none relative z-20 mx-auto flex h-full max-w-[1600px] flex-col px-5 pt-7 pb-6 md:px-10 md:pt-28 lg:pb-8">
          {/* 위: 섹션 이름 · 순서 */}
          <div className="flex items-start justify-between">
            <div>
              <p className="font-display text-[11px] tracking-[0.4em] text-gold uppercase md:text-xs">
                {label}
              </p>
              <p className="mt-2 text-sm text-ink/60 md:text-base">{title}</p>
            </div>
            <p className="font-display text-sm tracking-[0.2em] text-ink/40 tabular-nums md:text-base">
              <span className="text-ink">
                {String(active + 1).padStart(2, "0")}
              </span>{" "}
              / {String(n).padStart(2, "0")}
            </p>
          </div>

          {/* 가운데 아래: 지금 시술 소개 (바뀔 때마다 아래에서 떠오름) */}
          <div key={active} className="mt-auto max-w-[800px]">
            <p
              className="flex items-center gap-3 text-[13px] text-gold"
              style={{
                animation: "fade-up .8s cubic-bezier(.22,1,.36,1) .25s both",
              }}
            >
              <span className="h-px w-8 bg-gold/70" />
              {it.category}
            </p>
            <h3
              className="mt-4 text-[min(7vw,30px)] leading-[1.25] font-light tracking-[-0.04em] whitespace-nowrap md:text-[min(5.2vw,52px)] 2xl:text-[60px]"
              style={{
                animation: "fade-up 1s cubic-bezier(.22,1,.36,1) .35s both",
              }}
            >
              {(it.headline ?? [it.name]).map((h, k, arr) => {
                const last = k === arr.length - 1;
                const at = last && it.accent ? h.lastIndexOf(it.accent) : -1;
                return (
                  <span
                    key={h}
                    className={`block ${last ? "font-semibold" : "mb-1 text-[0.62em] md:mb-2"}`}
                  >
                    {at >= 0 ? (
                      <>
                        {h.slice(0, at)}
                        <span className="text-[#8a6838]">{it.accent}</span>
                        {h.slice(at + it.accent!.length)}
                      </>
                    ) : (
                      h
                    )}
                  </span>
                );
              })}
            </h3>
          </div>

          {/* 맨 아래: 시술 탭 */}
          <ul className="pointer-events-auto no-scrollbar mt-8 grid grid-cols-4 gap-3 md:mt-12 md:gap-6">
            {items.map((x, i) => (
              <li key={x.href} className="min-w-0">
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-current={i === active ? "true" : undefined}
                  className={`w-full pb-3 text-left text-[12px] transition-colors md:text-[15px] ${i === active ? "font-semibold text-ink" : "text-ink/40 hover:text-ink/70"}`}
                >
                  <span className="mr-2 font-display text-[10px] tracking-[0.15em] text-gold md:text-xs">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="break-keep">{x.name}</span>
                </button>
                <span className="block h-px bg-ink/15">
                  <span
                    className="block h-full origin-left bg-ink transition-transform duration-300"
                    style={{
                      transform: `scaleX(${i < active ? 1 : i === active ? Math.max(0.08, local) : 0})`,
                    }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
