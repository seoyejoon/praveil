import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import PostContent from "@/components/PostContent";
import { getNotice } from "@/lib/data";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const notice = await getNotice(Number((await params).id));
  return {
    title: notice?.title,
    description: notice?.summary || undefined,
    openGraph: notice?.coverImageUrl ? { images: [notice.coverImageUrl] } : undefined,
  };
}

export default async function NoticeDetailPage({ params }: Props) {
  const notice = await getNotice(Number((await params).id));
  if (!notice) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 pt-36 pb-24 md:px-10 md:pt-48 md:pb-36">
      <Reveal variant="zoom" className="text-center">
        <p className="font-display text-base tracking-[0.15em] text-gold">{notice.type === "event" ? "Event" : "Notice"}</p>
        <h1 className="mt-4 font-serif text-3xl leading-snug font-medium tracking-tight md:text-[44px]">{notice.title}</h1>
        <p className="mt-5 font-display text-sm tracking-widest text-taupe">
          {notice.type === "event" && notice.summary ? `이벤트 기간 ${notice.summary}` : notice.createdAt}
        </p>
      </Reveal>
      <div className="mt-12 border-t border-ink pt-12 text-[15px] leading-[1.9] text-muted md:text-base">
        <PostContent body={notice.body} />
      </div>
      <div className="mt-20 border-t border-ink/15 pt-10 text-center">
        <Link
          href="/notice"
          className="inline-block rounded-full border border-ink/40 px-10 py-3 text-sm transition hover:bg-ink hover:text-cream"
        >
          목록으로
        </Link>
      </div>
    </article>
  );
}
