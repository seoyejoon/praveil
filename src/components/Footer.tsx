import Link from "next/link";
import Logo from "@/components/Logo";
import { sitemap } from "@/content/sitemap";
import type { Hospital } from "@/lib/data";

// 검정 푸터 (2026.10 리뉴얼): 세로형 로고 · 전체 메뉴 · 병원 정보 · 대표전화
export default function Footer({ hospital }: { hospital: Hospital }) {
  const info: [string, string][] = [
    ["상호", hospital.name],
    ["대표원장", hospital.director],
    ["사업자등록번호", hospital.businessNumber],
    ["주소", `${hospital.address} ${hospital.addressDetail}`.trim()],
  ];

  return (
    <footer className="bg-black px-5 pt-20 pb-28 text-white md:px-10 md:pt-28 md:pb-12">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-14 lg:grid-cols-[1fr_2fr]">
          <div>
            <Link href="/" aria-label="프라베일 맑고고운의원 홈" className="inline-block">
              <Logo variant="stacked" className="h-[72px] w-auto md:h-[96px]" />
            </Link>
            <a href={`tel:${hospital.phone}`} className="mt-12 block font-display text-[34px] leading-none font-light tracking-[0.03em] md:text-[44px]">
              {hospital.phone}
            </a>
            <p className="mt-3 text-sm text-white/50">대표전화 · 진료시간 내 상담 가능</p>
          </div>

          <nav aria-label="사이트맵" className="hidden grid-cols-4 gap-x-8 gap-y-10 md:grid">
            {sitemap.map((s) => (
              <div key={s.key}>
                <p className="font-display text-xs tracking-[0.3em] text-white/40 uppercase">{s.en}</p>
                <ul className="mt-4 space-y-2.5">
                  {s.pages.map((p) => (
                    <li key={p.href}>
                      <Link href={p.href} className="text-sm text-white/75 transition hover:text-white">
                        {p.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-20 flex flex-col gap-8 border-t border-white/15 pt-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="flex gap-6 text-sm">
              <Link href="/privacy" className="font-bold text-white">
                개인정보처리방침
              </Link>
              <Link href="/terms" className="text-white/70 transition hover:text-white">
                이용약관
              </Link>
            </p>
            <dl className="mt-5 flex flex-col gap-1.5 text-[13px] text-white/45 md:flex-row md:flex-wrap md:gap-x-6">
              {info.map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <dt>{k}</dt>
                  <dd className="text-white/70">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="font-display text-xs tracking-[0.2em] text-white/40 uppercase">© {new Date().getFullYear()} Praveil Clinic</p>
        </div>
      </div>
    </footer>
  );
}
