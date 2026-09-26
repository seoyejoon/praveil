import type { Metadata } from "next";
import AboutPage from "@/components/AboutPage";
import ImageSlot from "@/components/ImageSlot";
import Reveal from "@/components/Reveal";
import { images } from "@/content/home";
import { aboutPage } from "@/content/pages";

export const metadata: Metadata = { title: "보유 장비" };

export default function EquipmentPage() {
  return (
    <AboutPage slug="equipment">
      <section className="bg-espresso py-28 text-cream md:py-40">
        <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
          <Reveal variant="zoom" className="mb-12 text-center md:mb-20">
            <p className="font-display text-base tracking-[0.15em] text-[#ffd899] md:text-lg">Equipment</p>
            <h2 className="mt-4 font-serif text-[28px] font-medium tracking-tight md:text-[44px]">보유 장비</h2>
            <p className="mt-5 text-[15px] text-cream/60 md:text-lg">시술 목적에 맞는 장비로 정확하게 진행합니다.</p>
          </Reveal>
          <ul className="grid grid-cols-2 gap-px border-y border-cream/15 bg-cream/15 md:grid-cols-4">
            {aboutPage.equipment.map((e, i) => (
              <Reveal as="li" key={e.name} delay={(i % 4) * 100} className="group bg-espresso p-5 md:p-8">
                <div className="overflow-hidden">
                  <ImageSlot
                    src={images.equipment[i % images.equipment.length]}
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
    </AboutPage>
  );
}
