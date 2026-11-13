// node scripts/check-rss.cjs
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const output = ts.transpileModule(fs.readFileSync("src/lib/rss.ts", "utf8"), {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;
const context = { exports: {}, URL };
vm.runInNewContext(output, context);
const { renderRss, bodyHtml } = context.exports;
const base = "https://praveil.com";
const post = {
  id: 1,
  type: "column",
  title: "A & B <칼럼>",
  summary: "요약 & 설명",
  createdAt: "2026-11-13",
  publishedAt: "2026-11-13T01:02:03Z",
  body: {
    kind: "text",
    text: "전체 본문 <script>alert(1)</script>\u0001\n두 번째 줄",
  },
};
const xml = renderRss(
  [post, { ...post, id: 2, isPrivate: true, title: "SECRET" }],
  base,
);
assert(!xml.includes("SECRET"));
assert(!xml.includes("\u0001"));
assert(xml.includes("A &amp; B &lt;칼럼&gt;"));
assert(xml.includes("Fri, 13 Nov 2026 01:02:03 GMT"));
assert(xml.includes("&amp;lt;script&amp;gt;"));
assert(xml.includes("<content:encoded>"));
assert(
  !renderRss([{ ...post, type: "notice" }], base, true).includes("<item>"),
);
assert.equal(
  (
    renderRss(
      Array.from({ length: 60 }, (_, id) => ({ ...post, id })),
      base,
    ).match(/<item>/g) || []
  ).length,
  50,
);
assert(
  !renderRss([{ ...post, publishedAt: undefined }], base).includes("<pubDate>"),
);
assert(
  !bodyHtml(
    {
      kind: "doc",
      doc: { type: "image", attrs: { src: "javascript:alert(1)" } },
    },
    base,
  ),
);
assert(
  bodyHtml(
    { kind: "images", images: [{ url: "/uploads/test.png", alt: "A & B" }] },
    base,
  ).includes('src="https://praveil.com/uploads/test.png"'),
);
const source = fs.readFileSync("src/app/rss.xml/route.ts", "utf8");
assert(source.includes("await getNotices()"));
assert(!source.includes("ForViewer"));
console.log(
  "RSS checks passed: private exclusion, full body, XML escaping, dates, feed selection, limit, safe absolute media.",
);
