// 컨펌 기간 잠금 설정 (middleware · 사이트맵이 함께 씀)
// 전체 공개할 때는 LOCKED 를 false 로 바꾸면 됨
export const LOCKED = true;

// 잠금 중에도 공개하는 페이지
export const OPEN = [
  /^\/$/,
  /^\/lifting\/coolsonic\/?$/,
  /^\/notice(\/.*)?$/,
  /^\/before-after(\/.*)?$/,
  /^\/terms\/?$/,
  /^\/privacy\/?$/,
  /^\/preparing\/?$/,
];

export const isOpen = (path: string) =>
  !LOCKED || OPEN.some((r) => r.test(path || "/"));
