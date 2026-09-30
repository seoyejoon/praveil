import { CalendarCheck, Check, MessageCircle, Phone, Plus } from "lucide-react";
import BestMark from "@/components/BestMark";
import Reveal from "@/components/Reveal";
import {
  commonCautions,
  treatmentSteps,
  type Treatment,
} from "@/content/treatments";
import type { Hospital } from "@/lib/data";

// 시술 상세 본문 (모든 시술 공통 틀)
// 소개 → 핵심 정보 → 이런 분께 → 특징 3가지 → 세부 시술 → 과정 → 자주 묻는 질문 → 주의사항 → 상담 안내
export default function TreatmentDetail({
  t,
  best,
  hospital,
}: {
  t: Treatment;
  best?: boolean;
  hospital: Hospital;
}) {
  return (
    <>
      {/* 소개 + 핵심 정보 */}
      <section className="mx-auto max-w-[1400px] px-5 pt-20 pb-16 md:px-10 md:pt-28 md:pb-24">
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
            <p className="text-[15px] leading-[1.9] text-muted md:text-[17px]">
              {t.intro}
            </p>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <dl className="mt-14 grid grid-cols-2 border-t border-ink/80 md:mt-20 md:grid-cols-4">
            {t.facts.map((f, i) => (
              <div
                key={f.label}
                className={`border-b border-line py-6 md:py-8 ${i % 2 ? "pl-5 md:pl-8" : "pr-5"} md:border-b-0 ${i > 0 ? "md:border-l md:pl-8" : ""}`}
              >
                <dt className="font-display text-[11px] tracking-[0.25em] text-gold uppercase">
                  {f.label}
                </dt>
                <dd className="mt-2 text-lg font-medium tracking-[-0.02em] md:text-xl">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* 이런 분께 권해요 */}
      <section className="px-3 md:px-6">
        <div className="mx-auto grid max-w-[1560px] overflow-hidden rounded-[28px] bg-ivory md:rounded-[40px] lg:grid-cols-2">
          <div className="relative min-h-[300px] lg:min-h-[560px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={t.photo}
              alt={`${t.title} 시술`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center px-6 py-14 md:px-16 md:py-20">
            <p className="font-display text-xs tracking-[0.35em] text-gold uppercase">
              Recommend
            </p>
            <h2 className="mt-4 text-[26px] font-semibold tracking-[-0.03em] md:text-[36px]">
              이런 분께 권해요
            </h2>
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

      {/* 특징 3가지 */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <p className="font-display text-xs tracking-[0.35em] text-gold uppercase">
          Point
        </p>
        <h2 className="mt-4 text-[26px] font-semibold tracking-[-0.03em] md:text-[36px]">
          프라베일 {t.title}의 특징
        </h2>
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
            <p className="font-display text-xs tracking-[0.35em] text-taupe uppercase">
              Program
            </p>
            <h2 className="mt-4 text-[26px] font-semibold tracking-[-0.03em] md:text-[36px]">
              {t.title} 세부 시술
            </h2>
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
                  <p className="mt-6 text-lg font-semibold md:text-xl">
                    {it.name}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">
                    {it.text}
                  </p>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 시술 과정 */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <p className="font-display text-xs tracking-[0.35em] text-gold uppercase">
          Process
        </p>
        <h2 className="mt-4 text-[26px] font-semibold tracking-[-0.03em] md:text-[36px]">
          시술 과정
        </h2>
        <ol className="relative mt-14 grid gap-10 md:mt-20 md:grid-cols-4 md:gap-6">
          <span
            aria-hidden
            className="absolute top-7 right-[12.5%] left-[12.5%] hidden h-px bg-line md:block"
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
                <p className="text-lg font-semibold md:mt-6">{s.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {s.text}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* 자주 묻는 질문 */}
      <section className="bg-ivory px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="font-display text-xs tracking-[0.35em] text-gold uppercase">
              FAQ
            </p>
            <h2 className="mt-4 text-[26px] font-semibold tracking-[-0.03em] md:text-[36px]">
              자주 묻는 질문
            </h2>
          </div>
          <ul className="border-t border-ink/80">
            {t.faq.map((f) => (
              <li key={f.q} className="border-b border-line">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-base font-medium md:py-7 md:text-lg [&::-webkit-details-marker]:hidden">
                    <span className="flex gap-3">
                      <span className="font-display text-gold">Q.</span>
                      {f.q}
                    </span>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/15 transition duration-300 group-open:rotate-45 group-open:border-gold group-open:bg-gold group-open:text-white">
                      <Plus className="h-4 w-4" strokeWidth={1.5} />
                    </span>
                  </summary>
                  <p className="pr-14 pb-7 pl-7 text-[15px] leading-relaxed text-muted">
                    {f.a}
                  </p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 주의사항 · 부작용 안내 */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-24">
        <div className="rounded-[24px] border border-line p-7 md:p-10">
          <p className="text-base font-semibold md:text-lg">
            시술 전후 주의사항 · 부작용 안내
          </p>
          <ul className="mt-5 grid gap-2 text-sm leading-relaxed text-muted md:grid-cols-2 md:gap-x-10">
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
        </div>
      </section>

      {/* 상담 안내 */}
      <section className="px-3 pb-16 md:px-6 md:pb-24">
        <div className="relative mx-auto max-w-[1560px] overflow-hidden rounded-[28px] bg-espresso px-6 py-16 text-white md:rounded-[40px] md:px-16 md:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_85%_20%,rgba(168,142,106,0.35),transparent_70%)]" />
          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-display text-xs tracking-[0.35em] text-taupe uppercase">
                Consulting
              </p>
              <h2 className="mt-4 text-[26px] leading-snug font-light tracking-[-0.03em] md:text-[40px]">
                나에게 맞는 {t.title},
                <br />
                <span className="font-semibold">
                  대표원장과 먼저 상담하세요.
                </span>
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={`tel:${hospital.phone}`}
                className="flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm text-ink transition hover:bg-ivory"
              >
                <Phone className="h-4 w-4" strokeWidth={1.6} />
                {hospital.phone}
              </a>
              <a
                href={hospital.kakaoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm transition hover:border-white"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.6} />
                카카오톡 상담
              </a>
              <a
                href={hospital.naverReservationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm transition hover:bg-mocha"
              >
                <CalendarCheck className="h-4 w-4" strokeWidth={1.6} />
                네이버 예약
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
