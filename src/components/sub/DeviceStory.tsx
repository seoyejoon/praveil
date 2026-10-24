import { CalendarDays, Clock, Droplets, Sparkles } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/sub/SectionHead";
import type { DeviceStory } from "@/content/device-story";

// 장비 시술 페이지 구역들 (장비 사진 · 원리 그림 · 특징 · 시술 과정 · 시술 영상)
// 글로만 설명하던 부분을 그림 · 사진과 나란히 보여 줘 처음 보는 분도 쉽게 이해하도록

const factIcons = [Clock, Droplets, Sparkles, CalendarDays];

/** 한눈에 보기: 핵심 정보 4개 (아이콘 카드) */
export function StoryFacts({
  facts,
}: {
  facts: { label: string; value: string }[];
}) {
  return (
    <ul className="mt-14 grid grid-cols-2 gap-3 md:mt-20 lg:grid-cols-4">
      {facts.slice(0, 4).map((f, i) => {
        const Icon = factIcons[i] ?? Clock;
        return (
          <Reveal
            as="li"
            key={f.label}
            delay={i * 80}
            className="flex flex-col gap-5 rounded-[22px] bg-ivory p-5 md:flex-row md:items-center md:gap-5 md:p-7"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-gold shadow-[0_8px_20px_-12px_rgba(90,60,30,0.5)]">
              <Icon className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <div>
              <p className="text-[13px] text-muted">{f.label}</p>
              <p className="mt-1 text-[17px] font-semibold tracking-[-0.02em] md:text-xl">
                {f.value}
              </p>
            </div>
          </Reveal>
        );
      })}
    </ul>
  );
}

