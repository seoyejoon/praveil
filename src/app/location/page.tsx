import type { Metadata } from "next";
import { Bus, Car, Building2 } from "lucide-react";
import { mapApps } from "@/components/MapLinks";
import Reveal from "@/components/Reveal";
import SubPage from "@/components/SubPage";
import { locationPage } from "@/content/pages";
import { sitemap } from "@/content/sitemap";
import { getHospital } from "@/lib/data";

export const metadata: Metadata = { title: "오시는 길" };

const icons = [Building2, Bus, Car];

// 오시는 길: 큰 주소 + 지도 앱 바로가기 → 찾아오는 방법 (지도 · 진료시간 · 전화는 바로 아래 푸터에)
export default async function LocationPage() {
  const hospital = await getHospital();
  const { hero } = locationPage;
  const about = sitemap.find((s) => s.key === "praveil")!;

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
    </SubPage>
  );
}
