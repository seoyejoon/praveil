import {
  principleIllustrations,
  type PrincipleKind,
} from "@/content/principle-illustrations";

/** Labels remain HTML so they stay legible on phones and when text is enlarged. */
export default function TreatmentPrinciple({
  kind,
  alt,
  note,
}: {
  kind: PrincipleKind;
  alt?: string;
  note?: string;
}) {
  const illustration = principleIllustrations[kind];
  const version = illustration.assetVersion
    ? `?v=${illustration.assetVersion}`
    : "";
  return (
    <figure
      id="principle-illustration"
      data-principle={kind}
      className="relative scroll-mt-44 overflow-hidden rounded-[24px] bg-[#1d2a30] md:scroll-mt-60 md:rounded-[32px]"
    >
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/images/principles/${kind}.webp${version}`}
          srcSet={`/images/principles/${kind}-mobile.webp${version} 800w, /images/principles/${kind}.webp${version} 1600w`}
          sizes="(min-width: 1400px) 740px, (min-width: 1024px) 55vw, (min-width: 768px) calc(100vw - 80px), calc(100vw - 40px)"
          alt={alt ?? illustration.alt}
          width={1600}
          height={1000}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full"
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 1600 1000"
          className="pointer-events-none absolute inset-0 h-full w-full text-white"
        >
          {illustration.marks.map((mark) => (
            <g key={mark.label}>
              <line
                x1={(mark.labelX ?? mark.x) * 16}
                y1={(mark.labelY ?? mark.y) * 10}
                x2={mark.x * 16}
                y2={mark.y * 10}
                stroke="currentColor"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
              <circle cx={mark.x * 16} cy={mark.y * 10} r="6" fill="currentColor" />
            </g>
          ))}
        </svg>
        <ol className="absolute inset-0 z-10">
          {illustration.marks.map((mark, index) => (
            <li
              key={mark.label}
              className="absolute flex w-max max-w-[44%] -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-white/40 bg-ink/85 py-1.5 pr-2.5 pl-1.5 text-xs leading-snug font-medium text-white shadow-sm md:gap-2 md:py-2 md:pr-3.5 md:pl-2 md:text-[13px]"
              style={{
                left: `${mark.labelX ?? mark.x}%`,
                top: `${mark.labelY ?? mark.y}%`,
              }}
            >
              <span aria-hidden="true" className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white font-display text-xs text-ink md:h-6 md:w-6 md:text-sm">
                {index + 1}
              </span>
              <span>{mark.label}</span>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/95 via-ink/75 to-transparent px-3 pt-7 pb-2.5 text-[10px] leading-relaxed text-white/90 md:px-5 md:pt-10 md:pb-4 md:text-xs">
        {note ?? `${illustration.note} 실제 크기 · 깊이와는 다를 수 있습니다.`}
      </figcaption>
    </figure>
  );
}
