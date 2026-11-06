import type { Metadata } from "next";
import { Bus, Car, Building2, Phone } from "lucide-react";
import { mapApps } from "@/components/MapLinks";
import Reveal from "@/components/Reveal";
import SubPage from "@/components/SubPage";
import { locationPage } from "@/content/pages";
import { sitemap } from "@/content/sitemap";
import { getHospital } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const h = await getHospital();
  return {
    title: "진료안내 · 오시는 길",
    description: `${h.address} ${h.addressDetail}. ${h.name} 진료시간 · 오시는 길 · 주차 안내.`,
    alternates: { canonical: "/location" },
  };
}

const icons = [Building2, Bus, Car];

// 진료안내 · 오시는 길: 주소 · 지도 앱 바로가기 · 구글 지도 + 진료시간 · 전화 → 찾아오는 방법
export default async function LocationPage() {
  const hospital = await getHospital();
  const { hero } = locationPage;
  const about = sitemap.find((s) => s.key === "praveil")!;
  const mapQuery = encodeURIComponent(hospital.address);

  return (
    <SubPage
      en={hero.en}
      title={hero.title}
      description={hero.description}
      image={hero.image}
      mobileImage={hero.mobileImage}
      heroTone="interior"
      // 병원소개 · 의료진소개와 같은 모양 (상단 경로 없이 아래 탭으로 이동)
      tabs={about.pages}
      current="/location"
      boldTitle
    >
      <section className="mx-auto grid max-w-[1400px] gap-12 px-5 pt-20 pb-16 md:px-10 md:pt-28 md:pb-24 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        {/* 주소 · 지도 앱 바로가기 · 구글 지도 (오른쪽 진료시간 칸과 높이를 맞춤) */}
        <div className="flex flex-col">
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
          <Reveal
            delay={250}
            className="mt-8 flex min-h-[300px] flex-1 overflow-hidden rounded-[24px] border border-line md:min-h-[340px] md:rounded-[28px]"
          >
            <iframe
              title={`${hospital.name} 위치 (구글 지도)`}
              src={`https://www.google.com/maps?q=${mapQuery}&hl=ko&z=17&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-full min-h-[300px] w-full flex-1 md:min-h-[340px]"
            />
          </Reveal>
        </div>

        {/* 진료시간 · 전화 */}
        <Reveal
          delay={200}
          className="rounded-[24px] bg-ivory p-7 md:rounded-[32px] md:p-10"
        >
          <p className="font-display text-xs tracking-[0.35em] text-gold uppercase">
            Hours
          </p>
          <h2 className="mt-3 text-[22px] font-semibold tracking-[-0.03em] md:text-[26px]">
            진료시간
          </h2>
          <dl className="mt-6 border-t border-ink/80">
            {hospital.hours.map((h) => (
              <div
                key={h.label}
                className="flex items-baseline justify-between gap-4 border-b border-line py-3.5"
              >
                <dt className="text-[15px] text-muted">{h.label}</dt>
                <dd
                  className={`text-right text-[15px] font-medium tracking-[-0.01em] md:text-base ${h.closed ? "text-muted" : ""}`}
                >
                  {h.time}
                  {h.note && (
                    <span className="ml-2 text-xs text-gold">{h.note}</span>
                  )}
                </dd>
              </div>
            ))}
            {hospital.lunch && (
              <div className="flex items-baseline justify-between gap-4 border-b border-line py-3.5">
                <dt className="text-[15px] text-muted">점심시간</dt>
                <dd className="text-right text-[15px] font-medium md:text-base">
                  {hospital.lunch}
                </dd>
              </div>
            )}
          </dl>
          {hospital.hoursNotice && (
            <p className="mt-4 text-[13px] text-muted">
              {hospital.hoursNotice}
            </p>
          )}
          <a
            href={`tel:${hospital.phone.replace(/[^0-9+]/g, "")}`}
            className="mt-7 flex items-center justify-between rounded-full bg-ink px-6 py-4 text-white transition hover:bg-espresso"
          >
            <span className="flex items-center gap-2.5 text-sm">
              <Phone className="h-4 w-4" strokeWidth={1.6} />
              전화 문의
            </span>
            <span className="text-[17px] font-semibold tracking-[-0.01em]">
              {hospital.phone}
            </span>
          </a>
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
        </div>
      </section>
    </SubPage>
  );
}
