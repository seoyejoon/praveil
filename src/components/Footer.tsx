import Link from "next/link";
import KakaoMap from "@/components/KakaoMap";
import { Clock, MapPin, Phone } from "lucide-react";
import Logo from "@/components/Logo";
import { mapApps } from "@/components/MapLinks";
import type { Hospital } from "@/lib/data";

// 오시는 길 + 푸터를 한 화면에 (검정). 왼쪽 지도, 오른쪽 주소 · 진료시간 · 전화, 맨 아래 병원 정보.
export default function Footer({ hospital }: { hospital: Hospital }) {
  const info: [string, string][] = [
    ["상호", hospital.name],
    ["대표원장", hospital.director],
    ["사업자등록번호", hospital.businessNumber],
    ["주소", `${hospital.address} ${hospital.addressDetail}`.trim()],
  ];

  return (
    <footer className="flex flex-col bg-espresso px-5 pt-20 pb-24 text-white md:px-10 md:pt-24 md:pb-8 lg:min-h-svh lg:pt-[112px]">
      <div className="mx-auto grid w-full max-w-[1600px] flex-1 gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
        <KakaoMap address={hospital.address} coords={hospital.coords} className="aspect-[4/3] rounded-[20px] bg-white/10 lg:aspect-auto lg:h-full lg:min-h-[420px] lg:rounded-[28px]" />

        {/* 오른쪽: 위아래 빈 곳 없이 이어서, 지도 높이 가운데에 */}
        <div className="flex flex-col justify-center gap-8">
          <div className="flex gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold/20 text-taupe">
              <MapPin className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <div>
              <p className="text-[22px] leading-snug font-semibold tracking-[-0.03em] md:text-[28px]">
                {hospital.address}
                <br />
                {hospital.addressDetail}
              </p>
              {hospital.directions[0] && <p className="mt-2 text-sm text-white/50">{hospital.directions[0].body}</p>}
            </div>
          </div>

          <div className="grid gap-8 border-t border-white/15 pt-8 sm:grid-cols-[1fr_auto]">
            <div className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold/20 text-taupe">
                <Clock className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <ul className="mt-1 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
                {hospital.hours.map((h) => (
                  <li key={h.label} className="col-span-2 grid grid-cols-subgrid">
                    <span className="whitespace-nowrap text-white/50">{h.label}</span>
                    <span className={`whitespace-nowrap ${h.closed ? "text-white/40" : ""}`}>
                      {h.time}
                      {h.note && <span className="ml-1.5 text-xs text-white/50">{h.note}</span>}
                    </span>
                  </li>
                ))}
                {hospital.lunch && (
                  <li className="col-span-2 grid grid-cols-subgrid">
                    <span className="text-white/50">점심시간</span>
                    <span>{hospital.lunch}</span>
                  </li>
                )}
              </ul>
            </div>
            <div className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold/20 text-taupe">
                <Phone className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <div>
              <a href={`tel:${hospital.phone}`} className="mt-1 block font-display text-[28px] leading-none font-light tracking-[0.02em] whitespace-nowrap xl:text-[34px]">
                {hospital.phone}
              </a>
              {hospital.hoursNotice && <p className="mt-3 text-xs text-white/45">{hospital.hoursNotice}</p>}
              </div>
            </div>
          </div>

          {/* 지도 앱 바로가기: 앱 아이콘 + 이름 */}
          <ul className="grid grid-cols-2 gap-2.5 border-t border-white/15 pt-8 sm:grid-cols-4">
            {mapApps(hospital.mapLinks, hospital.address, hospital.name).map((m) => (
              <li key={m.key}>
                <a
                  href={m.href}
                  target={m.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm text-black transition hover:bg-ivory"
                >
                  {m.icon}
                  {m.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-[1600px] flex-col gap-6 border-t border-white/15 pt-7 lg:mt-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:gap-12">
          <Link href="/" aria-label="프라베일 맑고고운의원 홈">
            <Logo className="h-6 w-auto" />
          </Link>
          <div>
            <p className="flex gap-5 text-[13px]">
              <Link href="/privacy" className="font-bold">
                개인정보처리방침
              </Link>
              <Link href="/terms" className="text-white/65 transition hover:text-white">
                이용약관
              </Link>
            </p>
            <dl className="mt-2 flex flex-col gap-1 text-xs text-white/45 md:flex-row md:flex-wrap md:gap-x-5">
              {info.map(([k, v]) => (
                <div key={k} className="flex gap-1.5">
                  <dt>{k}</dt>
                  <dd className="text-white/65">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <p className="font-display text-[11px] tracking-[0.2em] text-white/40 uppercase">© {new Date().getFullYear()} Praveil Clinic</p>
      </div>
    </footer>
  );
}
