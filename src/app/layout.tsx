import type { Metadata } from "next";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "@fontsource/oswald/300.css";
import "@fontsource/oswald/400.css";
import "@fontsource/oswald/500.css";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCta from "@/components/FloatingCta";
import QuickMenu from "@/components/QuickMenu";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import PageTransition from "@/components/PageTransition";
import PopupLayer from "@/components/PopupLayer";
import { getHospital, getPopups } from "@/lib/data";
import { getMember, getSignupSettings } from "@/lib/member";
import { isPreviewHost, SITE_URL } from "@/lib/site-url";

// 관리자에서 바꾼 내용이 바로 보이도록 요청마다 화면을 만든다. (DB 조회 결과는 source-db.ts 에서 캐시)
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "프라베일 맑고고운의원",
    template: "%s | 프라베일 맑고고운의원",
  },
  description:
    "인천 남동구 프라베일 맑고고운의원. 대표원장이 상담부터 시술까지 직접 합니다. 리프팅 · 필러 · 보톡스 · 스킨부스터 · 레이저.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "프라베일 맑고고운의원",
    images: ["/images/photos/hero-lobby.webp"],
  },
  // 임시 확인용(Vercel)에서는 검색 노출 안 함
  robots: isPreviewHost ? { index: false, follow: false } : undefined,
};

const DAYS: Record<string, string> = {
  월: "Monday",
  화: "Tuesday",
  수: "Wednesday",
  목: "Thursday",
  금: "Friday",
  토: "Saturday",
  일: "Sunday",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [hospital, popups, member, signup] = await Promise.all([
    getHospital(),
    getPopups(),
    getMember(),
    getSignupSettings(),
  ]);
  const [region = "", locality = "", ...street] = hospital.address.split(" ");
  // 병원 기본 정보 (모든 페이지 공통): 검색엔진 · AI가 병원 이름 · 주소 · 전화 · 진료시간을 정확히 알도록
  const clinicLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${SITE_URL}/#clinic`,
    name: hospital.name,
    url: SITE_URL,
    image: `${SITE_URL}/images/photos/hero-lobby.webp`,
    telephone: hospital.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${street.join(" ")} ${hospital.addressDetail}`,
      addressLocality: locality,
      addressRegion: region,
      addressCountry: "KR",
    },
    ...(hospital.coords && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: hospital.coords.lat,
        longitude: hospital.coords.lng,
      },
    }),
    // "월 · 화 · 수 · 금 / 10:00 – 19:00" → Monday, Tuesday … 10:00 ~ 19:00
    openingHoursSpecification: hospital.hours
      .filter((h) => !h.closed)
      .map((h) => {
        const [opens, closes] = h.time.split(/\s*[–~-]\s*/);
        return {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [...h.label.replace(/요일/g, "")]
            .map((c) => DAYS[c])
            .filter(Boolean)
            .map((d) => `https://schema.org/${d}`),
          opens,
          closes,
        };
      })
      .filter((o) => o.dayOfWeek.length && o.closes),
    founder: { "@type": "Physician", name: hospital.director },
    ...(hospital.instagramUrl.startsWith("http") && {
      sameAs: [hospital.instagramUrl],
    }),
  };

  return (
    <html lang="ko">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(clinicLd).replace(/</g, "\\u003c"),
          }}
        />
        <Header
          phone={hospital.phone}
          reservationUrl={hospital.naverReservationUrl}
          member={member}
          signup={signup && { enabled: signup.enabled, fields: signup.fields }}
        />
        <main>{children}</main>
        <Footer hospital={hospital} />
        <FloatingCta hospital={hospital} />
        <QuickMenu hospital={hospital} />
        <PopupLayer popups={popups} />
        <SmoothScroll />
        <PageTransition />
        <CustomCursor />
      </body>
    </html>
  );
}
