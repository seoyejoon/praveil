import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import { getNotices } from "@/lib/data";

export const metadata: Metadata = { title: "공지 · 이벤트" };

export default async function NoticePage() {
  const notices = await getNotices();

  return (
    <>
      <PageHeader en="Notice & Event" title="공지 · 이벤트" />
      <Container className="max-w-3xl py-12 md:py-16">
        {notices.length === 0 ? (
          <p className="py-20 text-center text-sm text-mocha">등록된 글이 없습니다.</p>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {notices.map((n) => (
              <li key={n.id}>
                <Link href={`/notice/${n.id}`} className="flex items-center gap-4 py-5 hover:text-mocha">
                  <span className="shrink-0 rounded-full bg-cream px-3 py-1 text-xs">
                    {n.type === "event" ? "이벤트" : "공지"}
                  </span>
                  <span className="flex-1 truncate">{n.title}</span>
                  <span className="shrink-0 text-xs text-taupe">{n.createdAt}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
