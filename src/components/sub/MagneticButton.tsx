import { ArrowRight } from "lucide-react";

// 상담 예약 버튼 (제자리 고정)
// - 평소: 진한 바탕 + 금색 점(깜빡임) + 은은한 빛이 가끔 스쳐 지나감
// - 마우스를 올리면: 왼쪽부터 금색이 차오르고, 화살표가 빠져나갔다 다시 들어옴
export default function MagneticButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`group relative isolate inline-flex h-12 items-center overflow-hidden rounded-full bg-ink pr-1.5 pl-6 text-[15px] font-medium tracking-[-0.01em] text-white shadow-[0_14px_30px_-14px_rgba(21,19,17,0.55)] transition-shadow duration-500 hover:shadow-[0_16px_36px_-14px_rgba(168,142,106,0.75)] md:h-14 md:pl-7 md:text-base ${className}`}
    >
      {/* 금색 채움 (왼쪽부터) */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(.65,0,.35,1)] group-hover:scale-x-100"
      />
      {/* 스쳐 지나가는 빛 */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/3 -z-10 w-1/3 skew-x-[-20deg] animate-[btn-sheen_4.5s_ease-in-out_infinite] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)] motion-reduce:hidden"
      />
      {/* 깜빡이는 점 */}
      <span
        aria-hidden
        className="relative mr-3 grid h-2 w-2 place-items-center"
      >
        <span className="absolute h-2 w-2 animate-ping rounded-full bg-gold opacity-70 group-hover:bg-white" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-gold transition-colors group-hover:bg-white" />
      </span>
      {children}
      <span aria-hidden className="mx-4 h-4 w-px bg-white/25 md:mx-5" />
      {/* 화살표: 오른쪽으로 빠져나가고 왼쪽에서 다시 들어옴 */}
      <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-white text-ink md:h-11 md:w-11">
        <ArrowRight
          className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(.65,0,.35,1)] group-hover:translate-x-8"
          strokeWidth={1.8}
        />
        <ArrowRight
          className="absolute h-4 w-4 -translate-x-8 transition-transform duration-500 ease-[cubic-bezier(.65,0,.35,1)] group-hover:translate-x-0"
          strokeWidth={1.8}
        />
      </span>
    </a>
  );
}
