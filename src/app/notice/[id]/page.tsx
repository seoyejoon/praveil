import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import { getNotice, getNotices } from "@/lib/data";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const notices = await getNotices();
  return notices.map((n) => ({ id: String(n.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const notice = await getNotice(Number((await params).id));
  return { title: notice?.title };
}

export default async function NoticeDetailPage({ params }: Props) {
  const notice = await getNotice(Number((await params).id));
  if (!notice) notFound();

  return (
    <Container className="max-w-3xl pt-32 pb-16 md:pt-44 md:pb-24">
      <p className="text-xs text-mocha">{notice.type === "event" ? "이벤트" : "공지"}</p>
      <h1 className="mt-2 font-serif text-2xl md:text-3xl">{notice.title}</h1>
      <p className="mt-3 text-xs text-taupe">{notice.createdAt}</p>
      <div className="mt-10 border-t border-line pt-10 leading-relaxed whitespace-pre-line">{notice.body}</div>
      <Link href="/notice" className="mt-16 inline-block text-sm underline underline-offset-4">
        목록으로
      </Link>
    </Container>
  );
}
