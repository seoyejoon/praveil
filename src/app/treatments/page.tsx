import type { Metadata } from "next";
import Link from "next/link";
import CategoryTabs from "@/components/CategoryTabs";
import ContactCta from "@/components/ContactCta";
import ImageSlot from "@/components/ImageSlot";
import ProcedureList from "@/components/ProcedureList";
import Reveal from "@/components/Reveal";
import SubPage from "@/components/SubPage";
import { categoryImage, treatmentsPage } from "@/content/pages";
import { getCategories, getHospital, getProcedures } from "@/lib/data";

export const metadata: Metadata = { title: "시술안내" };

export default async function TreatmentsPage() {
  const [hospital, categories, procedures] = await Promise.all([getHospital(), getCategories(), getProcedures()]);
  const { hero } = treatmentsPage;

  return (
    <SubPage en={hero.en} title={hero.title} description={hero.description} image={hero.image} crumbs={[{ label: "시술안내" }]}>
      <CategoryTabs categories={categories} />

      {/* 카테고리마다: 왼쪽 제목 · 사진 (스크롤해도 따라옴) / 오른쪽 시술 목록 */}
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        {categories.map((c, i) => (
          <section key={c.slug} id={c.slug} className="grid scroll-mt-40 gap-8 border-b border-line py-20 md:grid-cols-12 md:gap-12 md:py-28">
            <div className="md:col-span-5">
              <div className="md:sticky md:top-44">
                <Reveal variant="zoom">
                  <p className="font-display text-sm tracking-[0.15em] text-gold">
                    {String(i + 1).padStart(2, "0")} · {c.nameEn.toUpperCase()}
                  </p>
                  <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight md:text-5xl">{c.name}</h2>
                  <p className="mt-4 text-[15px] text-muted md:text-lg">{c.description}</p>
                </Reveal>
                <Reveal delay={120} className="mt-8 hidden overflow-hidden md:block">
                  <ImageSlot src={categoryImage(i)} className="aspect-[4/3]" />
                </Reveal>
                <Link
                  href={`/treatments/${c.slug}`}
                  className="mt-6 inline-block border-b border-ink/30 pb-1 font-display text-xs tracking-[0.2em] hover:text-gold"
                >
                  VIEW CATEGORY
                </Link>
              </div>
            </div>
            <div className="md:col-span-7">
              <ProcedureList procedures={procedures.filter((p) => p.categorySlug === c.slug)} columns={1} />
            </div>
          </section>
        ))}
      </div>

      <ContactCta hospital={hospital} />
    </SubPage>
  );
}
