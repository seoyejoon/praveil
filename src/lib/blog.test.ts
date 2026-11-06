// 블로그 제목에서 옛 상호(뉴리즈)를 떼는 규칙 확인
// 실행: npx tsx src/lib/blog.test.ts
import { cleanTitle } from "./blog";

const cases: [string, string][] = [
  [
    "구월동 피부과 울트라콜, 콜라겐부스터(feat.포텐자 펌핑팁) 뉴리즈의원 인천",
    "구월동 피부과 울트라콜, 콜라겐부스터(feat.포텐자 펌핑팁)",
  ],
  ["인천 쿨소닉 리프팅, 울쎄라와 어떤 점이 비슷할까요? - 뉴리즈의원 인천점", "인천 쿨소닉 리프팅, 울쎄라와 어떤 점이 비슷할까요?"],
  ["구월동 피부과 | 리쥬란 후기 뉴리즈", "구월동 피부과 | 리쥬란 후기".split("|")[1].trim()],
  // 옛 상호가 없으면 그대로
  ["20대, 벌써 목주름이? 목주름 원인부터 개선 방법까지 정리", "20대, 벌써 목주름이? 목주름 원인부터 개선 방법까지 정리"],
  // 제목이 상호뿐이면 지우지 않는다 (빈 제목 방지)
  ["뉴리즈의원 인천", "뉴리즈의원 인천"],
  // 문장 가운데의 '뉴리즈'는 건드리지 않는다
  ["뉴리즈의원 인천점 병원명 변경 안내", "뉴리즈의원 인천점 병원명 변경 안내"],
];

for (const [input, want] of cases) {
  const got = cleanTitle(input);
  if (got !== want)
    throw new Error(`cleanTitle(${JSON.stringify(input)})\n  = ${JSON.stringify(got)}\n  want ${JSON.stringify(want)}`);
}
console.log(`ok (${cases.length} cases)`);
