import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import ProcedureList from "@/components/ProcedureList";
import { getCategory, getProcedure, getProcedures } from "@/lib/data";

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

// 상세 템플릿: 소개 → 추천 대상 → 원리 → 시술 정보 → 포인트 → 주의사항 → FAQ
// 본문은 원고 확정 후 채운다.
const sections = ["이런 분께 추천합니다", "시술 원리", "시술 정보", "프라베일 포인트", "주의사항 · 부작용", "자주 묻는 질문"];

export default async function ProcedurePage({ params }: Props) {
  const { category: categorySlug, slug } = await params;
  const [category, procedure, siblings] = await Promise.all([
    getCategory(categorySlug),
    getProcedure(categorySlug, slug),
    getProcedures(categorySlug),
  ]);
  if (!category || !procedure) notFound();

  return (
    <>
      <PageHeader en={category.nameEn} title={procedure.name} description={procedure.summary} />
      <Container className="max-w-3xl py-12 md:py-16">
        <p className="text-sm text-mocha">
          <Link href="/treatments" className="hover:underline">시술안내</Link>
          <span className="mx-2">/</span>
          <Link href={`/treatments/${category.slug}`} className="hover:underline">{category.name}</Link>
        </p>

        {procedure.price && (
          <p className="mt-6 rounded-xl bg-cream px-5 py-4 text-sm">
            시술 가격 <strong className="ml-2 font-medium">{procedure.price}</strong>
          </p>
        )}

        <div className="mt-10 space-y-10">
          {sections.map((title) => (
            <section key={title} className="border-t border-line pt-8">
              <h2 className="font-serif text-xl">{title}</h2>
              <p className="mt-4 text-sm text-taupe">원고 준비 중입니다.</p>
            </section>
          ))}
        </div>

        <p className="mt-12 rounded-xl bg-cream px-5 py-4 text-xs leading-relaxed text-mocha">
          시술 결과는 개인에 따라 차이가 있을 수 있으며, 시술 후 붓기 · 멍 · 통증 등 부작용이 나타날 수 있습니다.
          자세한 내용은 의료진과 상담하시기 바랍니다.
        </p>
      </Container>

      {siblings.length > 1 && (
        <section className="bg-cream py-14">
          <Container>
            <h2 className="mb-6 font-serif text-xl">{category.name} 다른 시술</h2>
            <ProcedureList procedures={siblings.filter((p) => p.slug !== procedure.slug)} />
          </Container>
        </section>
      )}
    </>
  );
}
