import Link from "next/link";
import Container from "@/components/Container";
import DoctorProfile from "@/components/DoctorProfile";
import FeatureList from "@/components/FeatureList";
import ImageSlot from "@/components/ImageSlot";
import LocationInfo from "@/components/LocationInfo";
import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";
import {
  getCategories,
  getDoctor,
  getFeatures,
  getHospital,
  getSignatureProcedures,
} from "@/lib/data";

export default async function Home() {
  const [hospital, doctor, features, categories, signatures] = await Promise.all([
    getHospital(),
    getDoctor(),
    getFeatures(),
    getCategories(),
    getSignatureProcedures(),
  ]);
  const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name;

  return (
    <>
      {/* 히어로: 한 화면 꽉 차게 (전체 높이 - 헤더, 모바일은 하단 상담바도 제외) */}
      {/* 사진 확정 후 배경 이미지 추가 */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream via-cream to-sand">
        <p
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-[-0.18em] text-center font-display text-[28vw] leading-none text-ivory/70 italic select-none md:text-[18vw]"
        >
          Praveil
        </p>
        <Container className="relative flex h-[calc(100svh-4rem-3.5rem)] min-h-[480px] flex-col items-center justify-center text-center md:h-[calc(100svh-5rem)] md:min-h-[600px]">
          <p className="animate-rise font-display text-xl tracking-[0.2em] text-mocha italic md:text-2xl">
            Clear &amp; Graceful
          </p>
          <h1 className="animate-rise mt-6 font-serif text-3xl leading-snug [animation-delay:150ms] md:text-5xl md:leading-snug">
            맑고 고운 피부,
            <br />
            나에게 맞는 방법으로
          </h1>
          <p className="animate-rise mt-6 text-sm text-mocha [animation-delay:300ms] md:text-base">
            원장 직접 시술 · 1:1 맞춤 상담
          </p>
          <Link
            href="/treatments"
            className="animate-rise mt-10 rounded-full border border-espresso px-8 py-3 text-sm transition [animation-delay:450ms] hover:bg-espresso hover:text-ivory"
          >
            시술 안내 보기
          </Link>
        </Container>
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] tracking-[0.3em] text-mocha uppercase">
          Scroll
          <span className="h-10 w-px bg-mocha/60 [animation:scroll-line_2s_ease-in-out_infinite]" />
        </div>
      </section>

      {/* 대표 시술 */}
      <section className="py-24 md:py-36">
        <Container>
          <SectionTitle en="Signature" title="프라베일 대표 시술" />
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-6">
            {signatures.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 120} className={i % 2 === 1 ? "md:mt-16" : ""}>
                <Link href={`/treatments/${p.categorySlug}/${p.slug}`} className="group block">
                  <div className="overflow-hidden rounded-t-full">
                    <ImageSlot
                      label={`0${i + 1}`}
                      className="aspect-[3/4] transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-5 text-xs text-mocha">{categoryName(p.categorySlug)}</p>
                  <p className="mt-1 font-serif text-lg md:text-xl">{p.name}</p>
                  <p className="mt-3 text-xs tracking-widest text-taupe uppercase transition group-hover:text-espresso">
                    View more →
                  </p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* 특장점 */}
      <section className="bg-cream py-24 md:py-36">
        <Container>
          <SectionTitle en="Why Praveil" title="프라베일이 다른 이유" />
          <FeatureList features={features} />
        </Container>
      </section>

      {/* 원장 소개 */}
      <section className="py-24 md:py-36">
        <DoctorProfile doctor={doctor} />
      </section>

      {/* 시술 카테고리 */}
      <section className="bg-cream py-24 md:py-36">
        <Container>
          <SectionTitle en="Treatments" title="시술 안내" />
          <ul className="grid border-t border-espresso/20 md:grid-cols-2 md:gap-x-16">
            {categories.map((c) => (
              <li key={c.slug} className="border-b border-espresso/20">
                <Link href={`/treatments/${c.slug}`} className="group flex items-baseline gap-4 py-5 md:py-6">
                  <span className="w-36 shrink-0 font-display text-xl text-taupe italic transition group-hover:text-mocha md:w-44 md:text-2xl">
                    {c.nameEn}
                  </span>
                  <span className="flex-1">{c.name}</span>
                  <span aria-hidden className="text-taupe transition group-hover:translate-x-1 group-hover:text-espresso">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 진료시간 · 오시는 길 */}
      <section className="py-24 md:py-36">
        <Container>
          <SectionTitle en="Hours & Location" title="진료시간 · 오시는 길" />
          <Reveal>
            <LocationInfo hospital={hospital} />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
