import { Plus } from "lucide-react";

// 자주 묻는 질문 (첫 질문은 펼쳐 둠)
export default function FaqList({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  return (
    <ul className="border-t border-ink/80">
      {items.map((f, i) => (
        <li key={f.q} className="border-b border-line">
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
            <p className="pr-14 pb-7 pl-7 text-[15px] leading-relaxed text-muted">
              {f.a}
            </p>
          </details>
        </li>
      ))}
    </ul>
  );
}
