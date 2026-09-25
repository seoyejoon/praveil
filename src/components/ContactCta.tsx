import type { Hospital } from "@/lib/data";
import { contact, images } from "@/content/home";
import ImageSlot from "./ImageSlot";
import Reveal from "./Reveal";

// 상담 문의 (사진 배경). 아래에 오시는 길 · 푸터가 이어진다.
export default function ContactCta({ hospital }: { hospital: Hospital }) {
  const kakao = hospital.kakaoUrl && hospital.kakaoUrl !== "#" ? hospital.kakaoUrl : null;
  const btn = "inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm transition md:text-[15px]";

  return (
    <section className="relative grid min-h-[480px] place-items-center overflow-hidden px-5 py-24 text-center text-white md:min-h-[560px]">
      <ImageSlot src={images.contact} tone="dark" className="absolute inset-0" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(31,27,24,0.75)_0%,rgba(31,27,24,0.45)_100%)]" />
      <Reveal variant="zoom" className="relative">
        <p className="font-display text-base tracking-[0.12em] text-[#ffd899] md:text-lg">( {contact.en} )</p>
        <h2 className="mt-4 font-serif text-[30px] font-medium tracking-[-0.04em] md:text-5xl">{contact.title}</h2>
        <p className="mt-5 text-[15px] text-cream/80 md:text-lg">{contact.body}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {kakao && (
            <a href={kakao} target="_blank" rel="noopener noreferrer" className={`${btn} bg-[#fee500] text-[#191919] hover:brightness-95`}>
              <svg width="18" height="17" viewBox="0 0 18 17" aria-hidden>
                <path fill="currentColor" d="M9 0C4 0 0 3.1 0 7c0 2.5 1.7 4.7 4.2 6L3.3 16.3c-.1.3.3.6.5.4L7.8 14c.4 0 .8.1 1.2.1 5 0 9-3.1 9-7S14 0 9 0Z" />
              </svg>
              카카오톡 채널
            </a>
          )}
          <a href={`tel:${hospital.phone}`} className={`${btn} bg-[#1f1b18] text-white hover:bg-black`}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8Z" />
            </svg>
            {hospital.phone}
          </a>
          <a href={hospital.naverReservationUrl} target="_blank" rel="noopener noreferrer" className={`${btn} bg-white text-ink hover:bg-[#ffd899]`}>
            네이버 예약하기
          </a>
        </div>
      </Reveal>
    </section>
  );
}
