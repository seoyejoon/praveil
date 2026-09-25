// 철학 카드 속 움직이는 선 아이콘 (금색 선, 천천히 반복)
// read: 돋보기가 피부 층을 따라 지나감 / fit: 원형 가이드가 돌며 곡선이 그려짐 / change: 물방울 속 물결이 차오름
// 움직임 줄이기 설정이면 멈춘 그림으로 보인다 (globals.css)
export default function PhilosophyIcon({ type }: { type: "read" | "fit" | "change" }) {
  const common = {
    viewBox: "0 0 120 120",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.2,
    strokeLinecap: "round" as const,
    className: "h-full w-full overflow-visible",
    "aria-hidden": true,
  };

  if (type === "read") {
    return (
      <svg {...common}>
        {/* 피부 층 */}
        <path d="M18 48c8-5 16-5 24 0s16 5 24 0 16-5 24 0 12 4 12 4" opacity=".55" />
        <path d="M18 62c8-5 16-5 24 0s16 5 24 0 16-5 24 0 12 4 12 4" opacity=".4" />
        <path d="M18 76c8-5 16-5 24 0s16 5 24 0 16-5 24 0 12 4 12 4" opacity=".25" />
        {/* 결 점 */}
        {[30, 46, 62, 78, 94].map((x, i) => (
          <circle key={x} cx={x} cy={55 + (i % 2) * 14} r="1.3" fill="currentColor" stroke="none" className="ph-twinkle" style={{ animationDelay: `${i * 0.4}s` }} />
        ))}
        {/* 돋보기 */}
        <g className="ph-glide">
          <circle cx="44" cy="58" r="15" strokeWidth="1.5" />
          <circle cx="44" cy="58" r="15" fill="currentColor" stroke="none" opacity=".08" />
          <path d="M55 69l11 11" strokeWidth="2" />
        </g>
      </svg>
    );
  }

  if (type === "fit") {
    return (
      <svg {...common}>
        {/* 도는 원형 가이드 */}
        <g className="ph-spin">
          <circle cx="60" cy="60" r="38" strokeDasharray="2 6" opacity=".6" />
          <circle cx="60" cy="22" r="2.2" fill="currentColor" stroke="none" />
        </g>
        {/* 기준선 */}
        <path d="M60 30v60M30 60h60" opacity=".2" />
        {/* 설계 곡선 (그려졌다 사라짐) */}
        <path d="M34 78C42 52 54 44 60 44s18 8 26 34" strokeWidth="1.6" pathLength={100} className="ph-draw" />
        {[
          [34, 78, "0s"],
          [60, 44, "0.9s"],
          [86, 78, "1.8s"],
        ].map(([x, y, d]) => (
          <circle key={String(x)} cx={Number(x)} cy={Number(y)} r="2.6" fill="currentColor" stroke="none" className="ph-pop" style={{ animationDelay: String(d) }} />
        ))}
      </svg>
    );
  }

  return (
    <svg {...common}>
      <defs>
        <clipPath id="ph-drop">
          <path d="M60 22C60 22 34 52 34 70a26 26 0 0 0 52 0C86 52 60 22 60 22Z" />
        </clipPath>
      </defs>
      {/* 차오르는 물결 */}
      <g clipPath="url(#ph-drop)">
        <g className="ph-rise">
          <path className="ph-wave" d="M-20 72c10-5 20-5 30 0s20 5 30 0 20-5 30 0 20 5 30 0 20-5 30 0 20 5 30 0V130H-20Z" fill="currentColor" stroke="none" opacity=".16" />
          <path className="ph-wave ph-wave-slow" d="M-20 78c10-4 20-4 30 0s20 4 30 0 20-4 30 0 20 4 30 0 20-4 30 0 20 4 30 0V130H-20Z" fill="currentColor" stroke="none" opacity=".12" />
        </g>
      </g>
      <path d="M60 22C60 22 34 52 34 70a26 26 0 0 0 52 0C86 52 60 22 60 22Z" strokeWidth="1.5" />
      <path d="M47 72a13 13 0 0 0 8 11" opacity=".6" />
      {/* 반짝임 */}
      <path d="M91 30v10M86 35h10" className="ph-twinkle" />
      <path d="M28 40v6M25 43h6" className="ph-twinkle" style={{ animationDelay: "1.2s" }} />
    </svg>
  );
}
