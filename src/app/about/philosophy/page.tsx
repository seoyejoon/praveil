import type { Metadata } from "next";
import AboutPage from "@/components/AboutPage";
import { aboutSections } from "@/content/pages";
import Philosophy from "@/components/Philosophy";
import ScrollStatement from "@/components/home/ScrollStatement";
import { aboutPage } from "@/content/pages";

const section = aboutSections.find((s) => s.slug === "philosophy")!;
export const metadata: Metadata = {
  title: "프라베일 철학",
  description: section.description,
};

export default function PhilosophyPage() {
  return (
    <AboutPage slug="philosophy">
      <section className="py-28 md:py-44">
        <ScrollStatement en="Our Standard" text={aboutPage.statement} />
      </section>
      <Philosophy />
    </AboutPage>
  );
}
