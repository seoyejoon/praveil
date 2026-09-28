import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import BestMark from "@/components/BestMark";
import { findPage, pendingPaths } from "@/content/sitemap";

// 새 사이트맵의 시술 · 전후사진 페이지: 메인 시안 확정 후 차례로 만든다. 그 전까지 '준비 중' 화면.
type Props = { params: Promise<{ section: string; slug?: string[] }> };

function resolve(section: string, slug?: string[]) {
  const path = `/${[section, ...(slug ?? [])].join("/")}`;
  return pendingPaths.includes(path) ? findPage(path) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section, slug } = await params;
  const found = resolve(section, slug);
  return { title: found?.page.label ?? "페이지 준비 중" };
}

export default async function PendingPage({ params }: Props) {
  const { section, slug } = await params;
  const found = resolve(section, slug);
  if (!found) notFound();
  const { section: s, page } = found;

  return (
    <section className="min-h-[80svh] bg-white px-5 pt-40 pb-32 md:px-10 md:pt-52">
      <div className="mx-auto max-w-[1200px]">
        <p className="font-display text-sm font-light tracking-[0.3em] text-gold uppercase">{s.en}</p>
        <h1 className="mt-4 flex items-center gap-4 text-4xl font-semibold tracking-[-0.03em] md:text-6xl">
          {page.label}
          {page.best && (
            <span className="inline-flex items-center gap-2 rounded-full bg-ivory px-4 py-1.5 text-sm font-medium tracking-normal text-mocha">
              <BestMark />
              대표 시술
            </span>
          )}
        </h1>
        {page.items && (
          <ul className="mt-10 flex flex-wrap gap-2">
            {page.items.map((item) => (
              <li key={item} className="rounded-full border border-black/15 px-4 py-2 text-sm">
                {item}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-16 border-t border-black/10 pt-8 text-muted">상세 페이지는 메인 디자인 확정 후 제작합니다.</p>
        <Link href="/" aria-label="메인으로" className="mt-8 grid h-14 w-14 place-items-center rounded-full border border-black/20 transition hover:bg-black hover:text-white">
          <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
        </Link>
      </div>
    </section>
  );
}
