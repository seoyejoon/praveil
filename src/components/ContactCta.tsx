import type { Hospital } from "@/lib/data";
import { contact, images } from "@/content/home";
import ImageSlot from "./ImageSlot";
import Reveal from "./Reveal";

// 페이지 하단 예약 안내 (어두운 배경)
export default function ContactCta({ hospital }: { hospital: Hospital }) {
  return (
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
  );
}
