import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SpaceStrip from "./SpaceStrip";

// 병원 공간: 큰 사진이 옆으로 천천히 흘러가고, 마우스로 끌거나 손으로 밀어 넘길 수 있음
export default function MainSpace({ title, images }: { label?: string; title: string; images: string[] }) {
  return (
    <section className="flex min-h-svh flex-col justify-center overflow-hidden bg-ivory py-14 md:py-20">
      <div className="mx-auto flex w-full max-w-[1600px] items-end justify-between gap-6 px-5 md:px-10">
        <div>
          {/* PC: 긴 제목 / 모바일: 짧게 한 줄 (버튼과 같은 줄) */}
          <p className="mb-4 font-display text-[11px] font-light tracking-[0.4em] text-gold uppercase md:mb-5 md:text-xs">
            Private Space
          </p>
          <Reveal variant="line" className="hidden text-[56px] leading-[1.2] font-bold tracking-[-0.04em] md:block">
            <span>
              <span>{title}</span>
            </span>
          </Reveal>
          <Reveal variant="line" className="text-[34px] leading-[1.2] font-bold tracking-[-0.04em] md:hidden">
            <span>
              <span>프라베일 둘러보기</span>
            </span>
          </Reveal>
        </div>
        <Link
          href="/about/philosophy"
          aria-label="병원 둘러보기"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-black/25 transition duration-500 hover:rotate-45 hover:border-gold hover:bg-gold hover:text-white md:h-14 md:w-14"
        >
          <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} />
        </Link>
      </div>
      <div className="mt-8 md:mt-12">
        <SpaceStrip images={images} />
      </div>
    </section>
  );
}
