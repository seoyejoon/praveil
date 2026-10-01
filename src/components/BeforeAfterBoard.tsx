"use client";

import Link from "next/link";
import { Lock, MoveHorizontal } from "lucide-react";
import { useRef, useState } from "react";
import type { BeforeAfterCase, BeforeAfterStage } from "@/lib/data";

export type BaCategory = { key: string; label: string; href?: string };

const openLogin = () => window.dispatchEvent(new Event("praveil:login"));

// 시술 전 자리 (비회원): 사진 주소는 받지 않았으므로, 시술 후 사진을 아주 흐리게 깔고 자물쇠를 올림
function LockedBefore({
  after,
  label,
  button,
  size = "sm",
}: {
  after: string;
  label: string;
  button?: boolean;
  size?: "sm" | "lg";
}) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#2a2420]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={after}
        alt=""
        aria-hidden
        loading="lazy"
        className="h-full w-full scale-125 object-cover opacity-70 blur-2xl"
        draggable={false}
      />
      <div className="absolute inset-0 grid place-items-center bg-black/25 p-4 text-center text-white">
        <div>
          <span
            className={`mx-auto grid place-items-center rounded-full bg-white/20 backdrop-blur ${size === "lg" ? "h-10 w-10 md:h-14 md:w-14" : "h-10 w-10"}`}
          >
            <Lock
              className={size === "lg" ? "h-5 w-5" : "h-4 w-4"}
              strokeWidth={1.6}
            />
          </span>
          <p
            className={`mt-3 font-medium ${size === "lg" ? "text-xs md:text-base" : "text-xs md:text-sm"}`}
          >
            {label}은<br className="md:hidden" /> 로그인 후 공개
          </p>
          {button && (
            <button
              type="button"
              onClick={openLogin}
              className="mt-4 rounded-full bg-white px-4 py-2 text-xs whitespace-nowrap text-ink transition hover:bg-ivory md:mt-5 md:px-6 md:py-3 md:text-sm"
            >
              로그인 · 회원가입
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// 시술 전 · 후 한 쌍 (나란히)
export function BaPair({
  stage,
  alt,
  size = "sm",
}: {
  stage: BeforeAfterStage;
  alt: string;
  size?: "sm" | "lg";
}) {
  const tag =
    "absolute top-3 left-3 rounded-full px-3 py-1 font-display text-[10px] tracking-[0.2em] backdrop-blur md:text-[11px]";
  return (
    <div className="grid grid-cols-2 gap-1.5">
      <div className="relative aspect-[4/5] overflow-hidden rounded-l-[20px] bg-ivory">
        {stage.before ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={stage.before}
            alt={`${alt} ${stage.beforeLabel}`}
            loading="lazy"
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <LockedBefore
            after={stage.after}
            label={stage.beforeLabel}
            button={size === "lg"}
            size={size}
          />
        )}
        <span className={`${tag} bg-black/45 text-white`}>BEFORE</span>
      </div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-r-[20px] bg-ivory">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={stage.after}
          alt={`${alt} ${stage.afterLabel}`}
          loading="lazy"
          className="h-full w-full object-cover"
          draggable={false}
        />
        <span className={`${tag} bg-gold/90 text-white`}>AFTER</span>
      </div>
    </div>
  );
}

// 전후사진 목록: 분야별 걸러 보기 + 카드 (시술 전은 회원만)
export default function BeforeAfterBoard({
  member,
  cases,
  categories,
}: {
  member: boolean;
  cases: BeforeAfterCase[];
  categories: BaCategory[];
}) {
  const [cat, setCat] = useState("all");
  const labelOf = (c: string) =>
    categories.find((x) => x.key === c)?.label ?? c;
  const list = cat === "all" ? cases : cases.filter((c) => c.category === cat);
  const used = categories.filter((c) =>
    cases.some((x) => x.category === c.key),
  );

  return (
    <div>
      {!member && (
        <div className="mb-12 flex flex-col gap-5 rounded-[24px] bg-ivory p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-gold">
              <Lock className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <div>
              <p className="text-base font-semibold tracking-[-0.02em] md:text-lg">
                시술 전 사진은 회원에게만 공개합니다
              </p>
              <p className="mt-0.5 text-sm text-muted">
                의료법에 따라 로그인 후 확인하실 수 있습니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={openLogin}
            className="shrink-0 rounded-full bg-espresso px-7 py-3.5 text-sm text-white transition hover:bg-mocha"
          >
            로그인 · 회원가입
          </button>
        </div>
      )}

      <ul className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {[{ key: "all", label: "전체" }, ...used].map((c) => (
          <li key={c.key}>
            <button
              type="button"
              onClick={() => setCat(c.key)}
              className={`rounded-full border px-5 py-2.5 text-sm whitespace-nowrap transition ${cat === c.key ? "border-gold bg-gold text-white" : "border-line text-muted hover:border-gold/60 hover:text-ink"}`}
            >
              {c.label}
              <span className="ml-1.5 text-xs opacity-70">
                {c.key === "all"
                  ? cases.length
                  : cases.filter((x) => x.category === c.key).length}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {list.length === 0 ? (
        <p className="mt-10 rounded-[24px] border border-line py-24 text-center text-muted">
          등록된 전후사진이 없습니다.
        </p>
      ) : (
        <ul className="mt-10 grid gap-x-5 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <li key={c.id}>
              <Link href={`/before-after/${c.id}`} className="group block">
                <div className="transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:-translate-y-1">
                  <BaPair stage={c.stages[c.representative]} alt={c.title} />
                </div>
                <p className="mt-5 flex items-center gap-2 text-xs text-gold">
                  {labelOf(c.category)}
                  {c.stages.length > 1 && (
                    <span className="text-muted">
                      · 경과 {c.stages.length}단계
                    </span>
                  )}
                </p>
                <p className="mt-1.5 line-clamp-1 text-lg font-semibold tracking-[-0.02em] transition group-hover:text-mocha">
                  {c.title}
                </p>
                {c.summary && (
                  <p className="mt-1 line-clamp-1 text-sm text-muted">
                    {c.summary}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// 시술 페이지 안의 전후사진 (같은 시술 사례 몇 개 + 전체 보기)
export function BaPreview({
  member,
  cases,
  title,
}: {
  member: boolean;
  cases: BeforeAfterCase[];
  title: string;
}) {
  return (
    <div>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-xs tracking-[0.35em] text-gold uppercase">
            Before &amp; After
          </p>
          <h2 className="mt-4 text-[26px] leading-snug font-semibold tracking-[-0.03em] md:text-[36px]">
            {title} 전후사진
          </h2>
          <p className="mt-3 text-sm text-muted">
            {member
              ? "결과는 개인에 따라 다를 수 있습니다."
              : "시술 전 사진은 의료법에 따라 로그인한 회원에게만 공개합니다."}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          {!member && (
            <button
              type="button"
              onClick={openLogin}
              className="rounded-full bg-espresso px-6 py-3 text-sm text-white transition hover:bg-mocha"
            >
              로그인 · 회원가입
            </button>
          )}
          <Link
            href="/before-after"
            className="rounded-full border border-line px-6 py-3 text-sm transition hover:border-gold"
          >
            전체 보기
          </Link>
        </div>
      </div>
      <ul className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0">
        {cases.map((c) => (
          <li key={c.id} className="min-w-[82%] snap-start md:min-w-0">
            <Link href={`/before-after/${c.id}`} className="group block">
              <div className="transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:-translate-y-1">
                <BaPair stage={c.stages[c.representative]} alt={c.title} />
              </div>
              {c.stages.length > 1 && (
                <p className="mt-4 text-xs text-gold">
                  경과 {c.stages.length}단계
                </p>
              )}
              <p className="mt-1.5 line-clamp-1 text-lg font-semibold tracking-[-0.02em] transition group-hover:text-mocha">
                {c.title}
              </p>
              {c.summary && (
                <p className="mt-1 line-clamp-1 text-sm text-muted">
                  {c.summary}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 전 · 후 겹쳐 보기 (회원): 손잡이를 끌거나 사진 위를 눌러 경계를 옮김
export function Compare({
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
      className="relative aspect-[4/5] cursor-ew-resize touch-pan-y overflow-hidden rounded-[24px] bg-ivory select-none md:aspect-[4/3]"
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
      <span className="absolute top-4 left-4 rounded-full bg-black/45 px-3 py-1 font-display text-[11px] tracking-[0.2em] text-white backdrop-blur">
        BEFORE
      </span>
      <span className="absolute top-4 right-4 rounded-full bg-gold/90 px-3 py-1 font-display text-[11px] tracking-[0.2em] text-white backdrop-blur">
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
