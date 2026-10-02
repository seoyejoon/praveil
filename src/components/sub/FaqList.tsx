import { ChevronDown, Plus } from "lucide-react";
import MoreToggle from "@/components/sub/MoreToggle";

// 답변: 빈 줄 = 문단, **굵게**, [글자](주소) = 출처 링크
function Answer({ text }: { text: string }) {
  return text.split(/\n{2,}/).map((para, i) => (
    <p key={i} className={i ? "mt-4" : undefined}>
      {para.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/).map((part, k) => {
        const bold = part.match(/^\*\*([^*]+)\*\*$/);
        if (bold)
          return (
            <strong key={k} className="font-semibold text-ink">
              {bold[1]}
            </strong>
          );
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link)
          return (
            <a
              key={k}
              href={link[2]}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-[0.92em] text-gold underline decoration-gold/40 underline-offset-4 transition hover:decoration-gold"
            >
              {link[1]}
            </a>
          );
        return part;
      })}
    </p>
  ));
}

// 자주 묻는 질문 (첫 질문은 펼쳐 둠, 모바일은 mobileLimit 개까지만 먼저 보임)
// - line: 위아래 선 목록 (기본)
// - pill: 둥근 회색 상자 목록 (질문 굵게, 오른쪽 꺾쇠)
export default function FaqList({
  items,
  mobileLimit = 99,
  variant = "line",
}: {
  items: { q: string; a: string }[];
  mobileLimit?: number;
  variant?: "line" | "pill";
}) {
  if (variant === "pill")
    return (
      <MoreToggle
        hidden={Math.max(0, items.length - mobileLimit)}
        label="질문 더 보기"
      >
        <ul className="grid gap-3 md:gap-4">
          {items.map((f, i) => (
            <li
              key={f.q}
              className={i >= mobileLimit ? "more-item" : undefined}
            >
              <details className="group rounded-[28px] bg-[#f5f4f2] transition-colors open:bg-ivory md:rounded-[40px]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-6 md:px-11 md:py-8 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-[16px] leading-snug font-bold tracking-[-0.02em] md:text-[20px]">
                    {f.q}
                  </h3>
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-black/40 transition-transform duration-300 group-open:rotate-180 group-open:text-gold"
                    strokeWidth={1.6}
                  />
                </summary>
                <div className="-mt-1 px-6 pb-7 text-[15px] leading-[1.85] text-muted md:px-11 md:pb-9 md:text-base">
                  <Answer text={f.a} />
                </div>
              </details>
            </li>
          ))}
        </ul>
      </MoreToggle>
    );

  return (
    <MoreToggle
      hidden={Math.max(0, items.length - mobileLimit)}
      label="질문 더 보기"
    >
      <ul className="border-t border-ink/80">
        {items.map((f, i) => (
          <li
            key={f.q}
            className={`border-b border-line ${i >= mobileLimit ? "more-item" : ""}`}
          >
            <details className="group" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-base font-medium md:py-7 md:text-lg [&::-webkit-details-marker]:hidden">
                <h3 className="flex gap-3 font-medium">
                  <span className="font-display text-gold">Q.</span>
                  {f.q}
                </h3>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/15 transition duration-300 group-open:rotate-45 group-open:border-gold group-open:bg-gold group-open:text-white">
                  <Plus className="h-4 w-4" strokeWidth={1.5} />
                </span>
              </summary>
              <div className="pr-14 pb-7 pl-7 text-[15px] leading-relaxed text-muted">
                <Answer text={f.a} />
              </div>
            </details>
          </li>
        ))}
      </ul>
    </MoreToggle>
  );
}
