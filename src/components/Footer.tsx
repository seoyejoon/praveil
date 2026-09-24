import Link from "next/link";
import type { Hospital } from "@/lib/data";

export default function Footer({ hospital }: { hospital: Hospital }) {
  return (
    <footer className="bg-espresso pt-16 pb-24 text-sm text-cream/60 md:pt-20 md:pb-16">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 md:grid-cols-3 md:px-10">
        <div>
          <p className="font-display text-3xl tracking-[0.18em] text-cream">PRAVEIL</p>
          <p className="mt-2 text-xs tracking-[0.3em]">맑고고운의원</p>
        </div>

        <div>
          <p className="font-display text-xs tracking-[0.2em] text-[#ffd899]">RESERVATION</p>
          <a href={`tel:${hospital.phone}`} className="mt-3 block font-serif text-2xl text-cream">
            {hospital.phone}
          </a>
          <ul className="mt-5 space-y-1.5 text-[13px]">
            {hospital.hours.map((h) => (
              <li key={h.label} className="flex gap-4">
                <span className="w-28 shrink-0">{h.label}</span>
                <span className="text-cream/80">
                  {h.time}
                  {h.note && ` (${h.note})`}
                </span>
              </li>
            ))}
            <li className="flex gap-4">
              <span className="w-28 shrink-0">점심시간</span>
              <span className="text-cream/80">{hospital.lunch}</span>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-display text-xs tracking-[0.2em] text-[#ffd899]">LOCATION</p>
          <p className="mt-3 leading-relaxed text-cream/80">
            {hospital.address}
            <br />
            {hospital.addressDetail}
          </p>
          <Link href="/location" className="mt-3 inline-block border-b border-cream/30 pb-0.5 text-xs hover:text-cream">
            오시는 길 보기
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-[1440px] border-t border-cream/10 px-5 pt-8 text-xs leading-relaxed md:px-10">
        <p>
          <span className="mr-4">대표원장 {hospital.director}</span>
          <span className="mr-4">사업자등록번호 {hospital.businessNumber}</span>
          <span>대표전화 {hospital.phone}</span>
        </p>
        <p className="mt-2">주소 {hospital.address} {hospital.addressDetail}</p>
        <p className="mt-6 text-cream/40">© {new Date().getFullYear()} {hospital.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
