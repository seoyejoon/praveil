import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import AboutPage from "@/components/AboutPage";
import Reveal from "@/components/Reveal";
import ConsultCta from "@/components/sub/ConsultCta";
import FaqList from "@/components/sub/FaqList";
import JsonLd from "@/components/sub/JsonLd";
import SectionHead from "@/components/sub/SectionHead";
import {
  aboutEquipment,
  aboutIntro,
  aboutPhilosophy,
  aboutPromise,
  aboutSpace,
} from "@/content/about";
import { mainCategoryImage } from "@/content/main";
import { sitemap } from "@/content/sitemap";
import { areaOf, josa } from "@/content/treatment-guide";
import { getDoctor, getHospital } from "@/lib/data";
import { SITE_URL } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const h = await getHospital();
  return {
    title: "병원소개",
    description: `${h.name}은 ${areaOf(h.address)}에 있는 피부 · 미용 의원입니다. ${aboutIntro.body.split(".")[0]}.`,
    alternates: { canonical: "/about/philosophy" },
  };
}

// 병원소개: 한눈에 보기 → 진료 철학 → 다섯 가지 약속 → 공간 → 장비 → 진료 분야 → 자주 묻는 질문 → 상담
export default async function AboutIntroPage() {
  const [hospital, doctor] = await Promise.all([getHospital(), getDoctor()]);
  const area = areaOf(hospital.address);
  const fields = sitemap.filter((s) => s.treatment);
  const night = hospital.hours.find((h) => h.note);
  const parking = hospital.directions.find((d) => d.title.includes("주차"));
  const answer = `${hospital.name}${josa(hospital.name, "은", "는")} ${area}에 있는 피부 · 미용 의원입니다. ${aboutIntro.body}`;

  const facts = [
    { label: "대표원장", value: `${doctor.name} 원장` },
    { label: "위치", value: `${area} ${hospital.addressDetail.split(" ")[0]}` },
    {
      label: "진료 분야",
      value: fields.map((f) => f.label.replaceAll("·", " · ")).join(", "),
    },
    {
      label: "진료시간",
      value: night
        ? `${night.label} ${night.time.split("–").pop()?.trim()}까지 ${night.note}`
        : hospital.hours[0]?.time,
    },
    { label: "진료 방식", value: "대표원장 1:1 상담 · 직접 시술" },
    { label: "예약", value: "전화 · 카카오톡 · 네이버 예약" },
  ];

  const faq = [
    {
      q: `${hospital.name}${josa(hospital.name, "은", "는")} 어디에 있나요?`,
      a: `${hospital.address} ${hospital.addressDetail}에 있습니다.${hospital.directions[0] ? ` ${hospital.directions[0].body}.` : ""}`,
    },
    {
      q: "진료시간은 어떻게 되나요? 야간진료도 하나요?",
      a: `${hospital.hours.map((h) => `${h.label} ${h.time}${h.note ? `(${h.note})` : ""}`).join(", ")}입니다. 점심시간은 ${hospital.lunch}입니다.${hospital.hoursNotice ? ` ${hospital.hoursNotice}` : ""}`,
    },
    ...(parking ? [{ q: "주차할 수 있나요?", a: `${parking.body}.` }] : []),
    {
      q: "상담과 시술은 누가 하나요?",
      a: `대표원장 ${doctor.name} 원장이 상담부터 시술, 경과 확인까지 직접 진행합니다.`,
    },
    {
      q: "예약하고 가야 하나요?",
      a: "예약하시면 기다리는 시간 없이 상담받으실 수 있습니다. 전화 · 카카오톡 · 네이버 예약으로 편하게 예약해 주세요.",
    },
    {
      q: "상담만 받아도 되나요?",
      a: "네. 상담 후 바로 시술하지 않으셔도 괜찮습니다. 피부 상태와 필요한 방법을 충분히 설명해 드립니다.",
    },
    {
      q: "어떤 시술을 하나요?",
      a: `${fields.map((f) => `${f.label}(${f.pages.map((p) => p.label).join(" · ")})`).join(", ")}를 진료합니다.`,
    },
  ];

  const url = `${SITE_URL}/about/philosophy`;

  return (
    <AboutPage page="intro" current="/about/philosophy">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "AboutPage",
              "@id": `${url}#webpage`,
              url,
              name: `병원소개 | ${hospital.name}`,
              description: answer,
              inLanguage: "ko-KR",
              about: { "@id": `${SITE_URL}/#clinic` },
              mainEntity: { "@id": `${url}#faq` },
            },
            {
              "@type": "FAQPage",
              "@id": `${url}#faq`,
              mainEntity: faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ],
        }}
      />

      {/* 한눈에 보기 */}
      <section className="mx-auto max-w-[1400px] px-5 pt-20 pb-24 md:px-10 md:pt-28 md:pb-36">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <Reveal
            variant="line"
            className="text-[30px] leading-[1.35] font-light tracking-[-0.03em] md:text-[48px]"
          >
            {aboutIntro.headline.map((h) => (
              <span key={h}>
                <span>{h}</span>
              </span>
            ))}
          </Reveal>
          <Reveal delay={150} className="lg:pt-3">
            <p className="font-display text-xs tracking-[0.35em] text-gold uppercase">
              About · 한눈에 보기
            </p>
            <p className="mt-5 text-[16px] leading-[1.85] text-ink md:text-[18px]">
              {answer}
            </p>
          </Reveal>
        </div>
        <Reveal delay={200}>
          <dl className="mt-14 grid grid-cols-2 border-t border-ink/80 md:mt-20 lg:grid-cols-3">
            {facts.map((f) => (
              <div
                key={f.label}
                className="border-b border-line py-6 pr-4 md:py-8"
              >
                <dt className="text-[13px] text-gold">{f.label}</dt>
                <dd className="mt-2 text-[15px] leading-snug font-medium tracking-[-0.02em] md:text-lg">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* 진료 철학 */}
      <section className="relative overflow-hidden bg-espresso px-5 py-24 text-white md:px-10 md:py-36">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/photos/hero-lobby.webp"
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(29,26,23,0.6),rgba(29,26,23,0.95))]" />
        <div className="relative mx-auto max-w-[1400px]">
          <SectionHead
            en={aboutPhilosophy.en}
            tone="dark"
            title={aboutPhilosophy.title}
          />
          <ol className="mt-14 grid gap-px overflow-hidden rounded-[24px] bg-white/10 md:mt-20 md:grid-cols-3">
            {aboutPhilosophy.items.map((it, i) => (
              <Reveal
                as="li"
                key={it.title}
                delay={i * 120}
                className="bg-espresso/90 p-8 backdrop-blur md:p-10"
              >
                <p className="flex items-baseline justify-between">
                  <span className="font-display text-[44px] leading-none font-extralight text-[#f1e2c6] md:text-[56px]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-xs tracking-[0.3em] text-taupe uppercase">
                    {it.en}
                  </span>
                </p>
                <h3 className="mt-10 text-xl font-semibold tracking-[-0.02em] md:text-2xl">
                  {it.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-white/60">
                  {it.text}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 다섯 가지 약속 */}
      <section
        id="promise"
        className="mx-auto max-w-[1400px] scroll-mt-36 px-5 py-24 md:scroll-mt-44 md:px-10 md:py-36"
      >
        <SectionHead en={aboutPromise.en} title={aboutPromise.title} />
        <ul className="mt-12 grid gap-3 md:mt-16 md:grid-cols-2 md:gap-4 lg:grid-cols-6">
          {aboutPromise.items.map((it, i) => (
            <Reveal
              as="li"
              key={it.title}
              delay={(i % 3) * 100}
              className={`group relative overflow-hidden rounded-[24px] bg-ivory ${i < 2 ? "lg:col-span-3" : "lg:col-span-2"}`}
            >
              <div
                className={`overflow-hidden ${i < 2 ? "aspect-[16/9]" : "aspect-[4/3]"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={it.image}
                  alt={it.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-[scale] duration-[1.2s] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-105"
                />
              </div>
              <div className="p-7 md:p-8">
                <span className="font-display text-sm text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em]">
                  {it.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">
                  {it.text}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* 공간 */}
      <section
        id="space"
        className="scroll-mt-36 bg-ivory px-5 py-24 md:scroll-mt-44 md:px-10 md:py-36"
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
            <SectionHead en={aboutSpace.en} title={aboutSpace.title} />
            <p className="text-[15px] leading-relaxed text-muted lg:text-right">
              {aboutSpace.text}
            </p>
          </div>
          <ul className="mt-12 grid grid-cols-2 gap-3 md:mt-16 md:grid-cols-12 md:gap-4">
            {aboutSpace.items.map((it, i) => (
              <Reveal
                as="li"
                key={it.name}
                delay={(i % 3) * 100}
                className={`group relative overflow-hidden rounded-[20px] ${
                  [
                    "col-span-2 md:col-span-7",
                    "md:col-span-5",
                    "md:col-span-4",
                    "md:col-span-4",
                    "md:col-span-4",
                    "col-span-2 md:col-span-12",
                  ][i]
                }`}
              >
                <div
                  className={
                    i === 5
                      ? "aspect-[16/9] md:aspect-[21/8]"
                      : i === 0
                        ? "aspect-[4/3] md:aspect-auto md:h-full md:min-h-[360px]"
                        : "aspect-square md:aspect-auto md:h-full md:min-h-[360px]"
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.image}
                    alt={`${hospital.name} ${it.name}`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-[scale] duration-[1.2s] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(24,19,15,0.6))] p-5 text-white md:p-7">
                  <p className="text-base font-semibold md:text-lg">
                    {it.name}
                  </p>
                  <p className="mt-0.5 text-xs text-white/75 md:text-sm">
                    {it.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 장비 */}
      <section
        id="equipment"
        className="mx-auto max-w-[1400px] scroll-mt-36 px-5 py-24 md:scroll-mt-44 md:px-10 md:py-36"
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <SectionHead en={aboutEquipment.en} title={aboutEquipment.title} />
          <p className="text-[15px] leading-relaxed text-muted lg:text-right">
            {aboutEquipment.text}
          </p>
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-x-3 gap-y-10 md:mt-16 md:grid-cols-3 md:gap-x-5">
          {aboutEquipment.items.map((it, i) => (
            <Reveal as="li" key={it.name} delay={(i % 4) * 80}>
              <Link href={it.href} className="group block">
                <div className="overflow-hidden rounded-[20px] bg-ivory">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.image}
                    alt={`${it.name} 장비`}
                    loading="lazy"
                    className="aspect-square w-full object-cover transition-[scale] duration-[1.2s] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-105"
                  />
                </div>
                <p className="mt-4 font-display text-[11px] tracking-[0.25em] text-gold uppercase">
                  {it.en}
                </p>
                <p className="mt-1 flex items-center gap-1 text-lg font-semibold tracking-[-0.02em] transition group-hover:text-gold">
                  {it.name}
                  <ArrowUpRight
                    className="h-4 w-4 text-muted transition group-hover:text-gold"
                    strokeWidth={1.6}
                  />
                </p>
                <p className="mt-0.5 text-sm text-muted">{it.type}</p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* 진료 분야 */}
      <section className="px-3 md:px-6">
        <div className="mx-auto max-w-[1560px] rounded-[28px] bg-espresso px-6 py-16 text-white md:rounded-[40px] md:px-16 md:py-20">
          <SectionHead en="Treatments" tone="dark" title="진료 분야" />
          <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {fields.map((f, i) => (
              <Reveal as="li" key={f.key} delay={i * 80}>
                <Link
                  href={f.href}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-[20px]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mainCategoryImage[f.key]}
                    alt={f.label}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-[scale] duration-[1.2s] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,19,15,0.1),rgba(24,19,15,0.75))]" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="font-display text-[11px] tracking-[0.25em] text-taupe uppercase">
                      {f.en}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xl font-semibold">
                      {f.label}
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-white/70">
                      {f.pages.map((p) => p.label).join(" · ")}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 자주 묻는 질문 */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHead en="FAQ" title="처음 오시는 분들이 자주 묻는 질문" />
          <FaqList items={faq} />
        </div>
      </section>

      <ConsultCta hospital={hospital} title="어떤 시술이 맞을지 고민된다면," />
    </AboutPage>
  );
}
