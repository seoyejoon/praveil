"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";

export type ProgramItem = {
  href: string;
  name: string;
  category: string;
  image: string;
  description: string;
  tags: string[];
};

// 시그니처 시술 (어두운 배경)
// PC: 화면이 멈춘 채 스크롤하면 다음 시술로 넘어감 / 모바일: 이름을 눌러 전환
export default function Program({ items }: { items: ProgramItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      triggerRef.current = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${items.length * 70}%`,
        pin: true,
        onUpdate: (self) => setActive(Math.min(items.length - 1, Math.floor(self.progress * items.length))),
      });
      return () => {
        triggerRef.current = null;
      };
    });
    return () => mm.revert();
  }, [items.length]);

  // PC에서 탭을 누르면 해당 위치로 스크롤
  const select = (i: number) => {
    const st = triggerRef.current;
    if (st) window.scrollTo({ top: st.start + ((st.end - st.start) * (i + 0.5)) / items.length, behavior: "smooth" });
    else setActive(i);
  };

  const item = items[active];

  // 바깥 div: GSAP가 고정(pin)할 때 section을 감싸는 상자를 넣으므로, React가 지울 대상을 따로 둔다 (페이지 이동 시 오류 방지)
  return (
    <div>
      <section ref={sectionRef} className="overflow-hidden bg-espresso text-cream lg:h-svh">
        <div className="mx-auto grid h-full max-w-[1440px] items-center gap-10 px-5 py-24 md:px-10 lg:grid-cols-2 lg:gap-20 lg:py-0">
          {/* 사진: 겹쳐 두고 선택된 것만 보이게 */}
          <div className="relative aspect-[4/5] overflow-hidden lg:aspect-auto lg:h-[72vh]">
            {items.map((it, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={it.href}
                src={it.image}
                alt=""
                loading="lazy"
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-out ${
                  i === active ? "scale-100 opacity-100" : "scale-110 opacity-0"
                }`}
              />
            ))}
          </div>

          <div>
            <p className="font-display text-base tracking-[0.15em] text-[#ffd899] md:text-lg">Signature Program</p>
            <h2 className="mt-4 font-serif text-[28px] leading-snug font-medium tracking-tight md:text-[40px]">
              프라베일 시그니처 시술
            </h2>

            {/* 시술 이름 목록: 선택된 것만 밝게 */}
            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-2 md:mt-12">
              {items.map((it, i) => (
                <button
                  key={it.href}
                  type="button"
                  onClick={() => select(i)}
                  aria-pressed={i === active}
                  className={`flex items-center gap-2 font-serif text-lg transition md:text-xl ${
                    i === active ? "text-cream" : "text-cream/35 hover:text-cream/70"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full bg-[#ffd899] transition-opacity ${i === active ? "opacity-100" : "opacity-0"}`} />
                  {it.name}
                </button>
              ))}
            </div>

            <div key={active} className="animate-rise mt-10 md:mt-14">
              <p className="text-sm text-taupe">{item.category}</p>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-cream/75 md:text-lg">{item.description}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {item.tags.map((t) => (
                  <li key={t} className="rounded-full border border-cream/25 px-4 py-1.5 text-[13px] text-cream/80">
                    #{t}
                  </li>
                ))}
              </ul>
              <Link
                href={item.href}
                className="mt-10 inline-flex items-center gap-2 rounded-full border border-cream/40 px-6 py-2.5 font-display text-xs tracking-[0.2em] transition hover:border-[#ffd899] hover:bg-[#ffd899] hover:text-ink"
              >
                VIEW MORE <span aria-hidden>→</span>
              </Link>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
