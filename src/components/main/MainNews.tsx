"use client";

import Link from "next/link";
import { useState } from "react";
import type { Notice } from "@/lib/data";

type Item = Pick<Notice, "id" | "type" | "title" | "summary" | "createdAt">;
const tabs = [
  { key: "all", label: "전체" },
  { key: "notice", label: "공지사항" },
  { key: "event", label: "이벤트" },
] as const;

// 소식: 탭으로 전체 / 공지 / 이벤트를 골라 보는 목록
export default function MainNews({ items }: { items: Item[] }) {
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("all");
  const list = items.filter((n) => tab === "all" || n.type === tab).slice(0, 5);

  return (
    <section className="bg-white px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-[1fr_2fr] lg:gap-24">
        <div>
          <p className="font-display text-xs tracking-[0.35em] text-black/50 uppercase md:text-sm">News</p>
          <h2 className="mt-6 text-[34px] leading-[1.2] font-bold tracking-[-0.04em] md:text-[56px]">프라베일 소식</h2>
          <div role="tablist" className="mt-10 flex gap-6">
            {tabs.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={`relative pb-2 text-[15px] transition ${tab === t.key ? "font-semibold text-black" : "text-black/40 hover:text-black"}`}
              >
                {t.label}
                <span className={`absolute inset-x-0 bottom-0 h-px bg-black transition-transform duration-500 ${tab === t.key ? "scale-x-100" : "scale-x-0"}`} />
              </button>
            ))}
          </div>
          <Link
            href={tab === "all" ? "/notice" : `/notice?type=${tab}`}
            className="group mt-12 hidden items-center gap-4 font-display text-sm tracking-[0.25em] uppercase lg:inline-flex"
          >
            View All
            <span className="grid h-12 w-12 place-items-center rounded-full border border-black/25 transition group-hover:bg-black group-hover:text-white">→</span>
          </Link>
        </div>

        <ul className="border-t border-black">
          {list.length ? (
            list.map((n) => (
              <li key={n.id} className="border-b border-black/10">
                <Link href={`/notice/${n.id}`} className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-6 md:gap-10 md:py-8">
                  <span className="font-display text-sm font-light tracking-[0.1em] text-black/45 md:text-base">{n.createdAt.replace(/-/g, ".")}</span>
                  <span className="min-w-0">
                    <span className="mr-3 inline-block border border-black/20 px-2 py-0.5 text-[11px] text-black/60">
                      {n.type === "event" ? "이벤트" : "공지"}
                    </span>
                    <span className="text-[16px] font-medium transition group-hover:underline group-hover:underline-offset-4 md:text-xl">{n.title}</span>
                    {n.type === "event" && n.summary && <span className="mt-1 block text-xs text-black/45">기간 {n.summary}</span>}
                  </span>
                  <span className="text-xl transition-transform duration-500 group-hover:translate-x-2">→</span>
                </Link>
              </li>
            ))
          ) : (
            <li className="py-16 text-center text-sm text-black/45">등록된 소식이 없습니다.</li>
          )}
        </ul>
      </div>
    </section>
  );
}
