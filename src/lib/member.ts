import "server-only";
import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { hasDatabase, sql } from "./data/db";
import { getMemberSettings } from "./data/source-db";

// 홈페이지 회원: 가입 · 로그인은 관리자 서버의 회원 기능을 그대로 쓰고(아래 ADMIN_API_URL),
// 로그인 여부는 같은 DB의 세션 표를 읽어 확인한다. 쿠키 이름도 관리자와 같다.
export const adminApiUrl = () =>
  (process.env.ADMIN_API_URL || (process.env.VERCEL ? "https://praveil-admin.vercel.app" : "http://127.0.0.1:3100")).replace(/\/$/, "");

export const memberCookieName = (hospitalId: number) => `hs_website_session_${hospitalId}`;

export async function getSignupSettings() {
  if (!hasDatabase) return null;
  try {
    return await getMemberSettings();
  } catch {
    return null;
  }
}

export type Member = { name: string };

export async function getMember(): Promise<Member | null> {
  const settings = await getSignupSettings();
  if (!settings) return null;
  const token = (await cookies()).get(memberCookieName(settings.hospitalId))?.value;
  if (!token) return null;
  try {
    const [row] = await sql<{ name: string }>(
      `SELECT m.name FROM website_member_sessions s
         JOIN website_members m ON m.id = s.website_member_id AND m.hospital_id = s.hospital_id
        WHERE s.token_hash = $1 AND s.hospital_id = $2 AND s.expires_at > CURRENT_TIMESTAMP AND m.status = 'active'
        LIMIT 1`,
      [createHash("sha256").update(token).digest("hex"), settings.hospitalId],
    );
    return row ? { name: row.name } : null;
  } catch {
    return null;
  }
}
