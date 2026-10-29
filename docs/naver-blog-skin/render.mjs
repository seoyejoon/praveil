// skin.html 의 .asset 하나하나를 out/<id>.png 로 저장합니다.
// 실행: node docs/naver-blog-skin/render.mjs  (pnpm install 후, 프리텐다드 글꼴을 node_modules 에서 읽음)
import { createRequire } from "node:module";
import { readFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "out");
mkdirSync(out, { recursive: true });

// 로고 SVG 는 글자색(currentColor)을 따르도록 검정 채움을 뺍니다
const logo = readFileSync(join(here, "../../public/praveil-logo.svg"), "utf8")
  .replace(/<\?xml[^>]*>/, "")
  .replace(/fill="#000"/, "");
// 프로필처럼 작게 보이는 곳은 PRAVEIL 글자만 (오른쪽 작은 글씨를 잘라냄)
const mark = logo.replace(/viewBox="[^"]*"/, 'viewBox="0 0 146 29.84"');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 3000, height: 1000 } });
await page.goto(pathToFileURL(join(here, "skin.html")).href);
await page.evaluate(
  ([svg, markSvg]) => {
    for (const el of document.querySelectorAll(".logo")) {
      el.innerHTML = el.textContent.includes("MARK") ? markSvg : svg;
    }
  },
  [logo, mark],
);
await page.evaluate(() => document.fonts.ready);
await page.waitForLoadState("networkidle", { timeout: 120000 });
// 높이가 소수점이면 가장자리에 회색 줄이 생겨서 정수로 맞춤
await page.evaluate(() => {
  for (const el of document.querySelectorAll(".asset")) {
    el.style.height = `${Math.ceil(el.getBoundingClientRect().height)}px`;
  }
});

for (const el of await page.locator(".asset").all()) {
  const id = await el.getAttribute("id");
  const box = await el.boundingBox();
  await el.screenshot({ path: join(out, `${id}.png`) });
  console.log(
    `${id}.png  ${Math.round(box.width)} × ${Math.round(box.height)}`,
  );
}

// 블로그에 붙였을 때 모습 (확인용, 업로드하지 않음)
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(pathToFileURL(join(here, "preview.html")).href);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: join(out, "preview.png"), fullPage: true });
console.log("preview.png");

// 타이틀 시안 모아 보기 (확인용)
await page.setViewportSize({ width: 1046, height: 900 });
await page.goto(pathToFileURL(join(here, "title-options.html")).href);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: join(out, "title-options.png"), fullPage: true });
console.log("title-options.png");
await browser.close();
