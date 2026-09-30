import Link from "next/link";

// 이용약관 · 개인정보처리방침 공통 화면 (글자 위주, 읽기 쉬운 폭)
// 관리자 원문의 "제1조 (…)" 줄은 제목으로, 나머지는 문단으로 보여 줌
export default function PolicyPage({
  en,
  title,
  body,
}: {
  en: string;
  title: string;
  body: string;
}) {
  const blocks = body
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);
  const isHead = (line: string) =>
    /^(제\s*\d+\s*조|[■□●◆]|부\s*칙)/.test(line) && line.length < 60;
  return (
    <article className="px-5 pt-32 pb-24 md:px-10 md:pt-44 md:pb-32">
      <header className="mx-auto max-w-[860px]">
        <nav
          aria-label="현재 위치"
          className="flex items-center gap-2 text-xs text-muted"
        >
          <Link href="/" className="hover:text-ink">
            HOME
          </Link>
          <span aria-hidden className="h-px w-3 bg-line" />
          <span className="text-ink">{title}</span>
        </nav>
        <p className="mt-10 font-display text-xs tracking-[0.35em] text-gold uppercase">
          {en}
        </p>
        <h1 className="mt-4 text-[30px] font-semibold tracking-[-0.03em] md:text-[44px]">
          {title}
        </h1>
        <p className="mt-6 flex gap-2 text-sm text-muted">
          <Link
            href="/terms"
            className={
              title === "이용약관"
                ? "text-ink underline decoration-gold underline-offset-4"
                : "hover:text-ink"
            }
          >
            이용약관
          </Link>
          <span aria-hidden>·</span>
          <Link
            href="/privacy"
            className={
              title !== "이용약관"
                ? "text-ink underline decoration-gold underline-offset-4"
                : "hover:text-ink"
            }
          >
            개인정보처리방침
          </Link>
        </p>
      </header>
      <div className="mx-auto mt-10 max-w-[860px] border-t border-ink/80 pt-10 text-[15px] leading-[1.9] break-keep text-ink/80">
        {blocks.map((b, i) => {
          const [first, ...rest] = b.split("\n");
          const head = isHead(first);
          const text = head ? rest.join("\n") : b;
          return (
            <section key={i} className={head ? "mt-10 first:mt-0" : ""}>
              {head && (
                <h2 className="mb-3 text-lg font-semibold text-ink">{first}</h2>
              )}
              {text && <p className="my-3 whitespace-pre-line">{text}</p>}
            </section>
          );
        })}
      </div>
    </article>
  );
}
