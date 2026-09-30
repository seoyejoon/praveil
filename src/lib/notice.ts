import type { Notice } from "@/lib/data";

// 이벤트 기간 글("2026.10.01 ~ 2026.10.31")에서 마지막 날짜를 읽어 진행 상태를 정함
export function eventStatus(summary: string, today = new Date()) {
  const dates = [
    ...summary.matchAll(/(\d{4})[.\-/년\s]+(\d{1,2})[.\-/월\s]+(\d{1,2})/g),
  ];
  const last = dates.at(-1);
  if (!last) return null;
  const end = new Date(
    Number(last[1]),
    Number(last[2]) - 1,
    Number(last[3]),
    23,
    59,
    59,
  );
  return end.getTime() >= today.getTime() ? "진행 중" : "종료";
}

// 목록 카드에 쓸 대표 사진: 대표 이미지 → 본문 첫 이미지
export function coverOf(n: Notice) {
  if (n.coverImageUrl) return n.coverImageUrl;
  if (n.body.kind === "images") return n.body.images[0]?.url ?? "";
  if (n.body.kind === "doc") {
    const stack = [n.body.doc];
    while (stack.length) {
      const node = stack.shift()!;
      if (node.type === "image" && typeof node.attrs?.src === "string")
        return node.attrs.src;
      stack.push(...(node.content ?? []));
    }
  }
  return "";
}

export const formatDate = (d: string) => d.replaceAll("-", ".");
