// 미리보기(Vercel) 전용 테스트 글: 공지 3 · 이벤트 3 · 전후사례 3
// - 실제 서버(카페24)에는 나오지 않음 (VERCEL 환경에서만)
// - 오픈 전에 이 파일과 index.ts 의 demo 부분을 지우면 끝
// - 사진은 public/images/test (실제 환자 사진 아님)
import type { BeforeAfterCase, Notice } from "./types";

export const showDemo = Boolean(process.env.VERCEL);

const img = (name: string) => `/images/test/${name}.webp`;
const doc = (paras: string[]): Notice["body"] => ({
  kind: "doc",
  doc: {
    type: "doc",
    content: paras.map((text) => ({
      type: "paragraph",
      content: [{ type: "text", text }],
    })),
  },
});

export const demoNotices: Notice[] = [
  {
    id: 900101,
    type: "notice",
    title: "[테스트] 추석 연휴 휴진 안내",
    summary: "",
    coverImageUrl: "",
    createdAt: "2026-09-30",
    body: doc([
      "추석 연휴 기간 동안 휴진합니다.",
      "연휴 이후 정상 진료하며, 예약은 네이버 예약으로 미리 해 주세요.",
    ]),
  },
  {
    id: 900102,
    type: "notice",
    title: "[테스트] 목요일 야간진료 안내",
    summary: "",
    coverImageUrl: "",
    createdAt: "2026-09-29",
    body: doc([
      "매주 목요일은 오후 8시 30분까지 진료합니다.",
      "퇴근 후에도 편하게 방문해 주세요.",
    ]),
  },
  {
    id: 900103,
    type: "notice",
    title: "[테스트] 홈페이지 회원 전용 전후사진 안내",
    summary: "",
    coverImageUrl: "",
    createdAt: "2026-09-28",
    body: doc([
      "전후사진 게시판의 시술 전 사진은 의료법에 따라 로그인한 회원에게만 보입니다.",
    ]),
  },
  ...(
    [
      [
        900201,
        "[테스트] 10월 리프팅 이벤트",
        "2026.10.01 ~ 2026.10.31",
        1,
        "2026-09-30",
      ],
      [
        900202,
        "[테스트] 스킨부스터 첫 방문 이벤트",
        "2026.10.01 ~ 2026.12.31",
        2,
        "2026-09-29",
      ],
      [
        900203,
        "[테스트] 여름 제모 패키지",
        "2026.07.01 ~ 2026.08.31",
        3,
        "2026-06-28",
      ],
    ] as const
  ).map(([id, title, summary, n, createdAt]) => ({
    id,
    type: "event" as const,
    title,
    summary,
    coverImageUrl: img(`test-event-${n}`),
    createdAt,
    body: {
      kind: "images" as const,
      images: [{ url: img(`test-event-${n}`), alt: title }],
    },
  })),
];

const labels = ["시술 후 2주", "시술 후 1개월", "시술 후 3개월"];

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

export const demoBeforeAfter: BeforeAfterCase[] = [
  ...aiCoolsonic,
  ...(
    [
      [
        "[테스트] 쿨소닉 · 쿨페이즈 3개월 경과",
        "리프팅",
        "턱선 · 볼 라인 경과 사례 (테스트)",
        3,
      ],
      ["[테스트] 앞볼 볼륨필러", "쁘띠시술", "앞볼 꺼짐 개선 사례 (테스트)", 1],
      [
        "[테스트] 리투오 2회 경과",
        "피부관리",
        "피부결 · 밀도 경과 사례 (테스트)",
        2,
      ],
    ] as const
  ).map(([title, category, summary, n], i) => ({
    id: 900301 + i,
    title,
    summary,
    category,
    createdAt: "2026-09-30",
    representative: n - 1,
    stages: Array.from({ length: n }, (_, s) => ({
      before: img(`test-ba-${i + 1}-${s + 1}-before`),
      after: img(`test-ba-${i + 1}-${s + 1}-after`),
      beforeLabel: "시술 전",
      afterLabel: n > 1 ? labels[s] : "시술 후",
    })),
  })),
];
