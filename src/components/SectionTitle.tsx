import Reveal from "./Reveal";

export default function SectionTitle({
  en,
  title,
  description,
  align = "center",
}: {
  en: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal className={`mb-12 md:mb-16 ${align === "center" ? "text-center" : ""}`}>
      <p className="font-display text-3xl text-taupe italic md:text-5xl">{en}</p>
      <h2 className="mt-2 font-serif text-xl md:mt-3 md:text-2xl">{title}</h2>
      {description && <p className="mt-4 text-sm leading-relaxed text-mocha md:text-base">{description}</p>}
    </Reveal>
  );
}
