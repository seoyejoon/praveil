import type { DocNode, Notice, PostBody } from "./data/types";

// 본문을 HTML로 만들 때와 XML 필드에 넣을 때 각각 이스케이프한다.
export function escapeXml(value: string): string {
  return value
    .replace(
      /[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}]/gu,
      "",
    )
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function webUrl(value: unknown, base: string): string {
  const raw = String(value ?? "").trim();
  if (!/^(https?:\/\/|\/(?!\/))/i.test(raw)) return "";
  try {
    return new URL(raw, base).href;
  } catch {
    return "";
  }
}

function imageHtml(src: unknown, alt: unknown, base: string): string {
  const url = webUrl(src, base);
  return url
    ? `<img src="${escapeXml(url)}" alt="${escapeXml(String(alt ?? ""))}" />`
    : "";
}

function nodeHtml(node: DocNode, base: string): string {
  if (node.type === "text") {
    let text = escapeXml(node.text ?? "");
    for (const mark of node.marks ?? []) {
      if (mark.type === "bold") text = `<strong>${text}</strong>`;
      if (mark.type === "italic") text = `<em>${text}</em>`;
      if (mark.type === "link") {
        const url = webUrl(mark.attrs?.href, base);
        if (url) text = `<a href="${escapeXml(url)}">${text}</a>`;
      }
    }
    return text;
  }
  if (node.type === "image")
    return imageHtml(node.attrs?.src, node.attrs?.alt, base);
  if (node.type === "columnGallery" || node.type === "columnImageSection") {
    const images =
      node.type === "columnGallery" ? node.attrs?.images : node.attrs?.slots;
    return Array.isArray(images)
      ? images
          .map((item) => {
            if (!item || typeof item !== "object") return "";
            return imageHtml(item.src, item.alt, base);
          })
          .join("")
      : "";
  }
  if (node.type === "youtube") {
    const url = webUrl(node.attrs?.src, base);
    return url ? `<p><a href="${escapeXml(url)}">칼럼 영상</a></p>` : "";
  }
  if (node.type === "hardBreak") return "<br />";
  if (node.type === "horizontalRule") return "<hr />";
  const children = (node.content ?? [])
    .map((child) => nodeHtml(child, base))
    .join("");
  const tags: Record<string, string> = {
    paragraph: "p",
    heading: Number(node.attrs?.level) === 3 ? "h3" : "h2",
    blockquote: "blockquote",
    bulletList: "ul",
    orderedList: "ol",
    listItem: "li",
    codeBlock: "pre",
    table: "table",
    tableRow: "tr",
    tableHeader: "th",
    tableCell: "td",
    columnCallout: "div",
  };
  const tag = tags[node.type ?? ""];
  return tag ? `<${tag}>${children}</${tag}>` : children;
}

export function bodyHtml(body: PostBody, base: string): string {
  if (body.kind === "doc") return nodeHtml(body.doc, base);
  if (body.kind === "images")
    return body.images.map((i) => imageHtml(i.url, i.alt, base)).join("");
  return `<p>${escapeXml(body.text).replace(/\r?\n/g, "<br />")}</p>`;
}

export function renderRss(
  notices: Notice[],
  base: string,
  columnOnly = false,
): string {
  // getNotices()의 공개 조회에 더해 비공개 글 유입을 방어한다.
  const posts = notices
    .filter((n) => !n.isPrivate && (!columnOnly || n.type === "column"))
    .slice(0, 50);
  const feedUrl = `${base}/rss.xml${columnOnly ? "?type=column" : ""}`;
  const title = `프라베일 맑고고운의원${columnOnly ? " 원장칼럼" : " 새 소식"}`;
  const items = posts
    .map((post) => {
      const url = `${base}/notice/${post.id}`;
      const published = post.publishedAt ? new Date(post.publishedAt) : null;
      const date =
        published && Number.isFinite(published.getTime())
          ? `<pubDate>${published.toUTCString()}</pubDate>`
          : "";
      return `<item><title>${escapeXml(post.title)}</title><link>${escapeXml(url)}</link><guid isPermaLink="true">${escapeXml(url)}</guid>${date}<category>${post.type}</category><description>${escapeXml(post.summary)}</description><content:encoded>${escapeXml(bodyHtml(post.body, base))}</content:encoded></item>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel><title>${escapeXml(title)}</title><link>${base}${columnOnly ? "/notice?type=column" : "/notice"}</link><description>프라베일 맑고고운의원 공지 · 이벤트 · 원장칼럼</description><language>ko-KR</language><atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${items}</channel></rss>`;
}
