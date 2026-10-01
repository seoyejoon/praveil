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
  return (
    <>
      {/* 어떤 장비인가요? (제조사 브랜드 영상이 있으면 어두운 카드에 영상) */}
      <section id="what" className="scroll-mt-36 px-3 md:scroll-mt-44 md:px-6">
        {device.film ? (
          <div className="mx-auto grid max-w-[1560px] overflow-hidden rounded-[28px] bg-[#2b2b2b] text-white md:rounded-[40px] lg:grid-cols-[1.35fr_1fr]">
            <div className="relative aspect-[16/9] lg:aspect-auto lg:min-h-[560px]">
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
              <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,transparent_60%,#2b2b2b)] lg:block" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(180deg,transparent,#2b2b2b)] lg:hidden" />
            </div>
            <div className="flex flex-col justify-center px-6 pt-4 pb-14 md:px-14 md:py-16">
              <p className="font-display text-[11px] tracking-[0.3em] text-taupe uppercase">
                {device.maker} · {device.name}
              </p>
              <h2 className="mt-4 text-[26px] leading-snug font-semibold tracking-[-0.03em] md:text-[36px]">
                {title}, 어떤 장비인가요?
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
              <SectionHead en="What is" title={`${title}, 어떤 장비인가요?`} />
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
              <HifuDiagram depths={story.depths} />
              <figcaption className="mt-3 text-center text-xs text-muted">
                ※ 원리를 쉽게 보여 드리기 위한 그림입니다
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>
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
        <SectionHead en="Point" title={`프라베일 ${title}의 특징`} />
        <ol className="mt-12 grid gap-14 md:mt-16 md:gap-24">
          {story.features.map((f, i) => (
            <li
              key={f.title}
              className="grid items-center gap-7 md:grid-cols-2 md:gap-16"
            >
              <Reveal
                className={`relative aspect-[4/3] overflow-hidden rounded-[24px] bg-[#1d2227] md:rounded-[32px] ${i % 2 ? "md:order-2" : ""}`}
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
                    className="absolute inset-0 h-full w-full object-cover"
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
      <ol className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 md:mx-0 md:mt-16 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0">
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
                className="h-full w-full object-cover object-[70%_center]"
              />
              <span className="absolute top-4 left-4 grid h-10 w-10 place-items-center rounded-full bg-white font-display text-sm text-gold">
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
