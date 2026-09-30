import Link from "next/link";
import { CalendarCheck, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Hospital } from "@/lib/data";

// 페이지 끝 상담 안내 (지도 · 진료시간 · 전화는 바로 아래 푸터에)
export default function ConsultCta({
  hospital,
  title,
  strong = "대표원장과 먼저 상담하세요.",
  id,
}: {
  hospital: Hospital;
  /** 첫 줄 (예: 나에게 맞는 필러,) */
  title: string;
  strong?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-36 px-3 pb-16 md:scroll-mt-44 md:px-6 md:pb-24"
    >
      <div className="relative mx-auto max-w-[1560px] overflow-hidden rounded-[28px] bg-espresso px-6 py-16 text-white md:rounded-[40px] md:px-16 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_85%_20%,rgba(168,142,106,0.35),transparent_70%)]" />
        <div className="relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-display text-xs tracking-[0.35em] text-taupe uppercase">
              Consulting
            </p>
            <h2 className="mt-4 text-[26px] leading-snug font-light tracking-[-0.03em] md:text-[40px]">
              {title}
              <br />
              <span className="font-semibold">{strong}</span>
            </h2>
            <Link
              href="/location"
              className="mt-6 flex items-start gap-2 text-sm leading-relaxed text-white/60 transition hover:text-white"
            >
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-taupe"
                strokeWidth={1.6}
              />
              <span>
                {hospital.address} {hospital.addressDetail}
              </span>
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={`tel:${hospital.phone}`}
              className="flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm text-ink transition hover:bg-ivory"
            >
              <Phone className="h-4 w-4" strokeWidth={1.6} />
              {hospital.phone}
            </a>
            <a
              href={hospital.kakaoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm transition hover:border-white"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.6} />
              카카오톡 상담
            </a>
            <a
              href={hospital.naverReservationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm transition hover:bg-mocha"
            >
              <CalendarCheck className="h-4 w-4" strokeWidth={1.6} />
              네이버 예약
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
