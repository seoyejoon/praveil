import { NextResponse, type NextRequest } from "next/server";

// 컨펌 기간 잠금: 아래 페이지만 공개하고, 나머지는 주소는 그대로 둔 채 '준비 중' 화면을 보여 줌
// 전체 공개할 때는 LOCKED 를 false 로 바꾸면 됨
const LOCKED = true;
const OPEN = [
  /^\/$/,
  /^\/lifting\/coolsonic\/?$/,
  /^\/notice(\/.*)?$/,
  /^\/before-after(\/.*)?$/,
  /^\/terms\/?$/,
  /^\/privacy\/?$/,
  /^\/preparing\/?$/,
];

export function middleware(req: NextRequest) {
  if (!LOCKED) return NextResponse.next();
  const { pathname } = req.nextUrl;
  if (OPEN.some((r) => r.test(pathname))) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = "/preparing";
  url.search = "";
  return NextResponse.rewrite(url);
}

export const config = {
  // 화면 페이지만 (API · 이미지 · 파일 · 관리 경로 제외)
  matcher: [
    "/((?!api|_next|uploads|images|videos|favicon|robots|sitemap|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
