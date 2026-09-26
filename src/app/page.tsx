import Link from "next/link";
import ContactCta from "@/components/ContactCta";
import ImageSlot from "@/components/ImageSlot";
import Philosophy from "@/components/Philosophy";
import Reveal from "@/components/Reveal";
import DoctorGreeting from "@/components/home/DoctorGreeting";
import Hero from "@/components/home/Hero";
import HomeLocation from "@/components/home/HomeLocation";
import NewsSplit from "@/components/home/NewsSplit";
import Program from "@/components/home/Program";
import ScrollStatement from "@/components/home/ScrollStatement";
import SpecialProcess from "@/components/home/SpecialProcess";
import TreatmentSlider from "@/components/home/TreatmentSlider";
import {
  clinic,
  doctorGreeting,
  hero,
  categoryPhoto,
  images,
  news,
  programs,
  special,
  statement,
  treatmentCopy,
  treatmentIntro,
} from "@/content/home";
import { getCategories, getDoctor, getHospital, getNotices, getProcedures, getSignatureProcedures } from "@/lib/data";

const wide = "mx-auto w-full max-w-[1440px] px-5 md:px-10";

// 배경 흐름: 어두운 첫 화면 → 크림 → 밝은 카드 → 어두운 시그니처 → 크림 → 원장 → 아이보리 → 크림 → 아이보리 → 어두운 상담 → 밝은 오시는 길 · 푸터
export default async function Home() {
  const [hospital, doctor, categories, procedures, signatures, notices] = await Promise.all([
    getHospital(),
    getDoctor(),
    getCategories(),
    getProcedures(),
    getSignatureProcedures(),
    getNotices(),
  ]);

  const programItems = signatures.map((p, i) => ({
    href: `/treatments/${p.categorySlug}/${p.slug}`,
    name: p.name,
    category: categories.find((c) => c.slug === p.categorySlug)?.name ?? "",
    image: images.signature[i % images.signature.length],
    description: programs[p.slug]?.description ?? p.summary ?? "",
    tags: programs[p.slug]?.tags ?? [],
  }));

  const slides = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    nameEn: c.nameEn,
    body: treatmentCopy[c.slug] ?? c.description,
    image: categoryPhoto(c.slug),
    procedures: procedures
      .filter((p) => p.categorySlug === c.slug)
      .map((p) => ({ href: `/treatments/${c.slug}/${p.slug}`, name: p.name })),
  }));

  return (
    <>
      {/* ① 첫 화면은 제자리에 두고, 다음 섹션이 둥근 모서리로 위를 덮으며 올라온다 */}
      <div className="relative">
        <div className="sticky top-0">
          {/* 영상이 생기면 video={{ src, mobileSrc }} 지정 */}
          <Hero
            eyebrow={hero.eyebrow}
            title={hero.title}
            description={hero.description}
            image={images.hero}
            reservationUrl={hospital.naverReservationUrl}
          />
        </div>

        {/* ② 프라베일은 다릅니다 */}
        <section className="relative z-10 rounded-t-[28px] bg-cream py-28 md:rounded-t-[56px] md:py-44">
          <ScrollStatement en={statement.en} title={statement.title} text={statement.text} />
        </section>
      </div>

      {/* ③ 철학 3가지 (움직이는 아이콘) */}
      <Philosophy />

      {/* ⑤ 시그니처 시술 (어두운 배경, PC는 화면 고정) */}
      <Program items={programItems} />

      {/* ⑥ 프라베일만의 특별함 */}
      <SpecialProcess
        en={special.en}
        title={special.title}
        description={special.description}
        items={special.items.map((item, i) => ({ ...item, image: images.special[i % images.special.length] }))}
      />

      {/* ⑧ 원장 인사말 */}
      <DoctorGreeting
        doctor={doctor}
        image={images.doctorCutout}
        cutout
        eyebrow={doctorGreeting.eyebrow}
        quote={doctorGreeting.quote}
        description={doctorGreeting.description}
      />

      {/* ⑨ 진료분야 */}
      <TreatmentSlider en={treatmentIntro.en} title={treatmentIntro.title} description={treatmentIntro.description} slides={slides} />

      {/* ⑩ 공지사항 · 이벤트 */}
      <NewsSplit
        en={news.en}
        title={news.title}
        notices={notices.map(({ id, type, title, summary, coverImageUrl, createdAt }) => ({ id, type, title, summary, coverImageUrl, createdAt }))}
      />

      {/* ⑪ 병원 공간: 흘러가는 사진 */}
      <section className="overflow-hidden bg-ivory py-28 md:py-40">
        <div className={`${wide} grid items-end gap-8 md:grid-cols-10`}>
          <Reveal variant="zoom" className="md:col-span-5">
            <p className="font-display text-base tracking-[0.15em] text-gold md:text-lg">{clinic.en}</p>
            <h2 className="mt-5 font-serif text-[30px] leading-[1.3] font-medium tracking-[-0.04em] md:text-5xl md:leading-[1.3]">
              {clinic.title[0]}
              <br />
              {clinic.title[1]}
            </h2>
          </Reveal>
          <Reveal delay={150} className="md:col-span-3 md:col-start-8">
            <p className="text-[15px] leading-relaxed text-muted md:text-lg">{clinic.body}</p>
            <Link href="/about/tour" className="mt-6 inline-block border-b border-ink/30 pb-1 font-display text-xs tracking-[0.2em] hover:text-gold">
              VIEW MORE
            </Link>
          </Reveal>
        </div>
        <div className="mt-16 md:mt-24">
          <div className="animate-marquee flex w-max gap-6 hover:[animation-play-state:paused]">
            {[0, 1].map((set) =>
              images.clinic.map((src, i) => (
                <ImageSlot key={`${set}-${i}`} src={src} label="Clinic" className="aspect-[4/3] w-[280px] shrink-0 md:w-[440px]" />
              )),
            )}
          </div>
        </div>
      </section>

      {/* ⑬ 상담 문의 */}
      <ContactCta hospital={hospital} />

      {/* ⑫ 오시는 길 (아래 푸터와 배경이 이어짐) */}
      <HomeLocation hospital={hospital} />
    </>
  );
}
