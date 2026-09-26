import { NextResponse } from "next/server";
import { adminApiUrl, getSignupSettings, memberCookieName } from "@/lib/member";

// 로그인 · 회원가입 · 로그아웃: 관리자 서버의 회원 API로 전달하고, 받은 로그인 쿠키를 홈페이지 주소에 저장한다.
const targets = { login: "login", signup: "signup", logout: "logout" } as const;
const MAX_AGE = 60 * 60 * 24 * 30;

export async function POST(request: Request, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params;
  const target = targets[action as keyof typeof targets];
  if (!target) return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 404 });

  // 다른 사이트에서 보낸 요청은 막는다
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !host || new URL(origin).host !== host) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 403 });
  }

  const settings = await getSignupSettings();
  if (!settings) return NextResponse.json({ error: "회원 기능 준비 중입니다." }, { status: 503 });

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }
  if (!payload || typeof payload !== "object") return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });

  const cookieName = memberCookieName(settings.hospitalId);
  const base = adminApiUrl();
  // 관리자는 같은 사이트에서 온 요청만 받으므로, 위에서 출처를 확인한 뒤 관리자 주소 기준으로 보낸다
  const headers: Record<string, string> = { "content-type": "application/json", origin: new URL(base).origin, "sec-fetch-site": "same-origin" };
  const ip = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (ip) headers["x-real-ip"] = ip;
  const ua = request.headers.get("user-agent");
  if (ua) headers["user-agent"] = ua;
  const token = request.headers.get("cookie")?.match(new RegExp(`(?:^|;\\s*)${cookieName}=([^;]+)`))?.[1];
  if (action === "logout" && token) headers.cookie = `${cookieName}=${token}`;

  let upstream: Response;
  try {
    upstream = await fetch(`${base}/api/public/website-members/${target}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ ...payload, hospitalId: settings.hospitalId }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ error: "잠시 후 다시 시도해주세요." }, { status: 502 });
  }

  const data = await upstream.json().catch(() => ({ error: "잠시 후 다시 시도해주세요." }));
  const response = NextResponse.json(data, { status: upstream.status });
  const secure = new URL(request.url).protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";

  if (action === "logout") {
    response.cookies.set(cookieName, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  } else {
    const issued = upstream.headers.getSetCookie().map((c) => c.match(new RegExp(`^${cookieName}=([^;]+)`))?.[1]).find(Boolean);
    if (issued) response.cookies.set(cookieName, issued, { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: MAX_AGE });
  }
  return response;
}
