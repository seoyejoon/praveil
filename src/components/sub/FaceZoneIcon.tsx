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
  // 눈 밑 꺼짐 (애교살보다 아래)
  눈밑: (
    <>
      <path
        d="M22.2 29.6c2.3 2.6 5 2.6 7.2 0-2.3 1.3-4.9 1.3-7.2 0Z"
        fill={G}
        fillOpacity=".55"
        stroke={G}
        strokeLinejoin="round"
      />
      <path
        d="M34.6 29.6c2.3 2.6 5 2.6 7.2 0-2.3 1.3-4.9 1.3-7.2 0Z"
        fill={G}
        fillOpacity=".55"
        stroke={G}
        strokeLinejoin="round"
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
  // 보톡스: 이마 · 미간 · 눈가
  표정주름: (
    <path
      d="M26 15.8h12M27.2 18.6h9.6M30.9 21.6v2.4M33.1 21.6v2.4M20 24.6l-1.7-.9M20 26.6h-2M20 28.6l-1.7.9M44 24.6l1.7-.9M44 26.6h2M44 28.6l1.7.9"
      stroke={G}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  ),
  // 턱 근육 (교근)
  턱: (
    <>
      <ellipse
        cx="22.4"
        cy="37.6"
        rx="2.6"
        ry="3.8"
        fill={G}
        fillOpacity=".45"
        stroke={G}
      />
      <ellipse
        cx="41.6"
        cy="37.6"
        rx="2.6"
        ry="3.8"
        fill={G}
        fillOpacity=".45"
        stroke={G}
      />
    </>
  ),
  // 턱 + 옆 라인
  슈퍼턱: (
    <path
      d="M19.4 27.5c-.6 4.6.4 9.2 3.2 13l2.4-1.8c-1.6-3.4-2.2-7.2-1.8-11.2ZM44.6 27.5c.6 4.6-.4 9.2-3.2 13l-2.4-1.8c1.6-3.4 2.2-7.2 1.8-11.2Z"
      fill={G}
      fillOpacity=".45"
      stroke={G}
      strokeLinejoin="round"
    />
  ),
  // 콧등 · 입꼬리 · 턱끝
  특수부위: (
    <g fill={G}>
      <circle cx="30.2" cy="28.6" r="1.1" />
      <circle cx="33.8" cy="28.6" r="1.1" />
      <circle cx="27.2" cy="41.2" r="1.1" />
      <circle cx="36.8" cy="41.2" r="1.1" />
      <circle cx="32" cy="43.2" r="1.1" />
    </g>
  ),
  // 피부 얕은 층: 얼굴 전체에 점
  스킨: (
    <g fill={G}>
      {[
        [26, 15.5],
        [32, 14.5],
        [38, 15.5],
        [22.5, 19.5],
        [41.5, 19.5],
        [21, 30.5],
        [24.5, 33.5],
        [21.5, 36],
        [43, 30.5],
        [39.5, 33.5],
        [42.5, 36],
        [25.5, 39.5],
        [38.5, 39.5],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r=".75" />
      ))}
    </g>
  ),
};

// 얼굴 밖 부위: 선 그림까지 따로 (viewBox 는 얼굴과 같음)
const L = {
  stroke: "currentColor",
  strokeOpacity: 0.55,
  strokeWidth: 1.3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
const bodies: Record<string, React.ReactNode> = {
  // 머리 · 목 · 어깨, 승모근 표시
  승모근: (
    <>
      <circle cx="32" cy="20" r="6.5" {...L} />
      <path
        d="M28.6 26v4.2c-3.6 2.2-8.4 2.6-10.6 6.2-.8 1.4-1 4-1 7.6M35.4 26v4.2c3.6 2.2 8.4 2.6 10.6 6.2.8 1.4 1 4 1 7.6"
        {...L}
      />
      <path
        d="M28.6 28.4c-1.6 2.6-5.2 3.8-8.6 5.4l1.4 1.8c3-1.4 5.6-2.2 7.2-3.6ZM35.4 28.4c1.6 2.6 5.2 3.8 8.6 5.4l-1.4 1.8c-3-1.4-5.6-2.2-7.2-3.6Z"
        fill={G}
        fillOpacity=".45"
        stroke={G}
        strokeLinejoin="round"
      />
    </>
  ),
  // 무릎 아래 두 다리, 종아리 근육 표시
  종아리: (
    <>
      <path
        d="M22.5 12c-.8 6-2.6 10.4-2.6 16.4 0 7 2.6 13 3 22.4M29.5 12c.3 5 .9 9.4.4 15-.5 6.4-2.2 13.4-2.4 23.8M34.5 12c-.3 5-.9 9.4-.4 15 .5 6.4 2.2 13.4 2.4 23.8M41.5 12c.8 6 2.6 10.4 2.6 16.4 0 7-2.6 13-3 22.4M22.9 50.8c-1.2 1.6-1.4 3.4 0 4.2h4.6c.4-1.4 0-2.8-.2-4.2M41.1 50.8c1.2 1.6 1.4 3.4 0 4.2h-4.6c-.4-1.4 0-2.8.2-4.2"
        {...L}
      />
      <ellipse
        cx="24.6"
        cy="27"
        rx="3.4"
        ry="7"
        fill={G}
        fillOpacity=".45"
        stroke={G}
      />
      <ellipse
        cx="39.4"
        cy="27"
        rx="3.4"
        ry="7"
        fill={G}
        fillOpacity=".45"
        stroke={G}
      />
    </>
  ),
  // 땀방울
  다한증: (
    <>
      <path
        d="M32 15c-4.6 6.6-8.4 11.8-8.4 17.2a8.4 8.4 0 0 0 16.8 0C40.4 26.8 36.6 21.6 32 15Z"
        fill={G}
        fillOpacity=".35"
        stroke={G}
        strokeLinejoin="round"
      />
      <path
        d="M21 38c-1.8 2.6-3.2 4.6-3.2 6.6a3.2 3.2 0 0 0 6.4 0c0-2-1.4-4-3.2-6.6ZM43 38c-1.8 2.6-3.2 4.6-3.2 6.6a3.2 3.2 0 0 0 6.4 0c0-2-1.4-4-3.2-6.6Z"
        {...L}
      />
      <path d="M28.6 32.4a3.6 3.6 0 0 0 3.4 3.4" {...L} />
    </>
  ),
};

export const hasFaceZone = (name: string) => name in zones || name in bodies;

export default function FaceZoneIcon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const zone = zones[name];
  if (!zone)
    return name in bodies ? (
      <svg viewBox="15 9 34 49" fill="none" aria-hidden className={className}>
        {bodies[name]}
      </svg>
    ) : null;
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
