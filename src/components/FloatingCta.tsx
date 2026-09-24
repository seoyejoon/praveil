import type { Hospital } from "@/lib/data";

// 모바일: 화면 하단 고정 바 / PC: 우측 하단 버튼
export default function FloatingCta({ hospital }: { hospital: Hospital }) {
  const items = [
    { href: `tel:${hospital.phone}`, label: "전화 상담" },
    { href: hospital.kakaoUrl, label: "카카오톡", external: true },
    { href: hospital.naverReservationUrl, label: "네이버 예약", external: true },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-line bg-ivory md:inset-x-auto md:right-6 md:bottom-6 md:flex md:flex-col md:gap-2 md:border-0 md:bg-transparent">
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="py-4 text-center text-sm first:bg-espresso first:text-ivory md:rounded-full md:bg-espresso md:px-5 md:py-3 md:text-ivory md:shadow-lg md:hover:bg-mocha"
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}
