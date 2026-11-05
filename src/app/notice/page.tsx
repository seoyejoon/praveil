import type { Metadata } from "next";
import ColumnList from "@/components/ColumnList";
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
    image: "/images/photos/hero-notice.webp?v=20261104",
    mobileImage: "/images/photos/hero-notice-m.webp",
  },
  event: {
    en: "Event",
    title: "이벤트",
    description: "프라베일에서 진행하는 이벤트를 확인해 보세요.",
    image: "/images/photos/hero-event.webp",
    // 확인 필요: 이벤트 세로 전용 사진 (없어서 PC 사진을 잘라 씀)
    mobileImage: undefined,
  },
  column: {
    en: "Column",
    title: "원장칼럼",
    description: "대표원장이 진료하며 정리한 이야기를 전해 드립니다.",
    // 확인 필요: 원장칼럼 전용 첫 화면 사진 (지금은 기존 상담 사진)
    image: "/images/photos/hero-consult.webp",
    mobileImage: undefined,
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
  return {
    title: b.title,
    description: `프라베일 맑고고운의원 ${b.title}. ${b.description}`,
    // 공지사항 · 이벤트는 같은 주소에 ?type 만 다름 → 각각을 대표 주소로 알려 중복으로 보이지 않게
    alternates: {
      canonical: type === "notice" ? "/notice" : `/notice?type=${type}`,
    },
  };
}

// 커뮤니티: 공지사항 · 원장칼럼(목록) · 이벤트(사진 카드) — 주소는 /notice?type=notice|event|column
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
      mobileImage={b.mobileImage}
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
