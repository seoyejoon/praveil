import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryTabs from "@/components/CategoryTabs";
import ContactCta from "@/components/ContactCta";
import ImageSlot from "@/components/ImageSlot";
import Reveal from "@/components/Reveal";
import SubPage from "@/components/SubPage";
import Link from "next/link";
import { categoryImage } from "@/content/pages";
import { getCategories, getCategory, getHospital, getProcedures } from "@/lib/data";

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategory((await params).category);
  return { title: category?.name };
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const [hospital, category, categories, procedures] = await Promise.all([
    getHospital(),
    getCategory(slug),
    getCategories(),
    getProcedures(slug),
  ]);
  if (!category) notFound();
  const index = categories.findIndex((c) => c.slug === slug);

  return (
    <SubPage
      en={category.nameEn}
      title={category.name}
      description={category.description}
      image={categoryImage(index)}
      crumbs={[{ label: "시술안내", href: "/treatments" }, { label: category.name }]}
    >
      <CategoryTabs categories={categories} active={category.slug} />

      {/* 시술 카드 */}
      <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {procedures.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={(i % 3) * 120}>
              <Link href={`/treatments/${p.categorySlug}/${p.slug}`} className="group block">
                <div className="overflow-hidden">
                  <ImageSlot
                    src={categoryImage(index + i)}
                    tone={i % 2 ? "light" : "dark"}
                    className="aspect-[4/3] transition duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mt-5 font-display text-xs tracking-[0.2em] text-gold">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-2 font-serif text-xl font-medium md:text-2xl">
                  {p.name}
                  {p.isSignature && (
                    <span className="ml-2 rounded-full border border-gold/60 px-2 py-0.5 align-middle font-sans text-[10px] text-gold">
                      대표
                    </span>
                  )}
                </p>
                <p className="mt-4 inline-block border-b border-ink/30 pb-1 font-display text-xs tracking-[0.2em] transition group-hover:border-gold group-hover:text-gold">
                  VIEW MORE
                </p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      <ContactCta hospital={hospital} />
    </SubPage>
  );
}
