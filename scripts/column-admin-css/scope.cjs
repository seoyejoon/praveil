/* eslint-disable @typescript-eslint/no-require-imports -- 노드에서 바로 실행하는 도구 스크립트 */
// 관리자 미리보기에서 뽑은 칼럼 규칙을 홈페이지의 .pvc 안으로만 한정하고, 주황 강조색을 프라베일 색으로 바꾼다.
// 사용: node scope.cjs <postcss 경로> <extracted-{device}.css> <출력 css> <vars.json>
//   {device} 자리에 desktop · mobile 을 넣은 두 파일(extract.js 를 PC · 모바일로 한 번씩 돌린 결과)을 읽는다.
const fs = require("fs");
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

const SCOPE = ".pvc";
function scope(sel) {
  const s = sel.trim();
  if (/^:root\b/.test(s)) return s.replace(/^:root/, SCOPE);
  if (/^html\b/.test(s)) return s.replace(/^html(\s+body)?/, SCOPE);
  if (/^body\b/.test(s)) return s.replace(/^body/, SCOPE);
  return `${SCOPE} ${s}`;
}

// 관리자 미리보기는 화면 폭 1440px 에서 PC · 모바일을 '틀 폭'으로만 바꿔 보여 준다.
// 그래서 (max-width) 미디어 규칙은 미리보기에서 꺼져 있고 (min-width) 규칙은 켜져 있다 → 그대로 재현한다.
const ADMIN_VIEWPORT = 1440;
const WIDTH = /\((max|min)-width:\s*([\d.]+)px\)/g;
function mediaActive(params) {
  const p = params.toLowerCase();
  if (/\bprint\b/.test(p) && !/\bscreen\b/.test(p)) return { active: false, unwrap: false };
  let active = true;
  for (const m of p.matchAll(WIDTH)) {
    const n = Number(m[2]);
    if (m[1] === "max" ? ADMIN_VIEWPORT > n : ADMIN_VIEWPORT < n) active = false;
  }
  const rest = p.replace(WIDTH, "").replace(/\b(and|only|screen|all)\b/g, "").trim();
  return { active, unwrap: !rest };
}

const CONTAINER_WIDTH = { desktop: 1126, mobile: 390 };
function containerActive(params, width) {
  let active = true;
  for (const m of params.toLowerCase().matchAll(WIDTH)) {
    const n = Number(m[2]);
    if (m[1] === "max" ? width > n : width < n) active = false;
  }
  return active;
}

function build(file, device) {
  let css = fs.readFileSync(file, "utf8");
  for (const [re, to] of COLOR_MAP) css = css.replace(re, to);
  const root = postcss.parse(css);
  root.walkAtRules("media", (at) => {
    const { active, unwrap } = mediaActive(at.params);
    if (!active) at.remove();
    else if (unwrap) at.replaceWith(at.nodes);
  });
  // @container: 기준 틀은 칼럼 본문(main.doctor-column-article). 미리보기 PC 틀 1126px · 모바일 틀 390px
  root.walkAtRules("container", (at) => {
    if (containerActive(at.params, CONTAINER_WIDTH[device])) at.replaceWith(at.nodes);
    else at.remove();
  });
  const keyframes = [];
  root.walkAtRules(/keyframes$/i, (at) => {
    keyframes.push(at.clone());
    at.remove();
  });
  const deviceClass = new RegExp(`\\.${device}(?![\\w-])`, "g");
  root.walkRules((rule) => {
    // .desktop / .mobile 을 늘 붙어 있는 .pvc-device 로 바꿔 선택자 우선순위를 관리자와 같게 유지
    rule.selectors = rule.selectors.map((sel) => scope(sel.replace(deviceClass, ".pvc-device")));
  });
  return { body: root.toString(), keyframes };
}

const desktop = build(src.replace("{device}", "desktop"), "desktop");
const mobile = build(src.replace("{device}", "mobile"), "mobile");
const seen = new Set();
const keyframes = [...desktop.keyframes, ...mobile.keyframes].filter((k) => {
  if (seen.has(k.params)) return false;
  seen.add(k.params);
  return true;
});

const vars = JSON.parse(fs.readFileSync(varsFile, "utf8"));
const varLines = Object.entries(vars)
  .map(([k, v]) => `  ${k}: ${v};`)
  .join("\n");

const output = [
  `/* 자동 생성 파일 — 손으로 고치지 마세요. (scripts/column-admin-css/README.md)
   관리자(admin.praveil.com) 칼럼 미리보기에 실제로 적용되는 규칙을 뽑아 .pvc 안으로 한정한 것.
   화면 폭 768px 이상은 미리보기 'PC', 그 아래는 미리보기 '모바일' 과 같은 규칙을 쓴다.
   강조색은 관리자 주황(#d75500)을 프라베일 모카(#7d6649) · 골드(#c9ad80) · 아이보리(#f6f2ec)로 바꿈. */`,
  `.pvc .pvc-inherit {
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
}`,
  ...keyframes.map((k) => k.toString()),
  `@media (min-width: 768px) {\n${desktop.body}\n}`,
  // 미리보기 '모바일' 은 390px 틀 안에 좌우 14px 여백 → 홈페이지(좌우 20px)에서 6px 씩 넓힌다
  `@media (max-width: 767px) {\n.pvc { margin-inline: -6px; }\n${mobile.body}\n}`,
].join("\n");

fs.writeFileSync(out, `${output}\n`);
console.log("bytes", fs.statSync(out).size);
