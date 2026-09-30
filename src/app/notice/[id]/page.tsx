import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarCheck, List } from "lucide-react";
import PostContent from "@/components/PostContent";
import JsonLd from "@/components/sub/JsonLd";
import { getHospital, getNotice, getNotices } from "@/lib/data";
import { coverOf, eventStatus, formatDate } from "@/lib/notice";
import { SITE_URL } from "@/lib/site-url";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const notice = await getNotice(Number((await params).id));
  if (!notice) return {};
  const cover = coverOf(notice);
  return {
    title: notice.title,
    description:
      notice.type === "event" && notice.summary
        ? `이벤트 기간 ${notice.summary}. ${notice.title}`
        : notice.summary || notice.title,
    alternates: { canonical: `/notice/${notice.id}` },
    openGraph: cover ? { images: [cover] } : undefined,
  };
}

// 공지 · 이벤트 글 보기: 분류 · 제목 · 날짜 → 본문 → 이전 · 다음 글 → 목록
export default async function NoticeDetailPage({ params }: Props) {
  const id = Number((await params).id);
  const [notice, all, hospital] = await Promise.all([
    getNotice(id),
    getNotices(),
    getHospital(),
  ]);
  if (!notice) notFound();

  const event = notice.type === "event";
  const board = event ? "이벤트" : "공지사항";
  const listHref = `/notice?type=${notice.type}`;
  const same = all.filter((n) => n.type === notice.type);
  const idx = same.findIndex((n) => n.id === notice.id);
  const newer = idx > 0 ? same[idx - 1] : null;
  const older = idx >= 0 && idx < same.length - 1 ? same[idx + 1] : null;
  const status = event ? eventStatus(notice.summary) : null;

  return (
    <article className="px-5 pt-32 pb-24 md:px-10 md:pt-44 md:pb-32">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: notice.title,
          datePublished: notice.createdAt,
          inLanguage: "ko-KR",
          url: `${SITE_URL}/notice/${notice.id}`,
          publisher: { "@id": `${SITE_URL}/#clinic` },
          ...(coverOf(notice) && { image: coverOf(notice) }),
        }}
      />
      <header className="mx-auto max-w-3xl">
        <nav
          aria-label="현재 위치"
          className="flex items-center gap-2 text-xs text-muted"
        >
          <Link href="/" className="hover:text-ink">
            HOME
          </Link>
          <span aria-hidden className="h-px w-3 bg-line" />
          <Link href={listHref} className="hover:text-ink">
            {board}
          </Link>
        </nav>
        <p className="mt-10 flex items-center gap-2">
          <span className="rounded-full border border-gold/60 px-3 py-1 text-xs text-mocha">
            {board}
          </span>
          {status && (
            <span
              className={`rounded-full px-3 py-1 text-xs ${status === "진행 중" ? "bg-gold text-white" : "bg-line text-muted"}`}
            >
              {status}
            </span>
          )}
        </p>
        <h1 className="mt-5 text-[28px] leading-snug font-semibold tracking-[-0.03em] md:text-[42px]">
          {notice.title}
        </h1>
        <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
          {event && notice.summary && (
            <div className="flex gap-2">
              <dt className="text-gold">기간</dt>
              <dd>{notice.summary}</dd>
            </div>
          )}
          <div className="flex gap-2">
            <dt className="text-gold">등록일</dt>
            <dd>
              <time dateTime={notice.createdAt}>
                {formatDate(notice.createdAt)}
              </time>
            </dd>
          </div>
        </dl>
      </header>

      <div className="mx-auto mt-10 max-w-3xl border-t border-ink/80 pt-10 text-[15px] leading-[1.9] text-muted md:text-base">
        <PostContent body={notice.body} />
      </div>

      {event && status !== "종료" && (
        <div className="mx-auto mt-14 flex max-w-3xl flex-col gap-5 rounded-[24px] bg-ivory p-7 md:flex-row md:items-center md:justify-between md:p-9">
          <p className="text-lg font-semibold tracking-[-0.02em]">
            이벤트 상담 · 예약하기
            <span className="mt-1 block text-sm font-normal text-muted">
              이벤트 내용은 상담 때 대표원장이 직접 안내해 드립니다.
            </span>
          </p>
          <a
            href={hospital.naverReservationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-espresso px-6 py-3.5 text-sm text-white transition hover:bg-mocha"
          >
            <CalendarCheck className="h-4 w-4" strokeWidth={1.6} />
            네이버 예약
          </a>
        </div>
      )}

      <nav
        aria-label="다른 글"
        className="mx-auto mt-16 max-w-3xl border-t border-ink/80"
      >
        {[
          { label: "다음 글", post: newer, Icon: ArrowLeft },
          { label: "이전 글", post: older, Icon: ArrowRight },
        ].map(({ label, post, Icon }) => (
          <div key={label} className="border-b border-line">
            {post ? (
              <Link
                href={`/notice/${post.id}`}
                className="group flex items-center gap-5 py-5"
              >
                <span className="w-14 shrink-0 text-sm text-gold">{label}</span>
                <span className="line-clamp-1 flex-1 text-[15px] transition group-hover:text-mocha">
                  {post.title}
                </span>
                <Icon
                  className="h-4 w-4 shrink-0 text-muted"
                  strokeWidth={1.6}
                />
              </Link>
            ) : (
              <p className="flex gap-5 py-5 text-[15px] text-muted/70">
                <span className="w-14 shrink-0 text-sm">{label}</span>
                {label === "다음 글" ? "최신 글입니다." : "처음 글입니다."}
              </p>
            )}
          </div>
        ))}
      </nav>

      <div className="mt-12 text-center">
        <Link
          href={listHref}
          className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-8 py-3.5 text-sm transition hover:border-ink hover:bg-ink hover:text-white"
        >
          <List className="h-4 w-4" strokeWidth={1.6} />
          목록으로
        </Link>
      </div>
    </article>
  );
}
