import Link from "next/link";
import SubPage from "@/components/SubPage";
import { aboutSections, type AboutSlug } from "@/content/pages";

// 병원소개 하위 페이지 공통 틀: 상단 사진 + 페이지 탭 + 본문 + 상담 안내
export default function AboutPage({ slug, children }: { slug: AboutSlug; children: React.ReactNode }) {
  const page = aboutSections.find((s) => s.slug === slug)!;

  return (
    <SubPage
      en={page.en}
      title={page.label}
      description={page.description}
      image={page.image}
      crumbs={[{ label: "병원소개", href: "/about" }, { label: page.label }]}
    >
      <nav className="sticky top-16 z-20 border-b border-line bg-cream/95 backdrop-blur md:top-20">
        <ul className="no-scrollbar mx-auto flex max-w-[1440px] gap-7 overflow-x-auto px-5 whitespace-nowrap md:justify-center md:gap-12 md:px-10">
          {aboutSections.map((s) => {
            const on = s.slug === slug;
            return (
              <li key={s.slug}>
                <Link
                  href={`/about/${s.slug}`}
                  aria-current={on ? "page" : undefined}
                  className={`relative block py-5 text-[15px] transition ${on ? "text-ink" : "text-muted hover:text-ink"}`}
                >
                  {s.label}
                  <span
                    className={`absolute inset-x-0 bottom-0 h-0.5 bg-gold transition-transform duration-500 ${on ? "scale-x-100" : "scale-x-0"}`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {children}

    </SubPage>
  );
}
