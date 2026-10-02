import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/Reveal";

// 병원 공간: 큰 사진이 옆으로 천천히 흘러간다. 마우스를 올리면 멈춤.
export default function MainSpace({ title, images }: { label?: string; title: string; images: string[] }) {
  return (
    <section className="overflow-hidden bg-ivory py-28 md:py-40">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-5 md:items-end md:px-10">
        <div>
          {/* PC: 긴 제목 / 모바일: 짧게 한 줄 (버튼과 같은 줄) */}
          <Reveal variant="line" className="hidden text-[52px] leading-[1.25] font-bold tracking-[-0.04em] md:block">
            <span>
              <span>{title}</span>
            </span>
          </Reveal>
          <Reveal variant="line" className="text-[26px] leading-[1.25] font-bold tracking-[-0.04em] md:hidden">
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
      <div className="mt-14 md:mt-20">
        <div className="animate-marquee flex w-max gap-4 hover:[animation-play-state:paused] md:gap-6">
          {[0, 1].map((set) =>
            images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${set}-${i}`}
                src={src}
                alt=""
                loading="lazy"
                aria-hidden={set === 1}
                className={`h-[46vw] w-auto shrink-0 rounded-[18px] object-cover md:rounded-[24px] md:h-[34vw] lg:h-[28vw] ${i % 2 ? "aspect-[4/5]" : "aspect-[3/2]"}`}
              />
            )),
          )}
        </div>
      </div>
    </section>
  );
}
