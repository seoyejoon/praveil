import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ContactCta from "@/components/ContactCta";
import ProcedureList from "@/components/ProcedureList";
import Reveal from "@/components/Reveal";
import ScrollSpyNav from "@/components/ScrollSpyNav";
import SubPage from "@/components/SubPage";
import { programs } from "@/content/home";
import { categoryImage, procedureInfo, procedureSections } from "@/content/pages";
import { getCategories, getCategory, getHospital, getProcedure, getProcedures } from "@/lib/data";

type Props = { params: Promise<{ category: string; slug: string }> };

export async function generateStaticParams() {
  const procedures = await getProcedures();
  return procedures.map((p) => ({ category: p.categorySlug, slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const procedure = await getProcedure(category, slug);
  return { title: procedure?.name };
}

// 상세 템플릿: 한 줄 소개 · 시술 정보 → 추천 대상 → 원리 → 포인트 → 주의사항 → FAQ
// 본문은 원고 확정 후 시술별로 채운다.
export default async function ProcedurePage({ params }: Props) {
  const { category: categorySlug, slug } = await params;
  const [hospital, category, categories, procedure, siblings] = await Promise.all([
    getHospital(),
    getCategory(categorySlug),
    getCategories(),
    getProcedure(categorySlug, slug),
    getProcedures(categorySlug),
  ]);
  if (!category || !procedure) notFound();
  const index = categories.findIndex((c) => c.slug === categorySlug);
  const program = programs[procedure.slug];

  return (
    <SubPage
      en={category.nameEn}
      title={procedure.name}
      description={procedure.summary ?? program?.description}
      image={categoryImage(index + siblings.findIndex((p) => p.slug === slug))}
      crumbs={[
        { label: "시술안내", href: "/treatments" },
        { label: category.name, href: `/treatments/${category.slug}` },
        { label: procedure.name },
      ]}
    >
      {/* 시술 정보 요약 */}
      <section className="mx-auto max-w-[1440px] px-5 pt-20 md:px-10 md:pt-28">
        <Reveal variant="zoom" className="text-center">
          <p className="font-display text-base tracking-[0.15em] text-gold md:text-lg">Treatment Info</p>
          <h2 className="mt-4 font-serif text-[28px] font-medium tracking-tight md:text-[40px]">{procedure.name}</h2>
          {program && (
            <ul className="mt-6 flex flex-wrap justify-center gap-2">
              {program.tags.map((t) => (
                <li key={t} className="rounded-full border border-ink/20 px-4 py-1.5 text-[13px] text-muted">
                  #{t}
                </li>
              ))}
            </ul>
          )}
        </Reveal>
        <ul className="mt-12 grid grid-cols-2 gap-px border-y border-ink/15 bg-ink/15 md:mt-16 md:grid-cols-4">
          {procedureInfo.map((info, i) => (
            <Reveal as="li" key={info.label} delay={i * 100} className="bg-cream px-4 py-8 text-center md:py-12">
              <p className="font-display text-xs tracking-[0.2em] text-gold">{info.en.toUpperCase()}</p>
              <p className="mt-3 text-sm text-muted">{info.label}</p>
              <p className="mt-2 font-serif text-lg font-medium md:text-xl">상담 후 안내</p>
            </Reveal>
          ))}
        </ul>
        {procedure.price && (
          <p className="mt-6 text-center text-sm text-muted">
            시술 가격 <strong className="ml-2 font-medium text-ink">{procedure.price}</strong>
          </p>
        )}
      </section>

      {/* 본문: 왼쪽 목차(따라옴) / 오른쪽 섹션 */}
      <section className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 md:grid-cols-12 md:px-10 md:py-28">
        <aside className="hidden md:col-span-3 md:block">
          <div className="sticky top-32">
            <ScrollSpyNav items={procedureSections} />
          </div>
        </aside>
        <div className="space-y-20 md:col-span-8 md:col-start-5 md:space-y-28">
          {procedureSections.map((s) => (
            <Reveal key={s.id}>
              <section id={s.id} className="scroll-mt-32">
                <p className="font-display text-sm tracking-[0.15em] text-gold">{s.en}</p>
                <h3 className="mt-3 font-serif text-2xl font-medium tracking-tight md:text-[32px]">{s.title}</h3>
                {s.id === "faq" ? (
                  <div className="mt-8 border-t border-ink/15">
                    {[1, 2, 3].map((n) => (
                      <details key={n} className="group border-b border-ink/15">
                        <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-[15px] md:text-base">
                          <span>
                            <span className="mr-3 font-display text-gold">Q</span>자주 묻는 질문 {n} (원고 준비 중)
                          </span>
                          <span aria-hidden className="text-taupe transition group-open:rotate-45">
                            +
                          </span>
                        </summary>
                        <p className="pb-6 pl-7 text-[15px] leading-relaxed text-muted">답변 원고 준비 중입니다.</p>
                      </details>
                    ))}
                  </div>
                ) : (
                  <p className="mt-6 text-[15px] leading-relaxed text-taupe md:text-base">원고 준비 중입니다.</p>
                )}
              </section>
            </Reveal>
          ))}

          <p className="border-l-2 border-gold/60 bg-ivory px-5 py-4 text-xs leading-relaxed text-muted md:text-sm">
            시술 결과는 개인에 따라 차이가 있을 수 있으며, 시술 후 붓기 · 멍 · 통증 등 부작용이 나타날 수 있습니다.
            자세한 내용은 의료진과 상담하시기 바랍니다.
          </p>
        </div>
      </section>

      {siblings.length > 1 && (
        <section className="bg-ivory py-20 md:py-28">
          <div className="mx-auto max-w-[1440px] px-5 md:px-10">
            <div className="mb-10 flex items-end justify-between">
              <Reveal variant="zoom">
                <p className="font-display text-sm tracking-[0.15em] text-gold">More {category.nameEn}</p>
                <h2 className="mt-3 font-serif text-2xl font-medium md:text-4xl">{category.name} 다른 시술</h2>
              </Reveal>
              <Link
                href={`/treatments/${category.slug}`}
                className="border-b border-ink/30 pb-1 font-display text-xs tracking-[0.2em] hover:text-gold"
              >
                VIEW ALL
              </Link>
            </div>
            <ProcedureList procedures={siblings.filter((p) => p.slug !== procedure.slug)} />
          </div>
        </section>
      )}

      <ContactCta hospital={hospital} />
    </SubPage>
  );
}
