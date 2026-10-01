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
    text: string;
    specs: { label: string; value: string }[];
  };
  /** 원리 (그림 옆 세 단계) */
  principle: { title: string; text: string }[];
  /** 특징: 사진 + 설명 */
  features: { title: string; text: string; image: string; alt: string }[];
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
    features: [
      {
        title: "피부를 식히며 시술합니다",
        text: "핸드피스가 닿는 피부 표면을 식히면서 에너지를 전달해, 시술 중 뜨거운 느낌을 줄였습니다.",
        image: cs("handpiece"),
        alt: "쿨소닉 핸드피스가 볼에 닿아 있는 모습",
      },
      {
        title: "깊이 · 세기를 한 샷씩 조절합니다",
        text: "깊이, 에너지 세기, 샷 수를 화면으로 확인하며 볼 · 턱선 · 이마처럼 두께가 다른 부위마다 나누어 조절합니다.",
        image: cs("screen"),
        alt: "시술 중인 쿨소닉 화면 (깊이 · 레벨 · 샷 수 · 냉각 설정)",
      },
      {
        title: "정품 장비 · 정품 팁",
        text: "병원이 직접 보유한 정품 장비와 정품 팁을 정해진 샷 수 그대로 사용합니다. 원하시면 시술 전 확인하실 수 있습니다.",
        image: photo("equip-1"),
        alt: "프라베일 시술실의 쿨소닉 장비",
      },
      {
        title: "대표원장이 직접 시술합니다",
        text: "상담한 원장이 얼굴 비율과 처짐 방향을 보고, 샷을 놓을 자리와 깊이를 직접 정합니다.",
        image: photo("signature-1"),
        alt: "대표원장이 쿨소닉으로 시술하는 모습",
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
