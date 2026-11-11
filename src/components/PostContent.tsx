import type { ReactNode } from "react";
import type { DocNode, PostBody } from "@/lib/data";

// 관리자 편집기로 쓴 게시글 본문을 홈페이지 톤으로 보여준다.
// 원장칼럼 편집기(관리자 '블로그 에디터')가 쓰는 블록까지 같은 모양으로 그린다:
// 요약(핵심 요약) · 강조박스(핵심 포인트) · TIP(의료진 TIP) · Q&A · 콜라주(갤러리)
const safeHref = (value: unknown) => (typeof value === "string" && /^(https:\/\/|\/(?!\/))/.test(value) ? value : undefined);
const safeSrc = (value: unknown) => (typeof value === "string" && /^(https:\/\/|\/uploads\/)/.test(value) ? value : undefined);
const safeColor = (value: unknown) => (typeof value === "string" && /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|var\(--[\w-]+\))$/i.test(value) ? value : undefined);

function youtubeEmbed(src: unknown) {
  try {
    const url = new URL(String(src));
    const id = url.hostname === "youtu.be" ? url.pathname.slice(1) : url.searchParams.get("v") ?? url.pathname.split("/").pop();
    return id && /^[\w-]{6,20}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : undefined;
  } catch {
    return undefined;
  }
}

function align(node: DocNode) {
  const value = node.attrs?.textAlign;
  return value === "center" ? "text-center" : value === "right" ? "text-right" : undefined;
}

/** 노드 안의 글자만 이어 붙인다 (목차 · Q&A 를 가를 때 씀) */
function plainText(node: DocNode): string {
  return `${node.text ?? ""}${(node.content ?? []).map(plainText).join("")}`;
}

/** 본문 맨 위 단계(h2) 제목 목록 — 원장칼럼 목차에 쓴다 */
export function docHeadings(body: PostBody) {
  if (body.kind !== "doc") return [];
  return (body.doc.content ?? [])
    .map((node, index) => ({ node, index }))
    .filter(({ node }) => node.type === "heading" && Number(node.attrs?.level ?? 2) === 2)
    .map(({ node, index }) => ({ id: `section-${index + 1}`, text: plainText(node).trim() }))
    .filter((heading) => heading.text)
    .slice(0, 10);
}

