import type { Metadata } from "next";
import { og } from "@/lib/site-url";
import ColumnList from "@/components/ColumnList";
import EventGallery from "@/components/EventGallery";
import NoticeList from "@/components/NoticeList";
import SubPage from "@/components/SubPage";
import { sitemap } from "@/content/sitemap";
import { getNoticesForViewer } from "@/lib/data";

type Props = { searchParams: Promise<{ type?: string }> };

const boards = {
  notice: {
    en: "Notice",
    title: "공지사항",
    description: "진료 일정과 병원 소식을 알려 드립니다.",
    image: "/images/photos/about-community-20261106/hero-community-notice-pc-20261106.webp",
    mobileImage: "/images/photos/about-community-20261106/hero-community-notice-mobile-20261106.webp",
  },
  event: {
    en: "Event",
    title: "이벤트",
    description: "프라베일에서 진행하는 이벤트를 확인해 보세요.",
    image: "/images/photos/about-community-20261106/hero-community-event-pc-20261106.webp",
    mobileImage: "/images/photos/about-community-20261106/hero-community-event-mobile-20261106.webp",
  },
  column: {
    en: "Column",
    title: "원장칼럼",
    description: "대표원장이 진료하며 정리한 이야기를 전해 드립니다.",
    // 상패 · 인증패가 보이는 빈 상담실 (사람 사진을 쓰지 않음)
    image: "/images/photos/about-community-20261106/hero-community-column-pc-20261106-awards-v2.webp",
    mobileImage: "/images/photos/about-community-20261106/hero-community-column-mobile-20261106-awards-v2.webp",
  },
};

type BoardType = keyof typeof boards;

const boardOf = async (
  searchParams: Props["searchParams"],
): Promise<BoardType> => {
  const type = (await searchParams).type;
  return type === "event" || type === "column" ? type : "notice";
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const type = await boardOf(searchParams);
  const b = boards[type];
  const url = type === "notice" ? "/notice" : `/notice?type=${type}`;
  return {
    title: b.title,
    openGraph: og(url),
    description: `프라베일 맑고고운의원 ${b.title}. ${b.description}`,
    // 공지사항 · 이벤트는 같은 주소에 ?type 만 다름 → 각각을 대표 주소로 알려 중복으로 보이지 않게
    alternates: {
      canonical: url,
    },
  };
}

// 커뮤니티: 공지사항 · 원장칼럼(목록) · 이벤트(사진 카드) — 주소는 /notice?type=notice|event|column
export default async function NoticePage({ searchParams }: Props) {
  const type = await boardOf(searchParams);
  const b = boards[type];
  const community = sitemap.find((s) => s.key === "community")!;
  const posts = (await getNoticesForViewer()).filter((n) => n.type === type);

  return (
    <SubPage
      en={b.en}
      title={b.title}
      description={b.description}
      image={b.image}
      mobileImage={b.mobileImage}
      heroTone="interior"
      crumbs={[
        { label: community.label, href: community.href },
        { label: b.title },
      ]}
      tabs={community.pages}
      current={`/notice?type=${type}`}
      boldTitle
    >
      <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
        {type === "event" ? (
          <EventGallery events={posts} />
        ) : type === "column" ? (
          <ColumnList notices={posts} />
        ) : (
          <NoticeList notices={posts} board={b.title} />
        )}
      </section>
    </SubPage>
  );
}
