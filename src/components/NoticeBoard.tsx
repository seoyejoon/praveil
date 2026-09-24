"use client";

import Link from "next/link";
import { useState } from "react";
import type { Notice } from "@/lib/data";

const filters = [
  { key: "all", label: "전체" },
  { key: "notice", label: "공지" },
  { key: "event", label: "이벤트" },
] as const;

// 공지 · 이벤트 목록 (종류별로 걸러 보기)
export default function NoticeBoard({ notices }: { notices: Notice[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("all");
  const list = filter === "all" ? notices : notices.filter((n) => n.type === filter);

  return (
    <div>
      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-full border px-5 py-2 text-sm transition ${
              filter === f.key ? "border-ink bg-ink text-cream" : "border-ink/20 text-muted hover:border-ink/50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="mt-10 border-y border-ink/15 py-24 text-center text-sm text-muted">등록된 글이 없습니다.</p>
      ) : (
        <ul className="mt-10 border-t border-ink">
          {list.map((n, i) => (
            <li key={n.id} className="border-b border-ink/15">
              <Link href={`/notice/${n.id}`} className="group grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-1 py-6 md:grid-cols-[4rem_6rem_1fr_auto] md:py-8">
                <span className="hidden font-display text-sm text-taupe md:block">{String(list.length - i).padStart(2, "0")}</span>
                <span className="w-fit rounded-full border border-gold/60 px-3 py-1 text-xs text-mocha">
                  {n.type === "event" ? "이벤트" : "공지"}
                </span>
                <span className="col-span-2 font-serif text-lg font-medium transition-transform duration-500 group-hover:translate-x-1.5 md:col-span-1 md:text-xl">
                  {n.title}
                  {n.type === "event" && n.summary && (
                    <small className="mt-1 block font-sans text-xs font-normal tracking-normal text-taupe">기간 {n.summary}</small>
                  )}
                </span>
                <span className="col-span-2 font-display text-xs tracking-widest text-taupe md:col-span-1">{n.createdAt}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
