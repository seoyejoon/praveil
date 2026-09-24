import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import CategoryTabs from "@/components/CategoryTabs";
import ProcedureList from "@/components/ProcedureList";
import { getCategories, getProcedures } from "@/lib/data";

export const metadata: Metadata = { title: "시술안내" };

export default async function TreatmentsPage() {
  const [categories, procedures] = await Promise.all([getCategories(), getProcedures()]);

  return (
    <>
      <PageHeader en="Treatments" title="시술안내" />
      <Container className="py-12 md:py-16">
        <CategoryTabs categories={categories} />
        <div className="mt-12 space-y-14">
          {categories.map((c) => (
            <section key={c.slug}>
              <h2 className="mb-5 font-serif text-xl">
                {c.name}
                <span className="ml-3 text-xs tracking-[0.2em] text-mocha uppercase">{c.nameEn}</span>
              </h2>
              <ProcedureList procedures={procedures.filter((p) => p.categorySlug === c.slug)} />
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
