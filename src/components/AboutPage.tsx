import SubPage from "@/components/SubPage";
import { aboutSections, type AboutSlug } from "@/content/pages";

// 병원소개 하위 페이지 공통 틀: 상단 사진 + 페이지 탭 + 본문 + 상담 안내
export default function AboutPage({
  slug,
  children,
}: {
  slug: AboutSlug;
  children: React.ReactNode;
}) {
  const page = aboutSections.find((s) => s.slug === slug)!;

  return (
    <SubPage
      en={page.en}
      title={page.label}
      description={page.description}
      image={page.image}
      crumbs={[{ label: "병원소개", href: "/about" }, { label: page.label }]}
      tabs={aboutSections.map((s) => ({
        href: `/about/${s.slug}`,
        label: s.label,
      }))}
      current={`/about/${slug}`}
    >
      {children}
    </SubPage>
  );
}
