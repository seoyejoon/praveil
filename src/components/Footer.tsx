import Link from "next/link";
import KakaoMap from "@/components/KakaoMap";
import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import type { ReactNode } from "react";
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
    <footer className="flex flex-col bg-espresso px-5 pt-20 pb-28 text-white md:px-10 md:pt-24 lg:pb-8 lg:min-h-svh lg:pt-[112px]">
      <div className="mx-auto grid w-full max-w-[1600px] flex-1 gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
        <KakaoMap
          address={hospital.address}
          coords={hospital.coords}
          className="aspect-[4/3] rounded-[20px] bg-white/10 lg:aspect-auto lg:h-full lg:min-h-[420px] lg:rounded-[28px]"
        />

        {/* 오른쪽: 항목마다 한 줄 (왼쪽 이름 · 오른쪽 내용), 지도 높이 가운데에 */}
        <dl className="flex flex-col justify-center">
          <Row
            icon={<MapPin className="h-4 w-4" strokeWidth={1.6} />}
            label="주소"
            first
          >
            <p className="text-[20px] leading-snug font-semibold tracking-[-0.03em] md:text-[24px]">
              {hospital.address} <br className="hidden sm:block" />
              {hospital.addressDetail}
            </p>
            {hospital.directions[0] && (
              <p className="mt-2 text-sm text-white/50">
                {hospital.directions[0].body}
              </p>
            )}
          </Row>

          <Row
            icon={<Clock className="h-4 w-4" strokeWidth={1.6} />}
            label="진료시간"
          >
            <ul className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
              {hospital.hours.map((h) => (
                <li key={h.label} className="col-span-2 grid grid-cols-subgrid">
                  <span className="whitespace-nowrap text-white/50">
                    {h.label}
                  </span>
                  <span
                    className={`whitespace-nowrap ${h.closed ? "text-white/40" : ""}`}
                  >
                    {h.time}
                    {h.note && (
                      <span className="ml-1.5 text-xs text-white/50">
                        {h.note}
                      </span>
                    )}
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
          </Row>

          <Row
            icon={<Phone className="h-4 w-4" strokeWidth={1.6} />}
            label="전화"
          >
            <a
              href={`tel:${hospital.phone}`}
              className="block font-display text-[28px] leading-none font-light tracking-[0.02em] whitespace-nowrap xl:text-[32px]"
            >
              {hospital.phone}
            </a>
            {hospital.hoursNotice && (
              <p className="mt-2.5 text-xs text-white/45">
                {hospital.hoursNotice}
              </p>
            )}
          </Row>

          {/* 지도 앱 바로가기: 앱 아이콘 + 이름 */}
          <Row
            icon={<Navigation className="h-4 w-4" strokeWidth={1.6} />}
            label="길찾기"
          >
            <ul className="grid grid-cols-2 gap-2 2xl:grid-cols-4">
              {mapApps(hospital.mapLinks, hospital.address, hospital.name).map(
                (m) => (
                  <li key={m.key}>
                    <a
                      href={m.href}
                      target={m.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-full bg-white px-3 py-2.5 text-[13px] whitespace-nowrap text-black transition hover:bg-ivory"
                    >
                      {m.icon}
                      {m.label}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </Row>
        </dl>
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
              <Link
                href="/terms"
                className="text-white/65 transition hover:text-white"
              >
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
        <p className="font-display text-[11px] tracking-[0.2em] text-white/40 uppercase">
          © {new Date().getFullYear()} Praveil Clinic
        </p>
      </div>
    </footer>
  );
}

// 오른쪽 한 줄: 왼쪽 아이콘 + 이름, 오른쪽 내용 (모바일은 위아래로)
function Row({
  icon,
  label,
  first,
  children,
}: {
  icon: ReactNode;
  label: string;
  first?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`grid gap-3 py-6 sm:grid-cols-[132px_1fr] sm:gap-6 lg:py-7 ${first ? "pt-0 lg:pt-0" : "border-t border-white/12"}`}
    >
      <dt className="flex items-center gap-2.5 self-start text-sm text-white/60 sm:pt-1">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold/20 text-taupe">
          {icon}
        </span>
        {label}
      </dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}
