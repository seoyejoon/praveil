import Link from "next/link";
import Container from "@/components/Container";
import DoctorProfile from "@/components/DoctorProfile";
import ImageSlot from "@/components/ImageSlot";
import LocationInfo from "@/components/LocationInfo";
import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";
import BigLetters from "@/components/home/BigLetters";
import Hero from "@/components/home/Hero";
import Program from "@/components/home/Program";
import ScrollStatement from "@/components/home/ScrollStatement";
import Stats from "@/components/home/Stats";
import TreatmentIndex from "@/components/home/TreatmentIndex";
import WhyHorizontal from "@/components/home/WhyHorizontal";
import {
  bigLetters,
  clinic,
  contact,
  hero,
  images,
  philosophy,
  programs,
  statement,
  stats,
} from "@/content/home";
import {
  getCategories,
  getDoctor,
  getFeatures,
  getHospital,
  getNotices,
  getSignatureProcedures,
} from "@/lib/data";

const wide = "mx-auto w-full max-w-[1440px] px-5 md:px-10";

export default async function Home() {
  const [hospital, doctor, features, categories, signatures, notices] = await Promise.all([
    getHospital(),
    getDoctor(),
    getFeatures(),
    getCategories(),
    getSignatureProcedures(),
    getNotices(),
  ]);

  const programItems = signatures.map((p, i) => ({
    href: `/treatments/${p.categorySlug}/${p.slug}`,
    name: p.name,
    category: categories.find((c) => c.slug === p.categorySlug)?.name ?? "",
    image: images.signature[i],
    description: programs[p.slug]?.description ?? "",
    tags: programs[p.slug]?.tags ?? [],
  }));

  return (
    <>
      {/* 첫 화면은 제자리에 두고, 다음 섹션이 둥근 모서리로 위를 덮으며 올라온다 */}
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

        {/* 브랜드 문장: 스크롤에 맞춰 한 단어씩 칠해짐 */}
        <section className="relative z-10 rounded-t-[28px] bg-cream py-28 md:rounded-t-[56px] md:py-48">
          <ScrollStatement en={statement.en} text={statement.text} />
        </section>
      </div>

      {/* 철학: 3칸 카드 */}
      <section className="relative z-10 grid md:grid-cols-3">
        {philosophy.map((p, i) => (
          <Reveal
            key={p.en}
            delay={i * 120}
            className={`flex min-h-[300px] flex-col p-8 md:min-h-[420px] md:p-12 lg:p-16 ${
              p.tone === "dark"
                ? "bg-[linear-gradient(97deg,#342f2a_0%,#4a433c_42%,#5a5148_63%,#39342f_100%)] text-white"
                : "bg-[linear-gradient(84deg,#d6caba_0%,#f1ebe1_46%,#e7ded1_68%,#cdbead_100%)] text-ink"
            }`}
          >
            <span
              aria-hidden
              className={`block h-20 w-20 rounded-full border md:h-28 md:w-28 ${
                p.tone === "dark" ? "border-[#ffd899]/50" : "border-ink/30"
              }`}
            />
            <div className="mt-auto pt-10">
              <p className={`font-display text-sm tracking-[0.2em] ${p.tone === "dark" ? "text-[#ffd899]" : "text-mocha"}`}>
                {p.en}
              </p>
              <p className="mt-3 font-serif text-2xl font-medium tracking-tight md:text-[28px]">{p.title}</p>
              <p className={`mt-3 text-[15px] ${p.tone === "dark" ? "text-cream/70" : "text-muted"}`}>{p.body}</p>
            </div>
          </Reveal>
        ))}
      </section>

      {/* 숫자로 보는 프라베일 */}
      <section className="bg-ivory py-28 md:py-40">
        <div className={wide}>
          <SectionTitle en="Praveil in Numbers" title="숫자로 보는 프라베일" />
          <Stats items={stats} />
        </div>
      </section>

      {/* 대표 시술 프로그램 (어두운 배경, PC는 화면 고정) */}
      <Program items={programItems} />

      {/* 강점: PC는 화면 고정 후 옆으로 */}
      <WhyHorizontal
        features={features}
        images={images.why}
        heading={
          <Reveal variant="zoom">
            <p className="font-display text-base tracking-[0.15em] text-gold md:text-lg">Why Praveil</p>
            <h2 className="mt-4 font-serif text-[28px] leading-snug font-medium tracking-tight md:mt-5 md:text-[44px] md:leading-tight">
              많이 하는 병원이 아닌,
              <br />
              잘 맞추는 병원.
            </h2>
          </Reveal>
        }
      />

      {/* 큰 문구: 한 글자씩 */}
      <section className="bg-ivory">
        <BigLetters text={bigLetters.text} caption={bigLetters.caption} />
      </section>

      {/* 원장 */}
      <section>
        <DoctorProfile doctor={doctor} />
      </section>

      {/* 시술 안내: 마우스를 올리면 사진 */}
      <section className="bg-cream py-28 md:py-40">
        <div className={wide}>
          <SectionTitle en="Treatments" title="시술 안내" description="11개 분야, 54가지 시술을 진행합니다." />
          <TreatmentIndex categories={categories} images={images.categories} />
          <div className="mt-12 text-center">
            <Link
              href="/treatments"
              className="inline-block rounded-full border border-ink/40 px-8 py-3 text-sm transition hover:bg-ink hover:text-cream"
            >
              전체 시술 보기
            </Link>
          </div>
        </div>
      </section>

      {/* 공지 · 이벤트 */}
      <section className="bg-ivory py-28 md:py-40">
        <div className={wide}>
          <div className="flex items-end justify-between gap-6">
            <Reveal variant="zoom">
              <p className="font-display text-base tracking-[0.15em] text-gold md:text-lg">News</p>
              <h2 className="mt-4 font-serif text-[28px] font-medium tracking-tight md:text-[44px]">공지 · 이벤트</h2>
            </Reveal>
            <Link href="/notice" className="border-b border-ink/30 pb-1 font-display text-xs tracking-[0.2em] hover:text-gold">
              VIEW MORE
            </Link>
          </div>
          <ul className="mt-12 grid gap-6 md:mt-16 md:grid-cols-3">
            {notices.slice(0, 3).map((n, i) => (
              <Reveal as="li" key={n.id} delay={i * 120}>
                <Link
                  href={`/notice/${n.id}`}
                  className="group flex h-full min-h-[220px] flex-col border-t border-ink pt-6 transition hover:border-gold"
                >
                  <span className="text-xs text-mocha">{n.type === "event" ? "이벤트" : "공지"}</span>
                  <span className="mt-4 font-serif text-xl leading-snug font-medium group-hover:text-mocha md:text-2xl">
                    {n.title}
                  </span>
                  <span className="mt-auto pt-8 font-display text-xs tracking-widest text-taupe">{n.createdAt}</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 시설: 흘러가는 사진 */}
      <section className="overflow-hidden bg-cream py-28 md:py-40">
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
            <Link href="/about" className="mt-6 inline-block border-b border-ink/30 pb-1 font-display text-xs tracking-[0.2em] hover:text-gold">
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

      {/* 진료시간 · 오시는 길 */}
      <section className="bg-ivory py-28 md:py-40">
        <Container>
          <SectionTitle en="Hours & Location" title="진료시간 · 오시는 길" />
          <Reveal>
            <LocationInfo hospital={hospital} />
          </Reveal>
        </Container>
      </section>

      {/* 예약 안내 */}
      <section className="relative grid min-h-[500px] place-items-center overflow-hidden px-5 py-28 text-center text-white md:min-h-[640px]">
        <ImageSlot src={images.contact} tone="dark" className="absolute inset-0" />
        <div className="absolute inset-0 bg-[#1f1b18]/55" />
        <Reveal variant="zoom" className="relative">
          <p className="font-display text-base tracking-[0.15em] text-[#ffd899] md:text-lg">{contact.en}</p>
          <h2 className="mt-5 font-serif text-[28px] leading-snug font-medium tracking-[-0.04em] md:text-5xl">{contact.title}</h2>
          <p className="mt-5 text-[15px] text-cream/80 md:text-lg">{contact.body}</p>
          <div className="mt-10 flex justify-center gap-3">
            <a
              href={hospital.naverReservationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white px-8 py-3.5 text-sm text-ink transition hover:bg-[#ffd899] md:text-base"
            >
              네이버 예약하기
            </a>
            <a
              href={`tel:${hospital.phone}`}
              className="rounded-full border border-white/60 px-8 py-3.5 text-sm transition hover:bg-white hover:text-ink md:text-base"
            >
              전화 문의
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
