"use client";

import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Notice } from "@/lib/data";
import { formatDate } from "@/lib/notice";

const PER_PAGE = 10;

// 공지사항 목록: 검색 + 10개씩 넘겨 보기
export default function NoticeList({ notices }: { notices: Notice[] }) {
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
            aria-label="공지사항 검색"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted/70"
          />
        </label>
      </div>

      {shown.length === 0 ? (
        <p className="mt-8 border-y border-line py-24 text-center text-sm text-muted">
          {q ? "찾는 글이 없습니다." : "등록된 공지가 없습니다."}
        </p>
      ) : (
        <ul className="mt-8 border-t border-ink/80">
          {shown.map((n, i) => {
            const no = list.length - ((page - 1) * PER_PAGE + i);
            const fresh =
              Date.now() - new Date(n.createdAt).getTime() < 7 * 86400000;
            return (
              <li key={n.id} className="border-b border-line">
                <Link
                  href={`/notice/${n.id}`}
                  className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1.5 py-6 md:grid-cols-[4rem_1fr_7rem_2.5rem] md:py-7"
                >
                  <span className="hidden font-display text-sm text-muted md:block">
                    {String(no).padStart(2, "0")}
                  </span>
                  <span className="flex items-center gap-2.5 text-base font-medium tracking-[-0.02em] transition-[translate,color] duration-500 group-hover:translate-x-1.5 group-hover:text-mocha md:text-lg">
                    {fresh && (
                      <span className="shrink-0 rounded-full bg-gold px-2 py-0.5 font-display text-[10px] tracking-widest text-white">
                        NEW
                      </span>
                    )}
                    <span className="line-clamp-1">{n.title}</span>
                  </span>
                  <span className="order-3 col-span-2 font-display text-xs tracking-widest text-muted md:order-none md:col-span-1 md:text-sm">
                    {formatDate(n.createdAt)}
                  </span>
                  <span className="row-span-2 grid h-10 w-10 place-items-center rounded-full border border-line transition group-hover:border-gold group-hover:bg-gold group-hover:text-white md:row-span-1">
                    <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {pages > 1 && (
        <nav aria-label="페이지" className="mt-12 flex justify-center gap-1.5">
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
