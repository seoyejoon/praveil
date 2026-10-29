import { createHmac } from "node:crypto";
import { hasDatabase, sql } from "@/lib/data/db";
import { getMemberSettings } from "@/lib/data/source-db";

// 방문 기록 저장 (관리자 '통계'가 읽는 analytics_events)
// - IP · 브라우저 정보는 저장하지 않고, 하루 단위로 바뀌는 익명 값(visitor_hash)만 남김
// - 검색 로봇 · 다른 사이트에서 보낸 요청은 무시
const TYPES = new Set([
  "page_view",
  "contact_view",
  "phone_click",
  "consultation_click",
]);
const BOT =
  /bot|crawl|spider|slurp|bingpreview|headless|lighthouse|facebookexternalhit|kakaotalk-scrap|yeti|daumoa/i;

const cut = (v: unknown, n: number) =>
  typeof v === "string" ? v.slice(0, n) : "";

function sourceOf(referrer: string, utmSource: string, host: string) {
  const s = utmSource.toLowerCase();
  if (s)
    return /^(naver|google|instagram|facebook|meta|kakao|daum)$/.test(s)
      ? s
      : "other";
  try {
    const h = new URL(referrer).hostname;
    if (!h || h === host || h.endsWith(".praveil.com")) return "direct";
    if (/naver\.com$/.test(h)) return "naver";
    if (/google\./.test(h)) return "google";
    if (/instagram\.com$/.test(h)) return "instagram";
    if (/facebook\.com$|fb\.com$/.test(h)) return "facebook";
    if (/kakao\.com$|daum\.net$/.test(h)) return "kakao";
    return "other";
  } catch {
    return "direct";
  }
}

export async function POST(request: Request) {
  const ok = () => new Response(null, { status: 204 });
  if (!hasDatabase) return ok();
  const ua = request.headers.get("user-agent") ?? "";
  if (!ua || BOT.test(ua)) return ok();
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    "";
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== host) return ok();

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return ok();
  }
  const type = cut(body.type, 40);
  const path = cut(body.path, 300);
  if (!TYPES.has(type) || !path.startsWith("/") || path.startsWith("/api/"))
    return ok();
  const utm = (
    body.utm && typeof body.utm === "object" ? body.utm : {}
  ) as Record<string, unknown>;

  const ip =
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "";
  const day = new Date().toLocaleDateString("sv-SE", {
    timeZone: "Asia/Seoul",
  });
  const key = createHmac("sha256", process.env.REVALIDATE_SECRET || "praveil")
    .update("analytics")
    .digest();
  const visitor = createHmac("sha256", key)
    .update(`${day}|${ip}|${ua}`)
    .digest("hex")
    .slice(0, 32);

  try {
    const { hospitalId } = await getMemberSettings();
    await sql(
      `INSERT INTO analytics_events (hospital_id, event_type, event_day, path, source, visitor_hash, utm_source, utm_medium, utm_campaign)
       VALUES ($1, $2, $3::date, $4, $5, $6, $7, $8, $9)`,
      [
        hospitalId,
        type,
        day,
        path,
        sourceOf(cut(body.referrer, 500), cut(utm.source, 60), host),
        visitor,
        cut(utm.source, 60),
        cut(utm.medium, 60),
        cut(utm.campaign, 100),
      ],
    );
  } catch {
    // 기록 실패는 화면에 영향 없게 조용히 넘김
  }
  return ok();
}
