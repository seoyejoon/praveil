// 하위 페이지 문구 · 사진. 모두 임시이며 확정 후 교체한다.
import { categoryPhoto, images } from "./home";

export const aboutPage = {
  hero: { en: "About Praveil", title: "병원소개", description: "피부를 먼저 읽고, 꼭 필요한 만큼 정확하게.", image: images.pageHero.about },
  statement:
    "과한 변화보다 나다운 아름다움을 지키는 것. 프라베일은 피부를 먼저 읽고, 꼭 필요한 만큼 정확하게 시술합니다.",
  // 임시: 시술 목록 기준으로 작성. 실제 보유 장비 확정 후 교체
  equipment: [
    { name: "쿨소닉", en: "Coolsonic", type: "리프팅" },
    { name: "쿨페이즈", en: "Coolphase", type: "리프팅" },
    { name: "슈링크 유니버스", en: "Shrink Universe", type: "리프팅" },
    { name: "포텐자", en: "Potenza", type: "리프팅 · 모공" },
    { name: "클라리티", en: "Clarity", type: "레이저" },
    { name: "피코 레이저", en: "Pico Laser", type: "색소 · 토닝" },
    { name: "프락셀", en: "Fraxel", type: "흉터 · 모공" },
    { name: "LDM", en: "LDM", type: "피부관리" },
  ],
};

// 병원소개 하위 페이지 (메뉴 · 탭 · 상단 사진이 모두 이 목록을 따른다)
export const aboutSections = [
  { slug: "philosophy", label: "프라베일 철학", en: "Our Standard", description: "피부를 먼저 읽고, 꼭 필요한 만큼 정확하게.", image: images.pageHero.about },
  { slug: "doctor", label: "대표원장 소개", en: "Doctor", description: "상담부터 시술까지, 대표원장이 직접 책임집니다.", image: images.clinic[2] },
  { slug: "why", label: "프라베일이 다른 이유", en: "Why Praveil", description: "처음 오시는 분도 안심할 수 있는 다섯 가지 약속.", image: images.clinic[1] },
  { slug: "tour", label: "병원 둘러보기", en: "Clinic Tour", description: "상담부터 회복까지, 편안하게 머무를 수 있도록 준비했습니다.", image: images.clinic[0] },
  { slug: "equipment", label: "보유 장비", en: "Equipment", description: "시술 목적에 맞는 장비로 정확하게 진행합니다.", image: images.pageHero.treatments },
] as const;
export type AboutSlug = (typeof aboutSections)[number]["slug"];

export const treatmentsPage = {
  hero: { en: "Treatments", title: "시술안내", description: "11개 분야, 54가지 시술을 진행합니다.", image: images.pageHero.treatments },
};

export const noticePage = {
  hero: { en: "News", title: "공지 · 이벤트", description: "프라베일의 새로운 소식을 전해드립니다.", image: images.pageHero.news },
};

export const locationPage = {
  hero: { en: "Location", title: "오시는 길", description: "인천 남동구 구월동, 효명프라자 4층", image: images.pageHero.location },
};

// 카테고리 · 시술 사진 (분류 slug 기준)
export const categoryImage = categoryPhoto;

// 시술 상세 공통 목차 (원고 확정 후 시술별 내용으로 채움)
export const procedureSections = [
  { id: "recommend", en: "Recommend", title: "이런 분께 추천합니다" },
  { id: "principle", en: "Principle", title: "시술 원리" },
  { id: "point", en: "Praveil Point", title: "프라베일 포인트" },
  { id: "caution", en: "Caution", title: "주의사항 · 부작용" },
  { id: "faq", en: "FAQ", title: "자주 묻는 질문" },
];

export const procedureInfo = [
  { key: "time", label: "시술 시간", en: "Time" },
  { key: "anesthesia", label: "마취", en: "Anesthesia" },
  { key: "recovery", label: "회복 기간", en: "Recovery" },
  { key: "interval", label: "내원 주기", en: "Interval" },
] as const;
