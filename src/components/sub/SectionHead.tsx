// 섹션 머리: 영문 작은 글씨 + 질문형 제목 (질문에 바로 답하는 구조 = 검색 · AI 답변에 잘 인용됨)
export default function SectionHead({
  en,
  title,
  tone = "light",
  className = "",
}: {
  en: string;
  title: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div className={className}>
      <p
        className={`font-display text-xs tracking-[0.35em] uppercase ${tone === "dark" ? "text-taupe" : "text-gold"}`}
      >
        {en}
      </p>
      {/* 단어 중간에서 끊기지 않게 (한국어는 기본이 글자 단위 줄바꿈) */}
      <h2 className="mt-4 text-[26px] leading-snug font-semibold tracking-[-0.03em] text-balance break-keep md:text-[36px]">
        {title}
      </h2>
    </div>
  );
}
