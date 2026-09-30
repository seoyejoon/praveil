"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "@/components/Logo";
import type { Notice } from "@/lib/data";
import { coverOf, eventStatus, formatDate } from "@/lib/notice";

const filters = ["전체", "진행 중", "종료"] as const;

// 이벤트 목록: 대표 사진 카드 + 진행 중 / 종료 표시
export default function EventGallery({ events }: { events: Notice[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("전체");
  const list = events
    .map((e) => ({ ...e, status: eventStatus(e.summary), cover: coverOf(e) }))
    .filter((e) => filter === "전체" || e.status === filter);

  return (
    <div>
      <ul className="flex gap-2">
        {filters.map((f) => (
          <li key={f}>
            <button
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full border px-5 py-2.5 text-sm transition ${filter === f ? "border-gold bg-gold text-white" : "border-line text-muted hover:border-gold/60 hover:text-ink"}`}
            >
              {f}
            </button>
          </li>
        ))}
      </ul>

      {list.length === 0 ? (
        <p className="mt-10 rounded-[24px] border border-line py-24 text-center text-sm text-muted">
          {filter === "진행 중"
            ? "지금 진행 중인 이벤트가 없습니다."
            : "등록된 이벤트가 없습니다."}
        </p>
      ) : (
        <ul className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((e) => (
            <li key={e.id}>
              <Link href={`/notice/${e.id}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[linear-gradient(160deg,#f6f2ec,#e2d6c5)]">
                  {e.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={e.cover}
                      alt={e.title}
                      loading="lazy"
                      className={`h-full w-full object-cover transition-[scale] duration-[1.2s] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-105 ${e.status === "종료" ? "grayscale-[0.6]" : ""}`}
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-mocha/60">
                      <Logo className="h-6 w-auto" />
                    </div>
                  )}
                  {e.status && (
                    <span
                      className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs backdrop-blur ${e.status === "진행 중" ? "bg-gold text-white" : "bg-black/45 text-white"}`}
                    >
                      {e.status}
                    </span>
                  )}
                </div>
                <p className="mt-5 line-clamp-2 text-lg font-semibold tracking-[-0.02em] transition group-hover:text-mocha md:text-xl">
                  {e.title}
                </p>
                <p className="mt-2 text-sm text-muted">
                  {e.summary ? `기간 ${e.summary}` : formatDate(e.createdAt)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
