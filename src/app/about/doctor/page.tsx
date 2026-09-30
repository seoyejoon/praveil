import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import AboutPage from "@/components/AboutPage";
import BestMark from "@/components/BestMark";
import Reveal from "@/components/Reveal";
import ConsultCta from "@/components/sub/ConsultCta";
import FaqList from "@/components/sub/FaqList";
import JsonLd from "@/components/sub/JsonLd";
import SectionHead from "@/components/sub/SectionHead";
import { doctorProfile } from "@/content/about";
import { mainBest } from "@/content/main";
import { areaOf } from "@/content/treatment-guide";
import { getDoctor, getHospital } from "@/lib/data";
import { SITE_URL } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const [h, d] = await Promise.all([getHospital(), getDoctor()]);
  return {
    title: "의료진소개",
    description: `${h.name} ${d.title} ${d.name}. 상담부터 시술, 경과 확인까지 대표원장이 직접 진행합니다.`,
    alternates: { canonical: "/about/doctor" },
  };
}

// 의료진소개: 인사말 → 약력 → 진료 방식 4단계 → 대표 시술 → 자주 묻는 질문 → 상담
export default async function DoctorPage() {
  const [hospital, doctor] = await Promise.all([getHospital(), getDoctor()]);
  const area = areaOf(hospital.address);
  const p = doctorProfile;
  const history = [
    { label: "학력", items: p.education },
    { label: "경력", items: p.career },
    { label: "학회 · 활동", items: doctor.credentials },
  ].filter((h) => h.items.length > 0);

  const faq = [
    {
      q: "대표원장님이 직접 시술하나요?",
      a: `네. ${hospital.name}에서는 ${doctor.title} ${doctor.name} 원장이 상담부터 시술, 경과 확인까지 직접 진행합니다.`,
    },
    {
      q: "상담한 의사와 시술하는 의사가 다를 수 있나요?",
      a: "아니요. 상담한 원장이 그대로 시술합니다. 얼굴과 피부를 직접 본 사람이 시술해야 설계한 대로 정확하게 진행할 수 있기 때문입니다.",
    },
    {
      q: "상담만 받아 봐도 되나요?",
      a: "네. 상담 후 바로 시술하지 않으셔도 괜찮습니다. 지금 필요한 것과 나중에 해도 되는 것을 나누어 안내해 드립니다.",
    },
    {
      q: "원장님 진료는 언제 받을 수 있나요?",
      a: `${hospital.hours.map((h) => `${h.label} ${h.time}${h.note ? `(${h.note})` : ""}`).join(", ")}에 진료합니다. 예약하시면 기다리지 않고 상담받으실 수 있습니다.`,
    },
  ];

  const url = `${SITE_URL}/about/doctor`;

  return (
    <AboutPage page="doctor" current="/about/doctor">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "ProfilePage",
              "@id": `${url}#webpage`,
              url,
              name: `의료진소개 | ${hospital.name}`,
              inLanguage: "ko-KR",
              mainEntity: { "@id": `${url}#physician` },
            },
            {
              "@type": "Physician",
              "@id": `${url}#physician`,
              name: doctor.name,
              alternateName: p.nameEn,
              jobTitle: doctor.title,
              image: `${SITE_URL}${p.photo}`,
              description: p.greeting.join(" "),
              worksFor: { "@id": `${SITE_URL}/#clinic` },
              address: {
                "@type": "PostalAddress",
                addressLocality: hospital.address.split(" ")[1],
                addressRegion: hospital.address.split(" ")[0],
                addressCountry: "KR",
              },
              ...(doctor.credentials.length && {
                memberOf: doctor.credentials.map((c) => ({
                  "@type": "Organization",
                  name: c,
                })),
              }),
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

      {/* 인사말 */}
      <section className="mx-auto max-w-[1400px] px-5 pt-20 pb-24 md:px-10 md:pt-28 md:pb-36">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <Reveal variant="clip" className="relative">
            <div className="overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,#f6f2ec,#ece5da)] md:rounded-[40px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.photo}
                alt={`${doctor.title} ${doctor.name}`}
                className="aspect-[4/5] w-full object-cover object-top"
              />
            </div>
            <p className="absolute right-6 bottom-6 rounded-full bg-white/90 px-4 py-2 text-xs text-ink backdrop-blur">
              {area} · {hospital.name}
            </p>
          </Reveal>
          <div className="flex flex-col justify-center">
            <p className="font-display text-xs tracking-[0.35em] text-gold uppercase">
              Greeting
            </p>
            <Reveal
              variant="line"
              className="mt-6 text-[28px] leading-[1.4] font-light tracking-[-0.03em] md:text-[42px]"
            >
              {p.quote.map((q) => (
                <span key={q}>
                  <span>{q}</span>
                </span>
              ))}
            </Reveal>
            <Reveal delay={150} className="mt-10 space-y-5">
              {p.greeting.map((g) => (
                <p
                  key={g}
                  className="text-[15px] leading-[1.9] text-muted md:text-[17px]"
                >
                  {g}
                </p>
              ))}
            </Reveal>
            <div className="mt-12 flex items-end gap-4 border-t border-ink/15 pt-8">
              <div>
                <p className="text-sm text-gold">{doctor.title}</p>
                <p className="mt-1 text-[30px] font-semibold tracking-[-0.03em]">
                  {doctor.name}
                </p>
              </div>
              <p className="pb-2 font-display text-xs tracking-[0.3em] text-muted uppercase">
                {p.nameEn}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 약력 */}
      {history.length > 0 && (
        <section className="px-3 md:px-6">
          <div className="mx-auto max-w-[1560px] rounded-[28px] bg-ivory px-6 py-16 md:rounded-[40px] md:px-16 md:py-20">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <SectionHead
                en="Profile"
                title={`${doctor.title} ${doctor.name} 약력`}
              />
              <div className="grid gap-10">
                {history.map((h) => (
                  <div key={h.label}>
                    <h3 className="border-b border-ink/80 pb-4 text-lg font-semibold">
                      {h.label}
                    </h3>
                    <ul>
                      {h.items.map((it, i) => (
                        <Reveal
                          as="li"
                          key={it}
                          delay={i * 60}
                          className="flex gap-4 border-b border-line py-4 text-[15px] md:text-base"
                        >
                          <span className="font-display text-sm text-gold">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {it}
                        </Reveal>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 진료 방식 */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <SectionHead
          en="How I Care"
          title="상담부터 경과까지, 한 사람이 끝까지"
        />
        <ol className="mt-12 grid gap-px overflow-hidden rounded-[24px] border border-line bg-line md:mt-16 md:grid-cols-4">
          {p.steps.map((s, i) => (
            <Reveal
              as="li"
              key={s.title}
              delay={i * 120}
              className="group bg-white p-8 transition-colors duration-500 hover:bg-ivory md:p-10"
            >
              <span className="font-display text-[44px] leading-none font-extralight text-gold/60 transition-colors duration-500 group-hover:text-gold md:text-[56px]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-8 text-xl font-semibold tracking-[-0.02em] md:text-2xl">
                {s.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                {s.text}
              </p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* 대표 시술 */}
      <section className="bg-espresso px-5 py-24 text-white md:px-10 md:py-32">
        <div className="mx-auto max-w-[1400px]">
          <SectionHead
            en="Signature"
            tone="dark"
            title="대표원장이 직접 설계하는 대표 시술"
          />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
            {mainBest.items.map((it, i) => (
              <Reveal as="li" key={it.href + it.name} delay={i * 100}>
                <Link href={it.href} className="group block">
                  <div className="overflow-hidden rounded-[20px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={it.image}
                      alt={it.name}
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover transition-[scale] duration-[1.2s] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-5 flex items-center gap-2 text-xs text-taupe">
                    <BestMark />
                    {it.category}
                  </p>
                  <p className="mt-2 flex items-center gap-1 text-xl font-semibold transition group-hover:text-taupe">
                    {it.name}
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">
                    {it.text}
                  </p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 자주 묻는 질문 */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHead en="FAQ" title="의료진에 대해 자주 묻는 질문" />
          <FaqList items={faq} />
        </div>
      </section>

      <ConsultCta
        hospital={hospital}
        title={`${doctor.name} 원장에게`}
        strong="직접 상담받아 보세요."
      />
    </AboutPage>
  );
}
