// 페이지 점검: PC(1440) · 모바일(390)에서 열리는지, 옆으로 넘치는지, 깨진 사진 · 스크립트 오류가 있는지
// 사용: DATABASE_URL= pnpm build && PREVIEW_UNLOCK=1 DATABASE_URL= pnpm start  (다른 창에서)
//       node scripts/check-pages.mjs                 → 시술 페이지 전체
//       node scripts/check-pages.mjs /petit/botox /about/doctor
// 화면 사진은 .shots/ 에 저장 (커밋하지 않음)
import { readFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";

// playwright 는 프로젝트 패키지에 넣지 않음 (컴퓨터에 설치된 것을 씀)
let chromium;
try {
  ({ chromium } = createRequire(import.meta.url)("playwright"));
} catch {
  console.error(
    "playwright 가 없어 화면 점검을 건너뜁니다. PR 본문에 '화면 점검 못 함'이라고 적어 주세요.",
  );
  process.exit(2);
}

const BASE = process.env.BASE_URL || "http://localhost:3000";
const paths = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      ...readFileSync("src/content/treatments.ts", "utf8").matchAll(
        /^\s{4}href: "(\/[^"]*)"/gm,
      ),
    ].map((m) => m[1]);

mkdirSync(".shots", { recursive: true });
const browser = await chromium.launch();
let failed = 0;

for (const [label, width, height] of [
  ["pc", 1440, 900],
  ["m", 390, 844],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  for (const path of paths) {
    const errors = [];
    page.removeAllListeners("pageerror");
    page.on("pageerror", (e) => errors.push(e.message));
    const res = await page.goto(BASE + path, { waitUntil: "networkidle" });
    // 아래까지 천천히 내려서 늦게 뜨는 사진도 불러옴
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(400);
    const info = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      broken: [...document.images]
        .filter((i) => i.complete && i.naturalWidth === 0 && i.src)
        .map((i) => i.src),
      preparing: document.title.includes("준비 중"),
    }));
    const problems = [];
    if (!res || res.status() !== 200) problems.push(`상태 ${res?.status()}`);
    if (info.preparing)
      problems.push("준비 중 화면 (PREVIEW_UNLOCK=1 로 start)");
    if (info.overflow > 0) problems.push(`옆으로 ${info.overflow}px 넘침`);
    if (info.broken.length)
      problems.push(`깨진 사진 ${info.broken.join(", ")}`);
    if (errors.length) problems.push(`스크립트 오류 ${errors.join(" / ")}`);
    const file = `.shots/${label}${path.replace(/\//g, "_") || "_home"}.png`;
    await page.screenshot({ path: file, fullPage: true });
    if (problems.length) failed++;
    console.log(
      `${problems.length ? "✗" : "✓"} ${label} ${path}${problems.length ? "  " + problems.join(" · ") : ""}`,
    );
  }
  await page.close();
}
await browser.close();
console.log(failed ? `\n문제 ${failed}건` : "\n모두 통과");
process.exit(failed ? 1 : 0);
