import Link from "next/link";
import type { Notice } from "@/lib/data";
import Reveal from "@/components/Reveal";

// 공지사항(글 목록)과 이벤트(사진 카드)를 나눠서 보여준다
export default function NewsSplit({ en, title, notices }: { en: string; title: string; notices: Notice[] }) {
  const noticeList = notices.filter((n) => n.type === "notice").slice(0, 5);
  const events = notices.filter((n) => n.type === "event").slice(0, 2);

  const head = (label: string, sub: string, href: string) => (
    <div className="flex items-end justify-between border-b border-ink pb-4">
      <div>
        <p className="font-display text-xs tracking-[0.2em] text-gold">{sub}</p>
        <h3 className="mt-2 font-serif text-2xl font-medium tracking-tight md:text-[28px]">{label}</h3>
      </div>
      <Link href={href} className="group flex items-center gap-2 text-sm text-muted transition hover:text-ink" aria-label={`${label} 전체 보기`}>
        전체보기
        <span className="grid h-7 w-7 place-items-center rounded-full border border-ink/20 transition group-hover:border-ink group-hover:bg-ink group-hover:text-cream">+</span>
      </Link>
    </div>
  );

  return (
    <section className="bg-cream py-28 md:py-40">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <Reveal variant="zoom" className="text-center">
          <p className="font-display text-base tracking-[0.15em] text-gold md:text-lg">{en}</p>
          <h2 className="mt-4 font-serif text-[28px] font-medium tracking-tight md:text-[44px]">{title}</h2>
        </Reveal>

        <div className="mt-14 grid gap-16 md:mt-20 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <Reveal>
            {head("공지사항", "NOTICE", "/notice?type=notice")}
            {noticeList.length ? (
              <ul>
                {noticeList.map((n) => (
                  <li key={n.id} className="border-b border-ink/10">
                    <Link href={`/notice/${n.id}`} className="group flex items-center justify-between gap-6 py-5 md:py-6">
                      <span className="truncate text-[15px] transition group-hover:translate-x-1 group-hover:text-mocha md:text-base">{n.title}</span>
                      <span className="shrink-0 font-display text-xs tracking-widest text-taupe">{n.createdAt.replace(/-/g, ".")}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-16 text-center text-sm text-muted">등록된 공지사항이 없습니다.</p>
            )}
          </Reveal>

          <Reveal delay={150}>
            {head("이벤트", "EVENT", "/notice?type=event")}
            {events.length ? (
              <ul className="mt-6 grid gap-5 sm:grid-cols-2">
                {events.map((e) => (
                  <li key={e.id}>
                    <Link href={`/notice/${e.id}`} className="group block">
                      <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-sand">
                        {e.coverImageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={e.coverImageUrl} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                        ) : (
                          <span className="grid h-full place-items-center font-display text-sm tracking-[0.2em] text-mocha">EVENT</span>
                        )}
                      </div>
                      <p className="mt-4 font-serif text-lg font-medium group-hover:text-mocha">{e.title}</p>
                      {e.summary && <p className="mt-1 text-xs text-taupe">기간 {e.summary}</p>}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-6 grid aspect-[16/9] place-items-center rounded-2xl border border-dashed border-ink/15 text-center">
                <p className="text-sm text-muted">
                  진행 중인 이벤트가 없습니다.
                  <br />
                  <span className="text-xs text-taupe">새 이벤트는 관리자에서 등록하면 이곳에 표시됩니다.</span>
                </p>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
