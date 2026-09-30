import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, List } from "lucide-react";
import { BaPair, Compare } from "@/components/BeforeAfterBoard";
import { baCategories, withCategoryKey } from "@/lib/before-after";
import { getBeforeAfterCases } from "@/lib/data";
import { getMember } from "@/lib/member";
import { formatDate } from "@/lib/notice";

type Props = { params: Promise<{ id: string }> };

const load = async (member: boolean) =>
  (await getBeforeAfterCases(member)).map(withCategoryKey);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = Number((await params).id);
  const c = (await load(false)).find((x) => x.id === id);
  return c
    ? {
        title: `${c.title} 전후사진`,
        description: c.summary || `${c.title} 시술 전후사진`,
        // 전후사진 글은 검색 결과에 싣지 않음 (의료광고 · 개인정보 보호)
        robots: { index: false, follow: true },
      }
    : {};
}

// 전후사진 한 건: 경과 단계별 전 · 후 (시술 전은 회원만), 회원은 겹쳐 보기
export default async function BeforeAfterDetail({ params }: Props) {
  const id = Number((await params).id);
  const member = Boolean(await getMember());
  const all = await load(member);
  const idx = all.findIndex((x) => x.id === id);
  if (idx < 0) notFound();
  const c = all[idx];
  const cat = baCategories.find((x) => x.key === c.category);
  const newer = all[idx - 1];
  const older = all[idx + 1];
  const rep = c.stages[c.representative];

  return (
    <article className="px-5 pt-32 pb-24 md:px-10 md:pt-44 md:pb-32">
      <header className="mx-auto max-w-5xl">
        <nav
          aria-label="현재 위치"
          className="flex items-center gap-2 text-xs text-muted"
        >
          <Link href="/" className="hover:text-ink">
            HOME
          </Link>
          <span aria-hidden className="h-px w-3 bg-line" />
          <Link href="/before-after" className="hover:text-ink">
            전후사진
          </Link>
        </nav>
        <p className="mt-10 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-gold/60 px-3 py-1 text-xs text-mocha">
            {cat?.label ?? c.category}
          </span>
          <span className="text-xs text-muted">{formatDate(c.createdAt)}</span>
        </p>
        <h1 className="mt-5 text-[28px] leading-snug font-semibold tracking-[-0.03em] md:text-[42px]">
          {c.title}
        </h1>
        {c.summary && (
          <p className="mt-4 text-[15px] leading-relaxed text-muted md:text-base">
            {c.summary}
          </p>
        )}
      </header>

      <div className="mx-auto mt-12 max-w-5xl space-y-14 border-t border-ink/80 pt-12">
        {member && rep.before && (
          <section>
            <h2 className="mb-5 text-lg font-semibold">
              겹쳐 보기
              <span className="ml-2 text-sm font-normal text-muted">
                손잡이를 좌우로 움직여 보세요
              </span>
            </h2>
            <Compare before={rep.before} after={rep.after} alt={c.title} />
          </section>
        )}
        {c.stages.map((st, i) => (
          <section key={i}>
            {c.stages.length > 1 && (
              <h2 className="mb-5 flex items-baseline gap-3 text-lg font-semibold">
                <span className="font-display text-sm text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                경과 {i + 1}
                <span className="text-sm font-normal text-muted">
                  {st.beforeLabel} → {st.afterLabel}
                </span>
              </h2>
            )}
            <BaPair stage={st} alt={c.title} size="lg" />
          </section>
        ))}
      </div>

      <p className="mx-auto mt-12 max-w-5xl rounded-[20px] bg-ivory p-6 text-xs leading-relaxed text-muted">
        ※ 환자 본인의 동의를 받아 게시한 사진입니다. 시술 결과는 사람마다 다르며
        같은 결과를 보장하지 않습니다. 시술 후 붓기 · 멍 · 붉어짐 등 부작용이
        생길 수 있습니다.
      </p>

      {cat && (
        <div className="mx-auto mt-6 max-w-5xl">
          <Link
            href={cat.href}
            className="group flex items-center justify-between rounded-[20px] border border-line p-6 transition hover:border-gold md:p-7"
          >
            <span>
              <span className="text-xs text-gold">관련 시술</span>
              <span className="mt-1 block text-lg font-semibold">
                {cat.label} 자세히 보기
              </span>
            </span>
            <ArrowUpRight
              className="h-5 w-5 text-muted transition group-hover:text-gold"
              strokeWidth={1.6}
            />
          </Link>
        </div>
      )}

      <nav
        aria-label="다른 글"
        className="mx-auto mt-16 max-w-5xl border-t border-ink/80"
      >
        {[
          { label: "다음 글", post: newer, Icon: ArrowLeft },
          { label: "이전 글", post: older, Icon: ArrowRight },
        ].map(({ label, post, Icon }) => (
          <div key={label} className="border-b border-line">
            {post ? (
              <Link
                href={`/before-after/${post.id}`}
                className="group flex items-center gap-5 py-5"
              >
                <span className="w-14 shrink-0 text-sm text-gold">{label}</span>
                <span className="line-clamp-1 flex-1 text-[15px] transition group-hover:text-mocha">
                  {post.title}
                </span>
                <Icon
                  className="h-4 w-4 shrink-0 text-muted"
                  strokeWidth={1.6}
                />
              </Link>
            ) : (
              <p className="flex gap-5 py-5 text-[15px] text-muted/70">
                <span className="w-14 shrink-0 text-sm">{label}</span>
                {label === "다음 글" ? "최신 글입니다." : "처음 글입니다."}
              </p>
            )}
          </div>
        ))}
      </nav>

      <div className="mt-12 text-center">
        <Link
          href="/before-after"
          className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-8 py-3.5 text-sm transition hover:border-ink hover:bg-ink hover:text-white"
        >
          <List className="h-4 w-4" strokeWidth={1.6} />
          목록으로
        </Link>
      </div>
    </article>
  );
}
