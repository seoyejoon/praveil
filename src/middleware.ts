import { NextResponse, type NextRequest } from "next/server";

// 컨펌 기간 잠금: 공개 페이지 외에는 주소는 그대로 둔 채 '준비 중' 화면을 보여 줌 (설정: src/lib/preview-lock.ts)
import { isOpen } from "@/lib/preview-lock";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // 예전 미리보기(Vercel) 주소로 들어오면 실서버(praveil.com)로 영구 이동 (같은 내용이 두 곳에 있으면 검색에 불리)
  if (process.env.VERCEL)
    return NextResponse.redirect(
      `https://praveil.com${pathname}${req.nextUrl.search}`,
      308,
    );
  if (isOpen(pathname)) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = "/preparing";
  url.search = "";
  // nginx 가 https 로 알려 줘도 앱 서버는 http 로만 받으므로, 내부 이동은 http 로 (https 면 500 에러)
  url.protocol = "http:";
  return NextResponse.rewrite(url);
}

export const config = {
  // 화면 페이지만 (API · 이미지 · 파일 · 관리 경로 제외)
  matcher: [
    "/((?!api|_next|uploads|images|videos|favicon|robots|sitemap|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
