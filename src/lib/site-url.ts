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
