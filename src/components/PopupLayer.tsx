"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleCheck, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Popup } from "@/lib/data";

const STORAGE_KEY = "praveil-popup-hidden-until";
const today = () =>
  new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });

// 관리자 '팝업' 메뉴에서 등록한 팝업. 메인 페이지에서만 띄운다.
// PC · 모바일 모두 한 장씩 넘기는 슬라이드. 넘김 표시(점)는 사진 위 아래쪽에 겹쳐 둔다.
// 모바일은 손가락으로, PC는 마우스로 끌어서 넘기고, PC는 오른쪽 제목 상자로도 고른다.
export default function PopupLayer({ popups }: { popups: Popup[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const [slide, setSlide] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let hidden = false;
    try {
      hidden = localStorage.getItem(STORAGE_KEY) === today();
    } catch {}
    setOpen(!hidden);
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // 기기별 노출: PC 전용은 모바일에서, 모바일 전용은 PC에서 뺀다.
  const items = popups.filter((p) =>
    desktop ? p.device !== "mobile" : p.device !== "pc",
  );

  useEffect(() => {
    setSlide(0);
    listRef.current?.scrollTo({ left: 0 });
  }, [desktop]);

  // PC: 마우스로 좌우로 끌어서 넘기기 (끄는 동안 칸 맞춤을 끄고, 놓으면 가까운 장으로. 끌었으면 링크 클릭은 막음)
  const visible = open && pathname === "/" && items.length > 1;
  useEffect(() => {
    const el = listRef.current;
    if (!visible || !el) return;
    let drag: { x: number; left: number; moved: boolean } | null = null;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      drag = { x: e.clientX, left: el.scrollLeft, moved: false };
      el.style.scrollSnapType = "none";
      el.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (Math.abs(dx) > 4) drag.moved = true;
      el.scrollLeft = drag.left - dx;
    };
    const up = () => {
      if (!drag) return;
      const { moved, left } = drag;
      drag = null;
      el.style.cursor = "";
      const w = el.clientWidth;
      // 조금만 끌어도(폭의 15%) 다음 · 이전 장으로
      const start = Math.round(left / w);
      const delta = (el.scrollLeft - left) / w;
      const target = Math.max(
        0,
        Math.min(
          items.length - 1,
          Math.abs(delta) > 0.15 ? start + Math.sign(delta) : start,
        ),
      );
      el.style.scrollSnapType = "";
      el.scrollTo({ left: target * w, behavior: "smooth" });
      if (moved) {
        const stop = (ev: MouseEvent) => {
          ev.preventDefault();
          ev.stopPropagation();
        };
        el.addEventListener("click", stop, { capture: true, once: true });
        setTimeout(() => el.removeEventListener("click", stop, true), 0);
      }
    };
    const noDrag = (e: DragEvent) => e.preventDefault();
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    el.addEventListener("dragstart", noDrag);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      el.removeEventListener("dragstart", noDrag);
    };
  }, [visible, items.length]);

  if (pathname !== "/" || !open || items.length === 0) return null;

  const hideToday = () => {
    try {
      localStorage.setItem(STORAGE_KEY, today());
    } catch {}
    setOpen(false);
  };

  const goTo = (i: number) => {
    const el = listRef.current;
    if (!el) return;
    const next = (i + items.length) % items.length;
    el.scrollTo({ left: el.clientWidth * next, behavior: "smooth" });
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-ink/45 px-5 py-6 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="병원 안내 팝업"
    >
      {/* 팝업 사진(카드)을 화면 가운데에 두고, 제목 상자는 그 오른쪽 바깥에 붙임 */}
      <div className="relative m-auto w-full max-w-[400px] md:w-[420px] md:max-w-none">
        <div className="w-full">
          <div className="relative overflow-hidden rounded-2xl bg-ivory shadow-2xl">
            <ul
              ref={listRef}
              onScroll={(e) => {
                const el = e.currentTarget;
                if (el.clientWidth)
                  setSlide(Math.round(el.scrollLeft / el.clientWidth));
              }}
              className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto select-none md:cursor-grab"
            >
              {items.map((p) => {
                const inner = p.imageUrl ? (
                  // 화면 높이에 맞춰 사진이 잘리지 않게 (아래 버튼 줄 높이만큼 뺀 높이까지)
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    draggable={false}
                    src={p.imageUrl}
                    alt={p.title}
                    className="mx-auto block h-auto max-h-[calc(100dvh-110px)] w-full object-contain"
                  />
                ) : (
                  <div className="flex min-h-[320px] flex-col justify-center px-8 py-10">
                    <p className="font-display text-sm tracking-[0.2em] text-gold">
                      Notice
                    </p>
                    <p className="mt-3 font-serif text-2xl font-medium tracking-tight">
                      {p.title}
                    </p>
                    {p.body && (
                      <p className="mt-4 text-[15px] leading-relaxed whitespace-pre-line text-muted">
                        {p.body}
                      </p>
                    )}
                  </div>
                );
                return (
                  <li
                    key={p.id}
                    className="flex w-full shrink-0 snap-center items-center bg-ivory"
                  >
                    {p.linkUrl ? (
                      <Link
                        href={p.linkUrl}
                        onClick={() => setOpen(false)}
                        className="block w-full"
                        {...(/^https?:/.test(p.linkUrl)
                          ? { target: "_blank", rel: "noreferrer" }
                          : {})}
                      >
                        {inner}
                      </Link>
                    ) : (
                      <div className="w-full">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>

            {items.length > 1 && (
              <>
                {/* 넘김 점: 사진 위 아래쪽에 겹침 */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center"
                  role="tablist"
                  aria-label="팝업 넘기기"
                >
                  <div className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-ink/35 px-2.5 py-1.5 backdrop-blur-sm">
                    {items.map((p, i) => (
                      <button
                        key={p.id}
                        type="button"
                        role="tab"
                        aria-selected={slide === i}
                        aria-label={`${i + 1}번째 팝업`}
                        onClick={() => goTo(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${slide === i ? "w-5 bg-white" : "w-1.5 bg-white/55"}`}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 팝업 아래 어두운 바탕 위 흰 글씨 버튼 */}
          <div className="mt-3 flex items-center justify-between px-1 text-[15px] text-white">
            <button
              type="button"
              onClick={hideToday}
              className="inline-flex items-center gap-2 py-2 transition hover:opacity-80"
            >
              <CircleCheck className="h-5 w-5" strokeWidth={1.6} />
              오늘 하루 보지 않기
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1.5 py-2 transition hover:opacity-80"
            >
              닫기
              <X className="h-5 w-5" strokeWidth={1.8} />
            </button>
          </div>
        </div>
        {/* PC: 오른쪽에 팝업 제목 상자 (누르면 그 팝업으로) */}
        {items.length > 1 && (
          <ul
            className="absolute top-0 left-full ml-4 hidden w-[200px] flex-col gap-2 lg:flex"
            aria-label="팝업 목록"
          >
            {items.map((p, i) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={slide === i}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-[14px] leading-snug transition ${slide === i ? "border-white bg-white font-semibold text-ink shadow-lg" : "border-white/35 bg-ink/30 text-white/85 backdrop-blur-sm hover:border-white/70 hover:text-white"}`}
                >
                  <span className="line-clamp-2">{p.title}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
