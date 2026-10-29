"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

type Ids = Record<string, string>;
type W = Window & {
  wcs?: { inflow?: (d?: string) => void };
  wcs_add?: Record<string, string>;
  wcs_do?: () => void;
  fbq?: (...a: unknown[]) => void;
  kakaoPixel?: (id: string) => { pageView: () => void };
};

// 관리자 > 외부 서비스에서 켠 분석 · 광고 태그 (값은 서버에서 형식 확인 후 넘어옴)
// - 구글 애널리틱스 · 태그 매니저: 페이지 이동은 구글이 스스로 셈
// - 네이버 애널리틱스 · 메타 픽셀 · 카카오 픽셀: 페이지를 옮길 때마다 직접 알림
export default function TrackingTags({ ids }: { ids: Ids }) {
  const pathname = usePathname();
  const first = useRef(true);
  const naver = ids.naver_analytics;
  const meta = ids.meta_pixel;
  const kakao = ids.kakao_pixel;

  useEffect(() => {
    if (first.current) {
      first.current = false; // 첫 페이지는 아래 스크립트가 불러오면서 셈
      return;
    }
    const w = window as W;
    try {
      if (naver && w.wcs_do) w.wcs_do();
      if (meta && w.fbq) w.fbq("track", "PageView");
      if (kakao && w.kakaoPixel) w.kakaoPixel(kakao).pageView();
    } catch {}
  }, [pathname, naver, meta, kakao]);

  const gtm = ids.google_tag_manager;
  const ga = ids.google_analytics;
  return (
    <>
      {gtm && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`}
        </Script>
      )}
      {ga && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${ga}');`}
          </Script>
        </>
      )}
      {naver && (
        <>
          <Script
            src="https://wcs.pstatic.net/wcslog.js"
            strategy="afterInteractive"
            onLoad={() => {
              const w = window as W;
              try {
                w.wcs_add = w.wcs_add || {};
                w.wcs_add.wa = naver;
                w.wcs?.inflow?.("praveil.com");
                w.wcs_do?.();
              } catch {}
            }}
          />
        </>
      )}
      {meta && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${meta}');fbq('track','PageView');`}
        </Script>
      )}
      {kakao && (
        <Script
          src="https://t1.daumcdn.net/kas/static/kp.js"
          strategy="afterInteractive"
          onLoad={() => {
            try {
              (window as W).kakaoPixel?.(kakao).pageView();
            } catch {}
          }}
        />
      )}
    </>
  );
}
