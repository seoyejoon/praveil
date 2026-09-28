import Link from "next/link";
import type { Hospital } from "@/lib/data";

const icons = {
  talk: "M12 4C7 4 3 7.1 3 11c0 2.4 1.6 4.6 4 5.9L6 21l4.3-2.7c.6.1 1.1.1 1.7.1 5 0 9-3.1 9-7s-4-7-9-7Z",
  insta: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5.5-1.5h.01",
  calendar: "M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Zm0 4h16M8 3v4m8-4v4",
};

// 어두운 푸터: 로고 · 약관 링크 · 병원 정보 / 오른쪽 대표전화 · SNS
export default function Footer({ hospital }: { hospital: Hospital }) {
  const info = [
    hospital.name,
    `${hospital.address} ${hospital.addressDetail}`.trim(),
    `대표원장 ${hospital.director}`,
    `사업자등록번호 ${hospital.businessNumber}`,
  ];
  const sns = [
    { href: hospital.kakaoUrl, label: "카카오톡 상담", icon: icons.talk },
    { href: hospital.instagramUrl, label: "인스타그램", icon: icons.insta },
    { href: hospital.naverReservationUrl, label: "네이버 예약", icon: icons.calendar },
  ].filter((s) => s.href && s.href !== "#");

  return (
    <footer className="border-t border-white/8 bg-[#171412] pt-14 pb-24 text-sm text-cream/55 md:pt-16 md:pb-14">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 md:px-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <Link href="/" className="inline-block leading-none text-cream" aria-label="프라베일 맑고고운의원 홈">
            <span className="block font-display text-[26px] font-semibold tracking-[0.18em]">PRAVEIL</span>
            <span className="mt-1.5 block text-[11px] tracking-[0.3em] text-cream/60">맑고고운의원</span>
          </Link>

          <p className="mt-8 flex gap-6 text-[15px]">
            <Link href="/privacy" className="font-bold text-cream transition hover:text-gold">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="text-cream/85 transition hover:text-gold">
              이용약관
            </Link>
          </p>

          <p className="mt-5 flex flex-col gap-y-1 leading-relaxed sm:flex-row sm:flex-wrap sm:gap-x-2">
            {info.map((t, i) => (
              <span key={t} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden className="hidden sm:inline">·</span>}
                {t}
              </span>
            ))}
          </p>
          <p className="mt-6 text-xs text-cream/40">© {new Date().getFullYear()} PRAVEIL CLINIC. All rights reserved.</p>
        </div>

        <div className="lg:text-right">
          <a href={`tel:${hospital.phone}`} className="inline-flex items-baseline gap-3 text-cream transition hover:text-gold">
            <span className="text-sm text-cream/70">대표전화</span>
            <span className="text-[30px] font-bold tracking-wide md:text-[36px]">{hospital.phone}</span>
          </a>
          {sns.length > 0 && (
            <ul className="mt-5 flex gap-2.5 lg:justify-end">
              {sns.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    className="grid h-12 w-12 place-items-center rounded-xl bg-white/8 text-cream transition hover:bg-gold hover:text-white"
                  >
                    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d={s.icon} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
