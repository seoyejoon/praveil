// 장비 시술 페이지의 "장비 이야기" 원고 (장비 소개 · 원리 그림 · 특징 · 시술 장면)
// - 글만 있던 설명을 장비 사진 · 원리 그림 · 실제 시술 장면과 함께 보여 줌
// - 있는 시술만 TreatmentDetail 에서 이 구성으로 바뀜 (지금은 쿨소닉만)
// ※ 임시 원고: 원장님 검토 후 확정해 주세요. 효과를 보장하는 표현 · 다른 병원과의 비교는 쓰지 않습니다.

export type DeviceStory = {
  /** 장비 소개 */
  device: {
    name: string;
    maker: string;
    /** 배경 없는 제품 사진 */
    image: string;
    /** 제조사 브랜드 영상 (있으면 사진 대신) */
    film?: { src: string; poster: string };
    text: string;
    specs: { label: string; value: string }[];
  };
  /** 원리 (그림 옆 세 단계) */
  principle: { title: string; text: string }[];
  /** 원리 그림의 깊이 표시 (얕게 · 중간 · 깊게 순) — 그림 사진이 없을 때 */
  depths?: [string, string, string];
  /** 원리 그림 사진 + 그 위 표시 (x · y 는 사진 속 %) */
  principleImage?: {
    src: string;
    alt: string;
    /** 가리키는 표시: 점 + 이름표 (side: 이름표가 점의 어느 쪽에) */
    marks: {
      x: number;
      y: number;
      label: string;
      side: "left" | "right";
      /** 이름표를 점 위로 올림 (점이 줄지어 있을 때) */
      above?: boolean;
    }[];
    /** 오른쪽 끝 층 이름 */
    layers: { y: number; label: string }[];
  };
  /** 많이 비교하는 장비 비교표 (장비의 일반적인 특징, 우열 비교 아님) */
  compare?: {
    columns: { name: string; maker: string; owned?: boolean; self?: boolean }[];
    rows: { label: string; values: string[] }[];
    note: string;
  };
  /** 특징 파트 제목 (없으면 "○○만의 특별함") */
  featuresTitle?: string;
  /** 특징: 사진 또는 영상 + 설명 */
  features: {
    title: string;
    text: string;
    image: string;
    alt: string;
    /** 짧은 반복 영상 (image 는 첫 장면) */
    video?: string;
  }[];
  /** 시술 과정: 사진 + 설명 */
  process: { title: string; text: string; image: string; alt: string }[];
  /** 시술 장면 영상 */
  video?: { src: string; poster: string; title: string[]; text: string };
};

const photo = (name: string) => `/images/photos/${name}.webp`;
const cs = (name: string) => `/images/coolsonic/${name}.webp`;

