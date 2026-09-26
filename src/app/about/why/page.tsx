import type { Metadata } from "next";
import AboutPage from "@/components/AboutPage";
import FeatureList from "@/components/FeatureList";
import SectionTitle from "@/components/SectionTitle";
import { getFeatures } from "@/lib/data";

export const metadata: Metadata = { title: "프라베일이 다른 이유" };

export default async function WhyPage() {
  const features = await getFeatures();
  return (
    <AboutPage slug="why">
      <section className="py-28 md:py-40">
        <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
          <SectionTitle en="Why Praveil" title="프라베일이 다른 이유" />
          <FeatureList features={features} />
        </div>
      </section>
    </AboutPage>
  );
}
