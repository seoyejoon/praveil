"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

// 모바일에서 긴 목록 줄이기: 안쪽의 .more-item 은 펼치기 전까지 모바일에서만 숨김 (PC는 항상 전부 보임)
export default function MoreToggle({
  hidden,
  label = "더 보기",
  tone = "light",
  children,
}: {
  /** 숨겨진 항목 수 (0이면 버튼 없음) */
  hidden: number;
  label?: string;
  tone?: "light" | "dark";
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div data-more={open ? "open" : "closed"}>
      {children}
      {!open && hidden > 0 && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full border py-3.5 text-sm transition md:hidden ${tone === "dark" ? "border-white/20 text-white/80" : "border-line text-muted"}`}
        >
          {label} ({hidden})
          <Plus className="h-4 w-4" strokeWidth={1.6} />
        </button>
      )}
    </div>
  );
}
