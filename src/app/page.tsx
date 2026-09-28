import MainBest from "@/components/main/MainBest";
import MainDoctor from "@/components/main/MainDoctor";
import MainHero from "@/components/main/MainHero";
import MainIntro from "@/components/main/MainIntro";
import MainNews from "@/components/main/MainNews";
import MainSpace from "@/components/main/MainSpace";
import MainTreatments from "@/components/main/MainTreatments";
import MainWhy from "@/components/main/MainWhy";
import { mainBest, mainCategoryImage, mainDoctor, mainHero, mainIntro, mainSpace, mainWhy } from "@/content/main";
import { sitemap } from "@/content/sitemap";
import { getDoctor, getNotices } from "@/lib/data";

// 메인 (2026.10 리뉴얼): 첫 화면 → 철학 → 대표 시술 4종 → 특장점 → 대표원장 → 진료 분야 → 공간 → 소식 (진료시간 · 오시는 길은 푸터와 한 화면)
export default async function Home() {
  const [doctor, notices] = await Promise.all([getDoctor(), getNotices()]);

  return (
    <>
      <MainHero {...mainHero} />
      <MainIntro {...mainIntro} />
      <MainBest {...mainBest} />
      <MainWhy {...mainWhy} />
      <MainDoctor {...mainDoctor} name={doctor.name} title={doctor.title} />
      <MainTreatments sections={sitemap.filter((s) => s.treatment)} images={mainCategoryImage} />
      <MainSpace {...mainSpace} />
      <MainNews items={notices.map(({ id, type, title, summary, createdAt }) => ({ id, type, title, summary, createdAt }))} />
    </>
  );
}
