// 병원소개 · 의료진소개 원고
// ※ 임시 원고: 원장님 약력 · 공간 설명 · 장비 목록은 자료를 받으면 교체합니다.
// ※ 의료광고: '최고 · 유일' 같은 표현, 다른 병원과의 비교, 치료 경험담은 쓰지 않습니다.

import { doctorPhotos } from "@/content/doctor-photos";

// 사진을 바꿔도 이름이 같으면 브라우저가 30일 동안 옛 사진을 보여 줘, 첫 화면 사진에만 버전을 붙임
const photo = (name: string) =>
  `/images/photos/${name}.webp${name.startsWith("hero-") ? "?v=20261104" : ""}`;
// 제조사 공식 제품 사진 (장비 구매 병원 사용 허가 범위)
// 장비 카드 사진: 원본(equipment/)에서 여백만 정리해 장비 높이를 같게 맞춘 사본 (equipment/card/)
const device = (name: string) => `/images/equipment/card/${name}.webp`;

// 병원소개 · 의료진소개 상단 (탭은 사이트맵 '병원소개' 분류를 따름)
export const aboutHero = {
  intro: {
    en: "About Praveil",
    title: "병원소개",
    description: "피부를 먼저 읽고, 꼭 필요한 만큼 정확하게.",
    image: photo("hero-lobby"),
    mobileImage: photo("hero-lobby-m"),
  },
  doctor: {
    en: "Doctor",
    title: "의료진소개",
    description: "페이닥터 없이 대표원장이 모든 시술을 직접 책임집니다.",
    // 원장 사진은 바로 아래 인사말에 있어, 첫 화면은 병원 입구 사진 (병원소개와 같은 모양)
    image: photo("hero-entrance"),
    mobileImage: photo("hero-entrance-m"),
  },
};

export const aboutIntro = {
  headline: ["과한 변화보다", "나다운 아름다움을 지키는 곳."],
  /** 첫 문단의 뒷부분 (앞부분 '○○은 ○○에 있는 피부 · 미용 의원입니다'는 병원 정보로 자동 생성) */
  body: "페이닥터 없이 대표원장이 모든 시술을 직접 집도하며, 리프팅 · 쁘띠시술 · 피부관리 · 여드름 · 모공 · 제모 · 문신제거를 중점 진료합니다. 같은 고민이라도 피부마다 답이 다르기에, 피부 상태를 면밀히 분석하여 꼭 필요한 시술만 권해 드립니다.",
};

// 진료 철학 (세 가지)
export const aboutPhilosophy = {
  en: "Philosophy",
  title: "프라베일이 지키는 세 가지",
  items: [
    {
      en: "Diagnose",
      title: "피부 상태에 맞는 정확한 진단",
      text: "고민 부위만 단편적으로 보지 않고 피부층과 노화 진행 상태를 면밀히 분석하여 진단합니다.",
    },
    {
      en: "Honest",
      title: "불필요한 과시술 없는 정직한 계획",
      text: "불필요한 패키지나 과한 시술을 권하지 않습니다. 지금 해야 할 시술과 불필요한 시술을 솔직하고 투명하게 구분합니다.",
    },
    {
      en: "Responsible",
      title: "대표원장의 1:1 책임 진료",
      text: "시술 시작부터 마무리까지 대표원장의 손길로 단 한 분만을 위한 맞춤 진료를 진행합니다.",
    },
  ],
};


// 약속 (메인 '프라베일만의 특별함'와 같은 다섯 가지)
export const aboutPromise = {
  en: "Our Promise",
  title: "처음 오셔도 안심할 수 있도록, 다섯 가지 약속",
  items: [
    {
      title: "대표원장 책임 진료",
      text: "페이닥터 없이 숙련된 대표원장이 전 시술 직접 집도",
      image: photo("special-2-model-a"),
    },
    {
      title: "1:1 맞춤 시술 설계",
      text: "개인별 피부 특성과 고민 부위에 맞춘 단계별 맞춤 플랜 수립",
      image: "/images/photos/clinic-3.webp",
      photoFit: "full-frame" as const,
    },
    {
      title: "정품 · 정량 원칙",
      text: "허가받은 정품 제품과 정량 사용 원칙 준수",
      image: photo("special-3"),
    },
    {
      title: "프리미엄 장비 보유",
      text: "쿨소닉, 쿨페이즈, 포텐자 등 엄선된 리프팅 · 피부 장비 라인업",
      image: photo("special-4-model-a"),
    },
    {
      title: "프라이빗한 케어 공간",
      text: "시술과 관리의 전 과정을 편안하게 누릴 수 있는 독립된 1인실 중심 환경",
      image: photo("special-5"),
    },
  ],
};


