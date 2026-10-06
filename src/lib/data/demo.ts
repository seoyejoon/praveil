// 미리보기(Vercel) 전용 예시: 쿨소닉 AI 가상 전후 예시 3건
// - 실제 서버(카페24)에는 나오지 않음 (VERCEL 환경에서만)
// - 오픈 전에 이 파일과 index.ts 의 demo 부분을 지우면 끝
// - 사진은 public/images/test (실제 환자 사진 아님)
import type { BeforeAfterCase } from "./types";

export const showDemo = Boolean(process.env.VERCEL);

const img = (name: string) => `/images/test/${name}.webp`;

// 쿨소닉 페이지 전후사진 미리 보기용 AI 가상 예시 (실제 시술 사진이 아님)
const aiCoolsonic: BeforeAfterCase[] = (
  [
    ["[AI 가상 예시] 쿨소닉 턱선 리프팅", "턱선 · 볼 라인"],
    ["[AI 가상 예시] 쿨소닉 볼 처짐 리프팅", "볼 처짐 · 팔자 주변"],
    ["[AI 가상 예시] 쿨소닉 이중턱 · 윤곽 리프팅", "이중턱 · 얼굴 윤곽"],
  ] as const
).map(([title, area], i) => ({
  id: 900401 + i,
  title,
  summary: `${area} · AI로 만든 가상 예시이며 실제 시술 전후 사진이 아닙니다`,
  category: "리프팅",
  createdAt: "2026-10-02",
  representative: 0,
  stages: [
    {
      before: img(`ai-coolsonic-${i + 1}-before`),
      after: img(`ai-coolsonic-${i + 1}-after`),
      beforeLabel: "시술 전 (가상)",
      afterLabel: "시술 후 (가상)",
    },
  ],
}));

export const demoBeforeAfter: BeforeAfterCase[] = aiCoolsonic;
