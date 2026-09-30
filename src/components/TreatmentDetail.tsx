import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Lock,
  MessageCircle,
  Phone,
} from "lucide-react";
import BestMark from "@/components/BestMark";
import ConsultCta from "@/components/sub/ConsultCta";
import FaqList from "@/components/sub/FaqList";
import SectionHead from "@/components/sub/SectionHead";
import Reveal from "@/components/Reveal";
import { mainDoctor } from "@/content/main";
import {
  chooseCriteria,
  josa,
  type TreatmentGuide,
} from "@/content/treatment-guide";
import {
  commonCautions,
  treatmentSteps,
  type Treatment,
} from "@/content/treatments";
import type { Doctor, Hospital, Procedure } from "@/lib/data";

export type CompareColumn = {
  href: string;
  title: string;
  profile: TreatmentGuide["profile"];
};

type Props = {
  t: Treatment;
  g: TreatmentGuide;
  best?: boolean;
  hospital: Hospital;
  doctor: Doctor;
  /** 가격이 입력된 시술만 */
  prices: Procedure[];
  compare: CompareColumn[];
  faq: { q: string; a: string }[];
  /** 지역 검색어 (예: 인천 남동구) */
  area: string;
  updated: string;
};

const compareRows: { key: keyof TreatmentGuide["profile"]; label: string }[] = [
  { key: "method", label: "방식" },
  { key: "depth", label: "작용 층" },
  { key: "concern", label: "주된 고민" },
  { key: "pain", label: "통증" },
  { key: "recovery", label: "회복" },
  { key: "interval", label: "권장 주기" },
];

