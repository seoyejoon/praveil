import { getNotices } from "@/lib/data";
import { renderRss } from "@/lib/rss";
import { SITE_URL } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const columnOnly = new URL(request.url).searchParams.get("type") === "column";
  return new Response(renderRss(await getNotices(), SITE_URL, columnOnly), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
