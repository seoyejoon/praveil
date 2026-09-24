// 사진 자리. src가 생기면 사진을, 없으면 톤에 맞는 빈 자리를 보여준다.
export default function ImageSlot({
  src,
  alt = "",
  label,
  tone = "light",
  className = "",
}: {
  src?: string;
  alt?: string;
  label?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  // 배경으로 깔 때(absolute)는 relative를 붙이지 않는다
  const position = className.includes("absolute") ? "" : "relative";
  return (
    <div className={`${position} overflow-hidden ${tone === "dark" ? "bg-espresso" : "bg-sand"} ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <div
          className={`absolute inset-0 flex items-end p-4 ${
            tone === "dark"
              ? "bg-[linear-gradient(97deg,#342f2a_0%,#4a433c_42%,#5a5148_63%,#39342f_100%)]"
              : "bg-[linear-gradient(135deg,#f1ebe1_0%,#e7ded1_50%,#d6caba_100%)]"
          }`}
        >
          {label && (
            <span className={`font-display text-xs tracking-[0.2em] ${tone === "dark" ? "text-cream/30" : "text-mocha/50"}`}>
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
