import type { Metadata } from "next";
import AboutPage from "@/components/AboutPage";
import ImageSlot from "@/components/ImageSlot";
import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";
import { images } from "@/content/home";

export const metadata: Metadata = { title: "병원 둘러보기" };

// 크기가 다른 사진을 엇갈려 배치
const layout = [
  "col-span-2 md:col-span-7 aspect-[16/10]",
  "md:col-span-5 aspect-[4/5] md:aspect-auto",
  "md:col-span-4 aspect-[4/5]",
  "md:col-span-4 aspect-[4/5] md:mt-16",
  "col-span-2 md:col-span-4 aspect-[16/10] md:aspect-[4/5]",
  "col-span-2 md:col-span-12 aspect-[16/7]",
];

export default function TourPage() {
  return (
    <AboutPage slug="tour">
      <section className="py-28 md:py-40">
        <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
          <SectionTitle en="Clinic Tour" title="병원 둘러보기" description="상담부터 회복까지, 편안하게 머무를 수 있도록 준비했습니다." />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-6">
            {layout.map((cls, i) => (
              <Reveal key={i} delay={(i % 3) * 120} className={`group overflow-hidden ${cls}`}>
                <ImageSlot src={images.clinic[i]} label="Clinic" className="h-full w-full transition duration-1000 group-hover:scale-105" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </AboutPage>
  );
}
