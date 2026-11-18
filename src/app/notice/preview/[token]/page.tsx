import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ColumnArticle from "@/components/ColumnArticle";
import PostContent from "@/components/PostContent";
import { getDoctor, getHospital, getNoticeByPreviewToken } from "@/lib/data";
import { formatDate } from "@/lib/notice";

// 발행 전 확인용 링크 (관리자 원장칼럼 편집 화면의 '확인용 링크')
// - 링크 값을 아는 사람은 로그인 없이 볼 수 있음 (원장 컨펌용)
// - 검색 · 링크 미리보기에는 올리지 않음
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ token: string }> };

export const metadata: Metadata = {
  title: "발행 전 확인",
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

function PreviewBar({ scheduledAt }: { scheduledAt?: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] bg-espresso px-5 py-3 text-center text-[13px] text-white/90">
      발행 전 확인용 화면입니다
      {scheduledAt ? ` · 예약 발행 ${scheduledAt}` : ""} · 링크를 받은 분만 볼
      수 있습니다
    </div>
  );
}

export default async function NoticePreviewPage({ params }: Props) {
  const { token } = await params;
  const [notice, hospital, doctor] = await Promise.all([
    getNoticeByPreviewToken(token),
    getHospital(),
    getDoctor(),
  ]);
  if (!notice) notFound();

  if (notice.type === "column")
    return (
      <>
        <ColumnArticle
          notice={notice}
          newer={null}
          older={null}
          related={[]}
          hospital={hospital}
          doctor={doctor}
          listHref="/notice?type=column"
        />
        <PreviewBar scheduledAt={notice.scheduledAt} />
      </>
    );

  return (
    <article className="px-5 pt-32 pb-32 md:px-10 md:pt-44">
      <header className="mx-auto max-w-3xl">
        <h1 className="text-[28px] leading-snug font-semibold tracking-[-0.03em] md:text-[42px]">
          {notice.title}
        </h1>
        <p className="mt-6 text-sm text-muted">
          {formatDate(notice.createdAt)}
        </p>
      </header>
      <div className="mx-auto mt-12 max-w-3xl border-t border-line pt-12">
        <PostContent body={notice.body} />
      </div>
      <PreviewBar scheduledAt={notice.scheduledAt} />
    </article>
  );
}
