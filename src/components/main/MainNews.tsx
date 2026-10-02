"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight, Gift, Megaphone } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import type { Notice } from "@/lib/data";
import { eventStatus } from "@/lib/notice";

type Item = Pick<Notice, "id" | "type" | "title" | "summary" | "createdAt"> & { cover?: string };
const tabs = [
  { key: "all", label: "전체" },
  { key: "notice", label: "공지사항" },
  { key: "event", label: "이벤트" },
] as const;

// 소식: 탭으로 전체 / 공지 / 이벤트를 골라 보는 목록 (이벤트는 섬네일 가로 슬라이드)
export default function MainNews({ items }: { items: Item[] }) {
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("all");
  const list = items.filter((n) => tab === "all" || n.type === tab).slice(0, 5);
  // 진행 중 이벤트 먼저, 그다음 최신순
  const events = items
    .filter((n) => n.type === "event")
    .map((n, i) => ({ n, i, ended: eventStatus(n.summary) === "종료" }))
    .sort((a, b) => Number(a.ended) - Number(b.ended) || a.i - b.i)
    .map((x) => x.n)
    .slice(0, 10);
  const track = useRef<HTMLUListElement>(null);
  const slide = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector("li");
    if (el && card) el.scrollBy({ left: dir * (card.clientWidth + 20), behavior: "smooth" });
  };

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

        {tab === "event" ? (
          <div className="min-w-0">
            {events.length ? (
              <>
                <ul ref={track} className="no-scrollbar -mx-5 flex scroll-px-5 snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 md:mx-0 md:scroll-px-0 md:px-0">
                  {events.map((n) => {
                    const status = eventStatus(n.summary);
                    return (
                      <li key={n.id} className="w-[72%] shrink-0 snap-start sm:w-[46%] xl:w-[31%]">
                        <Link href={`/notice/${n.id}`} className="group block">
                          <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-ivory">
                            {n.cover ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={n.cover} alt={n.title} loading="lazy" className="h-full w-full object-cover transition-[scale] duration-[1.2s] group-hover:scale-105" />
                            ) : (
                              <span className="grid h-full w-full place-items-center text-gold">
                                <Gift className="h-8 w-8" strokeWidth={1.2} />
                              </span>
                            )}
                            {status && (
                              <span className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs ${status === "진행 중" ? "bg-gold text-white" : "bg-black/50 text-white"}`}>{status}</span>
                            )}
                          </div>
                          <p className="mt-4 line-clamp-1 text-[17px] font-semibold tracking-[-0.02em] transition group-hover:text-mocha md:text-lg">{n.title}</p>
                          {n.summary && <p className="mt-1 text-xs text-black/45">기간 {n.summary}</p>}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                {events.length > 1 && (
                  <div className="mt-6 hidden gap-2 sm:flex">
                    <button type="button" aria-label="이전 이벤트" onClick={() => slide(-1)} className="grid h-12 w-12 place-items-center rounded-full border border-black/15 transition hover:border-gold hover:bg-gold hover:text-white">
                      <ArrowLeft className="h-4 w-4" strokeWidth={1.6} />
                    </button>
                    <button type="button" aria-label="다음 이벤트" onClick={() => slide(1)} className="grid h-12 w-12 place-items-center rounded-full border border-black/15 transition hover:border-gold hover:bg-gold hover:text-white">
                      <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="border-t border-gold py-16 text-center text-sm text-black/45">진행 중인 이벤트가 없습니다.</p>
            )}
          </div>
        ) : (
          <ul className="border-t border-gold">
            {list.length ? (
              list.map((n) => (
                <li key={n.id} className="border-b border-black/10">
                  <Link href={`/notice/${n.id}`} className="group grid grid-cols-[1fr_auto] items-center gap-4 py-5 md:grid-cols-[auto_1fr_auto] md:gap-10 md:py-8">
                    <span className="hidden font-display text-base font-light tracking-[0.1em] text-black/45 md:block">{n.createdAt.replace(/-/g, ".")}</span>
                    <span className="min-w-0">
                      <span className="flex min-w-0 items-center">
                      <span
                        title={n.type === "event" ? "이벤트" : "공지사항"}
                        className={`mr-2 inline-grid h-6 w-6 shrink-0 place-items-center rounded-full align-middle md:mr-3 md:h-7 md:w-7 ${n.type === "event" ? "bg-gold text-white" : "bg-ivory text-gold"}`}
                      >
                        {n.type === "event" ? <Gift className="h-3.5 w-3.5" strokeWidth={1.6} /> : <Megaphone className="h-3.5 w-3.5" strokeWidth={1.6} />}
                      </span>
                      <span className="truncate text-[15px] font-medium transition group-hover:underline group-hover:underline-offset-4 md:text-xl">{n.title}</span>
                      </span>
                    </span>
                    <ArrowRight className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-2" strokeWidth={1.5} />
                  </Link>
                </li>
              ))
            ) : (
              <li className="py-16 text-center text-sm text-black/45">등록된 소식이 없습니다.</li>
            )}
          </ul>
        )}
      </div>
    </section>
  );
}
