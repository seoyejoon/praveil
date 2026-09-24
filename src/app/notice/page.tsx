import type { Metadata } from "next";
import ContactCta from "@/components/ContactCta";
import NoticeBoard from "@/components/NoticeBoard";
import SubPage from "@/components/SubPage";
import { noticePage } from "@/content/pages";
import { getHospital, getNotices } from "@/lib/data";

export const metadata: Metadata = { title: "공지 · 이벤트" };

type Props = { searchParams: Promise<{ type?: string }> };

export default async function NoticePage({ searchParams }: Props) {
  const { type } = await searchParams;
  const initial = type === "notice" || type === "event" ? type : "all";
  const [hospital, notices] = await Promise.all([getHospital(), getNotices()]);
  const { hero } = noticePage;

  return (
    <SubPage en={hero.en} title={hero.title} description={hero.description} image={hero.image} crumbs={[{ label: "공지 · 이벤트" }]}>
      <section className="mx-auto max-w-5xl px-5 py-20 md:px-10 md:py-28">
        <NoticeBoard key={initial} notices={notices} initial={initial} />
      </section>
      <ContactCta hospital={hospital} />
    </SubPage>
  );
}
