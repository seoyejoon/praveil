import { CalendarCheck, MessageCircle, Phone } from "lucide-react";
import type { Hospital } from "@/lib/data";

// 모바일 전용 하단 고정 상담 바: 아이콘 + 짧은 이름
export default function FloatingCta({ hospital }: { hospital: Hospital }) {
  const items = [
    { href: `tel:${hospital.phone}`, label: "전화", Icon: Phone },
    { href: hospital.kakaoUrl, label: "카카오톡", Icon: MessageCircle, external: true },
    { href: hospital.naverReservationUrl, label: "예약", Icon: CalendarCheck, external: true },
  ];

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 grid h-[60px] grid-cols-3 overflow-hidden rounded-[18px] bg-black text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] md:hidden">
      {items.map(({ href, label, Icon, external }) => (
        <a
          key={label}
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="flex flex-col items-center justify-center gap-1 text-[11px] text-white/85 active:bg-white/10"
        >
          <Icon className="h-5 w-5" strokeWidth={1.5} />
          {label}
        </a>
      ))}
    </div>
  );
}
