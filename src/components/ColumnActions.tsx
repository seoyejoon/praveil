"use client";

import { useEffect, useState } from "react";
import { Check, Heart, Share2 } from "lucide-react";

// 칼럼 작성자 카드 오른쪽 공감 · 공유 버튼 (관리자 ColumnPostActions 와 같은 동작)
// ponytail: 공감은 이 브라우저에만 기억(숫자 집계 없음) — 공감 수를 보여 주려면 DB 쓰기 경로가 필요
export default function ColumnActions({ id, title }: { id: number; title: string }) {
  const key = `pv-column-like-${id}`;
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      setLiked(localStorage.getItem(key) === "1");
    } catch {}
  }, [key]);

  function toggleLike() {
    const next = !liked;
    setLiked(next);
    try {
      if (next) localStorage.setItem(key, "1");
      else localStorage.removeItem(key);
    } catch {}
  }

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => undefined);
      return;
    }
    await navigator.clipboard.writeText(url).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  const btn =
    "inline-flex h-10 items-center gap-1.5 rounded-full border border-line bg-white px-4 text-[13px] text-ink/80 transition hover:border-gold hover:text-mocha";

  return (
    <div className="ml-auto flex shrink-0 gap-2">
      <button type="button" aria-pressed={liked} onClick={toggleLike} className={btn}>
        <Heart
          className={`h-4 w-4 ${liked ? "text-mocha" : ""}`}
          fill={liked ? "currentColor" : "none"}
          strokeWidth={1.6}
        />
        공감
      </button>
      <button type="button" onClick={() => void share()} className={btn}>
        {copied ? (
          <Check className="h-4 w-4" strokeWidth={1.6} />
        ) : (
          <Share2 className="h-4 w-4" strokeWidth={1.6} />
        )}
        {copied ? "주소 복사됨" : "공유"}
      </button>
    </div>
  );
}
