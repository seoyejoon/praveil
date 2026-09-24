import Reveal from "./Reveal";

export default function SectionTitle({
  en,
  title,
  description,
  align = "center",
  tone = "dark",
}: {
  en: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  tone?: "dark" | "light";
}) {
  return (
    <Reveal variant="zoom" className={`mb-12 md:mb-20 ${align === "center" ? "text-center" : ""}`}>
      <p className={`font-display text-base tracking-[0.15em] md:text-lg ${tone === "light" ? "text-[#ffd899]" : "text-gold"}`}>
        {en}
      </p>
      <h2
        className={`mt-4 font-serif text-[28px] leading-snug font-medium tracking-tight md:mt-5 md:text-[44px] md:leading-tight ${tone === "light" ? "text-white" : "text-ink"}`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-5 text-[15px] leading-relaxed md:mt-6 md:text-lg ${tone === "light" ? "text-cream/80" : "text-muted"}`}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
