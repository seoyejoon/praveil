import type { Metadata } from "next";
import ContactCta from "@/components/ContactCta";
import DoctorProfile from "@/components/DoctorProfile";
import FeatureList from "@/components/FeatureList";
import ImageSlot from "@/components/ImageSlot";
import Philosophy from "@/components/Philosophy";
import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";
import SubPage from "@/components/SubPage";
import ScrollStatement from "@/components/home/ScrollStatement";
import { images } from "@/content/home";
import { aboutPage } from "@/content/pages";
import { getDoctor, getFeatures, getHospital } from "@/lib/data";

export const metadata: Metadata = { title: "병원소개" };

const wide = "mx-auto w-full max-w-[1440px] px-5 md:px-10";

export default async function AboutPage() {
  const [hospital, doctor, features] = await Promise.all([getHospital(), getDoctor(), getFeatures()]);
  const { hero } = aboutPage;

  return (
    <SubPage en={hero.en} title={hero.title} description={hero.description} image={hero.image} crumbs={[{ label: "병원소개" }]}>
      <section id="standard" className="scroll-mt-16 md:scroll-mt-20 py-28 md:py-44">
        <ScrollStatement en="Our Standard" text={aboutPage.statement} />
      </section>

      <Philosophy />

      <section id="doctor" className="scroll-mt-16 md:scroll-mt-20">
        <DoctorProfile doctor={doctor} />
      </section>

      <section id="why" className="scroll-mt-16 md:scroll-mt-20 bg-ivory py-28 md:py-40">
        <div className={wide}>
          <SectionTitle en="Why Praveil" title="프라베일이 다른 이유" />
          <FeatureList features={features} />
        </div>
      </section>

      {/* 병원 둘러보기: 크기가 다른 사진을 엇갈려 배치 */}
      <section id="tour" className="scroll-mt-16 md:scroll-mt-20 py-28 md:py-40">
        <div className={wide}>
          <SectionTitle en="Clinic Tour" title="병원 둘러보기" description="상담부터 회복까지, 편안하게 머무를 수 있도록 준비했습니다." />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-6">
            {[
              "col-span-2 md:col-span-7 aspect-[16/10]",
              "md:col-span-5 aspect-[4/5] md:aspect-auto",
              "md:col-span-4 aspect-[4/5]",
              "md:col-span-4 aspect-[4/5] md:mt-16",
              "col-span-2 md:col-span-4 aspect-[16/10] md:aspect-[4/5]",
              "col-span-2 md:col-span-12 aspect-[16/7]",
            ].map((cls, i) => (
              <Reveal key={i} delay={(i % 3) * 120} className={`group overflow-hidden ${cls}`}>
                <ImageSlot
                  src={images.clinic[i]}
                  label="Clinic"
                  className="h-full w-full transition duration-1000 group-hover:scale-105"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 보유 장비 */}
      <section id="equipment" className="scroll-mt-16 md:scroll-mt-20 bg-espresso py-28 text-cream md:py-40">
        <div className={wide}>
          <Reveal variant="zoom" className="mb-12 text-center md:mb-20">
            <p className="font-display text-base tracking-[0.15em] text-[#ffd899] md:text-lg">Equipment</p>
            <h2 className="mt-4 font-serif text-[28px] font-medium tracking-tight md:text-[44px]">보유 장비</h2>
            <p className="mt-5 text-[15px] text-cream/60 md:text-lg">시술 목적에 맞는 장비로 정확하게 진행합니다.</p>
          </Reveal>
          <ul className="grid grid-cols-2 gap-px border-y border-cream/15 bg-cream/15 md:grid-cols-4">
            {aboutPage.equipment.map((e, i) => (
              <Reveal
                as="li"
                key={e.name}
                delay={(i % 4) * 100}
                className="group bg-espresso p-5 md:p-8"
              >
                <div className="overflow-hidden">
                  <ImageSlot
                    src={images.why[i % images.why.length]}
                    tone="dark"
                    className="aspect-square opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                  />
                </div>
                <p className="mt-5 font-display text-xs tracking-[0.2em] text-[#ffd899]">{e.en.toUpperCase()}</p>
                <p className="mt-1 font-serif text-lg font-medium md:text-xl">{e.name}</p>
                <p className="mt-1 text-sm text-cream/50">{e.type}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <ContactCta hospital={hospital} />
    </SubPage>
  );
}
