"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Reveal from "@/components/Reveal";
import { gsap, reducedMotion } from "@/lib/gsap";

type Props = {
  label?: string;
  nameEn: string;
  name: string;
  title: string;
  quote: string[];
  text: string;
  image: string;
};

// 대표원장: 기존 두 단 구성을 유지하며 보정된 세로 원본 전체를 보여 줍니다.
// 사진을 확대하거나 움직이지 않아 얼굴 · 팔이 잘리지 않습니다.
export default function MainDoctor({
  nameEn,
  name,
  title,
  quote,
  text,
  image,
}: Props) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reducedMotion() || !rootRef.current) return;
    const ctx = gsap.context(() => {
      const st = {
        trigger: rootRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      };
      gsap.fromTo(
        ".doctor-name",
        { xPercent: 8 },
        { xPercent: -18, ease: "none", scrollTrigger: st },
      );
      // 인용문 아래 골드 선이 그어짐
      gsap.fromTo(
        ".doctor-rule",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".doctor-rule",
            start: "top 85%",
            end: "top 55%",
            scrub: 0.6,
          },
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-espresso text-white"
    >
      <p
        aria-hidden
        className="doctor-name pointer-events-none absolute top-[12%] left-0 hidden font-display lg:block text-[26vw] leading-none font-light whitespace-nowrap text-taupe/[0.09] uppercase lg:top-[18%] lg:text-[17vw]"
      >
        {nameEn}
      </p>

      <div className="relative mx-auto grid max-w-[1600px] items-center gap-10 px-5 py-28 md:px-10 lg:min-h-svh lg:grid-cols-2 lg:py-20">
        <div className="order-2 flex justify-center lg:order-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={`${name} ${title}`}
            loading="lazy"
            width={4672}
            height={7008}
            className="block h-auto w-full max-w-[360px] rounded-[28px] object-contain md:rounded-[40px] lg:max-w-[400px]"
          />
        </div>

        <div className="order-1 lg:order-2">
          <Reveal
            variant="line"
            className="text-[26px] leading-[1.4] font-semibold tracking-[-0.04em] md:text-[42px]"
          >
            {quote.map((q) => (
              <span key={q}>
                <span>{q}</span>
              </span>
            ))}
          </Reveal>
          <span
            aria-hidden
            className="doctor-rule mt-8 block h-px w-24 origin-left bg-gold md:w-32"
          />
          <Reveal delay={200}>
            <p className="mt-8 text-[15px] leading-relaxed whitespace-pre-line text-white/60 md:text-lg">
              {text}
            </p>
            <div className="mt-12 flex items-end justify-between border-t border-white/15 pt-6">
              <p>
                <span className="block text-sm text-taupe">{title}</span>
                <span className="mt-1 block text-2xl font-bold md:text-3xl">
                  {name}
                </span>
              </p>
              <Link
                href="/about/doctor"
                aria-label="대표원장 소개 자세히 보기"
                className="grid h-14 w-14 place-items-center rounded-full border border-white/40 transition duration-500 hover:rotate-45 hover:border-gold hover:bg-gold hover:text-white"
              >
                <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
