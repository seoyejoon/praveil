// 시술 상세 원고 공통 부분
// ⚠️ 모든 원고는 공개 자료(제조사 · 일반 의학 정보)를 바탕으로 새로 작성한 초안이다.
//    원장님 검수 전에는 공개하지 않는다. 확인이 필요한 내용은 각 시술의 check에 적어 두었다.

export type ProcedureDetail = {
  /** 상단 한 줄 소개 */
  summary: string;
  tags: string[];
  /** 이런 분께 추천합니다 */
  recommend: string[];
  /** 시술 원리 */
  principle: string;
  /** 프라베일 포인트 */
  points: string[];
  /** 주의사항 · 부작용 */
  cautions: string[];
  faq: { q: string; a: string }[];
  info: { time: string; anesthesia: string; recovery: string; interval: string };
  /** 원장님 확인이 필요한 사항 (화면에 표시하지 않음) */
  check?: string;
};

// 프라베일 공통 포인트 (특장점 기반)
export const pointDoctor = "상담부터 시술까지 대표원장이 직접 진행합니다.";
export const pointConsult = "피부 상태와 고민을 1:1로 확인한 뒤 강도와 부위를 정합니다.";
export const pointGenuine = "정품을 정량 그대로 사용하며, 원하시면 시술 전 제품을 확인하실 수 있습니다.";

// 분야별 공통 주의사항
export const cautionCommon = "시술 결과와 유지 기간은 피부 상태, 생활 습관 등에 따라 개인차가 있습니다.";

export const cautionEnergy = [
  "시술 직후 붉어짐, 열감, 가벼운 붓기가 나타날 수 있으며 대부분 수 시간에서 수일 내 가라앉습니다.",
  "드물게 물집, 화상, 일시적 신경 자극감 등이 나타날 수 있어 이상이 느껴지면 병원에 알려주세요.",
  "시술 후 1주일 정도는 사우나 · 찜질방 · 과음을 피하고 보습과 자외선 차단에 신경 써 주세요.",
  cautionCommon,
];

export const cautionLaser = [
  "시술 후 붉어짐, 열감, 가벼운 각질이 생길 수 있으며 보통 수일 내 좋아집니다.",
  "드물게 일시적인 색소침착 · 색소 저하, 딱지가 생길 수 있어 억지로 떼지 말아 주세요.",
  "시술 기간에는 자외선 차단제를 꼭 바르고, 각질 제거제 · 레티놀 제품은 잠시 쉬어 주세요.",
  cautionCommon,
];

export const cautionBotox = [
  "시술 후 4시간 정도는 눕거나 시술 부위를 문지르지 말아 주세요.",
  "당일 음주, 사우나, 격한 운동은 피해 주세요.",
  "주사 부위 멍 · 붓기, 드물게 두통 · 일시적인 비대칭이나 근력 저하가 나타날 수 있습니다.",
  "임신 · 수유 중이거나 신경근육 질환이 있는 경우 시술이 어렵습니다.",
  cautionCommon,
];

export const cautionFiller = [
  "시술 후 붓기와 멍이 생길 수 있으며 보통 1~2주 안에 가라앉습니다.",
  "1~2주 동안은 시술 부위를 세게 누르거나 마사지하지 말고, 사우나 · 음주를 피해 주세요.",
  "드물게 혈관 관련 합병증이 생길 수 있어 심한 통증이나 피부색 변화가 있으면 바로 병원에 연락해 주세요.",
  "필러가 원하는 모양과 다를 경우 히알루론산 필러는 분해 주사로 조절할 수 있습니다.",
  cautionCommon,
];

export const cautionBooster = [
  "주사 부위에 작은 자국, 엠보(볼록한 자국), 멍이 생길 수 있으며 보통 수일 내 가라앉습니다.",
  "시술 당일은 화장 · 세안을 가볍게 하고, 사우나 · 음주 · 격한 운동은 2~3일 피해 주세요.",
  "드물게 붉어짐, 가려움, 결절이 나타날 수 있어 오래가면 병원에 알려주세요.",
  cautionCommon,
];

export const cautionInjection = [
  "주사 부위에 멍이나 뻐근함이 생길 수 있습니다.",
  "성분에 대한 알레르기나 복용 중인 약이 있으면 상담 시 꼭 알려주세요.",
  "임신 · 수유 중이거나 지병이 있는 경우 시술이 제한될 수 있습니다.",
  cautionCommon,
];

export const cautionPeel = [
  "시술 후 일시적으로 붉어지거나 따끔할 수 있고, 가벼운 각질이 생길 수 있습니다.",
  "시술 후 2~3일은 각질 제거 · 스크럽 · 레티놀 제품을 피하고 보습과 자외선 차단에 신경 써 주세요.",
  "피부염이 심하거나 상처가 있는 부위는 시술을 미룰 수 있습니다.",
  cautionCommon,
];
