import Link from "next/link";
import type { Doctor } from "@/lib/data";
import Reveal from "@/components/Reveal";

type Props = {
  doctor: Doctor;
  image: string;
  /** 누끼(배경 없는 PNG) 사진이면 true: 가장자리 흐림 없이 그대로 세운다 */
  cutout?: boolean;
  eyebrow: string;
  quote: readonly string[];
  description: string;
};

// 원장 인사말: 왼쪽 원장 사진, 오른쪽 인사말 · 이름 · VIEW MORE (약력은 병원소개 페이지에서)
export default function DoctorGreeting({ doctor, image, cutout = false, eyebrow, quote, description }: Props) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8f4ee_0%,#efe6da_100%)]">
      <div className="mx-auto grid max-w-[1200px] items-end gap-10 px-5 pt-24 md:grid-cols-2 md:gap-16 md:px-10 md:pt-20">
        <Reveal className="order-2 mx-auto w-full max-w-[460px] md:order-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={`${doctor.name} ${doctor.title}`}
            loading="lazy"
            className={`block w-full ${
              cutout
                ? "mx-auto h-[56vh] max-h-[520px] w-auto max-w-full object-contain md:h-[calc(100vh-200px)] md:max-h-[720px]"
                : "aspect-[4/5] object-cover [mask-image:radial-gradient(120%_90%_at_50%_30%,#000_55%,transparent_78%)]"
            }`}
          />
        </Reveal>

        <div className="order-1 pb-4 md:order-2 md:pb-28">
          <Reveal>
            <span aria-hidden className="block font-serif text-7xl leading-none text-taupe/70">&ldquo;</span>
            <p className="mt-2 font-serif text-[24px] leading-[1.5] font-medium tracking-[-0.03em] md:text-[34px]">
              {quote.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </Reveal>
          <Reveal delay={200} className="mt-12 md:mt-16">
            <p className="font-display text-sm tracking-[0.2em] text-mocha uppercase md:text-base">{eyebrow}</p>
            <p className="mt-4 text-xl md:text-[26px]">
              <strong className="font-semibold">{doctor.name}</strong>
              <span className="text-muted"> · {doctor.title}</span>
            </p>
            <p className="mt-5 text-[15px] leading-relaxed whitespace-pre-line text-muted md:text-base">{description}</p>
            <Link
              href="/about/doctor"
              className="mt-9 inline-flex items-center gap-3 border border-ink px-6 py-3.5 font-display text-sm tracking-[0.12em] transition hover:bg-ink hover:text-cream"
            >
              VIEW MORE <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>
      </div>

      {/* 오른쪽 아래 회전하는 원형 글자 */}
      <svg aria-hidden viewBox="0 0 200 200" className="absolute -right-16 -bottom-16 hidden h-64 w-64 animate-[ph-spin_30s_linear_infinite] text-mocha/60 md:block">
        <defs>
          <path id="doctor-circle" d="M100 100m-80 0a80 80 0 1 1 160 0a80 80 0 1 1-160 0" />
        </defs>
        <text className="font-display" fontSize="15" letterSpacing="5" fill="currentColor">
          <textPath href="#doctor-circle">PRAVEIL CLINIC · CLEAR &amp; GRACEFUL · PRAVEIL CLINIC ·</textPath>
        </text>
      </svg>
    </section>
  );
}
