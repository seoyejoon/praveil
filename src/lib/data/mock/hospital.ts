import type { Doctor, Feature, Hospital } from "../types";

// TODO: 주소·전화·사업자번호·채널 링크는 확정되면 교체 (관리자 연결 후에는 DB에서 읽음)
export const hospital: Hospital = {
  name: "프라베일 맑고고운의원",
  shortName: "프라베일의원",
  director: "한재웅",
  phone: "02-000-0000",
  address: "주소 확정 전",
  addressDetail: "",
  businessNumber: "000-00-00000",
  kakaoUrl: "#",
  naverReservationUrl: "#",
  instagramUrl: "#",
  hours: [
    { label: "월 · 화 · 수 · 금", time: "10:00 – 19:00" },
    { label: "목요일", time: "10:00 – 20:30", note: "야간진료" },
    { label: "토요일", time: "10:00 – 15:00" },
    { label: "일요일 · 공휴일", time: "휴진", closed: true },
  ],
  lunch: "13:00 – 14:00",
  hoursNotice: "진료 마감 30분 전까지 접수해 주세요.",
  directions: [
    { title: "지하철", body: "역세권 · 역 정보 확정 전" },
    { title: "주차", body: "건물 내 주차 가능 · 상세 안내 확정 전" },
  ],
};

export const doctor: Doctor = {
  name: "한재웅",
  title: "대표원장",
  credentials: [
    "대한 미용외과 정회원",
    "대한 미용의학 연구회 성형 자문의",
    "대한 레이저학회 정회원",
    "대한 유방성형학회 정회원",
  ],
};

export const features: Feature[] = [
  { title: "최신 장비 보유", description: "시술 목적에 맞는 장비를 갖추고 있습니다." },
  { title: "원장 직접 시술", description: "상담부터 시술까지 원장이 직접 진행합니다." },
  { title: "1:1 맞춤 상담", description: "피부 상태와 고민에 맞춰 시술을 제안합니다." },
  { title: "정품 · 정량 사용", description: "정품을 정량 그대로 사용합니다." },
  { title: "역세권 · 주차 편리", description: "대중교통과 자가용 모두 편하게 오실 수 있습니다." },
];
