"use client";

import { ArrowRight, ArrowUpRight, Gift, Megaphone } from "lucide-react";
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
          <h2 className="text-[34px] leading-[1.2] font-bold tracking-[-0.04em] md:text-[56px]">프라베일 소식</h2>
          <div role="tablist" className="mt-10 inline-flex rounded-full bg-ivory p-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={`rounded-full px-5 py-2.5 text-sm transition ${tab === t.key ? "bg-gold text-white" : "text-black/50 hover:text-black"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <Link
            href={tab === "all" ? "/notice" : `/notice?type=${tab}`}
            aria-label="소식 전체 보기"
            className="mt-10 hidden h-14 w-14 place-items-center rounded-full border border-black/25 transition duration-500 hover:rotate-45 hover:border-gold hover:bg-gold hover:text-white lg:grid"
          >
            <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} />
          </Link>
        </div>

        <ul className="border-t border-gold">
          {list.length ? (
            list.map((n) => (
              <li key={n.id} className="border-b border-black/10">
                <Link href={`/notice/${n.id}`} className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-6 md:gap-10 md:py-8">
                  <span className="font-display text-sm font-light tracking-[0.1em] text-black/45 md:text-base">{n.createdAt.replace(/-/g, ".")}</span>
                  <span className="min-w-0">
                    <span
                      title={n.type === "event" ? "이벤트" : "공지사항"}
                      className={`mr-3 inline-grid h-7 w-7 place-items-center rounded-full align-middle ${n.type === "event" ? "bg-gold text-white" : "bg-ivory text-gold"}`}
                    >
                      {n.type === "event" ? <Gift className="h-3.5 w-3.5" strokeWidth={1.6} /> : <Megaphone className="h-3.5 w-3.5" strokeWidth={1.6} />}
                    </span>
                    <span className="text-[16px] font-medium transition group-hover:underline group-hover:underline-offset-4 md:text-xl">{n.title}</span>
                    {n.type === "event" && n.summary && <span className="mt-1 block pl-10 text-xs text-black/45">기간 {n.summary}</span>}
                  </span>
                  <ArrowRight className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-2" strokeWidth={1.5} />
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
