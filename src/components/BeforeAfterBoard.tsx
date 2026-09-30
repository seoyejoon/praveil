"use client";

import { Lock, MoveHorizontal } from "lucide-react";
import { useRef, useState } from "react";
import type { BeforeAfter } from "@/content/beforeAfter";

type Category = { key: string; label: string };

// 전후사진 게시판
// - 로그인 전: 흐린 자리표시 + 로그인 안내 (의료법: 회원에게만 공개)
// - 로그인 후: 분야별로 골라 보고, 사진 위 손잡이를 좌우로 끌어 전 · 후 비교
export default function BeforeAfterBoard({
  member,
  items,
  categories,
}: {
  member: boolean;
  items: BeforeAfter[];
  categories: Category[];
}) {
  const [cat, setCat] = useState("all");
  const list = cat === "all" ? items : items.filter((i) => i.category === cat);

  return (
    <div>
      <ul className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {[{ key: "all", label: "전체" }, ...categories].map((c) => (
          <li key={c.key}>
            <button
              type="button"
              onClick={() => setCat(c.key)}
              className={`rounded-full border px-5 py-2.5 text-sm whitespace-nowrap transition ${cat === c.key ? "border-gold bg-gold text-white" : "border-line text-muted hover:border-gold/60 hover:text-ink"}`}
            >
              {c.label}
            </button>
          </li>
        ))}
      </ul>

      {!member ? (
        <div className="relative mt-10">
          <ul
            aria-hidden
            className="grid grid-cols-2 gap-3 blur-[2px] md:grid-cols-3 md:gap-5"
          >
            {Array.from({ length: 6 }, (_, i) => (
              <li
                key={i}
                className="aspect-[4/5] rounded-[20px] bg-[linear-gradient(135deg,#efe7dc,#e2d6c5)]"
              />
            ))}
          </ul>
          <div className="absolute inset-0 grid place-items-center bg-white/40 backdrop-blur-sm">
            <div className="mx-5 max-w-md rounded-[24px] bg-white p-8 text-center shadow-[0_24px_60px_-30px_rgba(29,26,23,0.5)] md:p-10">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-ivory text-gold">
                <Lock className="h-6 w-6" strokeWidth={1.5} />
              </span>
              <p className="mt-6 text-xl font-semibold tracking-[-0.02em]">
                회원에게만 공개합니다
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                의료법에 따라 전후사진은 로그인한 회원에게만 보여 드립니다.
              </p>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("praveil:login"))}
                className="mt-8 w-full rounded-full bg-espresso py-4 text-sm text-white transition hover:bg-mocha"
              >
                로그인 · 회원가입
              </button>
            </div>
          </div>
        </div>
      ) : list.length === 0 ? (
        <p className="mt-10 rounded-[24px] border border-line py-24 text-center text-muted">
          등록된 전후사진이 없습니다.
        </p>
      ) : (
        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((it) => (
            <li key={it.id}>
              <Compare before={it.before} after={it.after} alt={it.title} />
              <p className="mt-4 text-xs text-gold">
                {categories.find((c) => c.key === it.category)?.label}
              </p>
              <p className="mt-1 text-lg font-semibold">{it.title}</p>
              {it.note && <p className="mt-1 text-sm text-muted">{it.note}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// 전 · 후 비교: 손잡이를 끌거나 사진 위를 눌러 경계를 옮김
function Compare({
  before,
  after,
  alt,
}: {
  before: string;
  after: string;
  alt: string;
}) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const move = (clientX: number) => {
    const r = box.current!.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <div
      ref={box}
      className="relative aspect-[4/5] cursor-ew-resize touch-pan-y overflow-hidden rounded-[20px] bg-ivory select-none"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        move(e.clientX);
      }}
      onPointerMove={(e) => e.buttons && move(e.clientX)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={after}
        alt={`${alt} 후`}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={before}
        alt={`${alt} 전`}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        draggable={false}
      />
      <span className="absolute top-4 left-4 rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur">
        BEFORE
      </span>
      <span className="absolute top-4 right-4 rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur">
        AFTER
      </span>
      <span
        className="absolute inset-y-0 w-px bg-white"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute top-1/2 left-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-lg">
          <MoveHorizontal className="h-5 w-5" strokeWidth={1.5} />
        </span>
      </span>
    </div>
  );
}
