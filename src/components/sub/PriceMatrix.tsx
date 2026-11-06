import type { Procedure } from "@/lib/data";

// 부위 × 제품 가격표 (필러 · 보톡스처럼 부위마다 같은 제품 가격이 반복될 때 한 표로)
// - 줄 이름에서 '1cc' 같은 단위를 빼고, '벨로테로 · 레스틸렌'처럼 묶인 줄은 두 칸에 같은 가격
// - 표에 맞지 않는 시술(다른 이름이 섞인 줄)은 rest 로 돌려줘 기존 카드로 보여 줌
const clean = (label: string) => label.replace(/\s*\d+\s*cc\s*$/i, "").trim();
const parts = (label: string) => clean(label).split(/\s*·\s*/);
// 용량 · 횟수는 제품 이름이 아니다. "100U · 뉴럭스"는 '100U 짜리 뉴럭스' 한 줄이지,
// 같은 가격의 두 제품(예: "벨로테로 · 레스틸렌")이 아니므로 표로 묶으면 값이 섞인다.
const isUnit = (name: string) =>
  /^\d+(\.\d+)?\s*(U|cc|ml|mg|샷|회|줄|부위)$/i.test(name);

export function splitForMatrix(procedures: Procedure[]) {
  // 두 개 이상의 시술에 나오는 이름만 '제품'으로 봄
  const count = new Map<string, number>();
  for (const p of procedures) {
    const names = new Set(p.prices.flatMap((r) => parts(r.label)));
    names.forEach((n) => count.set(n, (count.get(n) ?? 0) + 1));
  }
  const known = new Set(
    [...count].filter(([, n]) => n >= 2).map(([name]) => name),
  );
  const fits = (p: Procedure) =>
    p.prices.length > 0 &&
    p.prices.every(
      (r) =>
        !r.note &&
        parts(r.label).every((x) => known.has(x) && !isUnit(x)),
    );
  const matrix = procedures.filter(fits);
  if (matrix.length < 3) return { matrix: [], rest: procedures };
  // 칸이 하나뿐이면 표가 아니라 그냥 목록이므로 카드로 보여 준다
  const cols = new Set(
    matrix.flatMap((p) => p.prices.flatMap((r) => parts(r.label))),
  );
  if (cols.size < 2) return { matrix: [], rest: procedures };
  return { matrix, rest: procedures.filter((p) => !fits(p)) };
}

export default function PriceMatrix({
  procedures,
}: {
  procedures: Procedure[];
}) {
  // 제품 순서: 처음 나온 순서대로
  const columns: string[] = [];
  for (const p of procedures)
    for (const r of p.prices)
      for (const x of parts(r.label)) if (!columns.includes(x)) columns.push(x);
  const unit = procedures.some((p) =>
    p.prices.some((r) => /cc\s*$/i.test(r.label)),
  );

  return (
    <div className="min-w-0">
      <div className="no-scrollbar -mx-6 overflow-x-auto overscroll-x-contain px-6 md:mx-0 md:px-0">
        <table className="w-full min-w-[640px] border-separate border-spacing-0 overflow-hidden rounded-[20px] bg-white text-left">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-espresso px-5 py-4 text-[13px] font-medium text-white/70 md:px-7">
                부위
              </th>
              {columns.map((c) => (
                <th
                  key={c}
                  className="bg-espresso px-4 py-4 text-center text-[14px] font-semibold text-white md:text-[15px]"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {procedures.map((p) => {
              const cell = new Map<string, string>();
              for (const r of p.prices)
                for (const x of parts(r.label)) cell.set(x, r.price);
              return (
                <tr key={p.slug} className="group">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 border-t border-line bg-white px-5 py-4 text-[15px] font-semibold whitespace-nowrap group-hover:bg-ivory md:px-7"
                  >
                    {p.name}
                  </th>
                  {columns.map((c) => (
                    <td
                      key={c}
                      className={`border-t border-line px-4 py-4 text-center text-[15px] tracking-[-0.02em] whitespace-nowrap group-hover:bg-ivory ${cell.has(c) ? "font-medium text-ink" : "text-ink/25"}`}
                    >
                      {cell.get(c) ?? "–"}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">
        {unit ? "부위에 따라 1cc 기준 · " : ""}– 표시는 가격표에 없는
        구성입니다. 모바일에서는 옆으로 밀어 볼 수 있습니다.
      </p>
    </div>
  );
}
