import type { Metadata } from "next";
import { Bus, Car, Building2 } from "lucide-react";
import { mapApps } from "@/components/MapLinks";
import Reveal from "@/components/Reveal";
import SubPage from "@/components/SubPage";
import FaqList from "@/components/sub/FaqList";
import JsonLd from "@/components/sub/JsonLd";
import SectionHead from "@/components/sub/SectionHead";
import { areaOf } from "@/content/treatment-guide";
import { SITE_URL } from "@/lib/site-url";
import { locationPage } from "@/content/pages";
import { sitemap } from "@/content/sitemap";
import { getHospital } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const h = await getHospital();
  return {
    title: "오시는 길",
    description: `${h.address} ${h.addressDetail}. ${h.name} 오시는 길 · 주차 · 진료시간 안내.`,
  };
}

const icons = [Building2, Bus, Car];

// 오시는 길: 큰 주소 + 지도 앱 바로가기 → 찾아오는 방법 (지도 · 진료시간 · 전화는 바로 아래 푸터에)
export default async function LocationPage() {
  const hospital = await getHospital();
  const { hero } = locationPage;
  const about = sitemap.find((s) => s.key === "praveil")!;
  const area = areaOf(hospital.address);
  const find = (word: string) =>
    hospital.directions.find((d) => d.title.includes(word))?.body;
  const hours = hospital.hours
    .map((h) => `${h.label} ${h.time}${h.note ? `(${h.note})` : ""}`)
    .join(", ");
  const night = hospital.hours.find((h) => h.note);
  // 확정 전 문구("확정 전")는 질문에서 뺌
  const ok = (v?: string) => v && !v.includes("확정 전");
  const faq = [
    {
      q: `${hospital.name}은 어디에 있나요?`,
      a: `${hospital.address} ${hospital.addressDetail}에 있습니다.${ok(find("건물")) ? ` ${find("건물")}.` : ""}`,
    },
    ...(ok(find("지하철"))
      ? [{ q: "지하철로 어떻게 가나요?", a: `${find("지하철")}.` }]
      : []),
    ...(ok(find("버스"))
      ? [{ q: "버스로 어떻게 가나요?", a: `${find("버스")}.` }]
      : []),
    ...(ok(find("주차"))
      ? [{ q: "주차할 수 있나요?", a: `${find("주차")}.` }]
      : []),
    {
      q: "진료시간은 어떻게 되나요?",
      a: `${hours}입니다. 점심시간은 ${hospital.lunch}입니다.${hospital.hoursNotice ? ` ${hospital.hoursNotice}` : ""}`,
    },
    ...(night
      ? [
          {
            q: "퇴근 후에도 진료받을 수 있나요?",
            a: `네. ${night.label}은 ${night.time.split("–").pop()?.trim()}까지 ${night.note}을 합니다.`,
          },
        ]
      : []),
    {
      q: "예약은 어떻게 하나요?",
      a: `전화(${hospital.phone}) · 카카오톡 · 네이버 예약으로 하실 수 있습니다. 예약하시면 기다리지 않고 상담받으실 수 있습니다.`,
    },
  ];

  return (
    <SubPage
      en={hero.en}
      title={hero.title}
      description={hero.description}
      image={hero.image}
      crumbs={[
        { label: about.label, href: about.href },
        { label: "오시는 길" },
      ]}
      tabs={about.pages}
      current="/location"
    >
      <section className="mx-auto max-w-[1400px] px-5 pt-20 pb-16 md:px-10 md:pt-28 md:pb-24">
        <p className="font-display text-xs tracking-[0.35em] text-gold uppercase">
          Address
        </p>
        <Reveal
          variant="line"
          className="mt-5 text-[28px] leading-[1.35] font-light tracking-[-0.03em] md:text-[48px]"
        >
          <span>
            <span>{hospital.address}</span>
          </span>
          <span>
            <span className="font-semibold">{hospital.addressDetail}</span>
          </span>
        </Reveal>
        <Reveal delay={150}>
          <ul className="mt-10 flex flex-wrap gap-2.5">
            {mapApps(hospital.mapLinks, hospital.address, hospital.name).map(
              (m) => (
                <li key={m.key}>
                  <a
                    href={m.href}
                    target={m.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm transition hover:border-gold hover:bg-ivory"
                  >
                    {m.icon}
                    {m.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </Reveal>
      </section>

      <section className="px-3 pb-20 md:px-6 md:pb-28">
        <div className="mx-auto max-w-[1560px] rounded-[28px] bg-ivory px-5 py-16 md:rounded-[40px] md:px-16 md:py-20">
          <p className="font-display text-xs tracking-[0.35em] text-gold uppercase">
            Directions
          </p>
          <h2 className="mt-4 text-[26px] font-semibold tracking-[-0.03em] md:text-[36px]">
            찾아오시는 방법
          </h2>
          <ul className="mt-12 grid gap-3 md:grid-cols-3 md:gap-5">
            {hospital.directions.map((d, i) => {
              const Icon = icons[i % icons.length];
              return (
                <Reveal
                  as="li"
                  key={d.title}
                  delay={i * 120}
                  className="rounded-[24px] bg-white p-8 md:p-10"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-gold/15 text-mocha">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <p className="mt-8 text-xl font-semibold md:text-2xl">
                    {d.title}
                  </p>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">
                    {d.body}
                  </p>
                </Reveal>
              );
            })}
          </ul>
          <p className="mt-10 text-sm text-muted">
            지도 · 진료시간 · 전화번호는 아래에서 확인하실 수 있습니다.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10 md:pb-32">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHead
            en="FAQ"
            title={`${area} ${hospital.name}, 오시기 전에 궁금한 점`}
          />
          <FaqList items={faq} />
        </div>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          url: `${SITE_URL}/location`,
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </SubPage>
  );
}
