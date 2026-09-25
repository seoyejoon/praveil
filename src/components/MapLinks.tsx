import type { Hospital } from "@/lib/data";

const NaverIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
    <path fill="#03c75a" d="M12 1.5c-4.4 0-8 3.4-8 7.7 0 5.3 6.6 12.2 7.3 12.9.4.4 1 .4 1.4 0 .7-.7 7.3-7.6 7.3-12.9 0-4.3-3.6-7.7-8-7.7Z" />
    <path fill="#fff" d="M9 5.8h2l2.1 3.2V5.8H15v6.6h-2L10.9 9.2v3.2H9V5.8Z" />
  </svg>
);
const KakaoIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
    <rect width="24" height="24" rx="5" fill="#fee500" />
    <path fill="#3b82f6" d="M12 4.2c-3 0-5.3 2.3-5.3 5.2 0 3.7 4.5 8.7 4.8 9.1.3.3.7.3 1 0 .3-.4 4.8-5.4 4.8-9.1 0-2.9-2.3-5.2-5.3-5.2Z" />
    <circle cx="12" cy="9.4" r="2" fill="#fee500" />
  </svg>
);
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
    <path fill="#4285f4" d="M22.6 12.3c0-.8-.1-1.5-.2-2.2H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-2 3.3-4.8 3.3-8.1Z" />
    <path fill="#34a853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23Z" />
    <path fill="#fbbc05" d="M5.8 14.2a6.6 6.6 0 0 1 0-4.3V7.1H2.1a11 11 0 0 0 0 9.9l3.7-2.8Z" />
    <path fill="#ea4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4Z" />
  </svg>
);
const TmapIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
    <defs>
      <linearGradient id="tmap-bar" x1="0" x2="1">
        <stop offset="0" stopColor="#ff3b8d" />
        <stop offset="1" stopColor="#8b5cf6" />
      </linearGradient>
      <linearGradient id="tmap-stem" y1="0" y2="1" x1="0" x2="0">
        <stop offset="0" stopColor="#3b82f6" />
        <stop offset="1" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="18" height="5" rx="1.5" fill="url(#tmap-bar)" />
    <rect x="9.5" y="8" width="5" height="13" rx="1.5" fill="url(#tmap-stem)" />
  </svg>
);

// 관리자에 링크가 없으면 주소로 검색하는 링크를 대신 쓴다
export default function MapLinks({ links, address, name }: { links: Hospital["mapLinks"]; address: string; name?: string }) {
  const q = encodeURIComponent(address);
  const apps = [
    { key: "naver", label: "네이버지도", icon: <NaverIcon />, href: links.naver || `https://map.naver.com/p/search/${q}` },
    { key: "kakao", label: "카카오지도", icon: <KakaoIcon />, href: links.kakao || `https://map.kakao.com/?q=${q}` },
    { key: "google", label: "구글지도", icon: <GoogleIcon />, href: links.google || `https://www.google.com/maps/search/?api=1&query=${q}` },
    // 티맵은 휴대폰에 앱이 있어야 열린다
    { key: "tmap", label: "TMAP", icon: <TmapIcon />, href: links.tmap || `tmap://search?name=${encodeURIComponent(name || address)}` },
  ];

  return (
    <ul className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap">
      {apps.map((app) => (
        <li key={app.key}>
          <a
            href={app.href}
            target={app.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 rounded-full border border-ink/12 bg-white px-5 py-3 text-sm text-ink transition hover:border-ink/40 hover:shadow-[0_6px_16px_rgba(60,40,20,0.08)]"
          >
            {app.icon}
            {app.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
