// 컨펌 기간 잠금 설정 (middleware · 사이트맵이 함께 씀)
// 전체 공개할 때는 LOCKED 를 false 로 바꾸면 됨
// 로컬 확인용: PREVIEW_UNLOCK=1 pnpm start 로 켜면 잠금 없이 모든 페이지가 열림 (파일은 그대로 둠, 실서버에는 넣지 말 것)
export const LOCKED = true;

// 잠금 중에도 공개하는 페이지
export const OPEN = [
  /^\/$/,
  /^\/lifting\/coolsonic\/?$/,
  /^\/petit\/filler\/?$/,
  /^\/notice(\/.*)?$/,
  /^\/before-after(\/.*)?$/,
  /^\/terms\/?$/,
  /^\/privacy\/?$/,
  /^\/preparing\/?$/,
];

export const isOpen = (path: string) =>
  !LOCKED ||
  process.env.PREVIEW_UNLOCK === "1" ||
  OPEN.some((r) => r.test(path || "/"));