// 공간 (사진 순서: 인포메이션 · 대기실 · 상담실 · 파우더룸 · 시술실 · 복도)
export const aboutSpace = {
  en: "Space",
  title: "가치를 더하는 프라이빗한 공간, 프라베일",
  text: "상담부터 시술, 회복까지 한 층에서 이어집니다. 조용하고 편안한 경험을 위해 공간을 세심하게 나누었습니다.",
  items: [
    { name: "인포메이션", text: "예약 확인과 접수", image: photo("clinic-1") },
    { name: "대기실", text: "조용히 기다리는 공간", image: photo("clinic-2") },
    { name: "상담실", text: "한 분 한 분 1:1 맞춤 상담", image: photo("clinic-3") },
    { name: "파우더룸", text: "시술 후 정돈", image: photo("clinic-4") },
    { name: "시술실", text: "독립된 시술 공간", image: photo("clinic-5") },
    { name: "복도", text: "프라이빗한 동선", image: photo("clinic-6") },
  ],
};

// 보유 장비: 병원 촬영본에서 확인된 6대 (프락셀 · LDM 등은 보유 확인 후 추가)
// 사진: 제조사 공식 제품 사진 또는 병원 촬영본 배경 정리 (public/images/equipment)
export const aboutEquipment = {
  en: "Equipment",
  title: "프라베일의 프리미엄 장비 소개",
  text: "같은 리프팅이라도 작용하는 깊이와 방식이 다릅니다. 고민에 맞는 장비를 골라 필요한 만큼만 사용합니다.",
  items: [
    {
      name: "쿨소닉",
      en: "CoolSonic",
      type: "초음파 리프팅",
      href: "/lifting/coolsonic",
      image: device("coolsonic"),
    },
    {
      name: "쿨페이즈",
      en: "Coolfase",
      type: "고주파 리프팅",
      href: "/lifting/coolphase",
      image: device("coolphase"),
    },
    {
      name: "슈링크 유니버스",
      en: "Shurink Universe",
      type: "초음파 리프팅",
      href: "/lifting/laser",
      image: device("shrink-universe"),
    },
    {
      name: "포텐자",
      en: "Potenza",
      type: "마이크로니들 고주파",
      href: "/lifting/laser?type=potenza",
      image: device("potenza"),
    },
    {
      name: "클라리티2",
      en: "Clarity II",
      type: "레이저 · 제모",
      href: "/removal/hair",
      image: device("clarity"),
    },
    {
      name: "피코케이",
      en: "PICO-K",
      type: "피코 레이저 · 색소 · 문신제거",
      href: "/removal/tattoo",
      image: device("pico-k"),
    },
  ],
};

// 의료진소개
export const doctorProfile = {
  nameEn: "Han Jae Woong",
  photo: doctorPhotos.portrait,
  // 제목 · 첫 문단은 메인 페이지 원장 소개(mainDoctor)와 같게
  quote: ["더 많이 하는 것보다,", "필요한 것을 제대로."],
  greeting: [
    "현재 피부 상태를 기준으로 치료의 우선순위를 정하고, 불필요한 과정보다는 필요한 진료에 집중합니다.",
    "오랜 경험과 실력을 갖춘 대표원장이 모든 시술을 책임 집도합니다. 한 분 한 분에게 맞는 시술로 끝까지 함께하겠습니다.",
  ],
  // 약력: 자료를 받으면 채움 (비어 있으면 화면에 나오지 않음)
  education: [] as string[],
  career: [] as string[],
  /** 진료 방식 (원장이 직접 하는 네 단계) */
  steps: [
    {
      title: "상담",
      text: "고민과 원하는 변화를 충분히 듣습니다. 상담만 받고 가셔도 괜찮습니다.",
    },
    {
      title: "진단 · 설계",
      text: "피부 두께 · 처짐 · 근육 · 볼륨을 보고 시술과 양 · 세기를 정합니다.",
    },
    {
      title: "직접 시술",
      text: "대표원장이 직접 시술합니다. 다른 의사에게 넘기지 않습니다.",
    },
    {
      title: "경과 확인",
      text: "시술 뒤 변화를 함께 확인하고 다음 관리 시기를 안내합니다.",
    },
  ],
};
