// 병원소개 · 의료진소개 원고
// ※ 임시 원고: 원장님 약력 · 공간 설명 · 장비 목록은 자료를 받으면 교체합니다.
// ※ 의료광고: '최고 · 유일' 같은 표현, 다른 병원과의 비교, 치료 경험담은 쓰지 않습니다.

const photo = (name: string) => `/images/photos/${name}.webp`;
// 제조사 공식 제품 사진 (장비 구매 병원 사용 허가 범위)
const device = (name: string) => `/images/equipment/${name}.webp`;

// 병원소개 · 의료진소개 상단 (탭은 사이트맵 '병원소개' 분류를 따름)
export const aboutHero = {
  intro: {
    en: "About Praveil",
    title: "병원소개",
    description: "피부를 먼저 읽고, 꼭 필요한 만큼 정확하게.",
    image: photo("hero-about"),
  },
  doctor: {
    en: "Doctor",
    title: "의료진소개",
    description: "상담부터 시술, 경과 확인까지 대표원장이 직접 책임집니다.",
    image: photo("hero-consult"),
  },
};

export const aboutIntro = {
  headline: ["과한 변화보다", "나다운 아름다움을 지키는 곳."],
  /** 첫 문단의 뒷부분 (앞부분 '○○은 ○○에 있는 피부 · 미용 의원입니다'는 병원 정보로 자동 생성) */
  body: "대표원장이 상담부터 시술, 경과 확인까지 직접 진행하며, 리프팅 · 쁘띠시술 · 피부관리 · 여드름 · 모공 · 제모 · 문신제거를 진료합니다. 같은 고민도 피부마다 답이 다르기에, 먼저 피부를 읽고 꼭 필요한 방법만 권합니다.",
};

// 진료 철학 (세 가지)
export const aboutPhilosophy = {
  en: "Philosophy",
  title: "프라베일이 지키는 세 가지",
  items: [
    {
      en: "Read",
      title: "피부를 먼저 읽습니다",
      text: "시술을 고르기 전에 피부 두께 · 처짐 · 볼륨 · 생활 습관을 먼저 봅니다. 진단이 먼저, 시술은 그다음입니다.",
    },
    {
      en: "Design",
      title: "꼭 필요한 만큼만 권합니다",
      text: "여러 시술을 한꺼번에 권하지 않습니다. 지금 필요한 것과 나중에 해도 되는 것을 나누어 정직하게 안내합니다.",
    },
    {
      en: "Care",
      title: "끝까지 책임집니다",
      text: "시술한 원장이 경과까지 직접 확인하고, 다음 관리 시기와 방법을 함께 정합니다.",
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
      text: "20년 경력의 대표원장이 상담부터 시술까지 직접 책임집니다.",
      image: photo("special-2"),
    },
    {
      title: "1:1 맞춤 설계",
      text: "환자마다 다른 피부 상태와 고민 부위, 적응증을 고려해 가장 알맞은 시술 계획을 세웁니다.",
      image: photo("special-1"),
    },
    {
      title: "정품 · 정량 원칙",
      text: "프라베일 맑고고운의원에서 사용되는 모든 제품은 정품 · 정량 사용을 원칙으로 합니다.",
      image: photo("special-3"),
    },
    {
      title: "프리미엄 장비 보유",
      text: "프라베일 맑고고운의원은 쿨소닉, 쿨페이즈, 포텐자 등 프리미엄 장비를 갖추고 있습니다.",
      image: photo("special-4"),
    },
    {
      title: "프라이빗한 공간",
      text: "상담부터 시술, 관리까지 프라이빗한 공간에서 한 분만을 위한 맞춤 진료를 진행합니다.",
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
    { name: "상담실", text: "대표원장 1:1 상담", image: photo("clinic-3") },
    { name: "파우더룸", text: "시술 후 정돈", image: photo("clinic-4") },
    { name: "시술실", text: "독립된 시술 공간", image: photo("clinic-5") },
    { name: "복도", text: "프라이빗한 동선", image: photo("clinic-6") },
  ],
};

// 보유 장비: 병원 촬영본에서 확인된 6대 (프락셀 · LDM 등은 보유 확인 후 추가)
// 사진: 제조사 공식 제품 사진 또는 병원 촬영본 배경 정리 (public/images/equipment)
export const aboutEquipment = {
  en: "Equipment",
  title: "시술 목적에 맞춘 장비",
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
      href: "/lifting/laser",
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
  photo: photo("doctor"),
  quote: ["20여 년, 오직 '피부'라는", "하나의 세계만을 들여다봤습니다."],
  greeting: [
    "같은 고민도 피부마다 답이 다릅니다. 그래서 프라베일에서는 시술을 고르기 전에 피부를 먼저 읽습니다.",
    "많이 하는 것보다 꼭 맞게 하는 것, 한 번의 변화보다 오래 건강한 피부를 목표로 합니다. 상담한 제가 직접 시술하고, 경과까지 끝까지 확인하겠습니다.",
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
      text: "상담한 원장이 직접 시술합니다. 다른 의사에게 넘기지 않습니다.",
    },
    {
      title: "경과 확인",
      text: "시술 뒤 변화를 함께 확인하고 다음 관리 시기를 안내합니다.",
    },
  ],
};
