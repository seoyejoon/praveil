import type { Metadata } from "next";
import Container from "@/components/Container";
import DoctorProfile from "@/components/DoctorProfile";
import ImageSlot from "@/components/ImageSlot";
import FeatureList from "@/components/FeatureList";
import PageHeader from "@/components/PageHeader";
import SectionTitle from "@/components/SectionTitle";
import { getDoctor, getFeatures } from "@/lib/data";

export const metadata: Metadata = { title: "병원소개" };

export default async function AboutPage() {
  const [doctor, features] = await Promise.all([getDoctor(), getFeatures()]);

  return (
    <>
      <PageHeader en="About" title="병원소개" />

      <section className="py-24 md:py-36">
        <DoctorProfile doctor={doctor} />
      </section>

      <section className="bg-cream py-24 md:py-36">
        <Container>
          <SectionTitle en="Why Praveil" title="프라베일이 다른 이유" />
          <FeatureList features={features} />
        </Container>
      </section>

      <section className="py-24 md:py-36">
        <Container>
          <SectionTitle en="Interior & Equipment" title="병원 둘러보기 · 보유 장비" description="사진 촬영 후 채워집니다." />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ImageSlot key={i} label={i < 2 ? "Interior" : "Equipment"} className="aspect-square rounded-2xl" />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
