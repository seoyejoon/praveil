import SubPage from "@/components/SubPage";
import { aboutHero } from "@/content/about";
import { doctorPhotos } from "@/content/doctor-photos";
import { sitemap } from "@/content/sitemap";

// 병원소개 하위 페이지 공통 틀: 상단 사진 + 탭(병원소개 · 의료진소개 · 오시는 길) + 본문
export default function AboutPage({
  page,
  current,
  children,
}: {
  page: keyof typeof aboutHero;
  current: string;
  children: React.ReactNode;
}) {
  const hero = aboutHero[page];
  const about = sitemap.find((s) => s.key === "praveil")!;

  return (
    <SubPage
      en={hero.en}
      title={hero.title}
      description={hero.description}
      image={hero.image}
      scene={
        page === "doctor"
          ? {
              src: doctorPhotos.banner,
              mobileSrc: doctorPhotos.portrait,
              photoLayout: "full-frame",
              photoAspect: "portrait-mobile",
              photoAlt: "프라베일 대표원장 프로필",
            }
          : undefined
      }
      crumbs={[{ label: about.label, href: about.href }, { label: hero.title }]}
      tabs={about.pages}
      current={current}
    >
      {children}
    </SubPage>
  );
}
