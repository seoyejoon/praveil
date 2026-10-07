import type { Doctor, Feature, Hospital } from "../types";

// 네이버 플레이스(이전 이름: 뉴리즈의원 인천) 정보 기준. 사업자번호 · 카카오 채널은 확정되면 교체
// (관리자에 값을 넣으면 그 값이 우선)
export const hospital: Hospital = {
  name: "프라베일 맑고고운의원",
  shortName: "프라베일의원",
  director: "한재웅",
  phone: "032-429-7522",
  address: "인천광역시 남동구 성말로 10",
  addressDetail: "효명프라자 4층 403 · 404호",
  businessNumber: "000-00-00000",
  kakaoUrl: "#",
  naverReservationUrl: "https://m.booking.naver.com/booking/13/bizes/466071",
  instagramUrl: "https://www.instagram.com/newrizz_clinic/",
  hours: [
    { label: "월 · 화 · 수 · 금", time: "10:00 – 19:00" },
    { label: "목요일", time: "10:00 – 20:30", note: "야간진료" },
    { label: "토요일", time: "10:00 – 15:00" },
    { label: "일요일 · 공휴일", time: "휴진", closed: true },
  ],
  lunch: "13:00 – 14:00",
  hoursNotice: "진료 마감 30분 전까지 접수해 주세요.",
  directions: [
    {
      title: "건물 안내",
      body: "투썸플레이스 · 홍콩반점이 있는 효명프라자 건물 4층 (엘리베이터 이용)",
    },
    {
      title: "지하철",
      body: "인천 1호선 예술회관역 6번 출구 → 자생한방병원 앞 횡단보도를 건너 농협은행 맞은편 건물",
    },
    { title: "주차", body: "건물 지하주차장 이용 (2시간 무료)" },
  ],
  coords: { lat: 37.4451996, lng: 126.7015395 },
  mapLinks: {
    naver: "https://map.naver.com/p/entry/place/1157284242",
    google:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("인천광역시 남동구 성말로 10"),
  },
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
  {
    title: "최신 장비 보유",
    description: "시술 목적에 맞는 장비를 갖추고 있습니다.",
  },
  {
    title: "원장 직접 시술",
    description: "상담부터 시술까지 원장이 직접 진행합니다.",
  },
  {
    title: "1:1 맞춤 상담",
    description: "피부 상태와 고민에 맞춰 시술을 제안합니다.",
  },
  { title: "정품 · 정량 사용", description: "정품을 정량 그대로 사용합니다." },
  {
    title: "역세권 · 주차 편리",
    description: "대중교통과 자가용 모두 편하게 오실 수 있습니다.",
  },
];
