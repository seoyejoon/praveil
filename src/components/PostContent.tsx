import type { ReactNode } from "react";
import type { DocNode, PostBody } from "@/lib/data";

// 관리자 편집기로 쓴 게시글 본문을 홈페이지 톤으로 보여준다.
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

function renderText(node: DocNode, key: number): ReactNode {
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

function children(node: DocNode) {
  return (node.content ?? []).map((child, i) => renderNode(child, i));
}

function renderNode(node: DocNode, key: number): ReactNode {
  switch (node.type) {
    case "doc":
      return <div key={key}>{children(node)}</div>;
    case "text":
      return renderText(node, key);
    case "hardBreak":
      return <br key={key} />;
    case "paragraph":
      return <p key={key} className={`my-5 ${align(node) ?? ""}`}>{children(node)}</p>;
    case "heading": {
      const level = Number(node.attrs?.level) || 2;
      const cls = `mt-12 mb-4 font-serif font-medium tracking-tight text-ink ${align(node) ?? ""}`;
      return level <= 2
        ? <h2 key={key} className={`${cls} text-2xl md:text-[28px]`}>{children(node)}</h2>
        : <h3 key={key} className={`${cls} text-xl md:text-2xl`}>{children(node)}</h3>;
    }
    case "blockquote":
      return <blockquote key={key} className="my-8 border-l-2 border-gold pl-6 font-serif text-ink">{children(node)}</blockquote>;
    case "bulletList":
      return <ul key={key} className="my-5 list-disc space-y-1.5 pl-6 marker:text-gold">{children(node)}</ul>;
    case "orderedList":
      return <ol key={key} className="my-5 list-decimal space-y-1.5 pl-6 marker:text-gold">{children(node)}</ol>;
    case "listItem":
      return <li key={key} className="[&>p]:my-0">{children(node)}</li>;
    case "horizontalRule":
      return <hr key={key} className="my-12 border-ink/15" />;
    case "codeBlock":
      return <pre key={key} className="my-6 overflow-x-auto rounded-xl bg-sand/50 p-5 text-sm">{children(node)}</pre>;
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
    case "columnCallout":
      return <div key={key} className="my-8 rounded-2xl bg-sand/40 px-6 py-5 [&>p]:my-2">{children(node)}</div>;
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
          <table className="w-full border-collapse text-sm"><tbody>{children(node)}</tbody></table>
        </div>
      );
    case "tableRow":
      return <tr key={key} className="border-b border-ink/15">{children(node)}</tr>;
    case "tableHeader":
      return <th key={key} className="bg-sand/40 px-4 py-3 text-left font-medium text-ink [&>p]:my-0">{children(node)}</th>;
    case "tableCell":
      return <td key={key} className="px-4 py-3 [&>p]:my-0">{children(node)}</td>;
    default:
      return node.content ? <div key={key}>{children(node)}</div> : null;
  }
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
  return <div className="[&>div>p:first-child]:mt-0">{renderNode(body.doc, 0)}</div>;
}
