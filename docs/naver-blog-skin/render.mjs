// skin.html 의 .asset 하나하나를 out/<id>.png 로 저장합니다.
// 실행: node docs/naver-blog-skin/render.mjs  (pnpm install 후, 프리텐다드 글꼴을 node_modules 에서 읽음)
import { createRequire } from "node:module";
import { readFileSync, mkdirSync, copyFileSync } from "node:fs";
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

// html 파일의 .asset 하나하나를 dir/<id>.png 로 저장
async function render(file, dir) {
  mkdirSync(dir, { recursive: true });
  await page.goto(pathToFileURL(join(here, file)).href);
  await page.evaluate(
    ([svg, markSvg]) => {
      for (const el of document.querySelectorAll(".logo")) {
        el.innerHTML = el.textContent.includes("MARK") ? markSvg : svg;
      }
    },
    [logo, mark],
  );
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState("load", { timeout: 120000 });
  await page.evaluate(() => (document.body.style.background = "transparent"));
  // 높이가 소수점이면 가장자리에 회색 줄이 생겨서 정수로 맞춤
  await page.evaluate(() => {
    for (const el of document.querySelectorAll(".asset")) {
      el.style.height = `${Math.ceil(el.getBoundingClientRect().height)}px`;
    }
  });
  for (const el of await page.locator(".asset").all()) {
    const id = await el.getAttribute("id");
    const box = await el.boundingBox();
    // 빈 타이틀은 투명 PNG 로 (다른 그림은 모두 자기 바탕색이 있음)
    await el.screenshot({ path: join(dir, `${id}.png`), omitBackground: true });
    console.log(
      `${id}.png  ${Math.round(box.width)} × ${Math.round(box.height)}`,
    );
  }
}

await render("skin.html", out);
// 블로그 글 3개에 들어가는 그림 (본문은 posts/*.txt)
await render("posts.html", join(out, "posts"));

// 위젯 그림은 홈페이지 서버에서 바로 열리도록 public 에도 복사 (위젯 코드가 이 주소를 씀)
const pub = join(here, "../../public/images/naver-blog");
mkdirSync(pub, { recursive: true });
for (const name of ["hours", "reserve", "home", "map"]) {
  copyFileSync(
    join(out, `widget-${name}.png`),
    join(pub, `widget-${name}.png`),
  );
}

// 블로그에 붙였을 때 모습 (확인용, 업로드하지 않음)
await page.setViewportSize({ width: 1920, height: 900 });
await page.goto(pathToFileURL(join(here, "preview.html")).href);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: join(out, "preview.png"), fullPage: true });
console.log("preview.png");

await browser.close();