/** 장비 소개 + 원리 그림 */
export function StoryAbout({
  title,
  story,
}: {
  title: string;
  story: DeviceStory;
}) {
  const { device, principle } = story;
  const what = story.kind === "procedure" ? "시술" : "장비";
  return (
    <>
      {/* 어떤 장비인가요? (제조사 브랜드 영상이 있으면 어두운 카드에 영상) */}
      <section id="what" className="scroll-mt-36 px-3 md:scroll-mt-44 md:px-6">
        {device.film || device.photo ? (
          <div className="mx-auto grid max-w-[1560px] overflow-hidden rounded-[28px] bg-[#2b2b2b] text-white md:rounded-[40px] lg:grid-cols-[1.35fr_1fr]">
            <div
              className={
                device.photoFullFrame && !device.film
                  ? "relative flex items-center"
                  : "relative aspect-[16/9] lg:aspect-auto lg:min-h-[560px]"
              }
            >
              {device.film ? (
                <video
                  src={device.film.src}
                  poster={device.film.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label={`${device.name} 장비 영상`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={device.photo}
                  alt={device.photoAlt ?? `${device.name} 시술 장면`}
                  loading="lazy"
                  width={device.photoFullFrame ? 7008 : undefined}
                  height={device.photoFullFrame ? 4672 : undefined}
                  className={
                    device.photoFullFrame
                      ? "block h-auto w-full"
                      : "absolute inset-0 h-full w-full object-cover"
                  }
                />
              )}
              {(!device.photoFullFrame || device.film) && (
                <>
                  <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,transparent_60%,#2b2b2b)] lg:block" />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(180deg,transparent,#2b2b2b)] lg:hidden" />
                </>
              )}
            </div>
            <div className="flex flex-col justify-center px-6 pt-4 pb-14 md:px-14 md:py-16">
              <p className="font-display text-[11px] tracking-[0.3em] text-taupe uppercase">
                {device.maker} · {device.name}
              </p>
              <h2 className="mt-4 text-[26px] leading-snug font-semibold tracking-[-0.03em] md:text-[36px]">
                {title}, 어떤 {what}인가요?
              </h2>
              <Reveal>
                <p className="mt-6 text-[15px] leading-[1.9] text-white/65 md:text-[16px]">
                  {device.text}
                </p>
              </Reveal>
              <Reveal delay={120}>
                <dl className="mt-9 border-t border-white/25">
                  {device.specs.map((s) => (
                    <div
                      key={s.label}
                      className="grid grid-cols-[80px_1fr] gap-4 border-b border-white/10 py-3.5 md:grid-cols-[96px_1fr]"
                    >
                      <dt className="text-[13px] text-taupe">{s.label}</dt>
                      <dd className="text-[15px]">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </div>
        ) : (
          <div className="mx-auto grid max-w-[1560px] overflow-hidden rounded-[28px] bg-[radial-gradient(ellipse_at_30%_40%,#fdfbf8,#f3eee6_55%,#e9e1d4)] md:rounded-[40px] lg:grid-cols-[1fr_1.1fr]">
            {/* 장비: 아치 위 */}
            <div className="relative flex min-h-[420px] items-end justify-center pt-12 lg:min-h-[640px]">
              <div className="absolute bottom-0 left-1/2 h-[82%] w-[62%] max-w-[380px] -translate-x-1/2 rounded-t-full bg-[linear-gradient(180deg,#ffffff,#f4eee5)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.9)]" />
              <div className="absolute bottom-[5%] left-1/2 h-[3%] w-[44%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(60,40,20,0.3),transparent)]" />
              <Reveal className="relative mb-[5%] h-[340px] lg:h-[540px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={device.image}
                  alt={`${device.name} 장비`}
                  loading="lazy"
                  className="h-full w-auto drop-shadow-[0_24px_30px_rgba(60,40,20,0.2)]"
                />
              </Reveal>
              <p className="absolute top-6 left-6 font-display text-[11px] tracking-[0.3em] text-gold uppercase md:top-10 md:left-10">
                {device.maker} · {device.name}
              </p>
            </div>
            <div className="flex flex-col justify-center px-6 py-14 md:px-16 md:py-20">
              <SectionHead
                en="What is"
                title={`${title}, 어떤 ${what}인가요?`}
              />
              <Reveal>
                <p className="mt-6 text-[15px] leading-[1.9] text-muted md:text-[17px]">
                  {device.text}
                </p>
              </Reveal>
              <Reveal delay={120}>
                <dl className="mt-10 border-t border-ink/80">
                  {device.specs.map((s) => (
                    <div
                      key={s.label}
                      className="grid grid-cols-[88px_1fr] gap-4 border-b border-ink/10 py-4 md:grid-cols-[110px_1fr]"
                    >
                      <dt className="text-[13px] text-gold">{s.label}</dt>
                      <dd className="text-[15px] font-medium">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </div>
        )}
      </section>

      {/* 원리 */}
      {story.principleImage || story.principleLayout === "figure-first" ? (
        <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
          <SectionHead en="How it works" title={`${title}, 어떤 원리인가요?`} />
          {/* 그림과 설명 높이를 같게: 설명 3개가 그림 높이를 나눠 채움 */}
          <div className="mt-10 grid gap-6 md:mt-14 lg:grid-cols-[1.35fr_1fr] lg:items-stretch lg:gap-8">
            <Reveal>
              {story.principleImage ? (
                <PrincipleFigure image={story.principleImage} />
              ) : (
                <figure className="overflow-hidden rounded-[24px] bg-ivory p-4 md:rounded-[32px] md:p-8">
                  {story.diagram === "filler" ? (
                    <FillerDiagram />
                  ) : story.diagram && story.diagram !== "hifu" ? (
                    <TreatmentDiagram kind={story.diagram} />
                  ) : (
                    <HifuDiagram depths={story.depths} />
                  )}
                  <figcaption className="mt-3 text-center text-xs text-muted">
                    ※ 원리를 쉽게 보여 드리기 위한 그림입니다
                  </figcaption>
                </figure>
              )}
            </Reveal>
            <ol className="grid gap-3 lg:grid-rows-3">
              {principle.map((p, i) => (
                <Reveal
                  as="li"
                  key={p.title}
                  delay={i * 100}
                  className="flex items-center gap-4 rounded-[20px] border border-line p-5 md:gap-5 lg:px-6 lg:py-4"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold font-display text-sm text-white md:h-10 md:w-10">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-[17px] font-semibold tracking-[-0.02em]">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-muted xl:text-[15px]">
                      {p.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <SectionHead
                en="How it works"
                title={`${title}, 어떤 원리인가요?`}
              />
              <ol className="mt-10 grid gap-3">
                {principle.map((p, i) => (
                  <Reveal
                    as="li"
                    key={p.title}
                    delay={i * 100}
                    className="flex gap-5 rounded-[20px] border border-line p-5 md:p-6"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold font-display text-sm text-white">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-[17px] font-semibold tracking-[-0.02em] md:text-lg">
                        {p.title}
                      </h3>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-muted">
                        {p.text}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>
            <Reveal delay={150}>
              <figure className="overflow-hidden rounded-[28px] bg-ivory p-4 md:p-8">
                {story.diagram === "filler" ? (
                  <FillerDiagram />
                ) : story.diagram && story.diagram !== "hifu" ? (
                  <TreatmentDiagram kind={story.diagram} />
                ) : (
                  <HifuDiagram depths={story.depths} />
                )}
                <figcaption className="mt-3 text-center text-xs text-muted">
                  ※ 원리를 쉽게 보여 드리기 위한 그림입니다
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}

/** 특징: 큰 영상 · 사진과 설명을 한 줄씩 번갈아 (POINT 01~) */
export function StoryFeatures({
  title,
  story,
}: {
  title: string;
  story: DeviceStory;
}) {
  return (
    <section className="bg-ivory px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1300px]">
        <SectionHead
          en="Point"
          title={story.featuresTitle ?? `${title}만의 특별함`}
        />
        <ol className="mt-12 grid gap-14 md:mt-16 md:gap-24">
          {story.features.map((f, i) => (
            <li
              key={f.title}
              className="grid items-center gap-7 md:grid-cols-2 md:gap-16"
            >
              <Reveal
                className={`relative ${f.fullFrame && !f.video ? "aspect-[3/2]" : "aspect-[4/3]"} overflow-hidden rounded-[24px] bg-[#1d2227] md:rounded-[32px] ${i % 2 ? "md:order-2" : ""}`}
              >
                {f.video ? (
                  <video
                    src={f.video}
                    poster={f.image}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={f.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={f.image}
                    alt={f.alt}
                    loading="lazy"
                    width={f.fullFrame ? 7008 : undefined}
                    height={f.fullFrame ? 4672 : undefined}
                    className={`absolute inset-0 h-full w-full ${f.fullFrame ? "object-contain" : "object-cover"}`}
                  />
                )}
              </Reveal>
              <Reveal delay={120} className={i % 2 ? "md:order-1" : ""}>
                <p className="font-display text-sm tracking-[0.3em] text-gold">
                  POINT {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-[22px] leading-snug font-semibold tracking-[-0.03em] md:text-[30px]">
                  {f.title}
                </h3>
                <p className="mt-4 text-[15px] leading-[1.85] text-muted md:text-[17px]">
                  {f.text}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** 시술 과정: 사진 + 설명 */
export function StoryProcess({
  title,
  story,
}: {
  title: string;
  story: DeviceStory;
}) {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
      <SectionHead en="Process" title={`${title}, 어떻게 진행되나요?`} />
      <ol className="no-scrollbar -mx-5 mt-12 flex scroll-px-5 gap-4 overflow-x-auto overscroll-x-contain px-5 md:mx-0 md:mt-16 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0">
        {story.process.map((s, i) => (
          <Reveal
            as="li"
            key={s.title}
            delay={i * 100}
            className="min-w-[72%] snap-start md:min-w-0"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-[#efeae3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.image}
                alt={s.alt}
                loading="lazy"
                width={s.fullFrame ? 7008 : undefined}
                height={s.fullFrame ? 4672 : undefined}
                className={`h-full w-full ${s.fullFrame ? "object-contain" : "object-cover object-[70%_center]"}`}
              />
              {/* 원본 3:2 사진은 가운데에 표시하므로 번호는 사진 위 여백에 놓입니다. */}
              <span
                className={`absolute grid place-items-center rounded-full bg-white font-display text-sm text-gold ${s.fullFrame ? "top-3 left-3 h-8 w-8" : "top-4 left-4 h-10 w-10"}`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em]">
              {s.title}
            </h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-muted">
              {s.text}
            </p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

/** 시술 장면 영상 (가로로 꽉 차게, 왼쪽 위에 글) */
export function StoryVideo({ story }: { story: DeviceStory }) {
  const v = story.video;
  if (!v) return null;
  return (
    <section aria-label="시술 장면" className="px-3 md:px-6">
      <div className="relative mx-auto max-w-[1560px] overflow-hidden rounded-[28px] bg-[#dcd7d3] md:aspect-[3/1] md:rounded-[40px]">
        <div className="relative aspect-[4/3] md:absolute md:inset-0 md:aspect-auto">
          <video
            src={v.src}
            poster={v.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover object-[78%_center]"
          />
          <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(225,221,217,0.92),rgba(225,221,217,0.6)_30%,transparent_48%)] md:block" />
        </div>
        <div className="relative flex flex-col p-7 md:h-full md:justify-center md:p-16">
          <p className="font-display text-xs tracking-[0.35em] text-gold uppercase">
            Treatment
          </p>
          <p className="mt-4 text-[26px] leading-snug font-semibold tracking-[-0.03em] md:text-[40px]">
            {v.title.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </p>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink/70">
            {v.text}
          </p>
        </div>
      </div>
    </section>
  );
}

/** HIFU 원리 그림: 피부 단면 + 핸드피스에서 모인 초음파가 층마다 열 응고점을 만듦 */
function HifuDiagram({
  depths = ["얕게", "중간", "깊게"],
}: {
  depths?: [string, string, string];
}) {
  // 층: [이름, 위, 아래, 색]
  const layers: [string, number, number, string][] = [
    ["표피", 96, 112, "#f6dccb"],
    ["진피층", 112, 182, "#f0cdb8"],
    ["피하지방층", 182, 262, "#f6e5c4"],
    ["근막층 (SMAS)", 262, 290, "#d8a48d"],
    ["근육", 290, 360, "#c98c7b"],
  ];
  // 초점 깊이: [y, 표시]
  const foci: [number, string][] = [
    [150, depths[0]],
    [222, depths[1]],
    [276, depths[2]],
  ];
  return (
    <svg
      viewBox="0 0 600 400"
      role="img"
      aria-label="집속 초음파가 피부 속 진피층 · 피하지방층 · 근막층에 열 응고점을 만드는 원리 그림"
      className="h-auto w-full"
    >
      <defs>
        <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a88e6a" stopOpacity="0.05" />
          <stop offset="1" stopColor="#a88e6a" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id="dot">
          <stop offset="0" stopColor="#fff7e6" />
          <stop offset="0.45" stopColor="#f2b35c" />
          <stop offset="1" stopColor="#f2b35c" stopOpacity="0" />
        </radialGradient>
        <pattern id="fat" width="26" height="22" patternUnits="userSpaceOnUse">
          <circle cx="13" cy="11" r="9" fill="#fbecd0" stroke="#efd6ab" />
        </pattern>
      </defs>

      {/* 피부 층 */}
      {layers.map(([name, y1, y2, c]) => (
        <g key={name}>
          <rect x="20" y={y1} width="380" height={y2 - y1} fill={c} />
          {name === "피하지방층" && (
            <rect
              x="20"
              y={y1}
              width="380"
              height={y2 - y1}
              fill="url(#fat)"
              opacity="0.7"
            />
          )}
          {/* 오른쪽 이름표 */}
          <line
            x1="400"
            y1={(y1 + y2) / 2}
            x2="416"
            y2={(y1 + y2) / 2}
            stroke="#a88e6a"
            strokeWidth="1"
          />
          <text
            x="422"
            y={(y1 + y2) / 2 + 7}
            fontSize="19"
            fill="#4a423b"
            fontWeight={name.includes("SMAS") ? 700 : 400}
          >
            {name}
          </text>
        </g>
      ))}

      {/* 핸드피스 */}
      <rect x="95" y="26" width="230" height="62" rx="18" fill="#2a2724" />
      <rect x="112" y="80" width="196" height="14" rx="6" fill="#d9d4cd" />
      <text x="210" y="64" fontSize="18" fill="#f1e2c6" textAnchor="middle">
        핸드피스 (표면 냉각)
      </text>

      {/* 모이는 초음파 + 열 응고점 (깊이별) */}
      {foci.map(([y, label], i) => {
        const cx = 145 + i * 65;
        return (
          <g key={y}>
            <path
              d={`M${cx - 34} 92 L${cx} ${y} L${cx + 34} 92 Z`}
              fill="url(#beam)"
            />
            <circle
              cx={cx}
              cy={y}
              r="13"
              fill="url(#dot)"
              className="animate-[focus-glow_2.4s_ease-in-out_infinite]"
              style={{ animationDelay: `${i * 0.6}s` }}
            />
            <circle cx={cx} cy={y} r="3" fill="#fff" />
            <text
              x={cx}
              y="392"
              fontSize="16"
              fill="#7d6649"
              textAnchor="middle"
            >
              {label}
            </text>
            <line
              x1={cx}
              y1={y + 16}
              x2={cx}
              y2="372"
              stroke="#7d6649"
              strokeDasharray="2 4"
              strokeWidth="1"
              opacity="0.5"
            />
          </g>
        );
      })}
    </svg>
  );
}

/** 원리 그림 사진 + 그 위 표시 (넓은 화면: 이름표, 좁은 화면: 번호 + 아래 설명) */
function PrincipleFigure({
  image,
}: {
  image: NonNullable<DeviceStory["principleImage"]>;
}) {
  return (
    <figure>
      <div className="relative overflow-hidden rounded-[24px] bg-[#1d2a30] md:rounded-[32px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          className="block h-auto w-full"
        />
        {/* 가리키는 표시 */}
        {image.marks.map((m) => (
          <div
            key={m.label}
            className="absolute"
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
          >
            <span className="absolute h-3 w-3 -translate-1/2 rounded-full bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.35)] md:h-3.5 md:w-3.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-white/70" />
            </span>
            {/* 이름표 (모바일은 작게) */}
            <span
              className={`absolute flex items-center gap-0 whitespace-nowrap ${m.above ? "top-2.5 md:-top-10" : "top-0 -translate-y-1/2"} ${m.side === "left" ? "right-1.5 flex-row-reverse md:right-2" : "left-1.5 md:left-2"}`}
            >
              <span className="h-px w-3 bg-white/80 md:w-8 lg:w-12" />
              <span className="rounded-full bg-ink/75 px-2 py-[3px] text-[10.5px] text-white backdrop-blur md:px-3.5 md:py-1.5 md:text-[13px] lg:text-sm">
                {m.label}
              </span>
            </span>
          </div>
        ))}
        {/* 오른쪽 끝 층 이름 */}
        <div className="absolute inset-y-0 right-0 hidden md:block">
          {image.layers.map((l) => (
            <span
              key={l.label}
              className="absolute right-4 -translate-y-1/2 rounded-l-full rounded-r-md bg-white/85 px-3 py-1 text-xs whitespace-nowrap text-ink backdrop-blur lg:right-6 lg:text-[13px]"
              style={{ top: `${l.y}%` }}
            >
              {l.label}
            </span>
          ))}
        </div>
      </div>
    </figure>
  );
}

/** 많이 비교하는 장비 비교표 */
export function StoryCompare({
  title,
  story,
}: {
  title: string;
  story: DeviceStory;
}) {
  const c = story.compare;
  if (!c) return null;
  return (
    <section
      id="compare"
      className="mx-auto max-w-[1400px] scroll-mt-36 px-5 pb-24 md:scroll-mt-44 md:px-10 md:pb-36"
    >
      <SectionHead
        en="Compare"
        title={c.title ?? `${title}, 다른 리프팅 장비와 어떻게 다른가요?`}
      />
      <p className="mt-4 text-[15px] text-muted">
        {c.lead ??
          "상담 시 자주 비교되는 리프팅 장비의 일반적인 특징을 정리했습니다."}
      </p>
      <p className="mt-8 text-xs text-muted md:hidden">
        ← 옆으로 밀어서 비교해 보세요
      </p>
      <Reveal className="no-scrollbar -mx-5 mt-3 overflow-x-auto overscroll-x-contain px-5 md:mx-0 md:mt-12 md:px-0">
        <table className="w-full min-w-[720px] table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[120px] md:w-[150px]" />
            {c.columns.map((col) => (
              <col key={col.name} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th />
              {c.columns.map((col) => (
                <th
                  key={col.name}
                  scope="col"
                  className={`px-4 pt-6 pb-5 align-top font-normal md:px-6 ${col.self ? "rounded-t-[20px] bg-espresso text-white" : ""}`}
                >
                  <span
                    className={`block text-[11px] ${col.self ? "text-taupe" : "text-muted"}`}
                  >
                    {col.maker}
                  </span>
                  <span className="mt-1 block text-lg font-semibold tracking-[-0.02em] md:text-xl">
                    {col.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {c.rows.map((r, ri) => (
              <tr key={r.label} className="border-t border-line">
                <th
                  scope="row"
                  className="py-4 pr-3 text-[13px] font-normal text-gold md:py-5"
                >
                  {r.label}
                </th>
                {r.values.map((v, i) => (
                  <td
                    key={c.columns[i].name}
                    className={`px-4 py-4 text-[14px] leading-snug md:px-6 md:py-5 md:text-[15px] ${c.columns[i].self ? `bg-espresso font-medium text-white ${ri === c.rows.length - 1 ? "rounded-b-[20px]" : ""}` : "text-ink/80"}`}
                  >
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
      <p className="mt-6 text-xs leading-relaxed text-muted">{c.note}</p>
    </section>
  );
}

type TreatmentDiagramKind = Exclude<
  NonNullable<DeviceStory["diagram"]>,
  "hifu" | "filler"
>;

/** 실제 깊이 · 용량을 나타내지 않는 개념도. 초음파 그림을 다른 시술에 재사용하지 않음. */
function TreatmentDiagram({ kind }: { kind: TreatmentDiagramKind }) {
  const copy: Record<TreatmentDiagramKind, { title: string; note: string }> = {
    rf: {
      title: "고주파 에너지와 피부 표면 냉각",
      note: "피부 속 열 자극 · 경과에 따른 조직 반응",
    },
    botox: {
      title: "보툴리눔 톡신의 신경 · 근육 작용",
      note: "근육의 움직임과 시술 부위에 맞춰 계획",
    },
    matrix: {
      title: "조직 유래 기질을 이용하는 시술",
      note: "제품의 처리 방식 · 적용 부위 · 경과 확인",
    },
    booster: {
      title: "성분과 주입 방법에 맞춘 관리",
      note: "성분 · 제형 · 허가 용도를 먼저 확인",
    },
    collagen: {
      title: "성분에 따라 다른 조직 반응",
      note: "같은 이름의 시술도 제품별로 구분",
    },
    laser: {
      title: "장비마다 다른 에너지 전달 방식",
      note: "초음파 · 고주파 · 레이저를 구분해 계획",
    },
    thread: {
      title: "실을 이용한 조직 지지",
      note: "실의 종류 · 삽입 층 · 방향은 진찰 후 결정",
    },
    acne: {
      title: "모공 속 막힘과 염증을 나누어 치료",
      note: "진행 중인 여드름과 남은 흔적은 다른 치료",
    },
    hair: {
      title: "털의 색소에 반응하는 레이저",
      note: "성장 단계 · 털 색 · 피부 톤에 맞춰 계획",
    },
    pigment: {
      title: "색소 입자에 작용하는 레이저",
      note: "색소 반응과 피부 회복을 확인하며 진행",
    },
  };
  const skin = !["botox", "booster", "laser"].includes(kind);
  return (
    <svg
      viewBox="0 0 600 420"
      role="img"
      aria-label={`${copy[kind].title} 개념도`}
      className="h-auto w-full"
    >
      <text
        x="300"
        y="35"
        textAnchor="middle"
        fill="#4a423b"
        fontSize="23"
        fontWeight="600"
      >
        {copy[kind].title}
      </text>
      {skin && (
        <g>
          <rect x="30" y="130" width="350" height="20" fill="#f6dccb" />
          <rect x="30" y="150" width="350" height="126" fill="#f0cdb8" />
          <rect x="30" y="276" width="350" height="90" fill="#f6e5c4" />
          {[
            ["표피", 143],
            ["진피", 218],
            ["피하 조직", 325],
          ].map(([label, y]) => (
            <g key={label}>
              <line
                x1="385"
                y1={Number(y) - 7}
                x2="405"
                y2={Number(y) - 7}
                stroke="#a88e6a"
              />
              <text x="418" y={y} fontSize="22" fill="#4a423b">
                {label}
              </text>
            </g>
          ))}
        </g>
      )}
      {kind === "rf" && (
        <g>
          <rect x="104" y="70" width="205" height="48" rx="12" fill="#2a2724" />
          <rect x="116" y="118" width="181" height="12" rx="4" fill="#bed7df" />
          <text x="206" y="102" textAnchor="middle" fill="#fff" fontSize="21">
            고주파 · 냉각
          </text>
          <ellipse
            cx="206"
            cy="215"
            rx="100"
            ry="47"
            fill="#cf8d70"
            opacity=".3"
          />
          {[135, 175, 215, 255].map((x) => (
            <path
              key={x}
              d={`M${x} 153 q-12 18 0 36 t0 36`}
              fill="none"
              stroke="#aa7057"
              strokeWidth="3"
            />
          ))}
          <text
            x="206"
            y="335"
            textAnchor="middle"
            fill="#715845"
            fontSize="22"
          >
            피부 속 열 자극
          </text>
        </g>
      )}
      {kind === "botox" && (
        <g>
          <path
            d="M75 120 H240 Q265 120 265 150 V180"
            fill="none"
            stroke="#a88e6a"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <text x="75" y="92" fill="#4a423b" fontSize="23">
            신경 신호
          </text>
          <circle cx="265" cy="198" r="14" fill="#7d6649" />
          <path
            d="M260 221 V249 M246 235 H274"
            stroke="#7d6649"
            strokeWidth="3"
          />
          <text x="304" y="207" fill="#4a423b" fontSize="22">
            신호 전달 완화
          </text>
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x="85"
              y={265 + i * 17}
              width="390"
              height="12"
              rx="6"
              fill={i % 2 ? "#d8a48d" : "#c98c7b"}
            />
          ))}
          <text
            x="280"
            y="361"
            textAnchor="middle"
            fill="#715845"
            fontSize="23"
          >
            근육 수축 조절
          </text>
        </g>
      )}
      {(kind === "matrix" || kind === "collagen") && (
        <g>
          <path
            d="M88 73 L145 118"
            stroke="#2a2724"
            strokeWidth="22"
            strokeLinecap="round"
          />
          <path d="M145 118 L193 167" stroke="#8b8378" strokeWidth="4" />
          {[0, 1, 2, 3, 4].map((i) => (
            <circle
              key={i}
              cx={105 + i * 48}
              cy={198 + (i % 2) * 24}
              r="9"
              fill={kind === "matrix" ? "#8da5a8" : "#b39b75"}
            />
          ))}
          <path
            d="M65 245 Q105 223 145 245 T225 245 T345 245"
            fill="none"
            stroke="#b47762"
            strokeWidth="4"
          />
          <text x="206" y="100" fill="#4a423b" fontSize="21">
            {kind === "matrix" ? "조직 유래 기질" : "제품별 성분"}
          </text>
          <text
            x="206"
            y="333"
            textAnchor="middle"
            fill="#715845"
            fontSize="22"
          >
            적용 후 경과 관찰
          </text>
        </g>
      )}
      {(kind === "booster" || kind === "laser") && (
        <g>
          {(kind === "laser"
            ? ["집속 초음파", "미세침 고주파", "레이저"]
            : ["성분 확인", "주입 방법", "피부 반응"]
          ).map((label, i) => (
            <g key={label} transform={`translate(${35 + i * 185} 100)`}>
              <rect width="160" height="240" rx="14" fill="#efe7db" />
              {kind === "laser" ? (
                <g fill="none" stroke="#9a7755" strokeWidth="3">
                  <path
                    d={
                      i === 0
                        ? "M36 40 L80 143 L124 40"
                        : i === 1
                          ? "M40 40 V117 M80 40 V132 M120 40 V117"
                          : "M68 40 V143 M92 40 V143"
                    }
                  />
                  <path d="M18 153 H142 M18 177 H142" stroke="#c99b83" />
                  <circle
                    cx="80"
                    cy={i === 1 ? 132 : 153}
                    r="9"
                    fill="#c99b83"
                    stroke="none"
                  />
                </g>
              ) : (
                <g fill="none" stroke="#9a7755" strokeWidth="3">
                  {i === 0 ? (
                    // 앰플
                    <g>
                      <rect x="66" y="40" width="28" height="16" rx="3" />
                      <rect x="58" y="56" width="44" height="84" rx="10" />
                      <path
                        d="M58 100 H102 V130 Q102 140 92 140 H68 Q58 140 58 130 Z"
                        fill="#c99b83"
                        stroke="none"
                      />
                    </g>
                  ) : i === 1 ? (
                    // 주사기
                    <g>
                      <path d="M70 34 H90 M80 34 V52" />
                      <rect x="68" y="52" width="24" height="62" rx="3" />
                      <path d="M68 72 H76 M68 88 H76 M68 104 H76" />
                      <path d="M80 114 V144" strokeWidth="2" />
                    </g>
                  ) : (
                    // 피부 속에 퍼진 성분
                    <g>
                      <path d="M18 76 Q49 64 80 76 T142 76" />
                      <path d="M18 140 H142" stroke="#c99b83" />
                      {[
                        [46, 100],
                        [80, 112],
                        [114, 100],
                        [63, 126],
                        [97, 126],
                      ].map(([cx, cy]) => (
                        <circle
                          key={cx + "-" + cy}
                          cx={cx}
                          cy={cy}
                          r="7"
                          fill="#c99b83"
                          stroke="none"
                        />
                      ))}
                    </g>
                  )}
                  <circle cx="80" cy="170" r="5" fill="#9a7755" />
                </g>
              )}
              <text
                x="80"
                y="216"
                textAnchor="middle"
                fill="#4a423b"
                fontSize="20"
              >
                {label}
              </text>
            </g>
          ))}
        </g>
      )}
      {kind === "thread" && (
        <g>
          <path d="M77 248 L320 191" stroke="#8d775f" strokeWidth="4" />
          {[105, 145, 185, 225, 265].map((x) => (
            <path
              key={x}
              d={`M${x - 8} ${248 - ((x - 77) * 57) / 243 - 10} L${x} ${248 - ((x - 77) * 57) / 243} l-5 12`}
              fill="none"
              stroke="#8d775f"
              strokeWidth="3"
            />
          ))}
          <path
            d="M198 112 L258 90 M246 82 L258 90 L251 103"
            fill="none"
            stroke="#7d6649"
            strokeWidth="3"
          />
          <text
            x="203"
            y="329"
            textAnchor="middle"
            fill="#715845"
            fontSize="22"
          >
            삽입한 실로 조직 지지
          </text>
        </g>
      )}
      {(kind === "hair" || kind === "acne") && (
        <g>
          <path
            d="M158 130 Q175 161 156 230 Q144 280 175 303 Q211 322 227 278 L239 130"
            fill="#e4b59e"
            stroke="#b5836c"
            strokeWidth="3"
          />
          {kind === "hair" ? (
            <g>
              <path
                d="M204 63 L189 259"
                stroke="#4a3931"
                strokeWidth="9"
                strokeLinecap="round"
              />
              <path
                d="M276 64 L205 249 M286 64 L218 261"
                stroke="#a88e6a"
                strokeWidth="3"
              />
              <ellipse cx="194" cy="270" rx="16" ry="24" fill="#795543" />
              <text
                x="215"
                y="347"
                textAnchor="middle"
                fill="#715845"
                fontSize="22"
              >
                털의 색소 · 모낭 주변 반응
              </text>
            </g>
          ) : (
            <g>
              <ellipse cx="201" cy="154" rx="31" ry="19" fill="#b59773" />
              <circle cx="191" cy="237" r="27" fill="#c77f69" opacity=".55" />
              <text x="88" y="93" fill="#715845" fontSize="21">
                모공 막힘
              </text>
              <text x="250" y="249" fill="#715845" fontSize="21">
                염증
              </text>
              <text
                x="204"
                y="347"
                textAnchor="middle"
                fill="#715845"
                fontSize="22"
              >
                상태에 따라 치료 구분
              </text>
            </g>
          )}
        </g>
      )}
      {kind === "pigment" && (
        <g>
          <path
            d="M171 64 V191 M187 64 V191"
            stroke="#a88e6a"
            strokeWidth="3"
          />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <circle
              key={i}
              cx={115 + (i % 4) * 45}
              cy={216 + Math.floor(i / 4) * 31}
              r={i % 2 ? 5 : 9}
              fill="#695651"
            />
          ))}
          <path
            d="M287 229 L339 229 M329 219 L339 229 L329 239"
            fill="none"
            stroke="#a88e6a"
            strokeWidth="3"
          />
          <text
            x="204"
            y="341"
            textAnchor="middle"
            fill="#715845"
            fontSize="22"
          >
            입자 반응 · 회복 과정 관찰
          </text>
        </g>
      )}
      <text x="300" y="402" textAnchor="middle" fill="#6b6259" fontSize="18">
        {copy[kind].note}
      </text>
    </svg>
  );
}

/** 필러 원리 그림: 피부 단면 + 부위에 따라 다른 층에 히알루론산을 넣어 꺼진 곳을 받쳐 줌 */
function FillerDiagram() {
  // 층: [이름, 위, 아래, 색]
  const layers: [string, number, number, string][] = [
    ["표피", 120, 134, "#f6dccb"],
    ["진피층", 134, 196, "#f0cdb8"],
    ["피하지방층", 196, 286, "#f6e5c4"],
    ["골막 · 뼈", 286, 360, "#e6dccd"],
  ];
  // 주입 위치: [x, y, 가로 반지름, 세로 반지름, 이름]
  const gels: [number, number, number, number, string][] = [
    [110, 168, 26, 11, "잔주름 · 입술"],
    [215, 242, 40, 22, "볼륨 (앞볼 · 옆볼)"],
    [320, 280, 36, 13, "윤곽 · 이마"],
  ];
  return (
    <svg
      viewBox="0 0 600 400"
      role="img"
      aria-label="필러를 부위에 따라 진피층 · 피하지방층 · 골막 위에 나누어 넣어 꺼진 곳을 받쳐 주는 원리 그림"
      className="h-auto w-full"
    >
      <defs>
        <radialGradient id="gel">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="0.6" stopColor="#e7f1f6" stopOpacity="0.9" />
          <stop offset="1" stopColor="#bcd6e2" stopOpacity="0.85" />
        </radialGradient>
        <pattern id="fat2" width="26" height="22" patternUnits="userSpaceOnUse">
          <circle cx="13" cy="11" r="9" fill="#fbecd0" stroke="#efd6ab" />
        </pattern>
      </defs>

      {/* 피부 층 */}
      {layers.map(([name, y1, y2, c]) => (
        <g key={name}>
          <rect x="20" y={y1} width="380" height={y2 - y1} fill={c} />
          {name === "피하지방층" && (
            <rect
              x="20"
              y={y1}
              width="380"
              height={y2 - y1}
              fill="url(#fat2)"
              opacity="0.7"
            />
          )}
          <line
            x1="400"
            y1={(y1 + y2) / 2}
            x2="416"
            y2={(y1 + y2) / 2}
            stroke="#a88e6a"
            strokeWidth="1"
          />
          <text x="422" y={(y1 + y2) / 2 + 7} fontSize="19" fill="#4a423b">
            {name}
          </text>
        </g>
      ))}

      {/* 주사기 (위에서 비스듬히) */}
      <g transform="rotate(-32 120 70)">
        <rect
          x="60"
          y="58"
          width="150"
          height="24"
          rx="6"
          fill="#ffffff"
          stroke="#cfc7bb"
        />
        <rect x="70" y="62" width="100" height="16" rx="4" fill="#dcebf2" />
        <rect x="30" y="64" width="34" height="12" rx="3" fill="#2a2724" />
        <rect x="210" y="67" width="70" height="6" rx="3" fill="#bdb6ac" />
      </g>

      {/* 넣은 필러: 층마다 다른 모양 */}
      {gels.map(([x, y, rx, ry, label], i) => (
        <g key={label}>
          <ellipse
            cx={x}
            cy={y}
            rx={rx}
            ry={ry}
            fill="url(#gel)"
            stroke="#9cc0d0"
            strokeWidth="1.2"
          />
          <line
            x1={x}
            y1={y - ry}
            x2={x}
            y2={i === 1 ? 82 : 104}
            stroke="#a88e6a"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
          <text
            x={x}
            y={i === 1 ? 74 : 96}
            fontSize="15"
            fill="#7d6649"
            textAnchor="middle"
            fontWeight={600}
          >
            {label}
          </text>
        </g>
      ))}

      <text x="210" y="390" fontSize="15" fill="#8a8378" textAnchor="middle">
        부위마다 넣는 층과 제품을 다르게
      </text>
    </svg>
  );
}
