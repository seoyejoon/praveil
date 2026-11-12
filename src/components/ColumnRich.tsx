/* eslint-disable @next/next/no-img-element -- 관리자 편집기에서 올린 사진은 크기를 모르므로 그대로 그린다 */
import { Fragment, type CSSProperties, type ReactNode } from "react";
import type { DocNode } from "@/lib/data";
import "@/app/column-admin.css";

// 원장칼럼 본문을 관리자 칼럼 편집기 · 미리보기와 '같은 HTML'로 그린다.
// 관리자 /opt/psbox-admin-only/app/components/ColumnContent.tsx 의 renderRichBlocks 를 그대로 옮긴 것.
// 스타일은 column-admin.css (관리자 미리보기에 실제로 적용되는 규칙을 뽑아 .pvc 안으로 한정한 것)
// 관리자 쪽 ColumnContent.tsx 를 바꾸면 이 파일도 같이 바꿔야 세 화면(편집 · 미리보기 · 홈페이지)이 같다.

const FALLBACK_ANSWER = "자세한 내용은 의료진 상담을 통해 안내받을 수 있습니다.";
const FALLBACK_SINGLE = "자세한 내용은 현재 상태를 확인한 뒤 상담을 통해 안내받을 수 있습니다.";

function safeUrl(value: string) {
  const url = value.trim();
  return /^(https?:\/\/|\/(?!\/))/i.test(url) ? url : "";
}

function youtubeEmbed(value: string) {
  try {
    const url = new URL(value);
    const id = url.hostname.includes("youtu.be")
      ? url.pathname.slice(1)
      : (url.searchParams.get("v") ?? url.pathname.split("/").filter(Boolean).at(-1) ?? "");
    return /^[A-Za-z0-9_-]{6,20}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : "";
  } catch {
    return "";
  }
}

function richText(node: DocNode): string {
  return `${node.text ?? ""}${(node.content ?? []).map(richText).join("")}`;
}

function faqEntry(node: DocNode) {
  const parts = (node.content ?? [])
    .map((child) => ({ type: child.type, text: richText(child).trim() }))
    .filter((part) => part.text);
  if (node.type === "blockquote" && /^Q[.:]?\s*/i.test(parts[0]?.text ?? "")) {
    return {
      question: parts[0].text.replace(/^Q[.:]?\s*/i, "").trim(),
      answer:
        parts.slice(1).map((part) => part.text.replace(/^A[.:]?\s*/i, "")).join(" ").trim() || FALLBACK_SINGLE,
    };
  }
  const heading = parts.find((part) => part.type === "heading")?.text;
  if (heading)
    return {
      question: heading.replace(/^Q[.:]?\s*/i, ""),
      answer: parts
        .filter((part) => part.type !== "heading")
        .map((part) => part.text.replace(/^A[.:]?\s*/i, ""))
        .join(" "),
    };
  const raw = parts.map((part) => part.text).join("\n");
  const matched = raw.match(/^Q[.:]?\s*([^\n]+)\s*\n+A[.:]?\s*([\s\S]+)$/i);
  return matched
    ? { question: matched[1].trim(), answer: matched[2].trim() }
    : { question: raw.replace(/^Q[.:]?\s*/i, "").trim(), answer: FALLBACK_SINGLE };
}

function faqEntries(node: DocNode) {
  if (node.type !== "columnCallout" || node.attrs?.kind !== "faq") return [faqEntry(node)];
  const entries: Array<{ question: string; answer: string }> = [];
  let question = "";
  let answer: string[] = [];
  const commit = () => {
    if (!question) return;
    entries.push({ question, answer: answer.join(" ").trim() || FALLBACK_ANSWER });
    question = "";
    answer = [];
  };
  for (const child of node.content ?? []) {
    const text = richText(child).trim();
    if (!text || child.type === "heading") continue;
    if (/^Q(?:\d+)?[.:]\s*/i.test(text)) {
      commit();
      question = text.replace(/^Q(?:\d+)?[.:]\s*/i, "").trim();
      continue;
    }
    if (!question) continue;
    answer.push(text.replace(/^A(?:\d+)?[.:]\s*/i, "").trim());
  }
  commit();
  return entries.length ? entries : [faqEntry(node)];
}

