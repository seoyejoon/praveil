"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Popup } from "@/lib/data";

const STORAGE_KEY = "praveil-popup-hidden-until";
const today = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });

// 관리자 '팝업' 메뉴에서 등록한 팝업. 메인 페이지에서만 띄운다.
export default function PopupLayer({ popups }: { popups: Popup[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let hidden = false;
    try {
      hidden = localStorage.getItem(STORAGE_KEY) === today();
    } catch {}
    setOpen(!hidden);
  }, []);

  if (pathname !== "/" || !open || popups.length === 0) return null;

  const hideToday = () => {
    try {
      localStorage.setItem(STORAGE_KEY, today());
    } catch {}
    setOpen(false);
  };

  // 기기별 노출: PC 전용은 모바일에서, 모바일 전용은 PC에서 숨긴다.
  const deviceClass = (p: Popup) => (p.device === "pc" ? "hidden md:flex" : p.device === "mobile" ? "flex md:hidden" : "flex");
  const pcCount = popups.filter((p) => p.device !== "mobile").length;
  const moCount = popups.filter((p) => p.device !== "pc").length;

  return (
    <div
      className={`fixed inset-0 z-[70] items-center justify-center bg-ink/45 px-5 backdrop-blur-[2px] ${moCount ? "flex" : "hidden"} ${pcCount ? "md:flex" : "md:hidden"}`}
      role="dialog"
      aria-modal="true"
      aria-label="병원 안내 팝업"
    >
      <div className="w-full max-w-[400px] overflow-hidden rounded-2xl bg-ivory shadow-2xl md:w-auto md:max-w-[calc(100vw-80px)]">
        <ul className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto md:gap-px md:overflow-visible md:bg-line">
          {popups.map((p) => {
            const inner = p.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.imageUrl} alt={p.title} className="block h-auto max-h-[70svh] w-full object-contain md:max-h-[560px]" />
            ) : (
              <div className="flex min-h-[320px] flex-col justify-center px-8 py-10">
                <p className="font-display text-sm tracking-[0.2em] text-gold">Notice</p>
                <p className="mt-3 font-serif text-2xl font-medium tracking-tight">{p.title}</p>
                {p.body && <p className="mt-4 text-[15px] leading-relaxed whitespace-pre-line text-muted">{p.body}</p>}
              </div>
            );
            return (
              <li key={p.id} className={`${deviceClass(p)} w-full shrink-0 snap-center bg-ivory md:w-[380px]`}>
                {p.linkUrl ? (
                  <Link href={p.linkUrl} onClick={() => setOpen(false)} className="block w-full" {...(/^https?:/.test(p.linkUrl) ? { target: "_blank", rel: "noreferrer" } : {})}>
                    {inner}
                  </Link>
                ) : (
                  <div className="w-full">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
        {moCount > 1 && <p className="bg-ivory pt-2 text-center text-[11px] tracking-widest text-taupe md:hidden">옆으로 넘겨 보세요</p>}
        <div className="grid grid-cols-2 border-t border-line bg-ivory text-sm">
          <button type="button" onClick={hideToday} className="py-4 text-muted transition hover:text-ink">
            오늘 하루 보지 않기
          </button>
          <button type="button" onClick={() => setOpen(false)} className="border-l border-line py-4 font-medium text-ink">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
