import type { Metadata } from "next";
import { faqDetail, faqPlain } from "@/content/faq-detail";
import { getBlogPosts } from "@/lib/blog";
import { narrowGroupName } from "@/lib/price-table";
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
import { deviceStory } from "@/content/device-story";
import { findTreatment, type Treatment } from "@/content/treatments";
import TreatmentSwitch, { HeroSwitch } from "@/components/sub/TreatmentSwitch";
import {
  getBeforeAfterCases,
  getDoctor,
  getHospital,
  getProcedures,
} from "@/lib/data";
import { withCategoryKey } from "@/lib/before-after";
import { SITE_URL } from "@/lib/site-url";

// 사이트맵의 시술 페이지 (리프팅 · 쁘띠 · 피부 관리 · 여드름모공 · 제모문신제거)
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
  const hospital = await getHospital();
  const area = areaOf(hospital.address);
  // 검색 제목: "쿨소닉 | 인천 남동구 쿨소닉, 깊이별로 나누어 … - 병원 이름"
  // 하위 시술을 묶은 페이지는 묶인 시술 이름을 모두 적는다
  const sub = t.variants
    ? t.variants.map((v) => findTreatment(v.href)!.title).join(" · ")
    : t.description;
  const title = `${t.title} | ${area} ${t.title}${sub ? `, ${sub}` : ""} - ${hospital.name}`;
  const description = clip(g.answer, 155);
  const image = { url: t.image, alt: `${t.title} - ${hospital.name}` };
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: t.href },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      siteName: hospital.name,
      url: t.href,
      title,
      description,
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

// 검색 설명은 155자 안쪽에서 문장이 끝나는 곳까지 (넘치면 잘린 채로 보임)
function clip(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const end = Math.max(cut.lastIndexOf("다. "), cut.lastIndexOf("요. "));
  return end > 40 ? cut.slice(0, end + 2) : `${cut.slice(0, max - 1)}…`;
}

