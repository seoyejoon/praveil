// 홈페이지가 쓰는 데이터 형태. 관리자 DB(source-db.ts)와 임시 데이터(mock/) 모두 이 형태로 맞춘다.

export type Hospital = {
  name: string;
  shortName: string;
  director: string;
  phone: string;
  address: string;
  addressDetail: string;
  businessNumber: string;
  kakaoUrl: string;
  naverReservationUrl: string;
  instagramUrl: string;
  hours: { label: string; time: string; note?: string; closed?: boolean }[];
  lunch: string;
  hoursNotice: string;
  directions: { title: string; body: string }[];
  /** 카카오맵 표시 위치 (주소 확정 후 입력) */
  coords?: { lat: number; lng: number };
  /** 다른 지도 앱 바로가기 (링크가 없으면 버튼만 비활성으로 표시) */
  mapLinks: { tmap?: string; naver?: string; google?: string };
};

export type Doctor = {
  name: string;
  title: string;
  credentials: string[];
};

export type Feature = {
  title: string;
  description: string;
};

export type ProcedureCategory = {
  slug: string;
  name: string;
  nameEn: string;
  description: string;
};

export type ProcedurePrice = { label: string; price: string; note: string };

export type Procedure = {
  slug: string;
  categorySlug: string;
  name: string;
  summary?: string;
  isSignature?: boolean;
  prices: ProcedurePrice[];
};

/** 관리자 편집기 문서(JSON) 한 조각 */
export type DocNode = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: { type?: string; attrs?: Record<string, unknown> }[];
  content?: DocNode[];
};

/** 게시글 본문: 편집기 문서 / 이벤트 이미지 묶음 / 일반 글 */
export type PostBody =
  | { kind: "doc"; doc: DocNode }
  | { kind: "images"; images: { url: string; alt: string }[] }
  | { kind: "text"; text: string };

export type Notice = {
  id: number;
  type: "notice" | "event";
  title: string;
  summary: string;
  coverImageUrl: string;
  body: PostBody;
  createdAt: string;
};

export type Popup = {
  id: number;
  title: string;
  imageUrl?: string;
  body?: string;
  linkUrl?: string;
  device: "all" | "pc" | "mobile";
};
