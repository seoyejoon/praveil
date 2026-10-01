import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import BestMark from "@/components/BestMark";
import SubPage from "@/components/SubPage";
import TreatmentDetail from "@/components/TreatmentDetail";
import { findPage, pendingPaths } from "@/content/sitemap";
import {
  areaOf,
  commonFaq,
  guideUpdated,
  treatmentGuide,
} from "@/content/treatment-guide";
import { findTreatment } from "@/content/treatments";
import { getDoctor, getHospital, getProcedures } from "@/lib/data";
import { SITE_URL } from "@/lib/site-url";

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

// 검색 제목: "인천 남동구 필러 | 프라베일 맑고고운의원", 설명: 한 줄 정의
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section, slug } = await params;
  const found = resolve(section, slug);
  const t = found && findTreatment(found.path);
  if (!t) return { title: found?.page.label ?? "페이지 준비 중" };
  const g = treatmentGuide[t.href];
  const area = areaOf((await getHospital()).address);
  const title = `${area} ${t.title}`;
  return {
    title,
    description: g.answer,
    alternates: { canonical: t.href },
    openGraph: { title, description: g.answer, images: [t.image] },
  };
}

export default async function SectionPage({ params }: Props) {
  const { section, slug } = await params;
  const found = resolve(section, slug);
  if (!found) notFound();
  const { section: s, page, path } = found;
  const t = findTreatment(path);

  if (t) {
    const [hospital, doctor, procedures] = await Promise.all([
      getHospital(),
      getDoctor(),
      getProcedures(),
    ]);
    const g = treatmentGuide[t.href];
    const area = areaOf(hospital.address);
    const prices = g.prices
      .map((slug) => procedures.find((p) => p.slug === slug))
      .filter((p) => p && p.prices.length > 0) as typeof procedures;
    const compare = (g.compare ?? []).map((href) => ({
      href,
      title: findTreatment(href)!.title,
      profile: treatmentGuide[href].profile,
    }));
    const faq = [
      ...t.faq,
      ...g.faq,
      ...commonFaq(t.title, hospital, doctor.name, prices.length > 0),
    ];
    const url = `${SITE_URL}${t.href}`;
    // 구조화 데이터: 이 페이지가 어떤 시술을, 어느 병원이, 어떤 질문에 답하는지 검색엔진 · AI에 알려 줌
    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "MedicalWebPage",
          "@id": `${url}#webpage`,
          url,
          name: `${t.title} | ${hospital.name}`,
          description: g.answer,
          inLanguage: "ko-KR",
          dateModified: guideUpdated,
          about: { "@id": `${url}#procedure` },
          mainEntity: { "@id": `${url}#faq` },
          breadcrumb: { "@id": `${url}#breadcrumb` },
          publisher: { "@id": `${SITE_URL}/#clinic` },
        },
        {
          "@type": "MedicalProcedure",
          "@id": `${url}#procedure`,
          name: t.title,
          alternateName: t.en,
          description: g.answer,
          howPerformed: g.principle,
          bodyLocation: g.area,
          followup: g.recovery,
        },
        {
          "@type": "FAQPage",
          "@id": `${url}#faq`,
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${url}#breadcrumb`,
          itemListElement: [
            { name: "HOME", item: SITE_URL },
            { name: s.label, item: `${SITE_URL}${s.href}` },
            { name: page.label, item: url },
          ].map((b, i) => ({ "@type": "ListItem", position: i + 1, ...b })),
        },
      ],
    };
    return (
      <SubPage
        en={t.en}
        title={t.title}
        description={t.description}
        image={t.image}
        device={t.device}
        facts={t.facts}
        crumbs={[{ label: s.label, href: s.href }, { label: page.label }]}
        tabs={s.pages}
        current={path}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <TreatmentDetail
          t={t}
          g={g}
          best={page.best}
          hospital={hospital}
          doctor={doctor}
          prices={prices}
          compare={compare}
          faq={faq}
          area={area}
          updated={guideUpdated}
        />
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
