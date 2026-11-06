// 가격표에서 쓰는 작은 규칙들 (PriceMatrix · 시술 페이지가 함께 씀)

const split = (s: string) =>
  s
    .split("·")
    .map((x) => x.trim())
    .filter(Boolean);

/**
 * 표에 빈칸('–')이 실제로 생기는지.
 * rowTokens: 시술별로 가진 칸 이름 목록 (PriceMatrix 가 쓰는 규칙으로 미리 나눈 것)
 * 빈칸이 없으면 '–' 설명을 띄우지 않는다.
 */
export const hasGap = (columns: string[], rowTokens: string[][]) =>
  rowTokens.some((have) => {
    const set = new Set(have);
    return columns.some((c) => !set.has(c));
  });

/**
 * 탭 가격만 남길 때 묶음 이름도 같이 좁힌다.
 * "실리프팅 (QTL실 · 잼버실)" + 다른 탭 ["잼버실"] → "실리프팅 (QTL실)"
 * 괄호 안에 다른 탭 이름이 없으면 그대로 둔다.
 */
export const narrowGroupName = (name: string, otherLabels: string[]) => {
  if (!otherLabels.some((o) => name.includes(o))) return name;
  const out = name
    .replace(/\(([^)]*)\)/, (_all, inner: string) => {
      const kept = split(inner).filter((s) => !otherLabels.includes(s));
      return kept.length ? `(${kept.join(" · ")})` : "";
    })
    .trim();
  return out || name;
};
