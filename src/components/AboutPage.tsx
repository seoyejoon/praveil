import SubPage from "@/components/SubPage";
import { aboutHero } from "@/content/about";
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
      mobileImage={hero.mobileImage}
      // 병원소개 · 의료진소개는 같은 모양으로, 상단 경로(HOME - 병원소개 - …)는 숨김 (아래 탭으로 이동)
      crumbs={[]}
      tabs={about.pages}
      current={current}
      boldTitle
    >
      {children}
    </SubPage>
  );
}
