import { ChevronDown } from "lucide-react";
import type { Procedure } from "@/lib/data";

// 비용 칸의 시술 한 개
// - 모든 줄에 메모(예: 1년 무제한 · 5회 패키지)가 있으면 메모별 소제목으로 묶음 (줄마다 반복하지 않게)
// - 줄이 많으면 앞의 몇 줄만 보이고 나머지는 '가격 전체 보기'로 펼침
const SHOW = 6;

type Row = Procedure["prices"][number];

export default function PriceCard({ p }: { p: Procedure }) {
  const rows = p.prices;
  const grouped =
    rows.every((r) => r.note) && new Set(rows.map((r) => r.note)).size > 1;
  const fold = rows.length > SHOW + 2;

  const line = (row: Row, i: number) => (
    <div key={`${row.label}-${row.note}`}>
      {grouped && row.note !== rows[i - 1]?.note && (
        <p
          className={`text-xs font-semibold tracking-[0.08em] text-gold ${i > 0 ? "mt-5" : ""} border-b border-line pb-2`}
        >
          {row.note}
        </p>
      )}
      <div className="flex items-baseline justify-between gap-4 border-t border-line py-3 first:border-t-0">
        <dt className="text-[15px] text-muted">
          {row.label}
          {!grouped && row.note && (
            <span className="ml-2 text-xs text-gold">{row.note}</span>
          )}
        </dt>
        <dd className="shrink-0 text-[17px] font-semibold tracking-[-0.02em]">
          {row.price}
        </dd>
      </div>
    </div>
  );

  return (
    <div className="rounded-[20px] bg-white p-6 md:p-8">
      <h3 className="text-lg font-semibold">{p.name}</h3>
      <dl className="mt-3">
        {(fold ? rows.slice(0, SHOW) : rows).map(line)}
        {fold && (
          <details className="group">
            <summary className="mt-2 flex cursor-pointer list-none items-center justify-center gap-1.5 rounded-full border border-line py-3 text-sm text-muted transition hover:border-gold hover:text-ink group-open:hidden [&::-webkit-details-marker]:hidden">
              가격 전체 보기 ({rows.length - SHOW}개 더)
              <ChevronDown className="h-4 w-4" strokeWidth={1.6} />
            </summary>
            {rows.slice(SHOW).map((row, k) => line(row, SHOW + k))}
          </details>
        )}
      </dl>
    </div>
  );
}
