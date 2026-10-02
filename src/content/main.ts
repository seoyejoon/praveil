// 메인 페이지 문구 (2026.10 리뉴얼). 원장님 검토 후 확정.
const photo = (name: string) => `/images/photos/${name}.webp`;

// 첫 화면: 스크롤에 따라 로비 → (유리 상담실 안으로 들어감) → 원장 상담 장면
// focusX: 좁은 화면에서 사진을 어디 기준으로 자를지 (로고가 보이게)
// glass: 유리 상담실 자리 (사진 기준 비율). 상담 장면이 이 유리창 안에서 먼저 보이다가 화면 가득 커짐
export const mainHero = {
  eyebrow: "Praveil Clinic",
  scenes: [
    // words: 둘째 줄 [ 괄호 ] 안에서 바뀌는 단어, after: 괄호 뒤 글자
    {
      title: ["오직 당신만을 위한"],
      words: ["단 하나의", "정직한", "섬세한", "자연스러운"],
      after: "계획",
    },
    {
      title: ["처음부터 끝까지 나만을 위한 플랜,", "대표원장 책임 진료 시스템"],
      sub: "프라베일 맑고고운의원",
    },
  ],
  // 밖에서 본 유리문 (가운데 이음새에서 좌우로 열림). openSrc = 같은 사진에서 문틀 · 손잡이만 지운 것
  entrance: {
    src: photo("hero-entrance"),
    openSrc: photo("hero-entrance-open"),
    // AI 업스케일(Real-ESRGAN x4) 후 3200px로 저장
    width: 3200,
    height: 1801,
  },
};

// 두 번째: 피부 분석 장면 (3D 얼굴)
export const mainScan = {
  eyebrow: "Custom Planning",
  title: ["20년 이상 축적된 데이터 기반의", "프라베일 커스텀 플래닝"],
  text: "프라베일 맑고고운의원은 트렌드를 따라가는 것이 아니라 20년 이상 축적한 시술 데이터를 기반으로 정확한 진단을 통해 환자에게 꼭 필요한 시술만을 진행합니다.",
  // 분석 카드: point = 얼굴 점 번호(MediaPipe), top = 카드 세로 위치(%)
  // 수치는 넣지 않는다 (의료광고: 실제 측정값처럼 보이지 않게)
  items: [
    {
      label: "주름",
      en: "Wrinkle",
      point: 151,
      side: "left" as const,
      top: 14,
    },
    { label: "모공", en: "Pore", point: 205, side: "left" as const, top: 46 },
    {
      label: "윤곽",
      en: "Contour",
      point: 172,
      side: "left" as const,
      top: 74,
    },
    {
      label: "탄력",
      en: "Elasticity",
      point: 263,
      side: "right" as const,
      top: 22,
    },
    {
      label: "색소",
      en: "Pigment",
      point: 425,
      side: "right" as const,
      top: 58,
    },
  ],
  steps: ["피부 진단", "분석", "맞춤 설계", "대표원장 시술"],
};

// 대표 시술 4종 (BEST)
export const mainBest = {
  label: "Praveil Signature",
  title: "프라베일 시그니처",
  items: [
    {
      en: "Coolsonic",
      name: "쿨소닉",
      category: "리프팅",
      href: "/lifting/coolsonic",
      text: "피부 깊은 층까지 고려한 초음파 리프팅. 처진 윤곽과 탄력을 한 번에 설계합니다.",
      image: photo("best-coolsonic"),
      headline: ["무너진 얼굴선을 다시 세우는", "쿨링 초음파 리프팅"],
      product: "/images/equipment/hero/coolsonic.webp",
    },
    {
      en: "Coolphase",
      name: "쿨페이즈",
      category: "리프팅",
      href: "/lifting/coolphase",
      text: "고주파로 피부 속 콜라겐을 자극해, 결과 탄력을 함께 끌어올립니다.",
      image: photo("best-coolphase"),
      headline: ["느슨해진 피부를 탄탄하게 조이는", "쿨링 고주파 리프팅"],
      product: "/images/equipment/hero/coolphase.webp",
    },
    {
      en: "Volume Filler",
      name: "볼륨필러",
      category: "쁘띠시술",
      href: "/petit/filler",
      text: "꺼진 곳만 정확하게. 얼굴 비율에 맞춰 자연스러운 볼륨을 채웁니다.",
      image: photo("best-filler"),
      headline: ["꺼진 볼륨을 채워,", "얼굴의 입체감을 디자인하다"],
      product: "/images/equipment/hero/filler.webp",
    },
    {
      en: "Retuo",
      name: "리투오",
      category: "피부관리",
      href: "/skin/retuo",
      text: "피부 속부터 채우는 콜라겐 부스터. 얇아진 피부에 밀도와 결을 더합니다.",
      image: photo("best-retuo"),
      headline: ["피부의 바탕부터 채우는", "ECM 스킨부스터"],
      product: "/images/equipment/hero/retuo.webp",
    },
  ],
};

// 특장점
export const mainWhy = {
  label: "Why Praveil",
  title: ["프라베일이", "다른 이유"],
  items: [
    {
      icon: "doctor",
      title: "대표원장 책임 진료",
      text: "상담한 원장이 시술까지 직접 진행하고, 결과까지 책임집니다.",
      image: photo("special-2"),
    },
    {
      icon: "consult",
      title: "1:1 맞춤 설계",
      text: "피부 상태와 생활 습관, 원하는 변화를 충분히 듣고 나만의 계획을 세웁니다.",
      image: photo("special-1"),
    },
    {
      icon: "genuine",
      title: "정품 · 정량 원칙",
      text: "정품을 정량 그대로 사용하며, 원하시면 시술 전 제품을 확인하실 수 있습니다.",
      image: photo("special-3"),
    },
    {
      icon: "device",
      title: "목적에 맞는 장비",
      text: "피부 층과 고민에 맞춰 장비를 골라, 필요한 만큼만 정확하게 사용합니다.",
      image: photo("special-4"),
    },
    {
      icon: "space",
      title: "프라이빗한 공간",
      text: "상담부터 회복까지, 편안하게 머무를 수 있는 공간을 준비했습니다.",
      image: photo("special-5"),
    },
  ],
};

export const mainDoctor = {
  label: "Doctor",
  nameEn: "Han Jae Woong",
  quote: ["20여 년, 오직 '피부'라는", "하나의 세계만을 들여다봤습니다."],
  text: "같은 고민도 피부마다 답이 다릅니다.\n오랜 시간 쌓아 온 경험으로 피부를 먼저 읽고, 꼭 맞는 방법만 정직하게 권하겠습니다.",
  image: photo("doctor-cutout"),
};

// 진료 분야 (시술 대분류 5개) 대표 사진
export const mainCategoryImage: Record<string, string> = {
  lifting: photo("cat-lifting"),
  petit: photo("cat-filler"),
  skin: photo("cat-skin-booster"),
  "acne-pore": photo("cat-scar-pore"),
  removal: photo("cat-hair-removal"),
};

export const mainSpace = {
  label: "Private Space",
  title: "편안하게 머무는, 프라이빗한 공간",
  images: [
    "clinic-1",
    "clinic-2",
    "clinic-3",
    "clinic-4",
    "clinic-5",
    "clinic-6",
  ].map(photo),
};
