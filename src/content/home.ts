// 메인 페이지 문구. 모두 임시 문구이며 원장님 확인 후 교체한다.

export const hero = {
  eyebrow: "Clear & Graceful",
  title: ["맑고 고운 피부,", "나에게 맞는 방법으로"],
  description: "피부를 먼저 읽고, 필요한 만큼 정확하게.\n대표원장이 직접 상담하고 시술합니다.",
};

export const philosophy = [
  { en: "READ : SKIN", title: "피부를 먼저 읽습니다.", body: "피부 두께와 탄력, 생활 습관까지 살핍니다.", tone: "dark" },
  { en: "FIT : YOU", title: "나에게 맞게 설계합니다.", body: "같은 시술도 사람마다 방법이 다릅니다.", tone: "light" },
  { en: "GLOW : LIFE", title: "일상에 자연스럽게 스밉니다.", body: "티 나지 않게, 그러나 분명하게 달라집니다.", tone: "dark" },
] as const;

// 스크롤에 맞춰 한 단어씩 칠해지는 문장
export const statement = {
  en: "Not More, But Right",
  text: "맑고 고운 피부는 많은 시술이 아니라, 정확한 진단에서 시작됩니다. 프라베일은 피부를 먼저 읽고, 꼭 필요한 만큼만 정확하게 시술합니다.",
};

// 숫자로 보는 프라베일. value가 null이면 "○"로 표시 (확정 후 입력)
export const stats: { value: number | null; unit: string; label: string; note: string }[] = [
  { value: 54, unit: "종", label: "시술 프로그램", note: "리프팅부터 스킨부스터까지" },
  { value: 4, unit: "곳", label: "학회 정회원 · 자문", note: "미용외과 · 레이저 · 미용의학" },
  { value: null, unit: "년", label: "대표원장 임상 경력", note: "확정 후 입력" },
  { value: null, unit: "종", label: "보유 장비", note: "확정 후 입력" },
];

// 대표 시술 프로그램 (slug는 시술 데이터와 연결)
export const programs: Record<string, { description: string; tags: string[] }> = {
  coolsonic: { description: "처진 윤곽과 탄력이 고민일 때, 피부 깊은 층까지 고려한 리프팅 프로그램입니다.", tags: ["리프팅", "탄력", "윤곽"] },
  coolphase: { description: "피부 상태에 맞춰 에너지를 설계하는 리프팅으로, 탄력과 피부결을 함께 살핍니다.", tags: ["탄력", "피부결", "리프팅"] },
  "volume-filler": { description: "꺼진 부위를 과하지 않게, 얼굴 전체의 균형을 보며 볼륨을 채웁니다.", tags: ["볼륨", "균형", "자연스러움"] },
  retuo: { description: "피부 속 컨디션을 채워 결과 광채를 가꾸는 스킨부스터 프로그램입니다.", tags: ["스킨부스터", "피부결", "광채"] },
};

export const bigLetters = {
  text: "Clear & Graceful",
  caption: "맑고 고운 피부를 위한 프라베일의 기준",
};

export const doctorQuote = "피부마다 맞는 방법은 다릅니다.\n상담부터 시술까지\n직접 책임지겠습니다.";

export const clinic = {
  en: "Clinic",
  title: ["편안하게 머무는,", "프라이빗한 공간."],
  body: "상담부터 시술, 회복까지 편안한 경험을 위해 공간을 세심하게 준비했습니다.",
};

export const contact = {
  en: "Reservation",
  title: "나에게 맞는 방법, 상담에서 시작됩니다.",
  body: "충분한 상담을 위해 예약 후 방문을 권장드립니다.",
};

// 샘플 사진 (Picsum · Unsplash 라이선스, 웜톤 보정). 촬영본이 나오면 같은 이름으로 교체한다.
const sample = (name: string) => `/images/sample/${name}.webp`;

export const images = {
  hero: sample("hero"),
  story: [sample("story-1"), sample("story-2")],
  // 시술 카테고리 목록에서 마우스를 올리면 뜨는 사진 (카테고리 순서대로 돌려 씀)
  categories: [
    "signature-1", "why-3", "signature-3", "why-4", "story-2", "why-2",
    "signature-2", "signature-4", "why-1", "story-1", "why-5",
  ].map(sample),
  signature: [1, 2, 3, 4].map((n) => sample(`signature-${n}`)),
  why: [1, 2, 3, 4, 5].map((n) => sample(`why-${n}`)),
  doctor: sample("doctor"),
  clinic: [1, 2, 3, 4, 5, 6].map((n) => sample(`clinic-${n}`)),
  contact: sample("contact"),
};
