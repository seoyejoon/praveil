// 시술별 AI 가상 비교 이미지 (2026-11-05 자료)
// ※ 실제 환자나 시술 결과 사진이 아닙니다. 실제 사례 게시판(/before-after)에는 쓰지 않습니다.
export type AiComparison = {
  /** 3:2 합본 이미지 (좌: 전 · 우: 후). 잘라서 쓰지 않습니다 */
  image: string;
  srcSet: string;
  alt: string;
  /** 이미지 밖에도 보여 주는 안내 문구 */
  caption: string;
  /** 어떤 부위를 보여 주는지 */
  focus: string;
};

export const aiComparison: Record<string, AiComparison> = {
  "/lifting/coolsonic": {
    image: "/images/simulations/praveil-coolsonic-comparison-ai-v1.webp",
    srcSet: "/images/simulations/praveil-coolsonic-comparison-ai-v1-800.webp 800w, /images/simulations/praveil-coolsonic-comparison-ai-v1-1200.webp 1200w, /images/simulations/praveil-coolsonic-comparison-ai-v1.webp 1536w",
    alt: "쿨소닉 관련 턱선·하안면 탄력의 AI 가상 비교. 실제 환자 및 시술 결과 아님.",
    caption: "AI 시뮬레이션 · 실제 환자 및 시술 결과 아님. 개인별 결과를 예측하거나 보장하지 않습니다.",
    focus: "턱선·하안면 탄력",
  },
  "/lifting/coolphase": {
    image: "/images/simulations/praveil-coolphase-comparison-ai-v1.webp",
    srcSet: "/images/simulations/praveil-coolphase-comparison-ai-v1-800.webp 800w, /images/simulations/praveil-coolphase-comparison-ai-v1-1200.webp 1200w, /images/simulations/praveil-coolphase-comparison-ai-v1.webp 1536w",
    alt: "쿨페이즈 관련 잔주름·피부 탄력의 AI 가상 비교. 실제 환자 및 시술 결과 아님.",
    caption: "AI 시뮬레이션 · 실제 환자 및 시술 결과 아님. 개인별 결과를 예측하거나 보장하지 않습니다.",
    focus: "잔주름·피부 탄력",
  },
  "/lifting/laser/shrink": {
    image: "/images/simulations/praveil-shrink-comparison-ai-v1.webp",
    srcSet: "/images/simulations/praveil-shrink-comparison-ai-v1-800.webp 800w, /images/simulations/praveil-shrink-comparison-ai-v1-1200.webp 1200w, /images/simulations/praveil-shrink-comparison-ai-v1.webp 1536w",
    alt: "슈링크 유니버스 관련 턱 아래·하안면 윤곽의 AI 가상 비교. 실제 환자 및 시술 결과 아님.",
    caption: "AI 시뮬레이션 · 실제 환자 및 시술 결과 아님. 개인별 결과를 예측하거나 보장하지 않습니다.",
    focus: "턱 아래·하안면 윤곽",
  },
  "/lifting/laser/potenza": {
    image: "/images/simulations/praveil-potenza-comparison-ai-v1.webp",
    srcSet: "/images/simulations/praveil-potenza-comparison-ai-v1-800.webp 800w, /images/simulations/praveil-potenza-comparison-ai-v1-1200.webp 1200w, /images/simulations/praveil-potenza-comparison-ai-v1.webp 1536w",
    alt: "포텐자 관련 볼 모공·피부결의 AI 가상 비교. 실제 환자 및 시술 결과 아님.",
    caption: "AI 시뮬레이션 · 실제 환자 및 시술 결과 아님. 개인별 결과를 예측하거나 보장하지 않습니다.",
    focus: "볼 모공·피부결",
  },
  "/lifting/laser/clarity": {
    image: "/images/simulations/praveil-clarity-comparison-ai-v1.webp",
    srcSet: "/images/simulations/praveil-clarity-comparison-ai-v1-800.webp 800w, /images/simulations/praveil-clarity-comparison-ai-v1-1200.webp 1200w, /images/simulations/praveil-clarity-comparison-ai-v1.webp 1536w",
    alt: "클라리티2 관련 볼의 색소 고민의 AI 가상 비교. 실제 환자 및 시술 결과 아님.",
    caption: "AI 시뮬레이션 · 실제 환자 및 시술 결과 아님. 개인별 결과를 예측하거나 보장하지 않습니다.",
    focus: "볼의 색소 고민",
  },
  "/lifting/thread/qtl": {
    image: "/images/simulations/praveil-qtl-comparison-ai-v1.webp",
    srcSet: "/images/simulations/praveil-qtl-comparison-ai-v1-800.webp 800w, /images/simulations/praveil-qtl-comparison-ai-v1-1200.webp 1200w, /images/simulations/praveil-qtl-comparison-ai-v1.webp 1536w",
    alt: "QTL 실리프팅 관련 처진 볼·턱선의 AI 가상 비교. 실제 환자 및 시술 결과 아님.",
    caption: "AI 시뮬레이션 · 실제 환자 및 시술 결과 아님. 개인별 결과를 예측하거나 보장하지 않습니다.",
    focus: "처진 볼·턱선",
  },
  "/lifting/thread/jamber": {
    image: "/images/simulations/praveil-jamber-comparison-ai-v1.webp",
    srcSet: "/images/simulations/praveil-jamber-comparison-ai-v1-800.webp 800w, /images/simulations/praveil-jamber-comparison-ai-v1-1200.webp 1200w, /images/simulations/praveil-jamber-comparison-ai-v1.webp 1536w",
    alt: "잼버실 관련 앞볼의 꺼진 부위의 AI 가상 비교. 실제 환자 및 시술 결과 아님.",
    caption: "AI 시뮬레이션 · 실제 환자 및 시술 결과 아님. 개인별 결과를 예측하거나 보장하지 않습니다.",
    focus: "앞볼의 꺼진 부위",
  },
  "/petit/botox/face": {
    image: "/images/simulations/praveil-botox-face-comparison-ai-v1.webp",
    srcSet: "/images/simulations/praveil-botox-face-comparison-ai-v1-800.webp 800w, /images/simulations/praveil-botox-face-comparison-ai-v1-1200.webp 1200w, /images/simulations/praveil-botox-face-comparison-ai-v1.webp 1536w",
    alt: "얼굴 보톡스 관련 이마 표정주름의 AI 가상 비교. 실제 환자 및 시술 결과 아님.",
    caption: "AI 시뮬레이션 · 실제 환자 및 시술 결과 아님. 개인별 결과를 예측하거나 보장하지 않습니다.",
    focus: "이마 표정주름",
  },
  "/petit/botox/body": {
    image: "/images/simulations/praveil-botox-body-comparison-ai-v1.webp",
    srcSet: "/images/simulations/praveil-botox-body-comparison-ai-v1-800.webp 800w, /images/simulations/praveil-botox-body-comparison-ai-v1-1200.webp 1200w, /images/simulations/praveil-botox-body-comparison-ai-v1.webp 1536w",
    alt: "바디 보톡스 관련 종아리 근육 윤곽의 AI 가상 비교. 실제 환자 및 시술 결과 아님.",
    caption: "AI 시뮬레이션 · 실제 환자 및 시술 결과 아님. 개인별 결과를 예측하거나 보장하지 않습니다.",
    focus: "종아리 근육 윤곽",
  },
  "/petit/filler": {
    image: "/images/simulations/praveil-filler-comparison-ai-v1.webp",
    srcSet: "/images/simulations/praveil-filler-comparison-ai-v1-800.webp 800w, /images/simulations/praveil-filler-comparison-ai-v1-1200.webp 1200w, /images/simulations/praveil-filler-comparison-ai-v1.webp 1536w",
    alt: "필러 관련 팔자 부위 윤곽의 AI 가상 비교. 실제 환자 및 시술 결과 아님.",
    caption: "AI 시뮬레이션 · 실제 환자 및 시술 결과 아님. 개인별 결과를 예측하거나 보장하지 않습니다.",
    focus: "팔자 부위 윤곽",
  },
  "/skin/retuo": {
    image: "/images/simulations/praveil-retuo-comparison-ai-v1.webp",
    srcSet: "/images/simulations/praveil-retuo-comparison-ai-v1-800.webp 800w, /images/simulations/praveil-retuo-comparison-ai-v1-1200.webp 1200w, /images/simulations/praveil-retuo-comparison-ai-v1.webp 1536w",
    alt: "리투오 관련 볼 피부결·얕은 잔주름의 AI 가상 비교. 실제 환자 및 시술 결과 아님.",
    caption: "AI 시뮬레이션 · 실제 환자 및 시술 결과 아님. 개인별 결과를 예측하거나 보장하지 않습니다.",
    focus: "볼 피부결·얕은 잔주름",
  },
  "/skin/booster/rejuran": {
    image: "/images/simulations/praveil-rejuran-comparison-ai-v1.webp",
    srcSet: "/images/simulations/praveil-rejuran-comparison-ai-v1-800.webp 800w, /images/simulations/praveil-rejuran-comparison-ai-v1-1200.webp 1200w, /images/simulations/praveil-rejuran-comparison-ai-v1.webp 1536w",
    alt: "리쥬란 관련 볼의 잔주름·피부결의 AI 가상 비교. 실제 환자 및 시술 결과 아님.",
    caption: "AI 시뮬레이션 · 실제 환자 및 시술 결과 아님. 개인별 결과를 예측하거나 보장하지 않습니다.",
    focus: "볼의 잔주름·피부결",
  },
  "/skin/booster/exosome": {
    image: "/images/simulations/praveil-isce-comparison-ai-v1.webp",
    srcSet: "/images/simulations/praveil-isce-comparison-ai-v1-800.webp 800w, /images/simulations/praveil-isce-comparison-ai-v1-1200.webp 1200w, /images/simulations/praveil-isce-comparison-ai-v1.webp 1536w",
    alt: "ISCE 엑소좀 관련 불균일한 피부결의 AI 가상 비교. 실제 환자 및 시술 결과 아님.",
    caption: "AI 시뮬레이션 · 실제 환자 및 시술 결과 아님. 개인별 결과를 예측하거나 보장하지 않습니다.",
    focus: "불균일한 피부결",
  },
  "/skin/collagen/juvelook": {
    image: "/images/simulations/praveil-juvelook-skin-comparison-ai-v1.webp",
    srcSet: "/images/simulations/praveil-juvelook-skin-comparison-ai-v1-800.webp 800w, /images/simulations/praveil-juvelook-skin-comparison-ai-v1-1200.webp 1200w, /images/simulations/praveil-juvelook-skin-comparison-ai-v1.webp 1536w",
    alt: "쥬베룩 스킨 30mg 관련 나비존 모공·얕은 요철의 AI 가상 비교. 실제 환자 및 시술 결과 아님.",
    caption: "AI 시뮬레이션 · 실제 환자 및 시술 결과 아님. 개인별 결과를 예측하거나 보장하지 않습니다.",
    focus: "나비존 모공·얕은 요철",
  },
  "/skin/collagen/ultracol": {
    image: "/images/simulations/praveil-ultracol-comparison-ai-v1.webp",
    srcSet: "/images/simulations/praveil-ultracol-comparison-ai-v1-800.webp 800w, /images/simulations/praveil-ultracol-comparison-ai-v1-1200.webp 1200w, /images/simulations/praveil-ultracol-comparison-ai-v1.webp 1536w",
    alt: "울트라콜 관련 앞볼의 얕은 꺼짐·피부결의 AI 가상 비교. 실제 환자 및 시술 결과 아님.",
    caption: "AI 시뮬레이션 · 실제 환자 및 시술 결과 아님. 개인별 결과를 예측하거나 보장하지 않습니다.",
    focus: "앞볼의 얕은 꺼짐·피부결",
  },
  "/acne-pore": {
    image: "/images/simulations/praveil-acne-pore-comparison-ai-v1.webp",
    srcSet: "/images/simulations/praveil-acne-pore-comparison-ai-v1-800.webp 800w, /images/simulations/praveil-acne-pore-comparison-ai-v1-1200.webp 1200w, /images/simulations/praveil-acne-pore-comparison-ai-v1.webp 1536w",
    alt: "여드름·모공 관련 여드름 흔적·피부결의 AI 가상 비교. 실제 환자 및 시술 결과 아님.",
    caption: "AI 시뮬레이션 · 실제 환자 및 시술 결과 아님. 개인별 결과를 예측하거나 보장하지 않습니다.",
    focus: "여드름 흔적·피부결",
  },
  "/removal/hair": {
    image: "/images/simulations/praveil-hair-removal-comparison-ai-v1.webp",
    srcSet: "/images/simulations/praveil-hair-removal-comparison-ai-v1-800.webp 800w, /images/simulations/praveil-hair-removal-comparison-ai-v1-1200.webp 1200w, /images/simulations/praveil-hair-removal-comparison-ai-v1.webp 1536w",
    alt: "레이저제모 관련 종아리 체모의 AI 가상 비교. 실제 환자 및 시술 결과 아님.",
    caption: "AI 시뮬레이션 · 실제 환자 및 시술 결과 아님. 개인별 결과를 예측하거나 보장하지 않습니다.",
    focus: "종아리 체모",
  },
  "/removal/tattoo": {
    image: "/images/simulations/praveil-tattoo-removal-comparison-ai-v1.webp",
    srcSet: "/images/simulations/praveil-tattoo-removal-comparison-ai-v1-800.webp 800w, /images/simulations/praveil-tattoo-removal-comparison-ai-v1-1200.webp 1200w, /images/simulations/praveil-tattoo-removal-comparison-ai-v1.webp 1536w",
    alt: "문신제거 관련 눈썹 반영구 색소의 AI 가상 비교. 실제 환자 및 시술 결과 아님.",
    caption: "AI 시뮬레이션 · 실제 환자 및 시술 결과 아님. 개인별 결과를 예측하거나 보장하지 않습니다.",
    focus: "눈썹 반영구 색소",
  },
};
