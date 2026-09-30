import type { Metadata } from "next";
import BeforeAfterBoard from "@/components/BeforeAfterBoard";
import SubPage from "@/components/SubPage";
import { beforeAfter } from "@/content/beforeAfter";
import { sitemap } from "@/content/sitemap";
import { getMember } from "@/lib/member";

export const metadata: Metadata = { title: "전후사진" };

// 전후사진: 회원에게만 공개 (의료법)
export default async function BeforeAfterPage() {
  const member = await getMember();
  const community = sitemap.find((s) => s.key === "community")!;
  const categories = sitemap
    .filter((s) => s.treatment)
    .map((s) => ({ key: s.key, label: s.label }));

  return (
    <SubPage
      en="Before & After"
      title="전후사진"
      description="프라베일에서 시술받은 분들의 변화를 보여 드립니다."
      image="/images/photos/hero-news.webp"
      crumbs={[
        { label: community.label, href: community.href },
        { label: "전후사진" },
      ]}
      tabs={community.pages}
      current="/before-after"
    >
      <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
        <BeforeAfterBoard
          member={Boolean(member)}
          items={beforeAfter}
          categories={categories}
        />
        <p className="mt-12 text-xs leading-relaxed text-muted">
          ※ 사진은 환자 본인의 동의를 받아 게시하며, 시술 결과는 개인에 따라
          다를 수 있습니다. 같은 결과를 보장하지 않습니다.
        </p>
      </section>
    </SubPage>
  );
}
