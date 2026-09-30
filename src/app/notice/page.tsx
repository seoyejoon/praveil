import type { Metadata } from "next";
import EventGallery from "@/components/EventGallery";
import NoticeList from "@/components/NoticeList";
import SubPage from "@/components/SubPage";
import { sitemap } from "@/content/sitemap";
import { getNotices } from "@/lib/data";

type Props = { searchParams: Promise<{ type?: string }> };

const boards = {
  notice: {
    en: "Notice",
    title: "공지사항",
    description: "진료 일정과 병원 소식을 알려 드립니다.",
    image: "/images/photos/hero-news.webp",
  },
  event: {
    en: "Event",
    title: "이벤트",
    description: "프라베일에서 진행하는 이벤트를 확인해 보세요.",
    image: "/images/photos/clinic-2.webp",
  },
};

const boardOf = async (searchParams: Props["searchParams"]) =>
  (await searchParams).type === "event" ? "event" : "notice";

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const b = boards[await boardOf(searchParams)];
  return {
    title: b.title,
    description: `프라베일 맑고고운의원 ${b.title}. ${b.description}`,
  };
}

// 커뮤니티: 공지사항(목록) · 이벤트(사진 카드) — 주소는 /notice?type=notice|event
export default async function NoticePage({ searchParams }: Props) {
  const type = await boardOf(searchParams);
  const b = boards[type];
  const community = sitemap.find((s) => s.key === "community")!;
  const posts = (await getNotices()).filter((n) => n.type === type);

  return (
    <SubPage
      en={b.en}
      title={b.title}
      description={b.description}
      image={b.image}
      crumbs={[
        { label: community.label, href: community.href },
        { label: b.title },
      ]}
      tabs={community.pages}
      current={`/notice?type=${type}`}
    >
      <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
        {type === "event" ? (
          <EventGallery events={posts} />
        ) : (
          <NoticeList notices={posts} />
        )}
      </section>
    </SubPage>
  );
}
