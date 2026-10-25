import {
  principleIllustrations,
  type PrincipleKind,
} from "@/content/principle-illustrations";

/** Labels remain HTML so they stay legible on phones and when text is enlarged. */
export default function TreatmentPrinciple({ kind }: { kind: PrincipleKind }) {
  const illustration = principleIllustrations[kind];
  return (
    <figure
      id="principle-illustration"
      data-principle={kind}
      className="scroll-mt-44 md:scroll-mt-60"
    >
      <div className="relative overflow-hidden rounded-[24px] bg-[#1d2a30] md:rounded-[32px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/images/principles/${kind}.webp`}
          srcSet={`/images/principles/${kind}-mobile.webp 800w, /images/principles/${kind}.webp 1600w`}
          sizes="(min-width: 1400px) 740px, (min-width: 1024px) 55vw, (min-width: 768px) calc(100vw - 80px), calc(100vw - 40px)"
          alt={illustration.alt}
          width={1600}
          height={1000}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full"
        />
        {illustration.marks.map((mark, index) => (
          <span
            key={mark.label}
            aria-hidden="true"
            className="absolute grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-espresso text-xs font-semibold text-white shadow-[0_2px_8px_rgba(0,0,0,0.2)] ring-2 ring-white/80 md:h-7 md:w-7 md:text-sm"
            style={{ left: `${mark.x}%`, top: `${mark.y}%` }}
          >
            {index + 1}
          </span>
        ))}
      </div>
      <figcaption className="px-1 pt-4 md:pt-5">
        <ol className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] leading-relaxed text-ink md:gap-x-6 md:text-sm">
          {illustration.marks.map((mark, index) => (
            <li key={mark.label} className="flex items-center gap-2">
              <span aria-hidden="true" className="font-display text-mocha">
                {index + 1}
              </span>
              {mark.label}
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          {illustration.note} 실제 크기 · 깊이와는 다를 수 있습니다.
        </p>
      </figcaption>
    </figure>
  );
}
