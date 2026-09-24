export default function SectionTitle({ en, title, description }: { en: string; title: string; description?: string }) {
  return (
    <div className="mb-10 text-center md:mb-14">
      <p className="text-xs tracking-[0.3em] text-mocha uppercase">{en}</p>
      <h2 className="mt-3 font-serif text-2xl md:text-3xl">{title}</h2>
      {description && <p className="mt-4 text-sm leading-relaxed text-mocha md:text-base">{description}</p>}
    </div>
  );
}