export const deviceStory: Record<string, DeviceStory> = {
  "/lifting/coolsonic": {
    device: {
      name: "CoolSonic",
      maker: "ASTERASYS",
      image: "/images/equipment/hero/coolsonic.webp",
      film: {
        src: "/videos/coolsonic-brand.mp4",
        poster: cs("coolsonic-brand"),
      },
      text: "쿨소닉은 아스테라시스(ASTERASYS)의 집속 초음파(HIFU) 리프팅 장비입니다. 피부 표면을 식히면서 피부 속 깊은 층에 에너지를 전달합니다. 프라베일은 이 장비를 직접 보유하고, 대표원장이 시술합니다.",
      specs: [
        { label: "방식", value: "고강도 집속 초음파 (HIFU)" },
        { label: "작용 층", value: "진피층 ~ 근막층 (SMAS)" },
        { label: "시술 부위", value: "턱선 · 볼 · 이중턱 · 눈가 · 이마 · 목" },
        { label: "냉각", value: "시술 중 피부 표면 냉각" },
      ],
    },
    principle: [
      {
        title: "초음파를 한 점에 모읍니다",
        text: "돋보기로 햇빛을 모으듯 초음파 에너지를 피부 속 한 점에 모읍니다. 피부 표면은 지나가고 속에서만 작용합니다.",
      },
      {
        title: "원하는 깊이에 열 응고점을 만듭니다",
        text: "진피층부터 근막층(SMAS)까지, 부위마다 깊이를 골라 아주 작은 열 응고점을 촘촘히 만듭니다.",
      },
      {
        title: "조이고, 새로 채웁니다",
        text: "자극받은 조직이 수축하며 당겨지고, 몇 주에 걸쳐 새 콜라겐이 만들어지며 탄력이 차오릅니다.",
      },
    ],
    depths: ["1.5mm", "3.0mm", "4.5mm"],
    principleImage: {
      src: cs("principle"),
      alt: "쿨소닉 원리 그림: 냉각 어플리케이터가 피부 표면을 식히고, 모인 초음파가 피부 속에 열 응고점을 만드는 모습",
      marks: [
        { x: 36, y: 16, label: "냉각 어플리케이터", side: "left" },
        { x: 22, y: 40, label: "피부 표면 냉각", side: "right" },
        { x: 52, y: 42, label: "한 점에 모이는 초음파", side: "right" },
        { x: 82.7, y: 58, label: "열 응고점", side: "left", above: true },
      ],
      layers: [
        { y: 46, label: "표피 · 진피" },
        { y: 70, label: "피하지방" },
        { y: 80, label: "근막층 (SMAS)" },
        { y: 93, label: "근육" },
      ],
    },
    compare: {
      columns: [
        { name: "쿨소닉", maker: "아스테라시스", owned: true, self: true },
        { name: "울쎄라", maker: "멀츠" },
        { name: "슈링크 유니버스", maker: "클래시스", owned: true },
        { name: "써마지 FLX", maker: "솔타메디칼" },
      ],
      rows: [
        {
          label: "에너지",
          values: [
            "집속 초음파 (HIFU)",
            "집속 초음파 (MFU-V)",
            "집속 초음파 (HIFU)",
            "고주파 (RF)",
          ],
        },
        {
          label: "작용 깊이",
          values: [
            "1.5 · 3.0 · 4.5mm",
            "1.5 · 3.0 · 4.5mm",
            "1.5 · 2.0 · 3.0 · 4.5mm",
            "진피 ~ 피하 (넓게)",
          ],
        },
        {
          label: "피부 표면 냉각",
          values: ["냉각 어플리케이터", "없음", "없음", "냉각 스프레이"],
        },
        {
          label: "특징",
          values: [
            "식히며 시술 · 굴곡 부위 밀착",
            "초음파 영상으로 층을 보며 시술",
            "모드가 다양 · 얼굴 · 바디",
            "피부 전체를 고르게 가열 · 탄력 · 피부결",
          ],
        },
        {
          label: "주로 찾는 고민",
          values: [
            "턱선 · 볼 처짐, 윤곽",
            "깊은 처짐, 윤곽",
            "윤곽 · 탄력",
            "탄력 · 피부결 · 잔주름",
          ],
        },
        {
          label: "회복",
          values: ["바로 일상", "바로 일상", "바로 일상", "바로 일상"],
        },
      ],
      note: "※ 각 장비의 일반적인 특징을 정리한 것으로, 어느 장비가 더 낫다는 뜻이 아닙니다. 맞는 장비는 피부 상태와 고민에 따라 다르며, 통증 · 효과 · 유지 기간은 사람마다 다릅니다.",
    },
    featuresTitle: "쿨소닉 리프팅의 4가지 특징",
    features: [
      {
        title: "1.5 · 3.0 · 4.5mm 깊이별 에너지 전달",
        text: "쿨소닉은 3가지 깊이에 대응하는 어플리케이터를 사용합니다. 목표 깊이에 초음파 에너지를 전달해 피부 속 조직에 작용합니다.",
        image: cs("coolsonic-applicator"),
        video: "/videos/coolsonic-applicator.mp4",
        alt: "쿨소닉 1.5mm · 3.0mm · 4.5mm 어플리케이터",
      },
      {
        title: "얼굴 굴곡에 밀착하는 펜형 어플리케이터",
        text: "쿨소닉은 펜형 어플리케이터로 굴곡진 피부에도 밀착하기 쉽도록 설계했습니다. 얼굴의 곡면을 따라 접촉하면서 초음파 에너지를 전달합니다.",
        image: cs("handpiece"),
        alt: "얼굴 곡면을 따라 쿨소닉 펜형 어플리케이터로 시술하는 모습",
      },
      {
        title: "쿨링으로 통증 부담을 줄이는 초음파 리프팅",
        text: "쿨소닉은 피부 표면을 냉각하면서 고강도 집속 초음파(HIFU)를 전달합니다. ACC 냉각 기술을 적용해 시술 중 열감과 통증 부담을 줄이도록 설계했습니다.",
        image: cs("coolsonic-cooling"),
        video: "/videos/coolsonic-cooling.mp4",
        alt: "쿨소닉 ACC 냉각 어플리케이터",
      },
      {
        title: "콜라겐과 탄성섬유의 재생 유도",
        text: "쿨소닉의 집속 초음파는 피부 속 목표 조직에 열응고점을 형성합니다. 이를 통해 콜라겐과 탄성섬유의 재생을 유도하는 방식으로 리프팅에 활용됩니다.",
        image: cs("principle"),
        alt: "피부 속 목표 조직에 열응고점을 만드는 쿨소닉 집속 초음파 원리",
      },
    ],
    process: [
      {
        title: "1:1 상담",
        text: "고민과 원하는 변화를 듣고, 쿨소닉이 맞는 시술인지부터 함께 판단합니다.",
        image: photo("hero-consult"),
        alt: "대표원장 상담",
      },
      {
        title: "진단 · 디자인",
        text: "피부 두께와 처짐 방향을 보고 부위별 깊이와 샷 수를 정합니다.",
        image: photo("special-1"),
        alt: "얼굴을 보며 시술 부위를 정하는 모습",
      },
      {
        title: "마취 · 시술",
        text: "마취 크림을 바른 뒤 약 30~40분, 피부를 식히며 층마다 나누어 시술합니다.",
        image: photo("hero-coolsonic"),
        alt: "쿨소닉 시술 장면",
      },
      {
        title: "경과 확인",
        text: "시술 직후 상태를 확인하고, 주의사항과 다음 관리 시기를 안내합니다.",
        image: photo("clinic-3"),
        alt: "프라베일 상담실",
      },
    ],
    video: {
      src: "/videos/hero-coolsonic.mp4",
      poster: photo("hero-coolsonic"),
      title: ["상담한 원장이,", "한 샷 한 샷 직접."],
      text: "프라베일의 쿨소닉은 대표원장이 처음부터 끝까지 직접 시술합니다.",
    },
  },
};
