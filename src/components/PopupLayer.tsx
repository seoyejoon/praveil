"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Popup } from "@/lib/data";

const STORAGE_KEY = "praveil-popup-hidden-until";
const today = () =>
  new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });

// 관리자 '팝업' 메뉴에서 등록한 팝업. 메인 페이지에서만 띄운다.
// PC · 모바일 모두 한 장씩 넘기는 슬라이드. 넘김 표시(점)는 사진 위 아래쪽에 겹쳐 둔다.
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
      <div className="m-auto w-full max-w-[400px] overflow-hidden rounded-2xl bg-ivory shadow-2xl md:max-w-[420px]">
        <div className="relative">
          <ul
            ref={listRef}
            onScroll={(e) => {
              const el = e.currentTarget;
              if (el.clientWidth)
                setSlide(Math.round(el.scrollLeft / el.clientWidth));
            }}
            className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
          >
            {items.map((p) => {
              const inner = p.imageUrl ? (
                // 화면 높이에 맞춰 사진이 잘리지 않게 (아래 버튼 줄 높이만큼 뺀 높이까지)
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="mx-auto block h-auto max-h-[calc(100dvh-120px)] w-full object-contain"
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
              {/* PC: 좌우 화살표 (모바일은 손가락으로 밀어서 넘김) */}
              {(
                [
                  [-1, "이전 팝업", "left-3", ChevronLeft],
                  [1, "다음 팝업", "right-3", ChevronRight],
                ] as const
              ).map(([dir, label, side, Icon]) => (
                <button
                  key={dir}
                  type="button"
                  aria-label={label}
                  onClick={() => goTo(slide + dir)}
                  className={`absolute top-1/2 ${side} hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-ink shadow transition hover:bg-white md:grid`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                </button>
              ))}
            </>
          )}
        </div>

        <div className="grid grid-cols-2 border-t border-line bg-ivory text-sm">
          <button
            type="button"
            onClick={hideToday}
            className="py-4 text-muted transition hover:text-ink"
          >
            오늘 하루 보지 않기
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="border-l border-line py-4 font-medium text-ink"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
