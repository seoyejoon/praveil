// 메인 페이지 문구. 모두 임시 문구이며 원장님 확인 후 교체한다.

// ① 첫 화면
export const hero = {
  eyebrow: "Customized Plan",
  title: ["대표원장 책임 진료 시스템"],
  description: "오직 당신만을 위한 단 하나의 계획",
};

// ② 브랜드 문장: 제목 아래 문장이 스크롤에 맞춰 한 단어씩 칠해진다
export const statement = {
  en: "Not More, But Right",
  title: "프라베일은 다릅니다.",
  text: "맑고 고운 피부는 많은 시술이 아니라, 정확한 진단에서 시작됩니다. 프라베일은 피부를 먼저 읽고, 꼭 필요한 만큼만 정확하게 시술합니다.",
};

// ③ 철학 3가지 (icon: 카드 속 움직이는 아이콘 종류)
export const philosophy = [
  { en: "READ : SKIN", title: "피부를 먼저 읽습니다.", body: "피부 두께와 탄력, 생활 습관까지 살핍니다.", icon: "read" },
  { en: "FIT : YOU", title: "나에게 맞게 설계합니다.", body: "같은 시술도 사람마다 방법이 다릅니다.", icon: "fit" },
  { en: "NATURAL : CHANGE", title: "자연스러운 변화를 만듭니다.", body: "티 나지 않게, 그러나 분명하게 달라집니다.", icon: "change" },
] as const;

// ⑤ 시그니처 시술 (slug는 시술 데이터와 연결)
export const programs: Record<string, { description: string; tags: string[] }> = {
  coolsonic: { description: "처진 윤곽과 탄력이 고민일 때, 피부 깊은 층까지 고려한 리프팅 프로그램입니다.", tags: ["리프팅", "탄력", "윤곽"] },
  coolphase: { description: "피부 상태에 맞춰 에너지를 설계하는 리프팅으로, 탄력과 피부결을 함께 살핍니다.", tags: ["탄력", "피부결", "리프팅"] },
  "volume-filler": { description: "꺼진 부위를 과하지 않게, 얼굴 전체의 균형을 보며 볼륨을 채웁니다.", tags: ["볼륨", "균형", "자연스러움"] },
  retuo: { description: "피부 속 컨디션을 채워 결과 광채를 가꾸는 스킨부스터 프로그램입니다.", tags: ["스킨부스터", "피부결", "광채"] },
};

// ⑥ 프라베일만의 특별함 (진료 여정 순서)
export const special = {
  en: "Praveil Special",
  title: "프라베일만의 특별함",
  description: "처음 오시는 분도 안심할 수 있도록,\n상담부터 사후 관리까지 한 흐름으로 진행합니다.",
  items: [
    { title: "1:1 맞춤 상담", body: "피부 상태와 생활 습관, 원하는 변화를 충분히 듣고 나만의 계획을 세웁니다." },
    { title: "대표원장 직접 시술", body: "상담한 원장이 시술까지 직접 진행하고, 결과까지 책임집니다." },
    { title: "정품 · 정량 사용", body: "정품을 정량 그대로 사용하며, 원하시면 시술 전 제품을 확인하실 수 있습니다." },
    { title: "목적에 맞는 장비", body: "피부 층과 고민에 맞춰 장비를 골라, 필요한 만큼만 정확하게 사용합니다." },
    { title: "편안한 내원", body: "대중교통과 자가용 모두 편하게, 프라이빗한 공간에서 머무르실 수 있습니다." },
  ],
};

// ⑧ 원장 인사말 (⚠️ '20여 년'은 실제 경력 확인 후 확정)
export const doctorGreeting = {
  eyebrow: "The Praveil Standard",
  quote: ["20여 년, 오직 '피부'라는", "하나의 세계만을 들여다봤습니다."],
  description: "같은 고민도 피부마다 답이 다릅니다.\n오랜 시간 쌓아 온 경험으로 피부를 먼저 읽고,\n꼭 맞는 방법만 정직하게 권하겠습니다.",
};

// 병원소개 페이지의 원장 소개 인용문
export const doctorQuote = "피부마다 맞는 방법은 다릅니다.\n상담부터 시술까지\n직접 책임지겠습니다.";

// ⑨ 진료 분야 (분류 slug별 소개. 없는 분류는 관리자의 분류 설명을 쓴다)
export const treatmentIntro = {
  en: "Praveil Department",
  title: ["피부 속부터 라인까지,", "프라베일 진료분야"],
  description: "어디서부터 시작해야 할지 고민되시나요?\n11개 분야, 54가지 시술 중 나에게 맞는 방법을 함께 찾습니다.",
};

