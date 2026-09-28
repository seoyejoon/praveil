import Link from "next/link";
import Reveal from "@/components/Reveal";

// 병원 공간: 큰 사진이 옆으로 천천히 흘러간다. 마우스를 올리면 멈춤.
export default function MainSpace({ label, title, images }: { label: string; title: string; images: string[] }) {
  return (
    <section className="overflow-hidden bg-ivory py-28 md:py-40">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-5 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <p className="font-display text-xs tracking-[0.35em] text-black/50 uppercase md:text-sm">{label}</p>
          <Reveal variant="line" className="mt-6 text-[30px] leading-[1.25] font-bold tracking-[-0.04em] md:text-[52px]">
            <span>
              <span>{title}</span>
            </span>
          </Reveal>
        </div>
        <Link href="/about/philosophy" className="group flex items-center gap-4 font-display text-sm tracking-[0.25em] uppercase">
          Clinic Tour
          <span className="grid h-12 w-12 place-items-center rounded-full border border-black/25 transition group-hover:bg-black group-hover:text-white">→</span>
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
                className={`h-[46vw] w-auto shrink-0 object-cover md:h-[34vw] lg:h-[28vw] ${i % 2 ? "aspect-[4/5]" : "aspect-[3/2]"}`}
              />
            )),
          )}
        </div>
      </div>
    </section>
  );
}
