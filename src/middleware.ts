import { NextResponse, type NextRequest } from "next/server";

// 컨펌 기간 잠금: 공개 페이지 외에는 주소는 그대로 둔 채 '준비 중' 화면을 보여 줌 (설정: src/lib/preview-lock.ts)
import { isOpen } from "@/lib/preview-lock";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (isOpen(pathname)) return NextResponse.next();
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