// 시술 상세 본문 (모든 시술 공통 틀)
// 한눈에 보기 → 어떤 시술 → 이런 분께 → 비교 → 특징 → 세부 시술 → 의료진 → 병원 고르는 기준
// → 과정 → 효과 타임라인 → 통증 · 회복 · 주의사항 → 비용 → 전후사진 → 자주 묻는 질문 → 상담
export default function TreatmentDetail({
  t,
  g,
  best,
  hospital,
  doctor,
  prices,
  compare,
  faq,
  area,
  updated,
}: Props) {
  const eun = josa(t.title, "은", "는");
  const summary = [
    { label: "시술 방식", value: g.profile.method },
    { label: "시술 부위", value: g.area },
    ...t.facts,
    { label: "효과", value: g.onset },
    {
      label: "비용",
      value: prices.length ? "아래 비용 안내 참고" : "상담 후 안내",
    },
    { label: "시술", value: `대표원장 ${doctor.name} 직접` },
    {
      label: "위치",
      value: `${area} ${hospital.addressDetail.split(" ")[0]}`,
    },
  ];
  const jumps = [
    { id: "what", label: "어떤 시술" },
    compare.length > 1 && { id: "compare", label: "비교" },
    { id: "result", label: "효과 · 유지" },
    { id: "aftercare", label: "통증 · 회복" },
    { id: "price", label: "비용" },
    { id: "faq", label: "자주 묻는 질문" },
    { id: "visit", label: "상담 · 위치" },
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <>
      {/* 한눈에 보기 */}
      <section
        id="summary"
        className="mx-auto max-w-[1400px] scroll-mt-36 px-5 pt-20 pb-16 md:scroll-mt-44 md:px-10 md:pt-28 md:pb-24"
      >
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            {best && (
              <Reveal>
                <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-ivory px-4 py-1.5 text-sm text-mocha">
                  <BestMark />
                  프라베일 대표 시술
                </p>
              </Reveal>
            )}
            <Reveal
              variant="line"
              className="text-[28px] leading-[1.35] font-light tracking-[-0.03em] md:text-[44px]"
            >
              {t.headline.map((h) => (
                <span key={h}>
                  <span>{h}</span>
                </span>
              ))}
            </Reveal>
          </div>
          <Reveal delay={150} className="lg:pt-3">
            <p className="font-display text-xs tracking-[0.35em] text-gold uppercase">
              Summary · 한눈에 보기
            </p>
            <p className="mt-5 text-[16px] leading-[1.85] text-ink md:text-[18px]">
              {g.answer}
            </p>
            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
              <span>
                {hospital.name} 대표원장 {doctor.name}
              </span>
              <span aria-hidden className="h-3 w-px bg-line" />
              <time dateTime={updated}>
                업데이트 {updated.replaceAll("-", ".")}
              </time>
            </p>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <dl className="mt-14 grid grid-cols-2 border-t border-ink/80 md:mt-20 lg:grid-cols-5">
            {summary.map((f) => (
              <div
                key={f.label}
                className="border-b border-line py-6 pr-4 md:py-7"
              >
                <dt className="text-[13px] text-gold">{f.label}</dt>
                <dd className="mt-2 text-[15px] leading-snug font-medium tracking-[-0.02em] md:text-lg">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <nav aria-label="이 페이지 바로 보기" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {jumps.map((j) => (
              <li key={j.id}>
                <a
                  href={`#${j.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-[13px] text-muted transition hover:border-gold hover:text-ink"
                >
                  {j.label}
                  <ArrowRight className="h-3 w-3 rotate-90" strokeWidth={1.6} />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      {/* 어떤 시술인가요? */}
      <section
        id="what"
        className="mx-auto max-w-[1400px] scroll-mt-36 px-5 pb-24 md:scroll-mt-44 md:px-10 md:pb-32"
      >
        <div className="grid gap-8 border-t border-line pt-16 md:pt-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHead
            en="What is"
            title={`${t.title}${eun} 어떤 시술인가요?`}
          />
          <Reveal className="space-y-5 text-[15px] leading-[1.9] text-muted md:text-[17px]">
            <p>{t.intro}</p>
            <p>{g.principle}</p>
          </Reveal>
        </div>
      </section>

      {/* 어떤 고민에 고려하나요? */}
      <section className="px-3 md:px-6">
        <div className="mx-auto grid max-w-[1560px] overflow-hidden rounded-[28px] bg-ivory md:rounded-[40px] lg:grid-cols-2">
          <div className="relative min-h-[300px] lg:min-h-[560px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={t.photo}
              alt={`${t.title} 이미지`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {t.photo.startsWith("/images/stock/") && (
              <span className="absolute bottom-3 left-4 text-[10px] text-white/80 drop-shadow">
                ※ 이해를 돕기 위한 연출 이미지입니다
              </span>
            )}
          </div>
          <div className="flex flex-col justify-center px-6 py-14 md:px-16 md:py-20">
            <SectionHead
              en="Who it's for"
              title={`${t.title}, 어떤 고민에 고려하나요?`}
            />
            <ul className="mt-10 grid gap-3">
              {t.recommend.map((r, i) => (
                <Reveal
                  as="li"
                  key={r}
                  delay={i * 80}
                  className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4 md:px-6 md:py-5"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold text-white">
                    <Check className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <span className="text-[15px] md:text-base">{r}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 다른 시술과 어떻게 다른가요? */}
      {compare.length > 1 && (
        <section
          id="compare"
          className="mx-auto max-w-[1400px] scroll-mt-36 px-5 pt-24 md:scroll-mt-44 md:px-10 md:pt-36"
        >
          <SectionHead
            en="Compare"
            title={`${t.title}, 다른 시술과 어떻게 다른가요?`}
          />
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
            같은 고민도 원인에 따라 맞는 시술이 다릅니다. 프라베일에서 함께
            상담하는 시술을 나란히 정리했습니다.
          </p>
          <p className="mt-10 text-xs text-muted md:hidden">
            ← 옆으로 밀어서 비교해 보세요
          </p>
          <Reveal className="no-scrollbar -mx-5 mt-3 overflow-x-auto px-5 md:mx-0 md:mt-16 md:px-0">
            <table className="w-full min-w-[720px] table-fixed border-separate border-spacing-0 text-left">
              <caption className="sr-only">
                {t.title} 및 비슷한 시술 비교
              </caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="sticky left-0 z-10 w-[112px] bg-white md:w-[160px]"
                  >
                    <span className="sr-only">항목</span>
                  </th>
                  {compare.map((c) => {
                    const me = c.href === t.href;
                    return (
                      <th
                        key={c.href}
                        scope="col"
                        className={`rounded-t-[20px] px-5 pt-7 pb-5 align-top font-normal md:px-7 ${me ? "bg-espresso text-white" : ""}`}
                      >
                        <span
                          className={`font-display text-[11px] tracking-[0.25em] uppercase ${me ? "text-taupe" : "text-gold"}`}
                        >
                          {me ? "This page" : "Compare"}
                        </span>
                        {me ? (
                          <span className="mt-2 block text-xl font-semibold tracking-[-0.02em] md:text-2xl">
                            {c.title}
                          </span>
                        ) : (
                          <Link
                            href={c.href}
                            className="group mt-2 flex items-center gap-1 text-xl font-semibold tracking-[-0.02em] transition hover:text-gold md:text-2xl"
                          >
                            {c.title}
                            <ArrowUpRight
                              className="h-4 w-4 text-muted transition group-hover:text-gold"
                              strokeWidth={1.6}
                            />
                          </Link>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {compareRows.map((r, ri) => (
                  <tr key={r.key}>
                    <th
                      scope="row"
                      className="sticky left-0 z-10 border-t border-line bg-white py-5 pr-4 align-top text-[13px] font-normal text-gold md:text-sm"
                    >
                      {r.label}
                    </th>
                    {compare.map((c) => {
                      const me = c.href === t.href;
                      const last = ri === compareRows.length - 1;
                      return (
                        <td
                          key={c.href}
                          className={`px-5 py-5 align-top text-[14px] leading-snug md:px-7 md:text-[15px] ${me ? `border-t border-white/10 bg-espresso text-white ${last ? "rounded-b-[20px]" : ""}` : "border-t border-line text-ink/80"}`}
                        >
                          {c.profile[r.key]}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </section>
      )}

      {/* 특징 3가지 */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <SectionHead en="Point" title={`프라베일 ${t.title}의 특징`} />
        <ol className="mt-12 grid gap-px overflow-hidden rounded-[24px] border border-line bg-line md:mt-16 md:grid-cols-3">
          {t.points.map((p, i) => (
            <Reveal
              as="li"
              key={p.title}
              delay={i * 120}
              className="group bg-white p-8 transition-colors duration-500 hover:bg-ivory md:p-10"
            >
              <span className="font-display text-[44px] leading-none font-extralight text-gold/60 transition-colors duration-500 group-hover:text-gold md:text-[56px]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-8 text-xl font-semibold tracking-[-0.02em] md:text-2xl">
                {p.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                {p.text}
              </p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* 세부 시술 */}
      {t.items && (
        <section className="bg-espresso px-5 py-24 text-white md:px-10 md:py-32">
          <div className="mx-auto max-w-[1400px]">
            <SectionHead
              en="Program"
              tone="dark"
              title={`${t.title} 세부 시술`}
            />
            <ul
              className={`mt-12 grid gap-3 md:mt-16 ${t.items.length > 4 ? "grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3"}`}
            >
              {t.items.map((it, i) => (
                <Reveal
                  as="li"
                  key={it.name}
                  delay={(i % 4) * 80}
                  className="group rounded-[20px] border border-white/12 p-6 transition duration-500 hover:border-gold/60 hover:bg-white/[0.04] md:p-8"
                >
                  <span className="font-display text-xs tracking-[0.2em] text-taupe">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-6 text-lg font-semibold md:text-xl">
                    {it.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">
                    {it.text}
                  </p>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 누가 상담하고 시술하나요? */}
      <section
        id="doctor"
        className={`scroll-mt-36 px-3 md:scroll-mt-44 md:px-6 ${t.items ? "pt-16 md:pt-24" : ""}`}
      >
        <div className="mx-auto grid max-w-[1560px] overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,#f6f2ec,#ece5da)] md:rounded-[40px] lg:grid-cols-[1fr_1.1fr]">
          <div className="relative order-2 min-h-[360px] lg:order-1 lg:min-h-[600px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mainDoctor.image}
              alt={`대표원장 ${doctor.name}`}
              loading="lazy"
              className="absolute inset-x-0 bottom-0 mx-auto h-[92%] w-auto max-w-none object-contain object-bottom"
            />
          </div>
          <div className="order-1 flex flex-col justify-center px-6 pt-14 pb-4 md:px-16 md:pt-20 lg:order-2 lg:pb-20">
            <SectionHead
              en="Doctor"
              title={`${t.title}, 누가 상담하고 시술하나요?`}
            />
            <p className="mt-6 text-[15px] leading-[1.85] text-muted md:text-[17px]">
              {hospital.name}
              {josa(hospital.name, "은", "는")} 상담한 원장이 시술까지 직접
              합니다. 대표원장 {doctor.name} 원장이 얼굴과 피부를 먼저 보고,{" "}
              {t.title}
              {josa(t.title, "이", "가")} 꼭 필요한지부터 함께 판단합니다.
            </p>
            <div className="mt-10 border-t border-ink/15 pt-8">
              <p className="text-sm text-gold">{doctor.title}</p>
              <p className="mt-1 flex items-baseline gap-3 text-[26px] font-semibold tracking-[-0.03em]">
                {doctor.name}
                <span className="font-display text-xs font-normal tracking-[0.3em] text-muted uppercase">
                  {mainDoctor.nameEn}
                </span>
              </p>
              <ul className="mt-6 grid gap-2 text-[14px] text-ink/75 sm:grid-cols-2">
                {doctor.credentials.map((c) => (
                  <li key={c} className="flex gap-2">
                    <span
                      aria-hidden
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold"
                    />
                    {c}
                  </li>
                ))}
              </ul>
              <Link
                href="/about/doctor"
                className="mt-8 inline-flex items-center gap-2 text-sm text-ink underline decoration-gold underline-offset-[6px] transition hover:text-gold"
              >
                의료진 소개 보기
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 병원 고르는 기준 */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHead
              en="How to choose"
              title={
                <>
                  {area}에서 {t.title} 병원,
                  <br className="hidden md:block" /> 무엇을 확인할까요?
                </>
              }
            />
            <p className="mt-5 text-[15px] leading-relaxed text-muted">
              시술 전에 확인해 보면 좋은 다섯 가지와, 프라베일이 지키는 방식을
              함께 정리했습니다.
            </p>
          </div>
          <ol className="border-t border-ink/80">
            {chooseCriteria(t.title, g.pain).map((c, i) => (
              <Reveal
                as="li"
                key={c.q}
                delay={i * 80}
                className="grid gap-2 border-b border-line py-7 md:grid-cols-[56px_1fr_1.2fr] md:gap-6 md:py-8"
              >
                <span className="font-display text-sm text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[17px] font-semibold tracking-[-0.02em] md:text-lg">
                  {c.q}
                </h3>
                <p className="text-[15px] leading-relaxed text-muted">
                  <span className="mr-2 text-ink">프라베일은</span>
                  {c.a}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 시술 과정 */}
      <section className="bg-ivory px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1400px]">
          <SectionHead en="Process" title={`${t.title}, 어떻게 진행되나요?`} />
          <ol className="relative mt-14 grid gap-10 md:mt-20 md:grid-cols-4 md:gap-6">
            <span
              aria-hidden
              className="absolute top-7 right-[12.5%] left-[12.5%] hidden h-px bg-gold/40 md:block"
            />
            {treatmentSteps.map((s, i) => (
              <Reveal
                as="li"
                key={s.title}
                delay={i * 120}
                className="relative flex gap-5 md:flex-col md:items-center md:text-center"
              >
                <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full border border-gold bg-white font-display text-lg text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-semibold md:mt-6">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {s.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 효과는 언제 나타나고 얼마나 유지되나요? */}
      <section
        id="result"
        className="scroll-mt-36 px-3 pt-16 md:scroll-mt-44 md:px-6 md:pt-24"
      >
        <div className="relative mx-auto max-w-[1560px] overflow-hidden rounded-[28px] bg-espresso px-6 py-16 text-white md:rounded-[40px] md:px-16 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(50%_70%_at_10%_0%,rgba(168,142,106,0.28),transparent_70%)]" />
          <div className="relative">
            <SectionHead
              en="Result"
              tone="dark"
              title={`${t.title} 효과는 언제 나타나고, 얼마나 유지되나요?`}
            />
            <ol className="mt-14 grid gap-px overflow-hidden rounded-[20px] bg-white/10 md:mt-20 md:grid-cols-4">
              {g.timeline.map((s, i) => (
                <Reveal
                  as="li"
                  key={s.when}
                  delay={i * 120}
                  className="bg-espresso p-7 md:p-8"
                >
                  <span aria-hidden className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-gold ring-4 ring-gold/20" />
                    <span className="h-px flex-1 bg-white/15" />
                  </span>
                  <p className="mt-6 font-display text-[22px] font-light tracking-[-0.01em] text-[#f1e2c6] md:text-[26px]">
                    {s.when}
                  </p>
                  <h3 className="mt-6 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {s.text}
                  </p>
                </Reveal>
              ))}
            </ol>
            <p className="mt-8 text-xs text-white/45">
              ※ 효과가 나타나는 시기와 유지 기간은 피부 상태 · 나이 · 생활
              습관에 따라 사람마다 다릅니다.
            </p>
          </div>
        </div>
      </section>

      {/* 통증 · 회복 · 주의사항 */}
      <section
        id="aftercare"
        className="mx-auto max-w-[1400px] scroll-mt-36 px-5 py-24 md:scroll-mt-44 md:px-10 md:py-36"
      >
        <SectionHead en="Aftercare" title="통증 · 회복 · 주의사항" />
        <div className="mt-12 grid gap-4 md:mt-16 lg:grid-cols-2">
          <div className="grid gap-4">
            {[
              { q: `${t.title}, 아프지 않나요?`, a: g.pain },
              { q: "회복은 얼마나 걸리나요?", a: g.recovery },
            ].map((c, i) => (
              <Reveal
                key={c.q}
                delay={i * 100}
                className="rounded-[24px] bg-ivory p-8 md:p-10"
              >
                <h3 className="text-lg font-semibold tracking-[-0.02em] md:text-xl">
                  {c.q}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-muted">
                  {c.a}
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal
            delay={200}
            className="rounded-[24px] border border-line p-8 md:p-10"
          >
            <h3 className="text-lg font-semibold tracking-[-0.02em] md:text-xl">
              시술 전후 주의사항 · 부작용
            </h3>
            <ul className="mt-4 grid gap-2.5 text-sm leading-relaxed text-muted">
              {[...t.cautions, ...commonCautions].map((c) => (
                <li key={c} className="flex gap-2">
                  <span
                    aria-hidden
                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold"
                  />
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 비용 */}
      <section id="price" className="scroll-mt-36 px-3 md:scroll-mt-44 md:px-6">
        <div className="mx-auto grid max-w-[1560px] gap-10 rounded-[28px] bg-ivory px-6 py-16 md:rounded-[40px] md:px-16 md:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHead en="Price" title={`${t.title} 비용은 얼마인가요?`} />
            <p className="mt-5 text-[15px] leading-relaxed text-muted">
              부위 · 양 · 피부 상태에 따라 달라질 수 있어, 상담 후 정확한 비용을
              안내해 드립니다.
            </p>
          </div>
          {prices.length ? (
            <div className="grid gap-3">
              {prices.map((p) => (
                <div
                  key={p.slug}
                  className="rounded-[20px] bg-white p-6 md:p-8"
                >
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  <dl className="mt-3">
                    {p.prices.map((row) => (
                      <div
                        key={row.label}
                        className="flex items-baseline justify-between gap-4 border-t border-line py-3 first:border-t-0"
                      >
                        <dt className="text-[15px] text-muted">
                          {row.label}
                          {row.note && (
                            <span className="ml-2 text-xs text-gold">
                              {row.note}
                            </span>
                          )}
                        </dt>
                        <dd className="text-[17px] font-semibold tracking-[-0.02em]">
                          {row.price}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center rounded-[20px] bg-white p-8 md:p-10">
              <p className="text-lg font-semibold tracking-[-0.02em] md:text-xl">
                {t.title} 비용은 상담 후 안내해 드립니다.
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                전화 · 카카오톡으로 원하는 부위를 알려 주시면 대략적인 비용을
                먼저 안내해 드릴 수 있습니다.
              </p>
              <div className="mt-8 flex flex-wrap gap-2.5">
                <a
                  href={`tel:${hospital.phone}`}
                  className="flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm transition hover:border-gold"
                >
                  <Phone className="h-4 w-4" strokeWidth={1.6} />
                  {hospital.phone}
                </a>
                <a
                  href={hospital.kakaoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm transition hover:border-gold"
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={1.6} />
                  카카오톡 문의
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 전후사진 (회원 공개) */}
      <section className="mx-auto max-w-[1400px] px-5 pt-16 md:px-10 md:pt-24">
        <Link
          href="/before-after"
          className="group flex flex-col gap-6 rounded-[24px] border border-line p-8 transition hover:border-gold md:flex-row md:items-center md:justify-between md:p-10"
        >
          <div className="flex items-center gap-5">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-ivory text-gold">
              <Lock className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <div>
              <p className="font-display text-[11px] tracking-[0.3em] text-gold uppercase">
                Before &amp; After
              </p>
              <p className="mt-1 text-lg font-semibold tracking-[-0.02em] md:text-xl">
                {t.title} 전후사진은 회원에게만 공개합니다
              </p>
              <p className="mt-1 text-xs text-muted">
                의료법에 따라 로그인 후 볼 수 있습니다. 결과는 개인에 따라 다를
                수 있습니다.
              </p>
            </div>
          </div>
          <span className="flex items-center gap-2 self-start rounded-full bg-espresso px-6 py-3.5 text-sm text-white transition group-hover:bg-mocha md:self-auto">
            전후사진 보기
            <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
          </span>
        </Link>
      </section>

      {/* 자주 묻는 질문 */}
      <section
        id="faq"
        className="mx-auto max-w-[1400px] scroll-mt-36 px-5 py-24 md:scroll-mt-44 md:px-10 md:py-32"
      >
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHead en="FAQ" title={`${t.title} 자주 묻는 질문`} />
          <FaqList items={faq} />
        </div>
      </section>

      <ConsultCta
        id="visit"
        hospital={hospital}
        title={`나에게 맞는 ${t.title},`}
      />
    </>
  );
}
