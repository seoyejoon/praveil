"use client";

import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Notice } from "@/lib/data";
import { coverOf, formatDate } from "@/lib/notice";

const PER_PAGE = 9;

// 원장칼럼 목록: 관리자 '블로그 에디터' 로 쓴 글을 대표 사진 · 분류 · 요약이 보이는 카드로 보여 준다.
export default function ColumnList({ notices }: { notices: Notice[] }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const list = useMemo(
    () => notices.filter((n) => n.title.includes(q.trim())),
    [notices, q],
  );
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const shown = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <p className="text-sm text-muted">
          전체 <span className="font-semibold text-ink">{list.length}</span>건
        </p>
        <label className="flex w-full items-center gap-2 rounded-full border border-line px-5 py-3 transition focus-within:border-gold md:w-80">
          <Search className="h-4 w-4 text-muted" strokeWidth={1.6} />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="제목으로 찾기"
            aria-label="원장칼럼 검색"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted/70"
          />
        </label>
      </div>

      {shown.length === 0 ? (
        <p className="mt-8 border-y border-line py-24 text-center text-sm text-muted">
          {q ? "찾는 글이 없습니다." : "등록된 원장칼럼 글이 없습니다."}
        </p>
      ) : (
        <ul className="mt-10 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((n) => {
            const cover = coverOf(n);
            const fresh =
              Date.now() - new Date(n.createdAt).getTime() < 7 * 86400000;
            return (
              <li key={n.id}>
                <Link href={`/notice/${n.id}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-ivory">
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.04]"
                      />
                    ) : (
                      <span className="absolute inset-0 grid place-items-center bg-gradient-to-br from-sand/70 to-ivory font-display text-[11px] tracking-[0.35em] text-mocha/60 uppercase">
                        Column
                      </span>
                    )}
                    {fresh && (
                      <span className="absolute top-4 left-4 rounded-full bg-gold px-2.5 py-1 font-display text-[10px] tracking-widest text-white">
                        NEW
                      </span>
                    )}
                    {n.isPrivate && (
                      <span className="absolute top-4 right-4 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] text-white">
                        비공개 · 관리자만 보임
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex items-center gap-2.5">
                    {n.category && (
                      <span className="rounded-full border border-gold/60 px-2.5 py-0.5 text-[11px] text-mocha">
                        {n.category}
                      </span>
                    )}
                    <span className="font-display text-xs tracking-widest text-muted">
                      {formatDate(n.createdAt)}
                    </span>
                  </div>

                  <h3 className="mt-2.5 line-clamp-2 text-[18px] leading-snug font-medium tracking-[-0.02em] transition-colors duration-500 group-hover:text-mocha md:text-[19px]">
                    {n.title}
                  </h3>

                  {n.summary && (
                    <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-muted">
                      {n.summary}
                    </p>
                  )}

                  <span className="mt-4 inline-flex items-center gap-2 text-[13px] text-mocha">
                    자세히 보기
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1"
                      strokeWidth={1.6}
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {pages > 1 && (
        <nav aria-label="페이지" className="mt-14 flex justify-center gap-1.5">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              aria-current={p === page ? "page" : undefined}
              className={`h-10 w-10 rounded-full font-display text-sm transition ${p === page ? "bg-espresso text-white" : "text-muted hover:bg-ivory"}`}
            >
              {p}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
