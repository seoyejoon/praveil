// 미리보기(Vercel) 전용 예시: 쿨소닉 AI 가상 전후 예시 3건
// - 실제 서버(카페24)에는 나오지 않음 (VERCEL 환경에서만)
// - 오픈 전에 이 파일과 index.ts 의 demo 부분을 지우면 끝
// - 사진은 public/images/test (실제 환자 사진 아님)
import type { BeforeAfterCase, Notice } from "./types";

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

// 미리보기용 공지 · 이벤트 예시 3건씩 (보여주기용, 오픈 전에 삭제)
const text = (t: string) => ({ kind: "text" as const, text: t });
const eventImage = (n: number, alt: string) => ({
  kind: "images" as const,
  images: [{ url: img(`test-event-${n}`), alt }],
});

export const demoNotices: Notice[] = [
  {
    id: 900501,
    type: "notice",
    title: "추석 연휴 휴진 안내",
    summary: "",
    coverImageUrl: "",
    body: text(
      "추석 연휴 기간(10월 5일 ~ 10월 7일) 동안 휴진합니다.\n10월 8일(수)부터 정상 진료하며, 예약은 네이버 예약으로 미리 해 주세요.",
    ),
    createdAt: "2026-10-01",
  },
  {
    id: 900502,
    type: "notice",
    title: "목요일 야간진료 안내",
    summary: "",
    coverImageUrl: "",
    body: text(
      "매주 목요일은 오후 8시 30분까지 진료합니다.\n퇴근 후에도 편하게 방문해 주세요.",
    ),
    createdAt: "2026-09-25",
  },
  {
    id: 900503,
    type: "notice",
    title: "홈페이지 회원 전용 전후사진 안내",
    summary: "",
    coverImageUrl: "",
    body: text(
      "전후사진 게시판의 시술 전 사진은 의료법에 따라 로그인한 회원에게만 보입니다.\n회원가입 후 확인해 주세요.",
    ),
    createdAt: "2026-09-20",
  },
  {
    id: 900511,
    type: "event",
    title: "10월 리프팅 이벤트",
    summary: "2026.10.01 ~ 2026.10.31",
    coverImageUrl: img("test-event-1"),
    body: eventImage(1, "10월 리프팅 이벤트"),
    createdAt: "2026-10-01",
  },
  {
    id: 900512,
    type: "event",
    title: "스킨부스터 첫 방문 이벤트",
    summary: "2026.10.01 ~ 2026.12.31",
    coverImageUrl: img("test-event-2"),
    body: eventImage(2, "스킨부스터 첫 방문 이벤트"),
    createdAt: "2026-09-30",
  },
  {
    id: 900513,
    type: "event",
    title: "여름 제모 패키지",
    summary: "2026.07.01 ~ 2026.08.31",
    coverImageUrl: img("test-event-3"),
    body: eventImage(3, "여름 제모 패키지"),
    createdAt: "2026-07-01",
  },
];
