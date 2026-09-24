// 도메인이 확정되면 .env 의 NEXT_PUBLIC_SITE_URL 만 바꾸면 됩니다.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://praveil.co.kr").replace(/\/$/, "");
