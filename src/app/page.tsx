import Link from "next/link";
import Container from "@/components/Container";
import DoctorProfile from "@/components/DoctorProfile";
import FeatureList from "@/components/FeatureList";
import SectionTitle from "@/components/SectionTitle";
import LocationInfo from "@/components/LocationInfo";
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

  return (
    <>
      {/* 히어로 (사진 확정 전 임시 배경) */}
      {/* 한 화면 꽉 차게: 전체 높이 - 헤더 (모바일은 하단 상담바도 제외) */}
      <section className="bg-gradient-to-b from-cream to-sand">
        <Container className="flex h-[calc(100svh-4rem-3.5rem)] min-h-[480px] flex-col items-center justify-center text-center md:h-[calc(100svh-5rem)] md:min-h-[600px]">
          <p className="text-xs tracking-[0.4em] text-mocha uppercase">Praveil Clinic</p>
          <h1 className="mt-6 font-serif text-3xl leading-snug md:text-5xl md:leading-snug">
            맑고 고운 피부,
            <br />
            나에게 맞는 방법으로
          </h1>
          <p className="mt-6 text-sm text-mocha md:text-base">원장 직접 시술 · 1:1 맞춤 상담</p>
          <Link
            href="/treatments"
            className="mt-10 rounded-full border border-espresso px-8 py-3 text-sm transition hover:bg-espresso hover:text-ivory"
          >
            시술 안내 보기
          </Link>
        </Container>
      </section>

      {/* 대표 시술 */}
      <section className="py-20 md:py-28">
        <Container>
          <SectionTitle en="Signature" title="대표 시술" />
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {signatures.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/treatments/${p.categorySlug}/${p.slug}`}
                  className="flex aspect-[3/4] flex-col justify-end rounded-2xl bg-cream p-6 transition hover:bg-sand"
                >
                  <span className="text-xs text-mocha">
                    {categories.find((c) => c.slug === p.categorySlug)?.name}
                  </span>
                  <span className="mt-1 font-serif text-lg md:text-xl">{p.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 특장점 */}
      <section className="bg-cream py-20 md:py-28">
        <Container>
          <SectionTitle en="Why Praveil" title="프라베일이 다른 이유" />
          <FeatureList features={features} />
        </Container>
      </section>

      {/* 원장 소개 */}
      <section className="py-20 md:py-28">
        <DoctorProfile doctor={doctor} />
      </section>

      {/* 시술 카테고리 */}
      <section className="bg-cream py-20 md:py-28">
        <Container>
          <SectionTitle en="Treatments" title="시술 안내" />
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/treatments/${c.slug}`}
                  className="block rounded-xl bg-ivory px-5 py-6 transition hover:bg-sand"
                >
                  <span className="block text-[10px] tracking-[0.2em] text-mocha uppercase">{c.nameEn}</span>
                  <span className="mt-1 block font-medium">{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 진료시간 · 오시는 길 */}
      <section className="py-20 md:py-28">
        <Container>
          <SectionTitle en="Hours & Location" title="진료시간 · 오시는 길" />
          <LocationInfo hospital={hospital} />
        </Container>
      </section>
    </>
  );
}
