// 시술 부위 아이콘: 얼굴 선 그림 위에 해당 부위를 금색으로 표시
// - 부위 이름이 등록된 경우에만 그림 (없으면 아무것도 안 그림)
const G = "#c4a77d";

const zones: Record<string, React.ReactNode> = {
  // 앞볼 · 옆볼
  볼륨: (
    <>
      <ellipse
        cx="22.5"
        cy="32"
        rx="4.2"
        ry="3.4"
        fill={G}
        fillOpacity=".45"
        stroke={G}
      />
      <ellipse
        cx="41.5"
        cy="32"
        rx="4.2"
        ry="3.4"
        fill={G}
        fillOpacity=".45"
        stroke={G}
      />
    </>
  ),
  이마: (
    <path
      d="M21 19.5c3-5.5 19-5.5 22 0-4 1.6-18 1.6-22 0Z"
      fill={G}
      fillOpacity=".45"
      stroke={G}
    />
  ),
  팔자: (
    <>
      <path
        d="M28.6 32.5c-2.2 1.8-3 4.4-2.6 7"
        stroke={G}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M35.4 32.5c2.2 1.8 3 4.4 2.6 7"
        stroke={G}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </>
  ),
  입술: (
    <path
      d="M27.5 39.5c2.5-1.6 6.5-1.6 9 0-1.4 2.4-7.6 2.4-9 0Z"
      fill={G}
      fillOpacity=".55"
      stroke={G}
    />
  ),
  애교: (
    <>
      <path
        d="M22.5 28.2c2 1.2 4.6 1.2 6.6 0"
        stroke={G}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M34.9 28.2c2 1.2 4.6 1.2 6.6 0"
        stroke={G}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </>
  ),
  상안검: (
    <>
      <path
        d="M22.4 25.2c2-1.6 4.8-1.6 6.8 0"
        stroke={G}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M34.8 25.2c2-1.6 4.8-1.6 6.8 0"
        stroke={G}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </>
  ),
  "깊은 주름": (
    <>
      <path
        d="M25 17.5h14M26.5 20.5h11"
        stroke={G}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M20 35.5l2.5 2M44 35.5l-2.5 2"
        stroke={G}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </>
  ),
  목주름: (
    <path
      d="M26 50.5c4 1.2 8 1.2 12 0M25.6 54c4.3 1.3 8.5 1.3 12.8 0"
      stroke={G}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  ),
};

export const hasFaceZone = (name: string) => name in zones;

export default function FaceZoneIcon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const zone = zones[name];
  if (!zone) return null;
  return (
    <svg viewBox="15 9 34 49" fill="none" aria-hidden className={className}>
      {/* 얼굴 · 목 */}
      <path
        d="M32 11c-8.6 0-14 6.6-14 15.4 0 9.6 6.2 18.6 14 18.6s14-9 14-18.6C46 17.6 40.6 11 32 11Z"
        stroke="currentColor"
        strokeOpacity=".55"
        strokeWidth="1.3"
      />
      <path
        d="M25.5 43v14M38.5 43v14"
        stroke="currentColor"
        strokeOpacity=".55"
        strokeWidth="1.3"
      />
      {/* 눈썹 · 눈 · 코 · 입 */}
      <path
        d="M22 22.5c2.2-1 5-1 7.2 0M34.8 22.5c2.2-1 5-1 7.2 0"
        stroke="currentColor"
        strokeOpacity=".35"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M23 26.6c1.8-1 4-1 5.6 0M35.4 26.6c1.8-1 4-1 5.6 0"
        stroke="currentColor"
        strokeOpacity=".35"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M32 27.5v6.5l-1.8 1.2"
        stroke="currentColor"
        strokeOpacity=".35"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28.5 39.8c2.2.9 4.8.9 7 0"
        stroke="currentColor"
        strokeOpacity=".35"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {zone}
    </svg>
  );
}
