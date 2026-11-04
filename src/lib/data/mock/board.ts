import type { Notice, Popup } from "../types";

export const notices: Notice[] = [
  {
    id: 1,
    type: "notice",
    title: "프라베일 맑고고운의원 홈페이지를 오픈했습니다",
    summary: "",
    coverImageUrl: "",
    body: {
      kind: "text",
      text: "임시 게시글입니다. 관리자 연결 후 실제 공지로 대체됩니다.",
    },
    createdAt: "2026-09-24",
  },
  {
    id: 2,
    type: "column",
    title: "원장칼럼 게시판을 열었습니다",
    summary: "",
    coverImageUrl: "",
    body: {
      kind: "text",
      text: "임시 게시글입니다. 관리자에서 원장칼럼 게시판에 글을 올리면 이 자리에 실제 칼럼이 표시됩니다.",
    },
    createdAt: "2026-11-04",
  },
];

export const popups: Popup[] = [];
