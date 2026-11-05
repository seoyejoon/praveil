import Link from "next/link";
import { ArrowLeft, ArrowRight, List } from "lucide-react";
import PostContent, { docHeadings } from "@/components/PostContent";
import type { Doctor, Hospital, Notice } from "@/lib/data";
import { coverOf, formatDate } from "@/lib/notice";

// 원장칼럼 글 보기: 관리자 '블로그 에디터' 의 칼럼 화면과 같은 구성
// (대표 사진 · 분류 · 요약 · 목차 · 본문 · 안내 문구 · 의료진 소개 · 추천 칼럼 · 이전/다음)
export default function ColumnArticle({
  notice,
  newer,
  older,
  related,
  hospital,
  doctor,
  listHref,
}: {
  notice: Notice;
  newer: Notice | null;
  older: Notice | null;
  related: Notice[];
  hospital: Hospital;
  doctor: Doctor;
  listHref: string;
}) {
  const cover = coverOf(notice);
  const headings = docHeadings(notice.body);

  return (
    <article className="px-5 pt-32 pb-24 md:px-10 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-[1100px]">
        <Link
          href={listHref}
          className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.6} />
          원장칼럼
        </Link>

        <header className="mt-7">
          {cover ? (
            <div className="relative overflow-hidden rounded-[24px] bg-ivory md:rounded-[32px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cover}
                alt=""
                className="aspect-[16/10] w-full object-cover md:aspect-[16/7]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute right-6 bottom-6 left-6 text-white md:right-12 md:bottom-11 md:left-12">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="rounded-full border border-white/50 px-3 py-1 text-xs">
                    {notice.category || "건강정보"}
                  </span>
                  <time
                    dateTime={notice.createdAt}
                    className="font-display text-xs tracking-widest text-white/75"
                  >
                    {formatDate(notice.createdAt)}
                  </time>
                </div>
                <h1 className="mt-4 max-w-3xl text-[26px] leading-snug font-semibold tracking-[-0.03em] md:text-[40px]">
                  {notice.title}
                </h1>
              </div>
            </div>
          ) : (
            <div className="border-b border-ink/80 pb-9">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-full border border-gold/60 px-3 py-1 text-xs text-mocha">
                  {notice.category || "건강정보"}
                </span>
                <time
                  dateTime={notice.createdAt}
                  className="font-display text-xs tracking-widest text-muted"
                >
                  {formatDate(notice.createdAt)}
                </time>
              </div>
              <h1 className="mt-5 text-[28px] leading-snug font-semibold tracking-[-0.03em] md:text-[42px]">
                {notice.title}
              </h1>
            </div>
          )}
        </header>

        <div
          className={`mt-12 gap-12 ${headings.length ? "lg:grid lg:grid-cols-[1fr_220px] lg:items-start" : "mx-auto max-w-3xl"}`}
        >
          <div className={headings.length ? "mx-auto w-full max-w-3xl" : ""}>
            {notice.summary && (
              <p className="mb-9 border-l-2 border-gold pl-5 text-[16px] leading-[1.9] text-ink/80 md:text-[17px]">
                {notice.summary}
              </p>
            )}

            <div className="text-[15px] leading-[1.9] text-muted md:text-base">
              <PostContent body={notice.body} />
            </div>

            <aside className="mt-12 rounded-[18px] bg-ivory px-6 py-5 text-[13px] leading-relaxed text-muted">
              ※ 본 글은 일반적인 건강 정보이며, 개인의 상태에 따라 치료 방법과
              경과는 달라질 수 있습니다. 정확한 진료 방향은 의료진 상담 후
              결정됩니다.
            </aside>

            <section
              aria-label="칼럼 작성 의료진"
              className="mt-8 flex items-center gap-5 rounded-[20px] border border-line px-6 py-6 md:px-8"
            >
              <span
                aria-hidden
                className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-sand font-display text-lg text-mocha"
              >
                {doctor.name.slice(0, 1)}
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted">{hospital.name}</p>
                <p className="mt-0.5 text-[17px] font-semibold tracking-[-0.02em]">
                  {doctor.title} {doctor.name}
                </p>
                <Link
                  href="/location"
                  className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-mocha"
                >
                  상담 안내
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
                </Link>
              </div>
            </section>

            {related.length > 0 && (
              <section aria-label="같이 보면 좋은 글" className="mt-16">
                <p className="font-display text-[11px] tracking-[0.35em] text-gold uppercase">
                  More Column
                </p>
                <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.03em] md:text-[26px]">
                  같이 보면 좋은 글
                </h2>
                <ul className="mt-6 border-t border-ink/80">
                  {related.map((post, i) => (
                    <li key={post.id} className="border-b border-line">
                      <Link
                        href={`/notice/${post.id}`}
                        className="group flex items-center gap-5 py-5"
                      >
                        <span className="font-display text-sm text-gold">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="line-clamp-1 flex-1 text-[15px] transition group-hover:text-mocha">
                          {post.title}
                        </span>
                        <span className="shrink-0 font-display text-xs tracking-widest text-muted">
                          {formatDate(post.createdAt)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {headings.length > 0 && (
            <aside className="mt-12 hidden lg:sticky lg:top-32 lg:mt-0 lg:block">
              <p className="font-display text-[11px] tracking-[0.3em] text-mocha uppercase">
                Contents
              </p>
              <ol className="mt-4 space-y-2.5 border-l border-line pl-4">
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <a
                      href={`#${heading.id}`}
                      className="line-clamp-2 text-[13px] leading-relaxed text-muted transition hover:text-mocha"
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ol>
            </aside>
          )}
        </div>

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
                  <span className="w-14 shrink-0 text-sm text-gold">
                    {label}
                  </span>
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
      </div>
    </article>
  );
}
