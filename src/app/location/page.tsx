import type { Metadata } from "next";
import ContactCta from "@/components/ContactCta";
import LocationInfo from "@/components/LocationInfo";
import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";
import SubPage from "@/components/SubPage";
import { locationPage } from "@/content/pages";
import { getHospital } from "@/lib/data";

export const metadata: Metadata = { title: "오시는 길" };

export default async function LocationPage() {
  const hospital = await getHospital();
  const { hero } = locationPage;

  return (
    <SubPage en={hero.en} title={hero.title} description={hero.description} image={hero.image} crumbs={[{ label: "오시는 길" }]}>
      <section id="hours" className="mx-auto max-w-[1440px] scroll-mt-16 md:scroll-mt-20 px-5 py-20 md:px-10 md:py-28">
        <SectionTitle en="Hours & Location" title="진료시간 · 오시는 길" />
        <Reveal>
          <LocationInfo hospital={hospital} />
        </Reveal>
      </section>

      <section id="directions" className="scroll-mt-16 md:scroll-mt-20 bg-ivory py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <SectionTitle en="Directions" title="찾아오시는 방법" />
          <ul className="grid gap-px border-y border-ink/15 bg-ink/15 md:grid-cols-3">
            {hospital.directions.map((d, i) => (
              <Reveal as="li" key={d.title} delay={i * 120} className="bg-ivory p-8 md:p-12">
                <p className="font-display text-sm tracking-[0.15em] text-gold">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-4 font-serif text-xl font-medium md:text-2xl">{d.title}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{d.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <ContactCta hospital={hospital} />
    </SubPage>
  );
}
