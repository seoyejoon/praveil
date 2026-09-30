import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import BestMark from "@/components/BestMark";
import SubPage from "@/components/SubPage";
import TreatmentDetail from "@/components/TreatmentDetail";
import { findPage, pendingPaths } from "@/content/sitemap";
import { findTreatment } from "@/content/treatments";
import { getHospital } from "@/lib/data";

// 사이트맵의 시술 페이지 (리프팅 · 쁘띠 · 피부관리 · 여드름모공 · 제모문신제거)
// 원고가 있으면 시술 상세, 없으면 '준비 중' 화면
type Props = { params: Promise<{ section: string; slug?: string[] }> };

function resolve(section: string, slug?: string[]) {
  const path = `/${[section, ...(slug ?? [])].join("/")}`;
  return pendingPaths.includes(path) ? { path, ...findPage(path)! } : null;
}

export function generateStaticParams() {
  return pendingPaths
    .filter((p) => findTreatment(p))
    .map((p) => {
      const [section, ...slug] = p.slice(1).split("/");
      return { section, slug };
    });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section, slug } = await params;
  const found = resolve(section, slug);
  const t = found && findTreatment(found.path);
  return t
    ? { title: t.title, description: `${t.title} | ${t.description}` }
    : { title: found?.page.label ?? "페이지 준비 중" };
}

export default async function SectionPage({ params }: Props) {
  const { section, slug } = await params;
  const found = resolve(section, slug);
  if (!found) notFound();
  const { section: s, page, path } = found;
  const t = findTreatment(path);

  if (t) {
    const hospital = await getHospital();
    return (
      <SubPage
        en={t.en}
        title={t.title}
        description={t.description}
        image={t.image}
        crumbs={[{ label: s.label, href: s.href }, { label: page.label }]}
        tabs={s.pages}
        current={path}
      >
        <TreatmentDetail t={t} best={page.best} hospital={hospital} />
      </SubPage>
    );
  }

  return (
    <section className="min-h-[80svh] bg-white px-5 pt-40 pb-32 md:px-10 md:pt-52">
      <div className="mx-auto max-w-[1200px]">
        <p className="font-display text-sm font-light tracking-[0.3em] text-gold uppercase">
          {s.en}
        </p>
        <h1 className="mt-4 flex items-center gap-4 text-4xl font-semibold tracking-[-0.03em] md:text-6xl">
          {page.label}
          {page.best && (
            <span className="inline-flex items-center gap-2 rounded-full bg-ivory px-4 py-1.5 text-sm font-medium tracking-normal text-mocha">
              <BestMark />
              대표 시술
            </span>
          )}
        </h1>
        <p className="mt-16 border-t border-black/10 pt-8 text-muted">
          준비 중인 페이지입니다.
        </p>
        <Link
          href="/"
          aria-label="메인으로"
          className="mt-8 grid h-14 w-14 place-items-center rounded-full border border-black/20 transition hover:bg-black hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
        </Link>
      </div>
    </section>
  );
}
