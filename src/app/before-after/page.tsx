import type { Metadata } from "next";
import BeforeAfterBoard from "@/components/BeforeAfterBoard";
import SubPage from "@/components/SubPage";
import { baCategories, withCategoryKey } from "@/lib/before-after";
import { sitemap } from "@/content/sitemap";
import { getBeforeAfterCases } from "@/lib/data";
import { getMember } from "@/lib/member";

export const metadata: Metadata = {
  title: "전후사진",
  description:
    "프라베일 맑고고운의원 시술 전후사진. 시술 전 사진은 의료법에 따라 로그인한 회원에게만 공개합니다.",
};

// 전후사진: 시술 후 사진은 누구나, 시술 전 사진은 회원만 (비회원에게는 사진 주소 자체를 보내지 않음)
export default async function BeforeAfterPage() {
  const member = await getMember();
  const community = sitemap.find((s) => s.key === "community")!;
  const cases = (await getBeforeAfterCases(Boolean(member))).map(
    withCategoryKey,
  );

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
          cases={cases}
          categories={baCategories}
        />
        <p className="mt-16 border-t border-line pt-6 text-xs leading-relaxed text-muted">
          ※ 사진은 환자 본인의 동의를 받아 게시합니다. 시술 결과는 피부 상태 ·
          나이 · 생활 습관에 따라 사람마다 다르며, 같은 결과를 보장하지
          않습니다. 시술 후 붓기 · 멍 · 붉어짐 등 부작용이 생길 수 있습니다.
        </p>
      </section>
    </SubPage>
  );
}