export const treatmentCopy: Record<string, string> = {
  lifting: "처진 윤곽과 탄력 고민을 피부 깊이와 두께에 맞춰 설계합니다. 초음파 · 고주파 · 실리프팅 중 필요한 방법을 골라 진행합니다.",
  botox: "표정 주름부터 턱 · 승모근 · 종아리 라인까지, 근육의 움직임을 보며 필요한 부위에 필요한 만큼만 사용합니다.",
  filler: "꺼진 곳을 과하지 않게 채워 얼굴 전체의 균형을 맞춥니다. 부위별 특성에 맞는 제품과 깊이를 선택합니다.",
  "skin-booster": "피부 속 컨디션을 채워 결 · 탄력 · 광채를 가꿉니다. 피부 타입과 고민에 맞춰 부스터를 조합합니다.",
  toning: "기미 · 잡티 · 색소 침착을 피부 자극을 줄이며 단계적으로 관리합니다.",
  "skin-care": "진정 · 보습 · 결 관리를 위한 관리 프로그램으로, 시술 전후 피부 컨디션을 돕습니다.",
  "scar-pore": "흉터와 넓어진 모공을 레이저로 관리하며, 피부 회복 속도에 맞춰 간격을 정합니다.",
  acne: "여드름 단계와 원인을 확인해 압출 · 필링 · 레이저를 단계별로 구성합니다.",
  injection: "영양 · 미백 · 바디 라인 등 목적에 맞는 주사 관리를 안내합니다.",
  "hair-removal": "털의 굵기와 피부톤에 맞춰 여성 · 남성 레이저제모를 진행합니다.",
  "tattoo-removal": "눈썹 · 아이라인 문신을 색소 깊이에 맞춰 여러 회에 걸쳐 옅게 합니다.",
};

// ⑩ 공지 · 이벤트
export const news = {
  en: "News",
  title: "프라베일 소식",
};

// ⑪ 병원 공간
export const clinic = {
  en: "Clinic",
  title: ["편안하게 머무는,", "프라이빗한 공간."],
  body: "상담부터 시술, 회복까지 편안한 경험을 위해 공간을 세심하게 준비했습니다.",
};

// ⑬ 상담 안내
export const contact = {
  en: "Contact Us",
  title: "상담 문의",
  body: "모든 시술 계획은 충분한 상담 후, 당신의 피부 상태에 맞게 세워집니다.",
};

// 2026.09 병원 촬영본 (원본: 구글 드라이브 '최종보정'). 자리별로 잘라서 public/images/photos 에 둔다.
const photo = (name: string) => `/images/photos/${name}.webp`;

export const images = {
  hero: photo("hero"),
  // 진료 분야별 대표 사진 (분류 slug 기준)
  categoryBySlug: {
    lifting: photo("cat-lifting"),
    botox: photo("cat-botox"),
    filler: photo("cat-filler"),
    "skin-booster": photo("cat-skin-booster"),
    toning: photo("cat-toning"),
    "skin-care": photo("cat-skin-care"),
    "scar-pore": photo("cat-scar-pore"),
    acne: photo("cat-acne"),
    injection: photo("cat-injection"),
    "hair-removal": photo("cat-hair-removal"),
    "tattoo-removal": photo("cat-tattoo-removal"),
  } as Record<string, string>,
  // 시그니처 시술 (쿨소닉 · 쿨페이즈 · 볼륨필러 · 리투오 순)
  signature: [1, 2, 3, 4].map((n) => photo(`signature-${n}`)),
  special: [1, 2, 3, 4, 5].map((n) => photo(`special-${n}`)),
  // 병원소개 > 보유 장비 (쿨소닉 · 쿨페이즈 외에는 원장님 확인 후 맞는 장비 사진으로 교체)
  equipment: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => photo(`equip-${n}`)),
  // 원장 인사말: 배경을 지운 사진 / 병원소개 약력: 원본 사진
  doctorCutout: photo("doctor-cutout"),
  doctor: photo("doctor"),
  // 인포메이션 · 대기실 · 상담실 · 파우더룸 · 시술실 · 복도
  clinic: [1, 2, 3, 4, 5, 6].map((n) => photo(`clinic-${n}`)),
  contact: photo("contact"),
  pageHero: {
    about: photo("hero-about"),
    treatments: photo("hero-treatments"),
    news: photo("hero-news"),
    location: photo("hero-location"),
  },
};

// offset 0 이면 그 분류 사진, 1 이상이면 다음 분류 사진들을 차례로 (시술 카드가 모두 같은 사진이 되지 않도록)
const categoryPhotos = Object.values(images.categoryBySlug);
export const categoryPhoto = (slug: string, offset = 0) => {
  const start = Math.max(0, Object.keys(images.categoryBySlug).indexOf(slug));
  return categoryPhotos[(start + offset) % categoryPhotos.length];
};
