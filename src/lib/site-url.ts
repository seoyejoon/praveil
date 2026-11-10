// 도메인이 확정되면 .env 의 NEXT_PUBLIC_SITE_URL 만 바꾸면 됩니다.
// 값이 비어 있거나 잘못되면: Vercel 임시 주소 → 기본 도메인 순서로 대신 쓴다.
function resolveSiteUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
    "https://praveil.co.kr",
  ];
  for (const value of candidates) {
    const trimmed = value?.trim();
    if (!trimmed) continue;
    try {
      const url = new URL(/^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`);
      return url.origin;
    } catch {
      // 다음 후보로
    }
  }
  return "https://praveil.co.kr";
}

export const SITE_URL = resolveSiteUrl();

// Vercel 같은 임시 확인용 서버인지 (검색 노출을 막는 데 사용)
export const isPreviewHost = Boolean(process.env.VERCEL);

// 공유 미리보기(og) 공통값: 페이지에서 openGraph 를 쓰면 레이아웃 값이 통째로 바뀌므로 이 함수로 채운다.
export const OG_IMAGE = {
  url: "/images/og-praveil-20261110.png",
  width: 1200,
  height: 630,
  alt: "PRAVEIL 프라베일 맑고고운의원 로고",
};
export const og = (url: string, extra: Record<string, unknown> = {}) => ({
  type: "website" as const,
  locale: "ko_KR",
  siteName: "프라베일 맑고고운의원",
  images: [OG_IMAGE],
  url,
  ...extra,
});
