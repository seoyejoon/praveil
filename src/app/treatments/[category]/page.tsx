import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import CategoryTabs from "@/components/CategoryTabs";
import ProcedureList from "@/components/ProcedureList";
import { getCategories, getCategory, getProcedures } from "@/lib/data";

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
  const [category, categories, procedures] = await Promise.all([
    getCategory(slug),
    getCategories(),
    getProcedures(slug),
  ]);
  if (!category) notFound();

  return (
    <>
      <PageHeader en={category.nameEn} title={category.name} description={category.description} />
      <Container className="py-12 md:py-16">
        <CategoryTabs categories={categories} active={category.slug} />
        <div className="mt-12">
          <ProcedureList procedures={procedures} />
        </div>
      </Container>
    </>
  );
}
