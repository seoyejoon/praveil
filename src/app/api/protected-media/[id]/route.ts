import { cookies } from "next/headers";
import { adminApiUrl, getSignupSettings, memberCookieName } from "@/lib/member";

// 전후사례 '시술 전' 사진 중계: 로그인한 회원의 쿠키를 관리자 서버에 그대로 전달하고,
// 관리자가 회원 · 게시글 연결을 확인한 뒤에만 사진을 돌려준다. (저장 · 캐시하지 않음)
const hidden = () =>
  new Response(null, {
    status: 404,
    headers: { "cache-control": "private, no-store" },
  });

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^[1-9]\d{0,15}$/.test(id)) return hidden();
  const settings = await getSignupSettings();
  if (!settings) return hidden();
  const name = memberCookieName(settings.hospitalId);
  const token = (await cookies()).get(name)?.value;
  if (!token) return hidden();

  try {
    const res = await fetch(
      `${adminApiUrl()}/api/public/protected-media/${id}`,
      {
        headers: { cookie: `${name}=${token}` },
        cache: "no-store",
      },
    );
    const type = res.headers.get("content-type") ?? "";
    if (!res.ok || !/^image\/(jpeg|png|webp)$/.test(type)) return hidden();
    return new Response(res.body, {
      headers: {
        "content-type": type,
        "cache-control": "private, no-store",
        "x-content-type-options": "nosniff",
        vary: "Cookie",
      },
    });
  } catch {
    return hidden();
  }
}
