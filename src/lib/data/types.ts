// 관리자 DB와 연결되기 전까지 홈페이지가 쓰는 데이터 형태.
// 관리자 테이블 구조를 받으면 이 형태에 맞춰 조회 코드만 교체한다.

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

export type Procedure = {
  slug: string;
  categorySlug: string;
  name: string;
  summary?: string;
  isSignature?: boolean;
  price?: string;
};

export type Notice = {
  id: number;
  type: "notice" | "event";
  title: string;
  body: string;
  createdAt: string;
};

export type Popup = {
  id: number;
  title: string;
  imageUrl?: string;
  body?: string;
  linkUrl?: string;
};
