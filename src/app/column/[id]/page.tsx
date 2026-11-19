import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import ColumnArticle from "@/components/ColumnArticle";
import {
  getDoctor,
  getHospital,
  getNoticeForViewer,
  getNoticesForViewer,
} from "@/lib/data";
import { coverOf, postHref } from "@/lib/notice";
import { og } from "@/lib/site-url";

// 원장칼럼 글 보기: /column/글번호 (공지 · 이벤트는 /notice/글번호)
type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const notice = await getNoticeForViewer(Number((await params).id));
  if (!notice || notice.type !== "column") return {};
  const cover = coverOf(notice);
  return {
    title: notice.title,
    description: notice.summary || notice.title,
    alternates: { canonical: `/column/${notice.id}` },
    // 비공개 · 예약 글은 관리자 확인용이라 검색에 올리지 않는다
    ...(notice.isPrivate && { robots: { index: false, follow: false } }),
    openGraph: og(`/column/${notice.id}`, {
      type: "article",
      ...(cover && { images: [cover] }),
    }),
  };
}

export default async function ColumnDetailPage({ params }: Props) {
  const id = Number((await params).id);
  const [notice, all, hospital, doctor] = await Promise.all([
    getNoticeForViewer(id),
    getNoticesForViewer(),
    getHospital(),
    getDoctor(),
  ]);
  if (!notice) notFound();
  // 공지 · 이벤트 글 번호로 들어오면 원래 주소로
  if (notice.type !== "column") permanentRedirect(postHref(notice));

  const same = all.filter((n) => n.type === "column");
  const idx = same.findIndex((n) => n.id === notice.id);
  const newer = idx > 0 ? same[idx - 1] : null;
  const older = idx >= 0 && idx < same.length - 1 ? same[idx + 1] : null;

  return (
    <ColumnArticle
      notice={notice}
      newer={newer}
      older={older}
      related={same.filter((n) => n.id !== notice.id).slice(0, 3)}
      // 본문 '같이 보면 좋은 글' 섬네일: 예전 주소 · 새 주소 모두
      thumbs={Object.fromEntries(
        all.flatMap((n) => {
          const c = coverOf(n);
          return c
            ? [
                [`/notice/${n.id}`, c],
                [`/column/${n.id}`, c],
              ]
            : [];
        }),
      )}
      hospital={hospital}
      doctor={doctor}
      listHref="/notice?type=column"
    />
  );
}
