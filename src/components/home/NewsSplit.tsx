"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Notice } from "@/lib/data";
import Reveal from "@/components/Reveal";

type Tab = "notice" | "event";
type NewsItem = Pick<Notice, "id" | "type" | "title" | "summary" | "coverImageUrl" | "createdAt">;
const tabs: { key: Tab; label: string }[] = [
  { key: "notice", label: "공지사항" },
  { key: "event", label: "이벤트" },
];

// 공지사항 / 이벤트: 버튼으로 골라 보는 카드 슬라이드 (오른쪽으로 넘겨 보기)
export default function NewsSplit({ en, title, notices }: { en: string; title: readonly string[]; notices: NewsItem[] }) {
  const [tab, setTab] = useState<Tab>("notice");
  const [page, setPage] = useState(1);
  const trackRef = useRef<HTMLUListElement>(null);
  const items = notices.filter((n) => n.type === tab).slice(0, 10);

  // 탭을 바꾸면 처음으로
  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 });
    setPage(1);
  }, [tab]);

  const step = () => {
    const track = trackRef.current;
    const card = track?.querySelector("li");
    return card ? card.getBoundingClientRect().width + 24 : 0;
  };
  const onScroll = () => {
    const track = trackRef.current;
    const w = step();
    if (!track || !w) return;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    setPage(atEnd ? items.length : Math.min(items.length, Math.round(track.scrollLeft / w) + 1));
  };
  const move = (dir: 1 | -1) => trackRef.current?.scrollBy({ left: dir * step(), behavior: "smooth" });
  const progress = items.length ? (page / items.length) * 100 : 0;

  return (
    <section className="overflow-hidden bg-cream py-28 md:py-40">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <p className="font-display text-base tracking-[0.15em] text-gold md:text-lg">{en}</p>
            <h2 className="mt-4 font-serif text-[28px] leading-[1.35] font-medium tracking-tight md:text-[44px]">
              {title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </Reveal>
          <Reveal delay={150} className="flex flex-wrap items-center gap-3">
            <div role="tablist" aria-label="소식 종류" className="flex rounded-full border border-ink/15 bg-ivory p-1">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={tab === t.key}
                  onClick={() => setTab(t.key)}
                  className={`rounded-full px-5 py-2.5 text-sm transition md:px-6 ${
                    tab === t.key ? "bg-ink text-cream" : "text-muted hover:text-ink"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <Link
              href={`/notice?type=${tab}`}
              className="group inline-flex items-center gap-3 rounded-full border border-ink px-6 py-3 text-sm transition hover:bg-ink hover:text-cream"
            >
              자세히보기 <span aria-hidden className="transition group-hover:translate-x-1">→</span>
            </Link>
          </Reveal>
        </div>

        {items.length ? (
          <>
            {/* 카드가 화면 오른쪽 끝까지 이어지도록 오른쪽 여백을 풀어 준다 */}
            <ul
              key={tab}
              ref={trackRef}
              onScroll={onScroll}
              className="-mr-5 mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pr-5 pb-2 [scrollbar-width:none] md:mt-16 md:-mr-[max(2.5rem,calc((100vw-1280px)/2+2.5rem))] md:pr-10 [&::-webkit-scrollbar]:hidden"
            >
              {items.map((n) => (
                <li key={n.id} className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[calc((1200px-72px)/4)]">
                  <Link href={`/notice/${n.id}`} className="group block h-full overflow-hidden rounded-2xl bg-ivory transition hover:shadow-[0_18px_40px_rgba(60,40,20,0.08)]">
                    <div className="aspect-square overflow-hidden">
                      {n.coverImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={n.coverImageUrl} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                      ) : (
                        // 사진이 없는 글은 병원 톤의 표지를 자동으로 만든다
                        <div
                          className={`flex h-full flex-col justify-between p-6 transition duration-700 group-hover:scale-105 ${
                            n.type === "event" ? "bg-[#b89b72] text-white" : "bg-mocha text-cream"
                          }`}
                        >
                          <span className="font-display text-xs tracking-[0.3em] opacity-80">PRAVEIL</span>
                          <p className="line-clamp-3 font-serif text-xl leading-snug font-medium md:text-2xl">{n.title}</p>
                          <span className="font-display text-[11px] tracking-[0.2em] opacity-70">{n.type === "event" ? "EVENT" : "NOTICE"}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex min-h-[180px] flex-col p-6">
                      <span
                        className={`self-start rounded px-2.5 py-1 text-xs font-medium ${
                          n.type === "event" ? "bg-gold text-white" : "bg-ink text-cream"
                        }`}
                      >
                        {n.type === "event" ? "이벤트" : "공지사항"}
                      </span>
                      <p className="mt-4 line-clamp-2 text-[17px] leading-snug font-medium group-hover:text-mocha">{n.title}</p>
                      {n.type === "event" && n.summary && <p className="mt-2 text-xs text-taupe">기간 {n.summary}</p>}
                      <p className="mt-auto pt-6 font-display text-sm tracking-wider text-taupe">{n.createdAt}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {/* 몇 번째 카드인지 + 이전 / 다음 */}
            <div className="mt-10 flex items-center gap-6">
              <div className="flex items-center gap-3 font-display text-sm">
                <span>{page}</span>
                <span className="relative h-px w-20 bg-ink/15 md:w-24">
                  <span className="absolute inset-y-0 left-0 bg-ink transition-all duration-500" style={{ width: `${progress}%` }} />
                </span>
                <span className="text-muted">{items.length}</span>
              </div>
              <div className="flex gap-2">
                {([-1, 1] as const).map((dir) => (
                  <button
                    key={dir}
                    onClick={() => move(dir)}
                    aria-label={dir < 0 ? "이전" : "다음"}
                    className="grid h-12 w-12 place-items-center rounded-full bg-ivory shadow-[0_4px_14px_rgba(60,40,20,0.08)] transition hover:bg-ink hover:text-cream"
                  >
                    {dir < 0 ? "←" : "→"}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="mt-12 grid aspect-[16/6] place-items-center rounded-2xl border border-dashed border-ink/15 text-center md:mt-16">
            <p className="text-sm text-muted">
              {tab === "event" ? "진행 중인 이벤트가 없습니다." : "등록된 공지사항이 없습니다."}
              <br />
              <span className="text-xs text-taupe">관리자에서 글을 등록하면 이곳에 표시됩니다.</span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