function isFaqNode(node: DocNode) {
  return (
    (node.type === "columnCallout" && node.attrs?.kind === "faq") ||
    (node.type === "blockquote" && /^Q[.:]?\s*/i.test(richText(node).trim()))
  );
}

function safeColor(value: unknown) {
  const color = String(value ?? "");
  return /^(#[0-9a-f]{3,8}|rgba?\([\d\s,.%]+\))$/i.test(color) ? color : undefined;
}

function richStyle(node: DocNode): CSSProperties {
  const align = String(node.attrs?.textAlign ?? "");
  return ["left", "center", "right", "justify"].includes(align)
    ? { textAlign: align as CSSProperties["textAlign"] }
    : {};
}

function richInline(node: DocNode, key: string): ReactNode {
  let result: ReactNode = node.text ?? "";
  for (const [index, mark] of (node.marks ?? []).entries()) {
    const markKey = `${key}-mark-${index}`;
    if (mark.type === "bold") result = <strong key={markKey}>{result}</strong>;
    else if (mark.type === "italic") result = <em key={markKey}>{result}</em>;
    else if (mark.type === "underline") result = <u key={markKey}>{result}</u>;
    else if (mark.type === "strike") result = <s key={markKey}>{result}</s>;
    else if (mark.type === "link") {
      const href = safeUrl(String(mark.attrs?.href ?? ""));
      if (href)
        result = (
          <a href={href} target="_blank" rel="noreferrer" key={markKey}>
            {result}
          </a>
        );
    } else if (mark.type === "textStyle") {
      const color = safeColor(mark.attrs?.color);
      const fontSize = /^\d{1,2}px$/.test(String(mark.attrs?.fontSize ?? "")) ? String(mark.attrs?.fontSize) : undefined;
      result = (
        <span style={{ color, fontSize }} key={markKey}>
          {result}
        </span>
      );
    } else if (mark.type === "highlight")
      result = (
        <mark style={{ backgroundColor: safeColor(mark.attrs?.color) }} key={markKey}>
          {result}
        </mark>
      );
  }
  return result;
}

function richChildren(node: DocNode, key: string) {
  return (node.content ?? []).map((child, index) => renderRichNode(child, `${key}-${index}`));
}

function ContentImage({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="column-image">
      <img src={src} alt={alt} loading="lazy" />
    </figure>
  );
}

function renderRichNode(node: DocNode, key: string): ReactNode {
  if (node.type === "text") return richInline(node, key);
  if (node.type === "paragraph")
    return (
      <p key={key} style={richStyle(node)}>
        {richChildren(node, key)}
      </p>
    );
  if (node.type === "heading") {
    const level = Number(node.attrs?.level) === 3 ? 3 : 2;
    const children = richChildren(node, key);
    const topIndex = key.match(/^rich-(\d+)$/)?.[1];
    const id = topIndex === undefined ? key : `section-${Number(topIndex) + 1}`;
    return level === 3 ? (
      <h3 id={id} key={key} style={richStyle(node)}>
        {children}
      </h3>
    ) : (
      <h2 id={id} key={key} style={richStyle(node)}>
        {children}
      </h2>
    );
  }
  if (node.type === "blockquote") return <blockquote key={key}>{richChildren(node, key)}</blockquote>;
  if (node.type === "bulletList") return <ul key={key}>{richChildren(node, key)}</ul>;
  if (node.type === "orderedList") return <ol key={key}>{richChildren(node, key)}</ol>;
  if (node.type === "listItem") return <li key={key}>{richChildren(node, key)}</li>;
  if (node.type === "horizontalRule") return <hr key={key} />;
  if (node.type === "hardBreak") return <br key={key} />;
  if (node.type === "codeBlock")
    return (
      <pre className="column-code" key={key}>
        <code>{richText(node)}</code>
      </pre>
    );
  if (node.type === "image") {
    const src = safeUrl(String(node.attrs?.src ?? ""));
    return src ? <ContentImage key={key} src={src} alt={String(node.attrs?.alt ?? "칼럼 이미지")} /> : null;
  }
  if (node.type === "youtube") {
    const src = youtubeEmbed(String(node.attrs?.src ?? ""));
    return src ? (
      <div className="column-video" key={key}>
        <iframe
          src={src}
          title="칼럼 영상"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    ) : null;
  }
  if (node.type === "table")
    return (
      <div className="column-table" key={key}>
        <table>
          <tbody>{richChildren(node, key)}</tbody>
        </table>
      </div>
    );
  if (node.type === "tableRow") return <tr key={key}>{richChildren(node, key)}</tr>;
  if (node.type === "tableHeader") return <th key={key}>{richChildren(node, key)}</th>;
  if (node.type === "tableCell") return <td key={key}>{richChildren(node, key)}</td>;
  if (node.type === "columnCallout") {
    const kind = ["summary", "tip", "faq", "point", "refs", "related"].includes(String(node.attrs?.kind)) ? String(node.attrs?.kind) : "point";
    const label = kind === "summary" ? "핵심 요약" : kind === "tip" ? "의료진 TIP" : kind === "faq" ? "Q&A" : "핵심 포인트";
    return (
      <aside className={`column-${kind}`} key={key}>
        {/* 요약 상자는 글쓴이가 넣은 제목(예: '쿨소닉 핵심 요약')을 쓰므로 자동 이름표를 달지 않는다 */}
        {/* 근거 · 추천 글 상자도 글쓴이 제목을 쓴다 */}
        {!["summary", "refs", "related"].includes(kind) && <span>{label}</span>}
        <div>{richChildren(node, key)}</div>
      </aside>
    );
  }
  if (node.type === "columnImageSection" || node.type === "columnGallery") {
    const gallery = node.type === "columnGallery";
    const raw = (Array.isArray(gallery ? node.attrs?.images : node.attrs?.slots)
      ? (gallery ? node.attrs?.images : node.attrs?.slots)
      : []) as unknown[];
    const images = raw
      .slice(0, gallery ? 12 : 3)
      .map((item) => (typeof item === "object" && item ? (item as Record<string, unknown>) : {}))
      .map((item) => ({ src: safeUrl(String(item.src ?? "")), alt: String(item.alt ?? (gallery ? "칼럼 이미지" : "")) }))
      .filter((item) => item.src);
    if (!images.length) return null;
    if (!gallery && images.length === 1) return <ContentImage key={key} src={images[0].src} alt={images[0].alt} />;
    return (
      <div className="column-gallery" key={key}>
        {images.map((item, index) => (
          <figure key={`${item.src}-${index}`}>
            <img src={item.src} alt={item.alt} loading="lazy" />
          </figure>
        ))}
      </div>
    );
  }
  return <Fragment key={key}>{richChildren(node, key)}</Fragment>;
}

function renderRichBlocks(nodes: DocNode[]) {
  const rendered: ReactNode[] = [];
  let pendingFaqHeadingId: string | undefined;
  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    const blockquoteParts =
      node.type === "blockquote" ? (node.content ?? []).filter((child) => richText(child).trim()) : [];
    if (
      node.type === "blockquote" &&
      /^(핵심\s*요약|key\s*summary)$/i.test(richText(blockquoteParts[0] ?? { type: "text" }).trim())
    ) {
      rendered.push(
        <aside className="column-summary column-summary-auto" aria-label="핵심 요약" key={`summary-${index}`}>
          <span>핵심 요약</span>
          <div>{blockquoteParts.slice(1).map((child, childIndex) => renderRichNode(child, `summary-${index}-${childIndex}`))}</div>
        </aside>,
      );
      continue;
    }
    if (
      node.type === "heading" &&
      /^(자주\s*묻는\s*질문|faq)/i.test(richText(node).trim()) &&
      nodes[index + 1] &&
      isFaqNode(nodes[index + 1])
    ) {
      pendingFaqHeadingId = `section-${index + 1}`;
      continue;
    }
    if (isFaqNode(node)) {
      const faqHeadingId = pendingFaqHeadingId;
      pendingFaqHeadingId = undefined;
      const faqNodes: DocNode[] = [];
      while (index < nodes.length && isFaqNode(nodes[index])) {
        faqNodes.push(nodes[index]);
        index += 1;
      }
      index -= 1;
      rendered.push(
        <section className="column-faq-group" id={faqHeadingId} aria-label="자주 묻는 질문과 답변" key={`faq-group-${index}`}>
          {faqNodes.flatMap(faqEntries).map((entry, faqIndex) => (
            <details className="column-faq-item" open key={`${entry.question}-${faqIndex}`}>
              <summary>
                <span>Q{faqIndex + 1}.</span>
                <strong>{entry.question}</strong>
                <i aria-hidden="true">+</i>
              </summary>
              <div>
                <span>A.</span>
                <p>{entry.answer}</p>
              </div>
            </details>
          ))}
        </section>,
      );
      continue;
    }
    rendered.push(renderRichNode(node, `rich-${index}`));
  }
  return rendered;
}

