"use client";

import { useState } from "react";
import { Eye, Glasses } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/sub/SectionHead";
import type { DeviceStory } from "@/content/device-story";

// 원리 구역과 같은 배치(왼쪽 사진 · 오른쪽 카드): 카드를 누르면 왼쪽 사진이 바뀐다
export default function StoryProtection({
  protection,
}: {
  protection: NonNullable<DeviceStory["protection"]>;
}) {
  const [active, setActive] = useState(0);
  const items = protection.items;
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
      <SectionHead en={protection.en} title={protection.title} />
      <div className="mt-10 grid gap-6 md:mt-14 lg:grid-cols-[1.35fr_1fr] lg:items-stretch lg:gap-8">
        <Reveal>
          <div className="relative aspect-[8/5] overflow-hidden rounded-[24px] bg-[#1d2a30] md:rounded-[32px]">
            {items.map((it, i) => {
              const fade = `absolute inset-0 h-full w-full transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-0"}`;
              if (it.image)
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={it.title}
                    src={it.image}
                    alt={it.alt}
                    loading="lazy"
                    aria-hidden={i !== active}
                    className={`${fade} object-cover`}
                  />
                );
              // 사진이 준비되기 전: 아이콘 + 이름 패널
              const Icon = it.icon === "glasses" ? Glasses : Eye;
              return (
                <div
                  key={it.title}
                  role="img"
                  aria-label={it.alt}
                  aria-hidden={i !== active}
                  className={`${fade} flex flex-col items-center justify-center gap-5 bg-[radial-gradient(circle_at_50%_40%,#2c3b42,#1d2a30_70%)] text-white`}
                >
                  <span className="grid h-24 w-24 place-items-center rounded-full border border-white/25 bg-white/5 md:h-32 md:w-32">
                    <Icon className="h-11 w-11 text-gold md:h-14 md:w-14" strokeWidth={1.25} />
                  </span>
                  <span className="text-lg font-semibold tracking-[-0.02em] md:text-2xl">
                    {it.title}
                  </span>
                </div>
              );
            })}
            {protection.note && (
              <p className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(20,24,26,0.82))] px-5 pt-12 pb-4 text-xs leading-relaxed text-white/85 md:px-6 md:pb-5">
                {protection.note}
              </p>
            )}
          </div>
        </Reveal>
        <ol className="grid gap-3" style={{ gridAutoRows: "1fr" }}>
          {items.map((it, i) => (
            <Reveal as="li" key={it.title} delay={i * 100}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                className={`flex h-full w-full items-center gap-4 rounded-[20px] border p-5 text-left transition-colors md:gap-5 lg:px-6 lg:py-6 ${i === active ? "border-gold bg-ivory" : "border-line hover:border-gold/60"}`}
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-sm md:h-10 md:w-10 ${i === active ? "bg-gold text-white" : "bg-gold/15 text-gold"}`}
                >
                  {i + 1}
                </span>
                <span>
                  <span className="block text-[17px] font-semibold tracking-[-0.02em]">
                    {it.title}
                  </span>
                  <span className="mt-1 block text-[14px] leading-relaxed text-muted xl:text-[15px]">
                    {it.text}
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
