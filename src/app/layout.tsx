import type { Metadata } from "next";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "@fontsource-variable/noto-serif-kr";
import "@fontsource/marcellus";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCta from "@/components/FloatingCta";
import QuickMenu from "@/components/QuickMenu";
import PopupLayer from "@/components/PopupLayer";
import { getCategories, getHospital, getPopups } from "@/lib/data";
import { isPreviewHost, SITE_URL } from "@/lib/site-url";

// 관리자에서 바꾼 내용이 바로 보이도록 요청마다 화면을 만든다. (DB 조회 결과는 source-db.ts 에서 캐시)
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "프라베일 맑고고운의원",
    template: "%s | 프라베일 맑고고운의원",
  },
  description: "원장 직접 시술, 1:1 맞춤 상담. 리프팅 · 보톡스 · 필러 · 스킨부스터 · 레이저",
  // 임시 확인용(Vercel)에서는 검색 노출 안 함
  robots: isPreviewHost ? { index: false, follow: false } : undefined,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [hospital, popups, categories] = await Promise.all([getHospital(), getPopups(), getCategories()]);

  return (
    <html lang="ko">
      <body>
        <Header phone={hospital.phone} reservationUrl={hospital.naverReservationUrl} categories={categories} />
        <main>{children}</main>
        <Footer hospital={hospital} />
        <FloatingCta hospital={hospital} />
        <QuickMenu hospital={hospital} />
        <PopupLayer popups={popups} />
      </body>
    </html>
  );
}
