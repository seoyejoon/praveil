import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { CACHE_TAG } from "@/lib/data/source-db";

// 관리자에서 저장하면 호출된다. (관리자 .env.local 의 HOMEPAGE_REVALIDATE_URL / HOMEPAGE_REVALIDATE_SECRET)
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET ?? "";
  const given = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const ok = secret.length >= 32 && given.length === secret.length && timingSafeEqual(Buffer.from(given), Buffer.from(secret));
  if (!ok) return Response.json({ error: "unauthorized" }, { status: 401 });
  revalidateTag(CACHE_TAG);
  revalidatePath("/", "layout");
  return Response.json({ ok: true });
}