// 관리자 미리보기에서 칼럼 본문을 감싸는 요소들 (스타일 규칙이 이 이름들을 기준으로 걸려 있어 그대로 둔다)
// 관리자 화면을 다시 빌드해 이름 뒤의 해시가 바뀌면 column-admin.css 를 다시 뽑아야 한다.
const WRAPPERS: Array<[string, string]> = [
  [
    "div",
    "website-admin-standalone"
  ],
  [
    "div",
    "WebsiteAdminCenter_page__8pl73 hs-readability-native"
  ],
  [
    "div",
    "WebsiteAdminCenter_settingsDialog__PYzRQ WebsiteAdminCenter_boardDialog__9ntzB"
  ],
  [
    "div",
    "WebsiteAdminCenter_content__gqEay"
  ],
  [
    "div",
    "WebsiteAdminCenter_contentScroll__T_Lwv WebsiteAdminCenter_boardContentScroll__ZlVHp"
  ],
  [
    "div",
    "WebsiteBoardManager_manager__lELmR"
  ],
  [
    "div",
    "WebsiteBoardManager_postDetailLayer__Au5et WebsiteBoardManager_doctorColumnLayer__rnLNG"
  ],
  [
    "div",
    "WebsiteBoardManager_postDrawer__UyO7y WebsiteBoardManager_createPostDrawer___AJt6 WebsiteBoardManager_doctorColumnPostDrawer__7kjeL"
  ],
  [
    "div",
    "WebsiteBoardManager_postDrawerScroll__JVwoL"
  ],
  [
    "div",
    "WebsiteBoardManager_doctorColumnWorkspace__wO3m4"
  ],
  [
    "div",
    "WebsiteBoardManager_doctorColumnEditorArea__evzn1"
  ],
  [
    "div",
    "column-studio column-studio-rich column-studio-standalone doctor-column-editor"
  ],
  [
    "div",
    "column-preview-wrap"
  ],
  [
    "div",
    "column-preview-device pvc-device article-parity"
  ],
  [
    "div",
    "public-post-page column-preview-page"
  ],
  [
    "div",
    "hs-readability-native doctor-column-article DoctorColumnArticle_article__dsbjS"
  ],
  [
    "div",
    "DoctorColumnArticle_inner__Zhy5g"
  ],
  [
    "div",
    "DoctorColumnArticle_contentLayout__0U1f0 DoctorColumnArticle_hasToc__BmTmC"
  ],
  [
    "div",
    "DoctorColumnArticle_content__e36HY pvc-inherit"
  ]
];

/** 원장칼럼 본문 (관리자 편집기 · 미리보기와 같은 구조 · 스타일) */
export default function ColumnRich({ doc }: { doc: DocNode }) {
  let inner: ReactNode = (
    <div className="column-content column-content-rich">{renderRichBlocks(doc.content ?? [])}</div>
  );
  for (const [tag, className] of [...WRAPPERS].reverse()) {
    const Tag = tag as "div";
    inner = <Tag className={className}>{inner}</Tag>;
  }
  return <div className="pvc">{inner}</div>;
}
