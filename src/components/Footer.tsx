import Link from "next/link";
import type { Hospital } from "@/lib/data";

// 밝은 푸터: 로고 / 병원 정보(항목 · 내용) / 저작권. 메인에서는 위 '오시는 길'과 배경이 이어진다.
export default function Footer({ hospital }: { hospital: Hospital }) {
  const rows: [string, string][][] = [
    [
      ["대표원장", hospital.director],
      ["연락처", hospital.phone],
      ["사업자등록번호", hospital.businessNumber],
    ],
    [["주소", `${hospital.address} ${hospital.addressDetail}`]],
  ];

  return (
    <footer className="bg-ivory pt-12 pb-24 text-sm text-muted md:pt-16 md:pb-14">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="border-t border-mocha/40 pt-10 md:pt-12">
          <div className="grid gap-8 md:grid-cols-[auto_1fr_auto] md:items-end md:gap-16">
            <Link href="/" className="leading-none text-ink" aria-label="프라베일 맑고고운의원 홈">
              <span className="block font-display text-[28px] tracking-[0.18em]">PRAVEIL</span>
              <span className="mt-1.5 block text-[11px] tracking-[0.3em] text-muted">맑고고운의원</span>
            </Link>

            <div className="space-y-1.5">
              <p className="font-medium text-ink/80">{hospital.name}</p>
              {rows.map((row, r) => (
                <p key={r} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {row.map(([label, value], i) => (
                    <span key={label} className="flex items-center gap-3">
                      {i > 0 && <span aria-hidden className="hidden h-2.5 w-px bg-ink/20 sm:block" />}
                      <span>
                        <span className="mr-2 text-taupe">{label}</span>
                        {value}
                      </span>
                    </span>
                  ))}
                </p>
              ))}
            </div>

            <div className="text-xs leading-relaxed text-taupe md:text-right">
              <p className="flex gap-4 md:justify-end">
                <Link href="/terms" className="hover:text-ink">
                  이용약관
                </Link>
                <Link href="/privacy" className="font-semibold text-ink/80 hover:text-ink">
                  개인정보처리방침
                </Link>
              </p>
              <p className="mt-3">© {new Date().getFullYear()} PRAVEIL CLINIC. ALL RIGHTS RESERVED.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
