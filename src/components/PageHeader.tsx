import Container from "./Container";

export default function PageHeader({ en, title, description }: { en: string; title: string; description?: string }) {
  return (
    <section className="border-b border-line bg-cream py-16 md:py-24">
      <Container className="animate-rise text-center">
        <p className="font-display text-3xl text-taupe italic md:text-5xl">{en}</p>
        <h1 className="mt-2 font-serif text-2xl md:mt-3 md:text-3xl">{title}</h1>
        {description && <p className="mt-4 text-sm text-mocha md:text-base">{description}</p>}
      </Container>
    </section>
  );
}
