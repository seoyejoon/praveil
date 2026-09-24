import type { Hospital } from "@/lib/data";

// 모바일 전용 하단 고정 상담 바 (PC는 헤더의 전화문의 · 예약하기 사용)
export default function FloatingCta({ hospital }: { hospital: Hospital }) {
  const items = [
    { href: `tel:${hospital.phone}`, label: "전화 상담" },
    { href: hospital.kakaoUrl, label: "카카오톡", external: true },
    { href: hospital.naverReservationUrl, label: "네이버 예약", external: true },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid h-14 grid-cols-3 border-t border-line bg-cream md:hidden">
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="flex items-center justify-center text-sm first:bg-espresso first:text-cream"
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}
