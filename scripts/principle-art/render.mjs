// Run with locally available Playwright and Sharp. No packages are installed.
// PRAVEIL_ART_TOOLS points to the existing node_modules directory containing both.
// CHROME_PATH optionally selects an installed Chrome executable.
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(process.env.PRAVEIL_ART_TOOLS
  ? join(resolve(process.env.PRAVEIL_ART_TOOLS), '__praveil_art__.cjs')
  : import.meta.url);
const { chromium } = require('playwright');
const sharp = require('sharp');
const output = resolve(here, '../../public/images/principles');
const kinds = ['rf','filler','botox','matrix','booster','collagen','laser','thread','acne','hair','pigment'];
await mkdir(output, { recursive:true });
const browser = await chromium.launch({
  ...(process.env.CHROME_PATH ? { executablePath:process.env.CHROME_PATH } : {}),
  args:['--enable-unsafe-swiftshader'],
});
const manifest = {};
try {
  const page = await browser.newPage({viewport:{width:1600,height:1000},deviceScaleFactor:1.5});
  await page.route('**/*', route => route.request().url().startsWith('file:') ? route.continue() : route.abort());
  await page.goto(pathToFileURL(join(here,'index.html')).href);
  for (const kind of kinds) {
    const info = await page.evaluate(kind => window.renderPrinciple(kind), kind);
    const png = await page.locator('canvas').screenshot();
    for (const width of [800,1600]) {
      const filename = `${kind}${width===800?'-mobile':''}.webp`;
      const image = await sharp(png).resize(width,width*5/8).webp({quality:90,effort:6}).toBuffer();
      await writeFile(join(output,filename),image);
      console.log(`${filename}: ${Math.round(image.length/1024)} KiB`);
    }
    manifest[kind] = info;
  }
  await writeFile(join(here,'landmarks.json'),JSON.stringify(manifest,null,2)+'\n');
} finally { await browser.close(); }