function renderText(node: DocNode, key: number | string): ReactNode {
  let out: ReactNode = node.text ?? "";
  for (const mark of node.marks ?? []) {
    if (mark.type === "bold") out = <strong className="font-semibold text-ink">{out}</strong>;
    else if (mark.type === "italic") out = <em>{out}</em>;
    else if (mark.type === "underline") out = <u>{out}</u>;
    else if (mark.type === "strike") out = <s>{out}</s>;
    else if (mark.type === "code") out = <code className="rounded bg-sand/60 px-1.5 py-0.5 text-[0.9em]">{out}</code>;
    else if (mark.type === "link") {
      const href = safeHref(mark.attrs?.href);
      out = href ? <a href={href} className="text-mocha underline underline-offset-4" {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>{out}</a> : out;
    } else if (mark.type === "textStyle") {
      const color = safeColor(mark.attrs?.color);
      out = color ? <span style={{ color }}>{out}</span> : out;
    } else if (mark.type === "highlight") {
      out = <mark style={{ backgroundColor: safeColor(mark.attrs?.color) ?? "#f3e6c8" }} className="px-0.5 text-inherit">{out}</mark>;
    }
  }
  return <span key={key}>{out}</span>;
}

function children(node: DocNode, keyPrefix: string) {
  return (node.content ?? []).map((child, i) => renderNode(child, `${keyPrefix}-${i}`));
}

// 강조 상자 4종: 관리자 편집기의 요약 · 강조박스 · TIP · Q&A
const calloutStyle: Record<string, { label: string; box: string }> = {
  summary: { label: "핵심 요약", box: "border-gold/45 bg-gold/[0.07]" },
  point: { label: "핵심 포인트", box: "border-line bg-sand/40" },
  tip: { label: "의료진 TIP", box: "border-mocha/25 bg-ivory" },
  faq: { label: "Q&A", box: "border-line bg-ivory" },
};

function Callout({ kind, node, keyPrefix }: { kind: string; node: DocNode; keyPrefix: string }) {
  const style = calloutStyle[kind] ?? calloutStyle.point;
  return (
    <aside data-callout={kind} className={`my-9 rounded-[20px] border px-6 py-6 md:px-8 md:py-7 ${style.box}`}>
      <span className="font-display text-[11px] tracking-[0.3em] text-mocha uppercase">{style.label}</span>
      <div className="mt-3 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0 [&>p]:my-2.5 [&>ul]:my-2.5">{children(node, keyPrefix)}</div>
    </aside>
  );
}

/** Q&A 상자: 질문 하나에 답 하나씩 풀어 놓는다 */
function faqEntries(node: DocNode) {
  const entries: { question: string; answer: string }[] = [];
  let question = "";
  let answer: string[] = [];
  const commit = () => {
    if (!question) return;
    entries.push({ question, answer: answer.join(" ").trim() });
    question = "";
    answer = [];
  };
  for (const child of node.content ?? []) {
    const text = plainText(child).trim();
    if (!text) continue;
    if (/^Q\d*[.:]\s*/i.test(text)) {
      commit();
      question = text.replace(/^Q\d*[.:]\s*/i, "").trim();
      continue;
    }
    if (!question) continue;
    answer.push(text.replace(/^A\d*[.:]\s*/i, "").trim());
  }
  commit();
  return entries;
}

function FaqGroup({ entries }: { entries: { question: string; answer: string }[] }) {
  return (
    <section
      aria-label="자주 묻는 질문과 답변"
      className="my-9 divide-y divide-line overflow-hidden rounded-[20px] border border-line"
    >
      {entries.map((entry, i) => (
        <details key={`${entry.question}-${i}`} open className="group bg-white open:bg-ivory/60">
          <summary className="flex cursor-pointer list-none items-start gap-3 px-6 py-5 md:px-8">
            <span className="font-display text-sm text-gold">Q{i + 1}.</span>
            <strong className="flex-1 text-[16px] leading-relaxed font-medium text-ink md:text-[17px]">{entry.question}</strong>
            <span aria-hidden className="mt-0.5 text-muted transition group-open:rotate-45">+</span>
          </summary>
          <div className="flex items-start gap-3 px-6 pb-6 md:px-8">
            <span className="font-display text-sm text-muted">A.</span>
            <p className="flex-1 text-[15px] leading-[1.9] text-ink/75">
              {entry.answer || "자세한 내용은 현재 상태를 확인한 뒤 상담을 통해 안내해 드립니다."}
            </p>
          </div>
        </details>
      ))}
    </section>
  );
}

function renderNode(node: DocNode, key: number | string): ReactNode {
  const keyPrefix = String(key);
  switch (node.type) {
    case "doc":
      return <div key={key}>{children(node, keyPrefix)}</div>;
    case "text":
      return renderText(node, key);
    case "hardBreak":
      return <br key={key} />;
    case "paragraph":
      return <p key={key} className={`my-5 ${align(node) ?? ""}`}>{children(node, keyPrefix)}</p>;
    case "heading": {
      const level = Number(node.attrs?.level) || 2;
      const top = /^rich-(\d+)$/.exec(keyPrefix)?.[1];
      const cls = `mt-12 mb-4 font-serif font-medium tracking-tight text-ink ${align(node) ?? ""}`;
      return level <= 2
        ? <h2 key={key} id={top ? `section-${Number(top) + 1}` : undefined} className={`${cls} scroll-mt-32 text-2xl md:text-[28px]`}>{children(node, keyPrefix)}</h2>
        : <h3 key={key} className={`${cls} text-xl md:text-2xl`}>{children(node, keyPrefix)}</h3>;
    }
    case "blockquote":
      return <blockquote key={key} className="my-8 border-l-2 border-gold pl-6 font-serif text-ink">{children(node, keyPrefix)}</blockquote>;
    case "bulletList":
      return <ul key={key} className="my-5 list-disc space-y-1.5 pl-6 marker:text-gold">{children(node, keyPrefix)}</ul>;
    case "orderedList":
      return <ol key={key} className="my-5 list-decimal space-y-1.5 pl-6 marker:text-gold">{children(node, keyPrefix)}</ol>;
    case "listItem":
      return <li key={key} className="[&>p]:my-0">{children(node, keyPrefix)}</li>;
    case "horizontalRule":
      return <hr key={key} className="my-12 border-ink/15" />;
    case "codeBlock":
      return <pre key={key} className="my-6 overflow-x-auto rounded-xl bg-sand/50 p-5 text-sm">{children(node, keyPrefix)}</pre>;
    case "image": {
      const src = safeSrc(node.attrs?.src);
      // eslint-disable-next-line @next/next/no-img-element
      return src ? <img key={key} src={src} alt={String(node.attrs?.alt ?? "")} loading="lazy" className="my-8 w-full rounded-2xl" /> : null;
    }
    case "youtube": {
      const src = youtubeEmbed(node.attrs?.src);
      return src ? (
        <div key={key} className="my-8 aspect-video overflow-hidden rounded-2xl bg-ink">
          <iframe src={src} title="YouTube" className="h-full w-full" allowFullScreen loading="lazy" />
        </div>
      ) : null;
    }
    case "columnCallout": {
      const kind = String(node.attrs?.kind ?? "point");
      if (kind === "faq") {
        const entries = faqEntries(node);
        if (entries.length) return <FaqGroup key={key} entries={entries} />;
      }
      return <Callout key={key} kind={kind} node={node} keyPrefix={keyPrefix} />;
    }
    case "columnGallery":
    case "columnImageSection": {
      const list = (Array.isArray(node.attrs?.images) ? node.attrs.images : Array.isArray(node.attrs?.slots) ? node.attrs.slots : []) as { src?: unknown; alt?: unknown }[];
      const images = list.map((img) => ({ src: safeSrc(img.src), alt: String(img.alt ?? "") })).filter((img) => img.src);
      return images.length ? (
        <div key={key} className={`my-8 grid gap-3 ${images.length > 1 ? "grid-cols-2" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {images.map((img, i) => <img key={i} src={img.src} alt={img.alt} loading="lazy" className="w-full rounded-2xl" />)}
        </div>
      ) : null;
    }
    case "table":
      return (
        <div key={key} className="my-8 overflow-x-auto">
          <table className="w-full border-collapse text-sm"><tbody>{children(node, keyPrefix)}</tbody></table>
        </div>
      );
    case "tableRow":
      return <tr key={key} className="border-b border-ink/15">{children(node, keyPrefix)}</tr>;
    case "tableHeader":
      return <th key={key} className="bg-sand/40 px-4 py-3 text-left font-medium text-ink [&>p]:my-0">{children(node, keyPrefix)}</th>;
    case "tableCell":
      return <td key={key} className="px-4 py-3 [&>p]:my-0">{children(node, keyPrefix)}</td>;
    default:
      return node.content ? <div key={key}>{children(node, keyPrefix)}</div> : null;
  }
}

/** 맨 윗줄이 '핵심 요약' 인 인용문은 요약 상자로 바꿔 그린다 (관리자 편집기와 같은 모양) */
function renderBlocks(nodes: DocNode[]) {
  return nodes.map((node, index) => {
    const parts = node.type === "blockquote" ? (node.content ?? []).filter((child) => plainText(child).trim()) : [];
    if (parts.length > 1 && /^(핵심\s*요약|key\s*summary)$/i.test(plainText(parts[0]).trim())) {
      return (
        <Callout
          key={`rich-${index}`}
          kind="summary"
          node={{ content: parts.slice(1) }}
          keyPrefix={`summary-${index}`}
        />
      );
    }
    return renderNode(node, `rich-${index}`);
  });
}

export default function PostContent({ body }: { body: PostBody }) {
  if (body.kind === "text") return <div className="whitespace-pre-line">{body.text}</div>;
  if (body.kind === "images") {
    return (
      <div className="space-y-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {body.images.map((img, i) => <img key={i} src={img.url} alt={img.alt} loading={i ? "lazy" : "eager"} className="block w-full" />)}
      </div>
    );
  }
  return <div className="[&>p:first-child]:mt-0">{renderBlocks(body.doc.content ?? [])}</div>;
}
