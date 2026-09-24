import type { Hospital } from "@/lib/data";

// 공식 아이콘 파일을 받으면 badge 부분만 <img>로 교체한다.
const apps = [
  { key: "tmap", label: "티맵", badge: "T", color: "bg-gradient-to-br from-[#ff4d6d] to-[#3b5bfd]" },
  { key: "naver", label: "네이버지도", badge: "N", color: "bg-[#03c75a]" },
  { key: "google", label: "구글지도", badge: "G", color: "bg-[#4285f4]" },
] as const;

export default function MapLinks({ links }: { links: Hospital["mapLinks"] }) {
  return (
    <ul className="grid grid-cols-3 gap-2">
      {apps.map((app) => {
        const href = links[app.key];
        const inner = (
          <>
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white ${app.color}`}>
              {app.badge}
            </span>
            <span className="text-xs">{app.label}</span>
          </>
        );
        const cls = "flex flex-col items-center gap-2 rounded-xl border border-line bg-ivory py-4";
        return (
          <li key={app.key}>
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer" className={`${cls} transition hover:border-taupe`}>
                {inner}
              </a>
            ) : (
              <span className={`${cls} cursor-not-allowed opacity-60`} title="링크 준비 중">
                {inner}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