export default async function SectionPage({ params }: Props) {
  const { section, slug } = await params;
  const found = resolve(section, slug);
  if (!found) notFound();
  const { section: s, page, path } = found;
  const t = findTreatment(path);

  if (t) {
    const [hospital, doctor, procedures, allCases, posts] = await Promise.all([
      getHospital(),
      getDoctor(),
      getProcedures(),
      // 시술 전 사진은 회원에게만: 시술 페이지(정적 페이지)에서는 항상 잠금, 회원은 전후사진 게시판에서 확인
      getBeforeAfterCases(false),
      deviceStory[t.href] ? getBlogPosts(30) : [],
    ]);
    // 시술 한 개 그리기 (하위 시술이 있으면 여러 번)
    const build = (
      tt: Treatment,
      variantKey = "",
      switcher?: React.ReactNode,
    ) => {
      // 블로그: 이 시술 이름이 들어간 글 먼저
      const blog = [
        ...posts.filter((p) => p.title.includes(tt.title)),
        ...posts.filter((p) => !p.title.includes(tt.title)),
      ];
      // 전후사진: 제목에 시술 이름이 있는 사례 먼저, 없으면 같은 분류 사례 (최대 3개)
      const cases = allCases.map(withCategoryKey);
      const named = cases.filter((c) => c.title.includes(tt.title));
      const baCases = (
        named.length ? named : cases.filter((c) => c.category === s.key)
      ).slice(0, 3);
      const g = treatmentGuide[tt.href];
      const area = areaOf(hospital.address);
      // 한 가격 항목에 여러 하위 시술 줄이 섞여 있으면(예: QTL실 · 잼버실) 이 시술 줄만
      const siblings = tt.variantOf
        ? (findTreatment(tt.variantOf)?.variants ?? [])
        : [];
      const mine = siblings.find((v) => v.href === tt.href)?.label;
      // 이 탭 가격만 남길 때 묶음 이름도 같이 좁힌다
      // "실리프팅 (QTL실 · 잼버실)" → QTL 탭에서는 "실리프팅 (QTL실)"
      const otherLabels = siblings
        .filter((v) => v.label !== mine)
        .map((v) => v.label);
      const onlyMine = (p: (typeof procedures)[number]) => {
        if (!mine) return p;
        const rows = p.prices.filter((r) => r.label.includes(mine));
        const others = p.prices.filter((r) =>
          siblings.some((v) => v.label !== mine && r.label.includes(v.label)),
        );
        return rows.length && rows.length + others.length === p.prices.length
          ? { ...p, name: narrowGroupName(p.name, otherLabels), prices: rows }
          : p;
      };
      const prices = g.prices
        .map((slug) => procedures.find((p) => p.slug === slug))
        .filter((p) => p && p.prices.length > 0)
        .map((p) => onlyMine(p!)) as typeof procedures;
      const compare = (g.compare ?? []).map((href) => {
        const c = findTreatment(href)!;
        return {
          // 하위 시술은 부모 페이지 + ?type= 으로 연결
          href: c.variantOf
            ? `${c.variantOf}?type=${href.split("/").pop()}`
            : href,
          me: href === tt.href,
          title: c.title,
          profile: treatmentGuide[href].profile,
        };
      });
      const faq = faqDetail[tt.href] ?? [
        ...tt.faq,
        ...g.faq,
        ...commonFaq(tt.title, hospital, doctor.name, prices.length > 0),
      ];
      // 하위 시술(variant)은 따로 주소가 없어 부모 주소 + 구분값
      const url = `${SITE_URL}${path}${variantKey ? `?type=${variantKey}` : ""}`;
      // 구조화 데이터: 이 페이지가 어떤 시술을, 어느 병원이, 어떤 질문에 답하는지 검색엔진 · AI에 알려 줌
      const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "MedicalWebPage",
            "@id": `${url}#webpage`,
            url,
            name: `${tt.title} | ${hospital.name}`,
            description: g.answer,
            inLanguage: "ko-KR",
            dateModified: guideUpdated,
            lastReviewed: guideUpdated,
            // 내용을 검수한 의료진 (의료진소개 페이지의 대표원장)
            reviewedBy: { "@id": `${SITE_URL}/about/doctor#physician` },
            primaryImageOfPage: `${SITE_URL}${tt.image}`,
            isPartOf: { "@id": `${SITE_URL}/#website` },
            about: { "@id": `${url}#procedure` },
            mainEntity: { "@id": `${url}#faq` },
            breadcrumb: { "@id": `${url}#breadcrumb` },
            publisher: { "@id": `${SITE_URL}/#clinic` },
          },
          {
            "@type": "MedicalProcedure",
            "@id": `${url}#procedure`,
            name: tt.title,
            alternateName: tt.en,
            description: g.answer,
            image: `${SITE_URL}${tt.image}`,
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
              acceptedAnswer: { "@type": "Answer", text: faqPlain(f.a) },
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
          key={variantKey}
          en={tt.en}
          title={tt.title}
          description={tt.description}
          image={tt.image}
          device={tt.device}
          scene={tt.scene}
          crumbs={[{ label: s.label, href: s.href }, { label: page.label }]}
          tabs={s.pages}
          current={path}
          switcher={switcher}
          // 하위 시술을 묶은 페이지는 페이지 대표 제목(h1)을 따로 두고 시술 이름은 h2
          headingAs={variantKey ? "h2" : "h1"}
        >
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
            }}
          />
          <TreatmentDetail
            t={tt}
            g={g}
            best={page.best}
            hospital={hospital}
            doctor={doctor}
            prices={prices}
            compare={compare}
            faq={faq}
            area={area}
            updated={guideUpdated}
            story={deviceStory[tt.href]}
            baCases={baCases}
            blog={blog}
          />
        </SubPage>
      );
    };

    if (t.variants) {
      const variants = t.variants.map((v) => ({
        key: v.href.split("/").pop()!,
        label: v.label,
        title: findTreatment(v.href)!.title,
      }));
      return (
        <>
          {/* 검색엔진 · AI 가 이 페이지의 주제를 알 수 있게 하는 대표 제목 (화면에는 보이지 않음) */}
          <h1 className="sr-only">
            {`${areaOf(hospital.address)} ${t.title} — ${variants.map((v) => v.title).join(" · ")}`}
          </h1>
        <TreatmentSwitch variants={variants}>
          {t.variants.map((v, i) =>
            build(findTreatment(v.href)!, variants[i].key, <HeroSwitch />),
          )}
        </TreatmentSwitch>
        </>
      );
    }
    return build(t);
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
