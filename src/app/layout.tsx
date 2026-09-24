import type { Metadata } from "next";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "@fontsource-variable/noto-serif-kr";
import "@fontsource-variable/cormorant";
import "@fontsource-variable/cormorant/wght-italic.css";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCta from "@/components/FloatingCta";
import { getHospital } from "@/lib/data";

export const metadata: Metadata = {
  metadataBase: new URL("https://praveil.com"),
  title: {
    default: "프라베일 맑고고운의원",
    template: "%s | 프라베일 맑고고운의원",
  },
  description: "원장 직접 시술, 1:1 맞춤 상담. 리프팅 · 보톡스 · 필러 · 스킨부스터 · 레이저",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const hospital = await getHospital();

  return (
    <html lang="ko">
      <body>
        <Header phone={hospital.phone} />
        <main>{children}</main>
        <Footer hospital={hospital} />
        <FloatingCta hospital={hospital} />
      </body>
    </html>
  );
}
