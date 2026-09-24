import Container from "./Container";

// 헤더가 화면 위에 떠 있으므로 그 높이만큼 위 여백을 더 준다.
export default function PageHeader({ en, title, description }: { en: string; title: string; description?: string }) {
  return (
    <section className="border-b border-line bg-ivory pt-32 pb-16 md:pt-44 md:pb-24">
      <Container className="animate-rise text-center">
        <p className="font-display text-base tracking-[0.15em] text-gold md:text-lg">{en}</p>
        <h1 className="mt-4 font-serif text-3xl font-medium tracking-tight md:text-5xl">{title}</h1>
        {description && <p className="mt-5 text-sm text-muted md:text-base">{description}</p>}
      </Container>
    </section>
  );
}
