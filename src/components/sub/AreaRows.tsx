import { Check } from "lucide-react";
import Reveal from "@/components/Reveal";
import FaceZoneIcon, { hasFaceZone } from "@/components/sub/FaceZoneIcon";
import type { TreatmentItem } from "@/content/treatments";

// 부위별 시술: 부위마다 한 줄씩, 그림 · 글을 좌우 번갈아 길게
// - 위의 부위 이름을 누르면 그 줄로 이동
// - 부위 사진(image)이 있으면 사진, 없으면 아치 안에 부위 그림
export default function AreaRows({ items }: { items: TreatmentItem[] }) {
  const total = String(items.length).padStart(2, "0");
  const id = (i: number) => `area-${i + 1}`;

  return (
    <>
      <nav
        aria-label="시술 부위"
        className="mt-10 flex flex-wrap gap-2 md:mt-12"
      >
        {items.map((it, i) => (
          <a
            key={it.name}
            href={`#${id(i)}`}
            className="flex items-center gap-2 rounded-full border border-white/15 py-1.5 pr-4 pl-2 text-[13px] text-white/75 transition hover:border-gold hover:text-white md:text-sm"
          >
            {hasFaceZone(it.name) ? (
              <FaceZoneIcon name={it.name} className="h-6 w-6" />
            ) : (
              <span className="w-2" />
            )}
            {it.name}
          </a>
        ))}
      </nav>

      <ol className="mt-14 md:mt-20">
        {items.map((it, i) => {
          const flip = i % 2 === 1;
          const no = String(i + 1).padStart(2, "0");
          return (
            <li
              key={it.name}
              id={id(i)}
              className="grid scroll-mt-40 items-center gap-8 border-t border-white/10 py-14 first:border-t-0 first:pt-0 md:scroll-mt-48 md:grid-cols-2 md:gap-14 md:py-20 lg:gap-24"
            >
              {/* 그림 */}
              <Reveal
                variant="clip"
                className={`group relative aspect-[4/3] overflow-hidden rounded-[24px] bg-white/[0.04] ring-1 ring-white/10 ${flip ? "md:order-2" : ""}`}
              >
                {it.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={it.image}
                    alt={`${it.name} 시술 부위`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-[scale] duration-[1.2s] group-hover:scale-105"
                  />
                ) : (
                  <>
                    <div className="absolute inset-x-0 top-[12%] bottom-0 mx-auto grid w-[46%] place-items-center rounded-t-full bg-white/[0.06]">
                      {hasFaceZone(it.name) && (
                        <FaceZoneIcon
                          name={it.name}
                          className="-mt-[8%] h-[58%] w-[58%] text-white"
                        />
                      )}
                    </div>
                    <p
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-4 truncate px-5 text-center font-display text-[40px] leading-none tracking-[0.06em] text-white/[0.08] uppercase md:bottom-6 md:text-[60px]"
                    >
                      {it.en ?? it.name}
                    </p>
                  </>
                )}
                <p className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-black/40 py-1.5 pr-3.5 pl-1.5 text-[13px] text-white backdrop-blur-sm md:top-5 md:left-5">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15">
                    {hasFaceZone(it.name) && (
                      <FaceZoneIcon name={it.name} className="h-5 w-5" />
                    )}
                  </span>
                  <span className="font-display text-[11px] tracking-[0.25em]">
                    {no} / {total}
                  </span>
                </p>
              </Reveal>

              {/* 글 */}
              <Reveal delay={120} className={flip ? "md:order-1" : ""}>
                <p className="flex items-baseline gap-4">
                  <span className="font-display text-[40px] leading-none text-gold md:text-[52px]">
                    {no}
                  </span>
                  {it.en && (
                    <span className="font-display text-xs tracking-[0.35em] text-taupe uppercase">
                      {it.en}
                    </span>
                  )}
                </p>
                <h3 className="mt-5 text-[26px] font-semibold tracking-[-0.03em] md:text-[32px]">
                  {it.name}
                </h3>
                <p className="mt-2 text-[15px] text-white/80 md:text-[17px]">
                  {it.text}
                </p>
                {it.detail && (
                  <p className="mt-5 text-[15px] leading-[1.9] text-white/60 md:text-[16px]">
                    {it.detail}
                  </p>
                )}

                {it.points && (
                  <ol className="mt-7 border-t border-white/10">
                    {it.points.map((p, n) => (
                      <li
                        key={p}
                        className="flex items-baseline gap-5 border-b border-white/10 py-3.5"
                      >
                        <span className="w-4 shrink-0 font-display text-lg text-gold italic">
                          {n + 1}
                        </span>
                        <span className="text-[15px] leading-relaxed text-white/80">
                          {p}
                        </span>
                      </li>
                    ))}
                  </ol>
                )}

                {it.recommend && (
                  <div className="mt-7">
                    <p className="text-xs tracking-[0.2em] text-taupe">
                      이런 분께 권합니다
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {it.recommend.map((r) => (
                        <li
                          key={r}
                          className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[13px] text-white/80 md:text-sm"
                        >
                          <Check className="h-3.5 w-3.5 shrink-0 text-gold" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Reveal>
            </li>
          );
        })}
      </ol>
    </>
  );
}
