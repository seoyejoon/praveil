import Container from "./Container";

export default function PageHeader({ en, title, description }: { en: string; title: string; description?: string }) {
  return (
    <section className="border-b border-line bg-cream py-16 md:py-24">
      <Container className="text-center">
        <p className="text-xs tracking-[0.3em] text-mocha uppercase">{en}</p>
        <h1 className="mt-3 font-serif text-3xl md:text-4xl">{title}</h1>
        {description && <p className="mt-4 text-sm text-mocha md:text-base">{description}</p>}
      </Container>
    </section>
  );
}
