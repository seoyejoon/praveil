// 이용약관 · 개인정보처리방침 공통 화면 (글자 위주, 읽기 쉬운 폭)
export default function PolicyPage({ en, title, body }: { en: string; title: string; body: string }) {
  return (
    <section className="bg-cream pt-36 pb-28 md:pt-48 md:pb-40">
      <div className="mx-auto max-w-[860px] px-5 md:px-10">
        <p className="font-display text-base tracking-[0.15em] text-gold md:text-lg">{en}</p>
        <h1 className="mt-4 font-serif text-[30px] font-medium tracking-tight md:text-[44px]">{title}</h1>
        <div className="mt-12 border-t border-ink/10 pt-10 text-[15px] leading-[1.9] whitespace-pre-line text-ink/80 break-keep md:mt-16">
          {body}
        </div>
      </div>
    </section>
  );
}
