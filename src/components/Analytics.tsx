"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// 관리자 '통계'용 방문 기록: 페이지 보기 · 전화 · 예약(상담) 버튼 누름
// - 쿠키 · 개인정보 없음 (서버에서 하루 단위 익명 값으로만 셈)
const send = (type: string, path: string) => {
  try {
    const q = new URLSearchParams(location.search);
    const body = JSON.stringify({
      type,
      path,
      referrer: document.referrer,
      utm: {
        source: q.get("utm_source") ?? "",
        medium: q.get("utm_medium") ?? "",
        campaign: q.get("utm_campaign") ?? "",
      },
    });
    if (
      !navigator.sendBeacon?.(
        "/api/track",
        new Blob([body], { type: "application/json" }),
      )
    )
      fetch("/api/track", {
        method: "POST",
        body,
        keepalive: true,
        headers: { "content-type": "application/json" },
      }).catch(() => {});
  } catch {}
};

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    send("page_view", pathname);
    if (pathname === "/location") send("contact_view", pathname);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) send("phone_click", location.pathname);
      else if (/booking\.naver\.com|pf\.kakao\.com/.test(href))
        send("consultation_click", location.pathname);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
