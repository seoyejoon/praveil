import MagneticButton from "@/components/sub/MagneticButton";

export type Crumb = { label: string; href?: string };

// 밝은 첫 화면 공통 글자
// - 영문 → 큰 한글 제목 → 설명 → 상담 예약 버튼
export default function LightHeroText({
  en,
  title,
  description,
  facts,
  className = "md:max-w-[50%]",
  wrap = "",
}: {
  en: string;
  title: string;
  description?: string;
  facts: { label: string; value: string }[];
  /** 위치 표시는 첫 화면에서 쓰지 않음 (받기만 함) */
  crumbs?: Crumb[];
  className?: string;
  /** 바깥 틀에 더할 클래스 (세로 위치 등) */
  wrap?: string;
}) {
  const ease = "cubic-bezier(.22,1,.36,1)";
  return (
    <div
      className={`relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-16 md:px-10 md:pb-24 ${wrap}`}
    >
      <div className={className}>
        <p
          className="font-display text-xs font-light tracking-[0.4em] text-gold uppercase md:text-[13px]"
          style={{ animation: `slide-in 1s ${ease} 0.3s both` }}
        >
          {en}
        </p>
        <h1
          className="mt-4 text-[38px] leading-[1.15] font-semibold tracking-[-0.04em] md:mt-5 md:text-[60px] 2xl:text-[72px]"
          style={{ animation: `slide-in 1.1s ${ease} 0.4s both` }}
        >
          {title}
        </h1>
        {description && (
          <p
            className="mt-3 text-[15px] leading-relaxed text-ink/70 md:mt-5 md:text-lg"
            style={{ animation: `slide-in 1s ${ease} 0.55s both` }}
          >
            {description}
          </p>
        )}
        {/* 상담 예약 (아래 상담 · 위치 안내로) */}
        <div
          className="mt-7 md:mt-10"
          style={{ animation: `fade-up 1s ${ease} 0.75s both` }}
        >
          <MagneticButton href="#visit">상담 예약</MagneticButton>
        </div>
        {facts.length > 0 && (
          <dl
            className="mt-7 grid max-w-md grid-cols-3 border-t border-ink/10 pt-5 md:mt-10"
            style={{ animation: `fade-up 1s ${ease} 0.75s both` }}
          >
            {facts.slice(0, 3).map((f, i) => (
              <div
                key={f.label}
                className={i > 0 ? "border-l border-ink/10 pl-4" : "pr-4"}
              >
                <dt className="text-[11px] text-muted">{f.label}</dt>
                <dd className="mt-1 text-[13px] font-medium md:text-sm">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}
