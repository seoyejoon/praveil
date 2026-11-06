// 가격표 규칙 확인 (실서버 가격 모양 그대로)
// 실행: npx tsx src/lib/price-table.test.ts
import { hasGap, narrowGroupName } from "./price-table";

const ok = (cond: boolean, msg: string) => {
  if (!cond) throw new Error(msg);
};

// 1. 보톡스 — 부위마다 세 제품 값이 다 있어 '–' 설명이 필요 없다
const botox = [
  ["뉴럭스", "코어톡스", "제오민"], // 표정주름
  ["뉴럭스", "코어톡스", "제오민"], // 턱
];
ok(!hasGap(["뉴럭스", "코어톡스", "제오민"], botox), "보톡스: 빈칸이 없어야 한다");

// 2. 필러 — 목주름은 뉴라미스 값이 없어 '–' 가 생긴다
const filler = [
  ["뉴라미스", "레스틸렌"], // 볼
  ["레스틸렌"], // 목주름
];
ok(hasGap(["뉴라미스", "레스틸렌"], filler), "필러: 빈칸이 있어야 한다");

// 3. 실리프팅 묶음 이름 좁히기
ok(
  narrowGroupName("실리프팅 (QTL실 · 잼버실)", ["잼버실"]) === "실리프팅 (QTL실)",
  "QTL 탭: 잼버실만 빠져야 한다",
);
ok(
  narrowGroupName("실리프팅 (QTL실 · 잼버실)", ["QTL실"]) === "실리프팅 (잼버실)",
  "잼버 탭: QTL실만 빠져야 한다",
);
// 괄호 안에 다른 탭 이름이 없으면 그대로
ok(
  narrowGroupName("특수부위 보톡스 (측두근 · 입꼬리 · 팔자)", ["바디 보톡스"]) ===
    "특수부위 보톡스 (측두근 · 입꼬리 · 팔자)",
  "관계없는 묶음 이름은 그대로 둔다",
);
// 괄호가 다른 탭 이름뿐이면 괄호째 뗀다 (남의 탭 이름이 제목에 남지 않게)
ok(
  narrowGroupName("실리프팅 (QTL실)", ["QTL실"]) === "실리프팅",
  "괄호가 다른 탭 이름뿐이면 괄호를 뗀다",
);
// 어떤 경우에도 제목이 비지 않는다
ok(narrowGroupName("(QTL실)", ["QTL실"]) === "(QTL실)", "제목이 비면 원래대로");

console.log("ok (7 cases)");
