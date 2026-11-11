// 관리자 미리보기에서 뽑은 칼럼 규칙을 홈페이지의 .pvc 안으로만 한정하고, 주황 강조색을 프라베일 색으로 바꾼다.
const fs = require("fs");
const path = require("path");
const postcss = require(process.argv[2]);
const [, , , src, out, varsFile] = process.argv;

const COLOR_MAP = [
  [/rgb\(255, 244, 236\)/g, "rgb(246, 242, 236)"], // 표 머리칸 배경 #fff4ec → 아이보리
  [/rgb\(255, 240, 229\)/g, "rgb(246, 242, 236)"], // 목록 점 배경 #fff0e5
  [/rgb\(224, 166, 129\)/g, "rgb(201, 173, 128)"], // TIP 윗선 #e0a681 → 골드
  [/rgb\(232, 180, 148\)/g, "rgb(201, 173, 128)"], // 링크 밑줄 #e8b494
  [/#d75500/gi, "#7d6649"], // 강조색 → 모카
  [/#ad4300/gi, "#7d6649"],
  [/#fff7f1/gi, "#f6f2ec"],
];

let css = fs.readFileSync(src, "utf8");
for (const [re, to] of COLOR_MAP) css = css.replace(re, to);

const SCOPE = ".pvc";
function scope(sel) {
  const s = sel.trim();
  if (/^:root\b/.test(s)) return s.replace(/^:root/, SCOPE);
  if (/^html\b/.test(s)) return s.replace(/^html(\s+body)?/, SCOPE);
  if (/^body\b/.test(s)) return s.replace(/^body/, SCOPE);
  return `${SCOPE} ${s}`;
}

const root = postcss.parse(css);
root.walkRules((rule) => {
  if (rule.parent && rule.parent.type === "atrule" && /keyframes$/i.test(rule.parent.name)) return;
  rule.selectors = rule.selectors.map(scope);
});
// 키프레임 이름이 홈페이지 것과 겹치지 않게
const renamed = new Map();
root.walkAtRules(/keyframes$/i, (at) => {
  const name = at.params.trim();
  const next = `pvc-${name}`;
  renamed.set(name, next);
  at.params = next;
});
if (renamed.size)
  root.walkDecls(/^animation(-name)?$/, (decl) => {
    for (const [from, to] of renamed) decl.value = decl.value.replace(new RegExp(`\\b${from}\\b`, "g"), to);
  });

const vars = JSON.parse(fs.readFileSync(varsFile, "utf8"));
const varLines = Object.entries(vars)
  .map(([k, v]) => `  ${k}: ${v};`)
  .join("\n");
const header = `/* 자동 생성 파일 — 손으로 고치지 마세요.
   관리자(admin.praveil.com) 칼럼 미리보기에 실제로 적용되는 규칙을 뽑아 .pvc 안으로 한정한 것.
   다시 만드는 법: 관리자 CSS를 public/__admincss 에 받아 로컬 칼럼 화면에서 추출 → scope-css 로 변환.
   강조색은 관리자 주황(#d75500)을 프라베일 모카(#7d6649) · 골드(#c9ad80) · 아이보리(#f6f2ec)로 바꿈. */
.pvc .pvc-inherit {
${varLines}
  --director-accent: #7d6649;
  --director-accent-dark: #7d6649;
  --director-soft: #f6f2ec;
  --article-accent: #7d6649;
  font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Noto Sans KR", "Malgun Gothic", sans-serif;
  font-size: 18px;
  line-height: 31.5px;
  color: rgb(22, 22, 22);
  letter-spacing: normal;
  font-weight: 400;
  text-align: start;
}
`;
fs.writeFileSync(out, header + root.toString() + "\n");
console.log("rules", root.nodes.length, "bytes", fs.statSync(out).size);
