import Link from "next/link";
import Container from "@/components/Container";
import DoctorProfile from "@/components/DoctorProfile";
import ImageSlot from "@/components/ImageSlot";
import LocationInfo from "@/components/LocationInfo";
import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";
import WhySlider from "@/components/home/WhySlider";
import { clinic, contact, hero, philosophy, story } from "@/content/home";
import {
  getCategories,
  getDoctor,
  getFeatures,
  getHospital,
  getSignatureProcedures,
} from "@/lib/data";

const wide = "mx-auto w-full max-w-[1440px] px-5 md:px-10";

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
      {/* 히어로: 한 화면 꽉 차게 (모바일은 하단 상담바 제외). 사진 확정 후 ImageSlot에 src 지정 */}
      <section className="relative h-[calc(100svh-3.5rem)] min-h-[560px] overflow-hidden bg-espresso text-white md:h-svh md:min-h-[680px]">
        <ImageSlot tone="dark" className="absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.35)_100%)]" />
        <div className="relative flex h-full flex-col items-center justify-center px-5 text-center">
          <p className="animate-rise font-display text-2xl tracking-[0.08em] text-[#ffd899] md:text-4xl">
            {hero.eyebrow}
          </p>
          <h1 className="animate-rise mt-5 font-serif text-[34px] leading-[1.3] font-medium tracking-[-0.04em] [animation-delay:150ms] md:mt-7 md:text-7xl md:leading-[1.25]">
            {hero.title[0]}
            <br />
            {hero.title[1]}
          </h1>
          <p className="animate-rise mt-6 text-[15px] leading-relaxed whitespace-pre-line text-cream [animation-delay:300ms] md:mt-8 md:text-xl">
            {hero.description}
          </p>
          <div className="animate-rise mt-10 flex gap-3 [animation-delay:450ms] md:mt-14">
            <Link
              href="/treatments"
              className="rounded-full border border-white/60 px-7 py-3 text-sm transition hover:bg-white hover:text-ink md:px-9 md:text-base"
            >
              시술 안내
            </Link>
            <a
              href={hospital.naverReservationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white px-7 py-3 text-sm text-ink transition hover:bg-[#ffd899] md:px-9 md:text-base"
            >
              예약하기
            </a>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-display text-[11px] tracking-[0.3em] text-cream/70 md:flex">
          SCROLL
          <span className="h-12 w-px bg-cream/60 [animation:scroll-line_2s_ease-in-out_infinite]" />
        </div>
      </section>

      {/* 철학: 3칸 카드 (어둠 / 밝음 / 어둠) */}
      <section className="grid md:grid-cols-3">
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

      {/* 스토리: 큰 문구 + 세로 사진 / 가로 사진 */}
      <section className="overflow-hidden bg-cream py-28 md:py-48">
        <div className={`${wide} grid gap-14 md:grid-cols-[68fr_76fr] md:gap-20 lg:gap-40`}>
          <Reveal className="md:pt-24">
            <ImageSlot label="Story" className="aspect-[680/1060]" />
          </Reveal>
          <div className="flex flex-col">
            <Reveal>
              <p className="font-display text-base tracking-[0.15em] text-gold md:text-lg">{story.en}</p>
              <h2 className="mt-5 font-serif text-[34px] leading-[1.25] font-medium tracking-[-0.04em] md:text-6xl md:leading-[1.2]">
                {story.title[0]}
                <br />
                {story.title[1]}
              </h2>
              <p className="mt-8 text-[15px] leading-[1.8] text-muted md:text-lg">
                {story.body.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </Reveal>
            <Reveal delay={150} className="mt-14 md:mt-auto">
              <ImageSlot label="Story" className="aspect-[760/420]" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 대표 시술 */}
      <section className="bg-ivory py-28 md:py-40">
        <div className={wide}>
          <SectionTitle en="Signature" title="프라베일 대표 시술" description="가장 많이 찾으시는 네 가지 시술입니다." />
          <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {signatures.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 120}>
                <Link href={`/treatments/${p.categorySlug}/${p.slug}`} className="group block">
                  <div className="overflow-hidden">
                    <ImageSlot
                      label={`0${i + 1}`}
                      tone={i % 2 ? "light" : "dark"}
                      className="aspect-[3/4] transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-6 text-sm text-mocha">{categoryName(p.categorySlug)}</p>
                  <p className="mt-1 font-serif text-2xl font-medium">{p.name}</p>
                  <p className="mt-4 inline-block border-b border-ink/30 pb-1 font-display text-xs tracking-[0.2em] transition group-hover:border-gold group-hover:text-gold">
                    VIEW MORE
                  </p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 왜 프라베일 */}
      <section className="bg-cream py-28 md:py-40">
        <div className={wide}>
          <SectionTitle
            en="Why Praveil"
            title={
              <>
                많이 하는 병원이 아닌,
                <br />
                잘 맞추는 병원.
              </>
            }
          />
          <Reveal>
            <WhySlider features={features} />
          </Reveal>
        </div>
      </section>

      {/* 원장 */}
      <section>
        <DoctorProfile doctor={doctor} />
      </section>

      {/* 시술 안내 */}
      <section className="bg-cream py-28 md:py-40">
        <div className={wide}>
          <SectionTitle en="Treatments" title="시술 안내" />
          <ul className="grid border-t border-ink/20 md:grid-cols-2 md:gap-x-20">
            {categories.map((c) => (
              <li key={c.slug} className="border-b border-ink/20">
                <Link href={`/treatments/${c.slug}`} className="group flex items-center gap-4 py-6 md:py-7">
                  <span className="w-40 shrink-0 font-display text-sm tracking-[0.15em] text-gold md:w-48 md:text-base">
                    {c.nameEn.toUpperCase()}
                  </span>
                  <span className="flex-1 font-serif text-lg font-medium md:text-xl">{c.name}</span>
                  <span aria-hidden className="text-taupe transition group-hover:translate-x-1 group-hover:text-ink">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 시설: 흘러가는 사진 */}
      <section className="overflow-hidden bg-ivory py-28 md:py-40">
        <div className={`${wide} grid items-end gap-8 md:grid-cols-10`}>
          <Reveal className="md:col-span-5">
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
              Array.from({ length: 6 }).map((_, i) => (
                <ImageSlot
                  key={`${set}-${i}`}
                  label="Clinic"
                  tone={i % 3 === 1 ? "dark" : "light"}
                  className="aspect-[4/3] w-[280px] shrink-0 md:w-[440px]"
                />
              )),
            )}
          </div>
        </div>
      </section>

      {/* 진료시간 · 오시는 길 */}
      <section className="bg-cream py-28 md:py-40">
        <Container>
          <SectionTitle en="Hours & Location" title="진료시간 · 오시는 길" />
          <Reveal>
            <LocationInfo hospital={hospital} />
          </Reveal>
        </Container>
      </section>

      {/* 예약 안내 */}
      <section className="relative grid min-h-[500px] place-items-center overflow-hidden px-5 py-28 text-center text-white md:min-h-[640px]">
        <ImageSlot tone="dark" className="absolute inset-0" />
        <Reveal className="relative">
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
