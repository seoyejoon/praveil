import type { DeviceStory } from "@/content/device-story";

export type PrincipleKind = Exclude<
  NonNullable<DeviceStory["diagram"]>,
  "hifu"
>;

type PrincipleIllustration = {
  assetVersion?: string;
  alt: string;
  note: string;
  marks: {
    x: number;
    y: number;
    label: string;
    /** 번호와 설명을 함께 놓는 위치. 연결선은 x · y의 구조를 가리킵니다. */
    labelX?: number;
    labelY?: number;
  }[];
};

// Explanatory illustrations. Positions identify visual features;
// they do not specify treatment depths, doses, device settings, or outcomes.
export const principleIllustrations: Record<
  PrincipleKind,
  PrincipleIllustration
> = {
  rf: {
    alt: "피부 표면에 닿은 냉각 팁과 진피 안에 넓게 전달되는 고주파 열 자극을 보여 주는 입체 개념도",
    note: "고주파 열 자극과 표면 냉각을 함께 표현한 개념도입니다.",
    marks: [
      { x: 45.6, y: 35.5, label: "피부 표면 냉각" },
      { x: 46.2, y: 50.8, label: "피부 속 열 자극" },
      { x: 63.8, y: 61.8, label: "콜라겐 조직" },
    ],
  },
  filler: {
    assetVersion: "20261026b",
    alt: "피부 단면 안에서 서로 다른 층에 놓인 필러를 보여 주는 입체 개념도",
    note: "부위와 제품에 따라 주입하는 층이 달라집니다.",
    marks: [
      { x: 34, y: 40, label: "얕은 층의 필러", labelX: 20, labelY: 24 },
      { x: 56, y: 56, label: "볼륨을 위한 필러", labelX: 45, labelY: 45 },
      { x: 78, y: 69, label: "깊은 층의 필러", labelX: 77, labelY: 65 },
    ],
  },
  botox: {
    assetVersion: "20261026b",
    alt: "신경 말단과 근육 사이의 접합부를 확대해 보툴리눔 톡신의 작용 위치를 보여 주는 입체 개념도",
    note: "신경 · 근육 접합부를 확대한 개념도입니다.",
    marks: [
      { x: 49, y: 36, label: "신경 말단", labelX: 60, labelY: 14 },
      { x: 46, y: 57, label: "톡신의 작용 위치", labelX: 25, labelY: 55 },
      { x: 72, y: 79, label: "근육 섬유", labelX: 78, labelY: 65 },
    ],
  },
  matrix: {
    assetVersion: "20261026",
    alt: "피부 단면에서 리투오의 무세포 동종진피 기질과 주변 진피의 콜라겐 구조를 구분한 입체 모식도",
    note: "리투오의 조직 유래 기질(hADM)과 주변 피부 조직을 구분한 설명용 모식도입니다.",
    marks: [
      { x: 40, y: 49, label: "성분 주입", labelX: 20, labelY: 37 },
      { x: 62, y: 56, label: "조직 유래 기질(hADM)", labelX: 54, labelY: 64 },
      { x: 77, y: 35, label: "주변 진피 조직", labelX: 76, labelY: 19 },
    ],
  },
  booster: {
    assetVersion: "20261026",
    alt: "피부의 진피 안에 리쥬란의 PN 성분을 주입하는 개념과 주변 콜라겐 구조를 구분한 입체 모식도",
    note: "리쥬란(PN)의 주입 개념도입니다. 다른 스킨부스터와 성분 · 사용방법을 구분합니다.",
    marks: [
      { x: 38, y: 45, label: "PN 성분 주입", labelX: 20, labelY: 29 },
      { x: 52, y: 53, label: "폴리뉴클레오티드(PN)", labelX: 43, labelY: 64 },
      { x: 78, y: 58, label: "주변 진피 조직", labelX: 78, labelY: 38 },
    ],
  },
  collagen: {
    alt: "조직 유래 기질의 망상 구조와 합성 고분자 입자를 나란히 구분한 콜라겐부스터 입체 개념도",
    note: "두 재료의 차이를 설명하는 그림이며, 함께 주입한다는 의미는 아닙니다.",
    marks: [
      { x: 31.5, y: 54.7, label: "조직 유래 기질" },
      { x: 61.1, y: 56.2, label: "합성 고분자 입자" },
    ],
  },
  laser: {
    alt: "집속 초음파의 초점, 미세침 고주파의 바늘, 레이저의 빛 전달을 세 개의 피부 단면으로 구분한 입체 개념도",
    note: "서로 다른 에너지 전달 방식을 비교한 개념도입니다.",
    marks: [
      { x: 22.4, y: 60.1, label: "집속 초음파" },
      { x: 47.6, y: 54.4, label: "미세침 고주파" },
      { x: 72.8, y: 60.2, label: "레이저" },
    ],
  },
  thread: {
    assetVersion: "20261026b",
    alt: "피부 조직 안에 비스듬히 놓인 돌기 있는 실과 조직을 지지하는 구조를 확대한 입체 개념도",
    note: "돌기가 있는 실의 예시입니다. 실마다 구조와 삽입 층이 다릅니다.",
    marks: [
      { x: 32.7, y: 58.5, label: "삽입한 실", labelX: 20, labelY: 42 },
      { x: 50.8, y: 56.5, label: "돌기 구조", labelX: 50, labelY: 66 },
      { x: 67.9, y: 55, label: "조직 지지", labelX: 78, labelY: 28 },
    ],
  },
  acne: {
    assetVersion: "20261026b",
    alt: "모공 속 막힘과 주변 염증, 피부 표면의 패인 흔적을 구분한 여드름 · 모공 입체 개념도",
    note: "진행 중인 여드름과 남은 흉터를 구분하기 위한 개념도입니다.",
    marks: [
      { x: 29, y: 25, label: "모공 막힘", labelX: 19, labelY: 11 },
      { x: 35, y: 41, label: "주변 염증", labelX: 20, labelY: 57 },
      { x: 75, y: 36, label: "패인 흉터", labelX: 76, labelY: 16 },
    ],
  },
  hair: {
    assetVersion: "20261026b",
    alt: "피부 단면 속 털과 모낭에 레이저 에너지가 전달되는 원리를 보여 주는 입체 개념도",
    note: "털의 색소와 모낭에 작용하는 원리를 표현했습니다.",
    marks: [
      { x: 45, y: 25, label: "레이저 에너지", labelX: 23, labelY: 19 },
      { x: 48, y: 51, label: "털의 멜라닌", labelX: 23, labelY: 51 },
      { x: 51, y: 72, label: "모낭", labelX: 76, labelY: 65 },
    ],
  },
  pigment: {
    assetVersion: "20261026b",
    alt: "피부 속 문신 색소와 레이저 작용 뒤 잘게 나뉜 입자를 구분한 입체 개념도",
    note: "색소 입자의 변화를 표현한 그림으로, 실제 전후 사진이 아닙니다.",
    marks: [
      { x: 50, y: 35, label: "레이저 에너지", labelX: 55, labelY: 16 },
      { x: 32, y: 49, label: "색소 입자", labelX: 22, labelY: 33 },
      { x: 63, y: 55, label: "잘게 나뉜 입자", labelX: 77, labelY: 60 },
    ],
  },
};
