// 시술 상세 원고를 원장님 검수용 문서(docs/procedure-review.md)로 내보낸다.
// 실행: npx tsx scripts/export-procedure-review.ts
import { writeFileSync } from "node:fs";
import { categories, procedures } from "../src/lib/data/mock/procedures";
import { procedureDetails } from "../src/content/procedure-details";

const lines: string[] = [
  "# 시술 상세 원고 검수본",
  "",
  "> 공개 자료(제조사 · 일반 의학 정보)를 참고해 새로 작성한 **초안**입니다. 의학적 내용과 표현을 확인해 주세요.",
  "> ⚠️ 표시는 확인이 꼭 필요한 항목입니다.",
  "",
];

const checks = procedures.filter((p) => procedureDetails[p.slug]?.check);
lines.push("## 확인 필요 항목 요약", "");
for (const p of checks) lines.push(`- **${p.name}**: ${procedureDetails[p.slug].check}`);
lines.push("");

for (const c of categories) {
  lines.push(`## ${c.name}`, "");
  for (const p of procedures.filter((x) => x.categorySlug === c.slug)) {
    const d = procedureDetails[p.slug];
    lines.push(`### ${p.name}`, "");
    if (d.check) lines.push(`⚠️ **확인 필요:** ${d.check}`, "");
    lines.push(`**한 줄 소개:** ${d.summary}`, "", `**태그:** ${d.tags.map((t) => `#${t}`).join(" ")}`, "");
    lines.push(
      `| 시술 시간 | 마취 | 회복 기간 | 내원 주기 |`,
      `|---|---|---|---|`,
      `| ${d.info.time} | ${d.info.anesthesia} | ${d.info.recovery} | ${d.info.interval} |`,
      "",
    );
    lines.push("**이런 분께 추천합니다**", "", ...d.recommend.map((r) => `- ${r}`), "");
    lines.push("**시술 원리**", "", d.principle, "");
    lines.push("**프라베일 포인트**", "", ...d.points.map((r, i) => `${i + 1}. ${r}`), "");
    lines.push("**주의사항 · 부작용**", "", ...d.cautions.map((r) => `- ${r}`), "");
    lines.push("**자주 묻는 질문**", "", ...d.faq.flatMap((f) => [`- **Q. ${f.q}**`, `  A. ${f.a}`]), "", "---", "");
  }
}

writeFileSync("docs/procedure-review.md", lines.join("\n"));
console.log(`exported ${procedures.length} procedures, ${checks.length} with checks`);
