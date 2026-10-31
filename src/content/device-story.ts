import { doctorPhotos } from "@/content/doctor-photos";

// 장비 시술 페이지의 "장비 이야기" 원고 (장비 소개 · 원리 그림 · 특징 · 시술 장면)
// - 글만 있던 설명을 장비 사진 · 원리 그림 · 실제 시술 장면과 함께 보여 줌
// - 원고가 있는 시술만 TreatmentDetail 에서 이 구성으로 바뀜
// ※ 임시 원고: 원장님 검토 후 확정해 주세요. 효과를 보장하는 표현 · 다른 병원과의 비교는 쓰지 않습니다.

export type DeviceStory = {
  /** 장비 시술(기본) · 장비가 아닌 시술(필러 등): 제목이 "어떤 장비인가요?" / "어떤 시술인가요?" 로 바뀜 */
  kind?: "device" | "procedure";
  /** 원리 그림 종류 (그림 사진이 없을 때). 장비 · 시술의 작용 방식을 구분 */
  diagram?:
    | "hifu"
    | "filler"
    | "rf"
    | "botox"
    | "matrix"
    | "booster"
    | "collagen"
    | "laser"
    | "thread"
    | "acne"
    | "hair"
    | "pigment";
  /** 비용 안내 칸도 보여 줌 (장비 시술은 기본으로 숨김) */
  showPrices?: boolean;
  /** 장비 소개 */
  device: {
    name: string;
    maker: string;
    /** 배경 없는 제품 사진 */
    image: string;
    /** 제품 사진 대신 시술 장면 사진을 크게 (어두운 배경 구성) */
    photo?: string;
    /** 기존 설명용 사진을 특정 제품의 실제 시술 사진으로 오해하지 않도록 설명 */
    photoAlt?: string;
    /** 병원 보정 원본은 얼굴 · 시술 부위가 잘리지 않게 전체 구도를 표시 */
    photoFullFrame?: boolean;
    /** 공식 제품 자료는 기존 카드 안에서 전체 프레임을 유지 */
    mediaContain?: boolean;
    /** 제조사 브랜드 영상 (있으면 사진 대신) */
    film?: { src: string; poster: string };
    text: string;
    specs: { label: string; value: string }[];
  };
  /** 원리 (그림 옆 세 단계) */
  principle: { title: string; text: string }[];
  /** 원리 그림의 깊이 표시 (얕게 · 중간 · 깊게 순) — 그림 사진이 없을 때 */
  depths?: [string, string, string];
  /** 원리 그림을 왼쪽, 세 단계 설명을 오른쪽에 배치 */
  principleLayout?: "figure-first";
  /** 원리 그림 사진 + 그 위 표시 (x · y 는 사진 속 %) */
  principleImage?: {
    src: string;
    alt: string;
    /** 공식 작동 원리 영상. src는 재생 전 포스터 */
    video?: string;
    /** 기존 8:5 원리 그림 영역 안에 공식 자료 전체를 표시 */
    framed?: boolean;
    note?: string;
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
    /** 제목 · 설명 (없으면 리프팅 장비 비교 문구) */
    title?: string;
    lead?: string;
    columns: { name: string; maker: string; owned?: boolean; self?: boolean }[];
    rows: { label: string; values: string[] }[];
    note: string;
  };
  /** 쓰는 제품 소개 (가격표에 있는 제품, 우열 비교 아님). 있으면 비교표 자리에 */
  products?: {
    title: string;
    lead: string;
    items: {
      name: string;
      /** 영문 이름 (모르면 비움) */
      en?: string;
      /** 제조사 · 나라 (모르면 비움) */
      maker?: string;
      text: string;
      tags: string[];
    }[];
    /** 칸이 남을 때 채우는 안내 카드 */
    guide?: { title: string; text: string };
    note: string;
  };
  /** 특징 파트 제목 (없으면 "○○만의 특별함") */
  featuresTitle?: string;
  /** 특징 위치 · 모양: "after-ba" 는 전후사진 아래에 아치 사진 카드로 (부위별 지그재그와 겹치지 않게) */
  featuresPlacement?: "after-ba";
  /** 특징: 사진 또는 영상 + 설명 */
  features: {
    title: string;
    text: string;
    image: string;
    alt: string;
    /** 사진 원본의 3:2 구도를 유지 */
    fullFrame?: boolean;
    /** 짧은 반복 영상 (image 는 첫 장면) */
    video?: string;
    /** 원본 크기. 4:3 박스와 비율이 크게 다르면 자르지 않고 전체를 보여 줌 (남는 자리는 흐린 배경) */
    mediaSize?: { width: number; height: number };
    /** 자르지 않고 보여 줄 때 남는 자리를 채울 색 [위 · 왼쪽, 아래 · 오른쪽] (사진 가장자리 색) */
    mediaEdges?: [string, string];
    /** 박스 채우기 방식을 직접 지정 (기본: 비율로 자동) */
    mediaFit?: "contain" | "cover";
    /** 1280×960(4:3) 파일 안에 16:9 본문과 상하 여백이 함께 있는 영상 · 도해 */
    paddedWidescreen?: boolean;
  }[];
  /** 시술 과정: 사진 + 설명 */
  process: {
    title: string;
    text: string;
    image: string;
    alt: string;
    /** 사진 원본의 3:2 구도를 유지하고 번호를 사진 밖에 표시 */
    fullFrame?: boolean;
    /** 지정한 사진만 원본 비율로 카드를 채우며 얼굴 · 시술 부위 중심을 유지 */
    coverPosition?: string;
  }[];
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
      text: "쿨소닉은 고강도 집속 초음파(HIFU)에 ACC 냉각 기술을 적용한 리프팅 장비입니다. 피부 표면을 냉각해 보호하면서 1.5 · 3.0 · 4.5mm 깊이에 에너지를 나누어 전달해, 근막층(SMAS)까지 단계적으로 리프팅합니다.",
      specs: [
        { label: "방식", value: "고강도 집속 초음파 (HIFU)" },
        { label: "작용 층", value: "진피층 ~ 근막층 (SMAS)" },
        { label: "시술 부위", value: "얼굴 · 목 (상담 후 부위 결정)" },
        { label: "냉각", value: "시술 중 피부 표면 냉각" },
      ],
    },
    principle: [
      {
        title: "초음파 에너지 집속",
        text: "초음파 에너지를 피부 속 한 지점에 모읍니다. 표피 손상을 줄이면서 원하는 깊이에만 에너지를 전달합니다.",
      },
      {
        title: "목표 깊이에 열응고점 형성",
        text: "진피층부터 근막층(SMAS)까지 부위별로 깊이를 선택해, 미세한 열응고점을 촘촘하게 형성합니다.",
      },
      {
        title: "조직 수축과 콜라겐 재생",
        text: "열 자극을 받은 조직이 수축하고, 수 주에 걸쳐 콜라겐 재생을 유도합니다.",
      },
    ],
    depths: ["1.5mm", "3.0mm", "4.5mm"],
    principleImage: {
      src: cs("principle"),
      alt: "쿨소닉 원리 그림: 냉각 어플리케이터가 피부 표면을 식히고, 모인 초음파가 피부 속에 열응고점을 만드는 모습",
      marks: [
        { x: 36, y: 16, label: "냉각 어플리케이터", side: "left" },
        { x: 22, y: 40, label: "피부 표면 냉각", side: "right" },
        { x: 52, y: 42, label: "집속 초음파", side: "right" },
        { x: 82.7, y: 58, label: "열응고점", side: "left", above: true },
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
            "진피 ~ 피하",
          ],
        },
        {
          label: "피부 표면 냉각",
          values: ["냉각 어플리케이터", "없음", "없음", "냉각 스프레이"],
        },
        {
          label: "특징",
          values: [
            "표면 냉각 · 굴곡 부위 밀착",
            "초음파 영상으로 층 확인",
            "다양한 시술 모드 · 얼굴 · 바디",
            "피부 전반 균일 가열 · 탄력 · 피부결",
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
          values: [
            "일상생활 바로 가능",
            "일상생활 바로 가능",
            "일상생활 바로 가능",
            "일상생활 바로 가능",
          ],
        },
      ],
      note: "※ 각 장비의 일반적인 특징을 정리한 것으로, 어느 장비가 더 낫다는 뜻이 아닙니다. 맞는 장비는 피부 상태와 고민에 따라 다르며, 통증 · 효과 · 유지 기간은 사람마다 다릅니다.",
    },
    featuresTitle: "쿨소닉 리프팅의 4가지 특징",
    features: [
      {
        title: "1.5 · 3.0 · 4.5mm 깊이별 에너지 전달",
        text: "부위에 따라 3가지 어플리케이터를 바꿔가며, 필요한 깊이에 에너지를 전달합니다.",
        image: cs("coolsonic-applicator"),
        video: "/videos/coolsonic-applicator.mp4",
        alt: "쿨소닉 1.5mm · 3.0mm · 4.5mm 어플리케이터",
        mediaSize: { width: 792, height: 864 },
        mediaFit: "cover",
      },
      {
        title: "얼굴 굴곡에 밀착하는 펜형 어플리케이터",
        text: "쿨소닉의 어플리케이터는 굴곡진 피부에도 밀착하기 쉬운 펜형 구조입니다. 얼굴의 곡면을 따라 접촉하면서 초음파 에너지를 전달합니다.",
        image: cs("handpiece"),
        alt: "얼굴 곡면을 따라 쿨소닉 펜형 어플리케이터로 시술하는 모습",
        mediaSize: { width: 1200, height: 788 },
      },
      {
        title: "쿨링으로 통증 부담을 줄이는 초음파 리프팅",
        text: "쿨소닉은 피부 표면을 냉각하면서 고강도 집속 초음파(HIFU)를 전달합니다. ACC 냉각 기술을 적용해 시술 중 열감과 통증 부담을 줄였습니다.",
        image: cs("coolsonic-cooling"),
        video: "/videos/coolsonic-cooling.mp4",
        alt: "쿨소닉 ACC 냉각 어플리케이터",
        mediaSize: { width: 792, height: 864 },
        mediaEdges: ["#06141a", "#06141a"],
      },
      {
        title: "콜라겐과 탄성섬유의 재생 유도",
        text: "쿨소닉의 집속 초음파는 피부 속 목표 조직에 열응고점을 형성합니다. 이를 통해 콜라겐과 탄성섬유의 재생을 유도해 탄력과 리프팅 효과를 기대할 수 있습니다.",
        image: cs("principle"),
        alt: "피부 속 목표 조직에 열응고점을 만드는 쿨소닉 집속 초음파 원리",
        mediaSize: { width: 1600, height: 901 },
      },
    ],
    process: [
      {
        title: "1:1 상담",
        text: "고민과 원하는 변화를 확인하고, 피부 두께와 처짐 방향을 진단해 부위별 깊이와 샷 수를 정합니다.",
        image: "/images/photos/retouched/coolsonic-consult.jpg",
        alt: "대표원장이 환자와 마주 앉아 상담하는 장면",
        fullFrame: true,
      },
      {
        title: "마취",
        text: "시술 부위에 마취 크림을 도포해 시술 중 불편감을 줄입니다.",
        image: photo("process-anesthesia"),
        alt: "시술 부위에 마취 크림을 바르는 모습",
      },
      {
        title: "시술",
        text: "피부 표면을 냉각하면서, 상담 때 정한 깊이에 맞춰 층별로 나누어 시술합니다.",
        image: doctorPhotos.coolsonic,
        alt: "대표원장이 쿨소닉으로 얼굴 부위를 시술하는 장면",
        fullFrame: true,
        coverPosition: "42% 50%",
      },
      {
        title: "경과 확인",
        text: "시술 직후 상태를 확인하고, 주의사항과 다음 관리 시기를 안내합니다.",
        image: photo("process-check"),
        alt: "시술 후 경과를 확인하는 모습",
      },
    ],
    video: {
      src: "/videos/hero-coolsonic.mp4",
      poster: photo("hero-coolsonic"),
      title: ["상담한 원장이,", "한 샷 한 샷 직접."],
      text: "프라베일의 쿨소닉은 대표원장이 처음부터 끝까지 직접 시술합니다.",
    },
  },
  "/petit/filler": {
    kind: "procedure",
    diagram: "filler",
    principleLayout: "figure-first",
    showPrices: true,
    device: {
      name: "필러",
      maker: "Hyaluronic Acid",
      image: photo("cat-filler"),
      photo: photo("cat-filler"),
      text: "필러는 히알루론산(HA) 성분을 피부 아래에 넣어 꺼진 부위의 볼륨을 채우고, 얼굴의 비율과 라인을 다듬는 시술입니다. 부위마다 필요한 단단함과 퍼짐이 달라, 넣는 층과 제품을 나누어 사용합니다.",
      specs: [
        { label: "성분", value: "히알루론산 (HA)" },
        { label: "넣는 층", value: "진피층 ~ 골막 위 (부위별)" },
        {
          label: "시술 부위",
          value: "이마 · 볼 · 팔자 · 입술 · 애교 · 목주름 등",
        },
        { label: "분해", value: "필요하면 분해 효소로 녹일 수 있음" },
      ],
    },
    principle: [
      {
        title: "얼굴 비율 분석",
        text: "정면 · 측면에서 얼굴 비율과 꺼진 부위를 확인하고, 채울 곳과 양을 정합니다.",
      },
      {
        title: "부위별 층 · 제품 선택",
        text: "잔주름 · 입술은 얕게, 볼륨은 피하지방층에, 윤곽은 골막 위에 넣는 등 부위에 맞춰 층과 제품을 고릅니다.",
      },
      {
        title: "꺼진 곳을 받쳐 볼륨 회복",
        text: "넣은 히알루론산이 꺼진 부위를 받쳐 주어, 시술 직후부터 볼륨 변화를 확인할 수 있습니다.",
      },
    ],
    products: {
      title: "필러, 어떤 제품을 쓰나요?",
      lead: "프라베일 가격표에 있는 필러입니다. 부위와 원하는 모습에 맞춰 상담 때 함께 고릅니다.",
      items: [
        {
          name: "뉴라미스",
          en: "Neuramis",
          maker: "메디톡스 · 국내",
          text: "국내에서 만든 히알루론산 필러입니다. 제품 라인마다 단단함이 달라, 부위에 맞춰 골라 씁니다.",
          tags: ["히알루론산", "국산"],
        },
        {
          // 확인 필요: 레나 영문 이름 · 제조사 · 국산/수입
          name: "레나",
          text: "히알루론산 필러입니다. 볼륨 · 이마 · 팔자 · 입술 · 애교 부위에 씁니다.",
          tags: ["히알루론산"],
        },
        {
          name: "레스틸렌",
          en: "Restylane",
          maker: "갈더마 · 스웨덴",
          text: "스웨덴에서 개발된 히알루론산 필러로, 오랫동안 여러 나라에서 쓰여 온 제품입니다. 종류가 다양해 부위에 맞춰 고릅니다.",
          tags: ["히알루론산", "수입"],
        },
        {
          name: "벨로테로",
          en: "Belotero",
          maker: "멀츠 · 독일",
          text: "독일에서 만든 히알루론산 필러입니다. 제조사는 피부 속에 고르게 퍼지도록 만든 제품이라고 소개하며, 얕은 주름부터 볼륨까지 종류별로 나누어 씁니다.",
          tags: ["히알루론산", "수입"],
        },
        {
          // 확인 필요: 큐티필 영문 이름 · 제조사 · 국산/수입
          name: "큐티필",
          text: "히알루론산 필러입니다. 볼륨 · 이마 · 팔자 · 입술 · 애교 부위에 씁니다.",
          tags: ["히알루론산"],
        },
      ],
      guide: {
        title: "어떤 제품이 맞을까요?",
        text: "부위마다 필요한 단단함과 퍼짐이 다릅니다. 피부 두께와 원하는 모습, 예산을 함께 보고 상담 때 정합니다.",
      },
      note: "※ 제조사 공개 자료를 바탕으로 한 일반 정보입니다. 어느 제품이 더 낫다는 뜻이 아니며, 효과와 유지 기간은 사람마다 다릅니다.",
    },
    featuresTitle: "프라베일 필러의 4가지 특징",
    featuresPlacement: "after-ba",
    features: [
      {
        title: "얼굴 비율부터 보는 디자인",
        text: "꺼진 부위만 보지 않고 정면 · 측면 비율을 함께 봅니다. 얼굴 전체의 균형 안에서 채울 곳과 양을 정해, 자연스러운 라인을 만듭니다.",
        image: photo("signature-3"),
        alt: "대표원장이 얼굴 비율을 보며 필러 시술 부위를 확인하는 모습",
      },
      {
        title: "부위에 맞춘 층 · 제품 선택",
        text: "이마 · 볼 · 입술 · 눈 밑은 피부 두께와 움직임이 다릅니다. 부위마다 넣는 층과 제품의 단단함을 나누어 선택합니다.",
        image: photo("cat-main-petit"),
        alt: "앞볼 부위에 필러를 주입하는 모습",
      },
      {
        title: "정품 · 정량, 시술 전 확인",
        text: "정품 필러를 사용하고, 시술 전 제품을 직접 확인하실 수 있습니다. 상담 때 정한 양을 정확하게 지킵니다.",
        image: photo("special-2"),
        alt: "대표원장이 정품 필러로 시술하는 모습",
      },
      {
        title: "과하지 않게, 필요한 만큼",
        text: "한 번에 많이 넣기보다 자연스러운 선에서 멈춥니다. 붓기가 빠진 뒤 경과를 보고, 필요하면 조금 더 채우는 쪽을 권합니다.",
        image: photo("cat-main-skin"),
        alt: "턱 라인에 필러를 소량씩 나누어 주입하는 모습",
      },
    ],
    process: [
      {
        title: "1:1 상담",
        text: "고민 부위와 원하는 모습을 확인하고, 얼굴 비율을 보며 채울 곳 · 제품 · 양을 정합니다.",
        image: doctorPhotos.consult,
        alt: "대표원장이 피부 분석 화면을 설명하는 상담 장면",
        fullFrame: true,
        coverPosition: "50% 50%",
      },
      {
        title: "마취",
        text: "시술 부위에 마취 크림을 바르고, 입술처럼 예민한 부위는 조금 더 충분히 마취합니다.",
        image: photo("process-anesthesia"),
        alt: "시술 부위에 마취 크림을 바르는 모습",
      },
      {
        title: "시술",
        text: "상담 때 정한 부위에 필요한 양만 나누어 넣고, 모양을 확인하며 다듬습니다.",
        image: photo("cat-main-petit"),
        alt: "대표원장이 필러를 주입하는 모습",
      },
      {
        title: "경과 확인",
        text: "시술 직후 모양을 함께 확인하고, 주의사항과 경과 확인 시기를 안내합니다.",
        image: photo("process-check"),
        alt: "시술 후 경과를 확인하는 모습",
      },
    ],
  },
  "/lifting/coolphase": {
    diagram: "rf",
    principleLayout: "figure-first",
    showPrices: true,
    device: {
      name: "Coolfase",
      maker: "ASTERASYS",
      image: "/images/photos/best-coolphase.webp",
      photo: doctorPhotos.coolphase,
      photoAlt: "대표원장이 쿨페이즈로 얼굴 부위를 시술하는 장면",
      photoFullFrame: true,
      film: {
        src: "/videos/coolphase-device.mp4",
        poster: "/images/coolphase/device.webp",
      },
      text: "쿨페이즈는 접촉 냉각을 더한 모노폴라 고주파(RF) 리프팅 장비입니다. 피부 표면을 식히면서 고주파 열을 전달해 피부결과 탄력을 관리합니다. 피부 두께와 탄력 상태에 맞춰 부위별 에너지를 정합니다.",
      specs: [
        {
          label: "방식",
          value: "모노폴라 고주파 (RF)",
        },
        {
          label: "전달 방식",
          value: "피부에 팁을 접촉해 전달",
        },
        {
          label: "냉각",
          value: "팁의 직접 접촉 냉각",
        },
        {
          label: "시술 부위",
          value: "얼굴 전체 · 턱선 · 눈가 · 목",
        },
      ],
    },
    principle: [
      {
        title: "피부에 밀착해 고주파 전달",
        text: "팁을 피부에 밀착시켜 고주파 에너지를 전달합니다. 부위별 피부 두께와 굴곡에 맞춰 설정을 조절합니다.",
      },
      {
        title: "고주파 가열과 표면 냉각",
        text: "조직의 전기 저항으로 피부 속에 열이 생깁니다. 팁으로 피부 표면을 냉각하면서 열감과 반응을 살핍니다.",
      },
      {
        title: "콜라겐 재구성과 탄력 관리",
        text: "열 자극 이후 콜라겐이 재구성되는 과정을 통해 탄력 변화를 기대할 수 있습니다. 변화의 정도와 시점에는 개인차가 있습니다.",
      },
    ],
    principleImage: {
      src: "/images/coolphase/principle.webp",
      alt: "쿨페이즈 제조사 원리 영상의 피부 단면: 접촉 팁의 표면 냉각과 피부 속 고주파 열 전달을 보여 주는 개념도",
      marks: [
        { x: 47.5, y: 43, label: "피부 표면 냉각", side: "left" },
        { x: 54, y: 65, label: "고주파 열 전달", side: "right" },
      ],
      layers: [],
    },
    compare: {
      title: "쿨페이즈, 다른 리프팅 장비와 무엇이 다른가요?",
      lead: "피부결과 탄력, 처진 윤곽 중 어떤 고민이 있나요? 에너지 전달 방식과 피부 상태를 함께 살펴 선택합니다.",
      columns: [
        {
          name: "쿨페이즈",
          maker: "아스테라시스",
          self: true,
        },
        {
          name: "써마지 FLX",
          maker: "솔타메디칼",
        },
        {
          name: "쿨소닉",
          maker: "아스테라시스",
        },
      ],
      rows: [
        {
          label: "에너지",
          values: [
            "모노폴라 고주파 (RF)",
            "모노폴라 고주파 (RF)",
            "집속 초음파 (HIFU)",
          ],
        },
        {
          label: "열을 만드는 방식",
          values: [
            "고주파 전류와 조직의 저항",
            "고주파 전류와 조직의 저항",
            "목표 깊이에 초음파 집속",
          ],
        },
        {
          label: "표면 보호",
          values: ["팁의 직접 접촉 냉각", "냉각 기능", "어플리케이터 냉각"],
        },
        {
          label: "계획할 때 확인",
          values: [
            "팁 · 피부 두께 · 열 반응",
            "팁 · 시술 부위 · 열 반응",
            "어플리케이터 깊이 · 조직 두께",
          ],
        },
      ],
      note: "※ 각 장비의 일반적인 특징을 정리한 것으로, 어느 장비가 더 낫다는 뜻이 아닙니다. 맞는 장비는 피부 상태와 고민에 따라 다르며, 통증 · 효과 · 유지 기간은 사람마다 다릅니다. 비교 장비의 본원 보유 여부를 뜻하지 않습니다.",
    },
    featuresTitle: "쿨페이즈 리프팅의 4가지 특징",
    features: [
      {
        title: "고주파로 피부결과 탄력 관리",
        text: "고주파 열 자극을 이용해 피부결과 탄력을 관리합니다. 탄력이 떨어진 부위와 잔주름 고민을 함께 살펴 시술 범위를 정합니다.",
        image: "/images/coolphase/principle-feature.webp",
        alt: "쿨페이즈 제조사 영상에서 보여 주는 고주파 열 전달 개념도",
        paddedWidescreen: true,
      },
      {
        title: "피부 표면을 식히는 접촉 냉각",
        text: "피부에 닿는 팁으로 표면을 직접 냉각합니다. 시술 중 느껴지는 열감과 통증을 확인하면서 에너지를 조절합니다.",
        image: "/images/coolphase/principle-feature.webp",
        video: "/videos/coolphase-cooling.mp4",
        alt: "쿨페이즈 접촉 냉각과 고주파 열 전달을 보여 주는 제조사 원리 영상",
        paddedWidescreen: true,
      },
      {
        title: "피부 두께와 굴곡에 맞춘 설계",
        text: "얼굴 전체 · 턱선 · 눈가 · 목은 피부 두께와 굴곡이 다릅니다. 이전 시술 이력까지 살펴 부위별로 계획합니다.",
        image: "/images/coolphase/tip.webp",
        video: "/videos/coolphase-tip.mp4",
        alt: "쿨페이즈 얼굴용 접촉 팁의 형태를 보여 주는 제조사 영상",
        paddedWidescreen: true,
      },
      {
        title: "시술 후 경과까지 이어지는 관리",
        text: "시술 직후의 피부 반응과 이후 탄력 변화를 나누어 확인합니다. 피부 상태에 맞춰 다음 관리 시기를 안내합니다.",
        image: "/images/photos/clinic-1.webp",
        alt: "경과 진료 방문 안내에 사용하는 병원 접수 공간 사진",
      },
    ],
    process: [
      {
        title: "1:1 상담",
        text: "피부 두께와 탄력 고민, 삽입물 · 이전 시술 이력을 살펴 부위별 시술 계획을 정합니다.",
        image: doctorPhotos.consult,
        alt: "대표원장이 피부 분석 화면을 설명하는 상담 장면",
        fullFrame: true,
        coverPosition: "50% 50%",
      },
      {
        title: "마취 · 준비",
        text: "부위에 맞는 마취 · 통증 관리 방법을 안내하고, 피부와 팁의 접촉 상태를 점검합니다.",
        image: "/images/photos/process-anesthesia.webp",
        alt: "피부 준비와 통증 관리를 설명하는 사진",
      },
      {
        title: "시술",
        text: "피부 표면을 냉각하며 계획한 부위에 고주파를 전달합니다. 열감과 피부 반응에 맞춰 조절합니다.",
        image: doctorPhotos.coolphase,
        alt: "대표원장이 쿨페이즈로 얼굴 부위를 시술하는 장면",
        fullFrame: true,
        coverPosition: "50% 50%",
      },
      {
        title: "경과 확인",
        text: "시술 직후 피부 상태를 확인하고 세안 · 보습 방법과 주의사항, 다음 관리 시기를 안내합니다.",
        image: "/images/photos/process-check.webp",
        alt: "경과 확인을 설명하는 사진",
      },
    ],
  },
  "/petit/botox": {
    kind: "procedure",
    diagram: "botox",
    principleLayout: "figure-first",
    showPrices: true,
    device: {
      name: "보톡스",
      maker: "Botulinum Toxin",
      image: "/images/photos/cat-botox.webp",
      photo: "/images/photos/cat-botox.webp",
      text: "보톡스는 보툴리눔 톡신(근육의 움직임을 줄이는 주사)을 이용하는 시술입니다. 움직일 때 생기는 표정주름과 가만히 있어도 남는 주름을 구분하고, 근육의 힘과 표정 습관을 살펴 계획합니다.",
      specs: [
        {
          label: "방식",
          value: "보툴리눔 톡신 제제 주사",
        },
        {
          label: "주된 작용",
          value: "목표 근육의 움직임을 일시적으로 줄임",
        },
        {
          label: "시술 계획",
          value: "부위 · 표정 · 근육의 힘 확인",
        },
        {
          label: "제품 선택",
          value: "국산 · 수입 제품 중 상담 후 선택",
        },
      ],
      photoAlt: "시술 안내에 사용하는 기존 진료 현장 사진",
    },
    principle: [
      {
        title: "표정과 근육 움직임 확인",
        text: "표정을 지을 때 주름이 생기는 위치와 근육의 움직임, 좌우 차이를 살핍니다.",
      },
      {
        title: "필요한 부위에 제제 주사",
        text: "부위와 제품별 기준에 맞춰 주사 위치와 용량을 정합니다. 제품마다 용량 단위가 달라 숫자만으로 비교하지 않습니다.",
      },
      {
        title: "신경의 전달 신호 감소",
        text: "신경에서 근육으로 전달되는 신호를 줄여 목표 근육의 수축을 일시적으로 줄입니다.",
      },
    ],
    products: {
      title: "보톡스, 어떤 제품을 쓰나요?",
      lead: "프라베일 가격표에 있는 보툴리눔 톡신 제제입니다. 부위와 근육의 힘, 이전 시술 이력을 보고 상담 때 함께 고릅니다.",
      items: [
        {
          name: "뉴럭스",
          en: "Newlux",
          maker: "뉴메코(메디톡스 계열) · 국내",
          text: "국내에서 만든 보툴리눔 톡신 제제입니다. 제조 과정에서 동물 유래 성분을 쓰지 않는 공정으로 만든 제품으로 소개됩니다.",
          tags: ["국산"],
        },
        {
          name: "코어톡스",
          en: "Coretox",
          maker: "메디톡스 · 국내",
          text: "국내에서 만든 보툴리눔 톡신 제제입니다. 신경독소 외의 복합단백질을 줄인 제품으로 소개됩니다.",
          tags: ["국산"],
        },
        {
          name: "제오민",
          en: "Xeomin",
          maker: "멀츠 · 독일",
          text: "독일에서 만든 보툴리눔 톡신 제제입니다. 복합단백질을 제거한 제품으로 소개되며, 여러 나라에서 쓰이고 있습니다.",
          tags: ["수입"],
        },
      ],
      note: "※ 제조사 공개 자료를 바탕으로 한 일반 정보입니다. 제품마다 용량 단위가 달라 숫자만으로 비교하지 않으며, 어느 제품이 더 낫다는 뜻이 아닙니다. 효과와 유지 기간은 사람마다 다릅니다.",
    },
    featuresTitle: "보톡스 시술에서 살피는 4가지",
    featuresPlacement: "after-ba",
    features: [
      {
        title: "표정을 보며 주사 위치 설정",
        text: "정면 사진만으로 판단하지 않고 표정을 지을 때의 움직임과 좌우 차이를 함께 확인합니다.",
        image: doctorPhotos.consult,
        alt: "대표원장이 피부 분석 화면을 설명하는 상담 장면",
        fullFrame: true,
      },
      {
        title: "부위와 제품에 맞춘 계획",
        text: "같은 이름의 보톡스 시술도 부위와 제제가 다르면 계획이 달라집니다. 제품 정보와 시술 이력을 확인합니다.",
        image: "/images/photos/signature-3.webp",
        alt: "주입 시술의 계획을 설명하기 위한 기존 사진",
      },
      {
        title: "원하는 표정 변화 함께 확인",
        text: "주름을 줄이고 싶은 정도와 유지하고 싶은 표정을 함께 듣고, 기대할 수 있는 변화와 한계를 설명합니다.",
        image: "/images/photos/hero-consult.webp",
        alt: "대표원장이 피부 분석 화면을 설명하는 상담 장면",
        fullFrame: true,
      },
      {
        title: "변화가 나타난 뒤 경과 확인",
        text: "시술 직후 추가하기보다 변화가 나타나는 과정을 보고 불편감과 좌우 움직임을 확인합니다.",
        image: "/images/photos/hero-about.webp",
        alt: "경과 진료 방문을 설명하는 병원 대기 공간 사진",
      },
    ],
    process: [
      {
        title: "1:1 상담",
        text: "고민 부위, 표정, 복용 약과 이전 보툴리눔 톡신 시술 이력을 확인합니다.",
        image: doctorPhotos.consult,
        alt: "대표원장이 피부 분석 화면을 설명하는 상담 장면",
        fullFrame: true,
        coverPosition: "50% 50%",
      },
      {
        title: "마취 · 통증 관리",
        text: "주사 부위를 확인하고 피부를 준비합니다. 통증 관리 방법은 부위에 맞춰 안내합니다.",
        image: "/images/photos/process-anesthesia.webp",
        alt: "피부 준비와 통증 관리를 설명하는 사진",
      },
      {
        title: "부위별 주사",
        text: "설계한 부위에 제품별 기준에 맞춰 주사합니다.",
        image: "/images/photos/cat-injection.webp",
        alt: "부위에 맞춰 주사하는 대표원장",
      },
      {
        title: "주의사항 · 경과 안내",
        text: "당일 주의사항과 변화 관찰 시점, 추가 진료가 필요한 증상을 안내합니다.",
        image: "/images/photos/process-check.webp",
        alt: "경과 확인을 설명하는 사진",
      },
    ],
  },
  "/skin/retuo": {
    kind: "procedure",
    diagram: "matrix",
    principleLayout: "figure-first",
    showPrices: true,
    device: {
      name: "리투오 (Re2O)",
      maker: "L&C BIO",
      image: "/images/photos/best-retuo.webp",
      photo: "/images/photos/best-retuo.webp",
      text: "리투오는 기증된 피부 조직에서 세포 성분을 제거한 무세포 동종진피(hADM) 제품입니다. 콜라겐 등 피부를 지지하는 성분을 이용하며, 피부결 · 잔주름 · 탄력 고민과 원료의 특성을 함께 살펴 시술 여부를 정합니다.",
      specs: [
        {
          label: "제품 분류",
          value: "인체조직",
        },
        {
          label: "주요 원료",
          value: "무세포 동종진피 (hADM)",
        },
        {
          label: "제품 구성",
          value: "피부의 세포외기질 (ECM)",
        },
        {
          label: "시술 계획",
          value: "피부 상태 · 부위 확인 후 결정",
        },
      ],
      photoAlt: "대표원장이 리투오를 시술하는 장면",
    },
    principle: [
      {
        title: "피부 상태와 목표 확인",
        text: "거친 피부결, 잔주름, 꺼짐을 나누어 보고 이전 주사 시술과 피부 질환 이력을 확인합니다.",
      },
      {
        title: "무세포 동종진피 성분 적용",
        text: "인체 피부 조직에서 세포를 제거해 얻은 성분을 이용합니다. 원료와 사용할 제품의 특성을 먼저 설명드립니다.",
      },
      {
        title: "조직 반응과 경과 관찰",
        text: "시술 후 초기 반응이 가라앉는 과정을 확인하고 피부결과 탄력 변화를 관찰합니다. 변화와 유지 정도는 개인마다 다릅니다.",
      },
    ],
    compare: {
      title: "리투오, 다른 주사 시술과 어떻게 다른가요?",
      lead: "피부결 · 탄력 고민과 꺼진 부위의 볼륨은 어떤 차이가 있을까요?",
      columns: [
        {
          name: "리투오",
          maker: "인체 유래 hADM",
          self: true,
        },
        {
          name: "PLLA 계열",
          maker: "합성 고분자",
        },
        {
          name: "히알루론산 필러",
          maker: "HA 젤",
        },
      ],
      rows: [
        {
          label: "주요 재료",
          values: [
            "무세포 동종진피의 기질 성분",
            "폴리-L-젖산 (PLLA)",
            "히알루론산 (HA)",
          ],
        },
        {
          label: "작용 방향",
          values: [
            "피부 기질 성분 적용",
            "콜라겐 생성 반응 유도",
            "조직의 꺼짐 · 윤곽 보완",
          ],
        },
        {
          label: "상담할 때 확인",
          values: [
            "피부결 · 탄력과 제품 특성",
            "피부 상태 · 목표 · 제품별 기준",
            "꺼진 부위 · 층 · 필요한 양",
          ],
        },
        {
          label: "경과 관찰",
          values: [
            "초기 반응과 이후 피부 변화",
            "시간에 따른 조직 반응",
            "초기 부기와 자리 잡은 모양",
          ],
        },
      ],
      note: "※ 각 시술의 일반적인 특징을 정리한 것으로, 어느 시술이 더 낫다는 뜻이 아닙니다. 맞는 시술은 피부 상태와 고민에 따라 다르며, 효과 · 유지 기간은 사람마다 다릅니다. 비교 재료의 특정 제품을 본원에서 보유한다는 뜻이 아닙니다.",
    },
    featuresTitle: "리투오 상담에서 확인하는 4가지",
    features: [
      {
        title: "리투오 · 무세포 동종진피 원료",
        text: "리투오는 기증된 피부 조직에서 세포를 제거한 hADM 제품입니다. 휴메딕스 공식 제품 자료의 원료와 구성 정보를 바탕으로 제품 특성을 설명합니다.",
        image: "/images/official/retuo-product.jpg",
        alt: "리투오 · 무세포 동종진피 원료 · 제조사 공식 자료",
        fullFrame: false,
        mediaSize: { width: 479, height: 479 },
        mediaEdges: ["#fffeff", "#fffeff"],
      },
      {
        title: "원료와 사용목적을 함께 확인",
        text: "리투오의 인체조직 유래 재료는 합성 고분자나 히알루론산 제품과 구분합니다. 사용할 제품과 부위를 확인한 뒤 적용 방법을 정합니다.",
        image: "/images/official/retuo-official.jpg",
        alt: "원료와 사용목적을 함께 확인 · 제조사 공식 자료",
        fullFrame: false,
        mediaSize: { width: 479, height: 479 },
        mediaEdges: ["#fffeff", "#fffeff"],
      },
      {
        title: "피부 두께와 시술 이력 확인",
        text: "같은 피부 고민이라도 두께와 이전 시술에 따라 접근이 달라집니다. 적용 범위와 방법을 진찰 후 정합니다.",
        image: "/images/photos/retouched/consult.jpg",
        alt: "대표원장이 피부 분석 화면을 설명하는 상담 장면",
        fullFrame: true,
      },
      {
        title: "시술 후 경과도 함께 확인",
        text: "초기 반응과 피부 상태의 변화를 나누어 살펴보고, 불편한 증상이 있는지도 함께 확인합니다.",
        image: "/images/photos/hero-about.webp",
        alt: "경과 진료 방문을 설명하는 병원 대기 공간 사진",
      },
    ],
    process: [
      {
        title: "1:1 상담",
        text: "피부 상태와 기대하는 변화, 알레르기 · 질환 · 이전 시술을 확인합니다.",
        image: doctorPhotos.consult,
        alt: "대표원장이 피부 분석 화면을 설명하는 상담 장면",
        fullFrame: true,
        coverPosition: "50% 50%",
      },
      {
        title: "마취 · 통증 관리",
        text: "제품과 적용 방법을 설명하고, 부위와 상태에 맞는 통증 관리 방법을 안내합니다.",
        image: "/images/photos/process-anesthesia.webp",
        alt: "피부 준비와 통증 관리를 설명하는 사진",
      },
      {
        title: "계획한 부위에 적용",
        text: "진찰로 정한 부위와 방법에 따라 진행하며 피부 반응을 살핍니다.",
        image: "/images/photos/cat-skin-booster.webp",
        alt: "계획한 부위에 주입하는 대표원장",
      },
      {
        title: "경과 · 이상 반응 안내",
        text: "당일 상태를 확인하고 관리 방법과 추가 진료가 필요한 증상을 설명합니다.",
        image: "/images/photos/process-check.webp",
        alt: "경과 확인을 설명하는 사진",
      },
    ],
  },
  "/skin/booster": {
    kind: "procedure",
    diagram: "booster",
    principleLayout: "figure-first",
    showPrices: true,
    device: {
      name: "스킨부스터",
      maker: "성분 · 사용목적별 계획",
      image: "/images/photos/cat-skin-booster.webp",
      photo: "/images/official/rejuran-product.png",
      text: "스킨부스터는 피부결 · 잔주름 같은 고민을 관리하는 여러 제품과 방법을 묶어 부르는 말입니다. PN, 히알루론산 등 성분마다 역할과 사용목적이 달라, 제품명과 피부 상태를 함께 확인해 계획합니다. 바르는 제품과 주입용 제품은 사용방법을 구분합니다. 사진은 PN 성분 제품인 리쥬란이며, 다른 스킨부스터와 성분을 구분합니다.",
      specs: [
        {
          label: "분류",
          value: "제품마다 다른 성분 · 제형",
        },
        {
          label: "확인 사항",
          value: "성분 · 사용목적 · 사용방법",
        },
        {
          label: "시술 범위",
          value: "진찰 후 제품별로 결정",
        },
        {
          label: "경과",
          value: "붓기 · 멍 · 주입 자국 등 개인차",
        },
      ],
      photoAlt: "파마리서치 공식 리쥬란 제품 이미지",
      mediaContain: true,
    },
    principle: [
      {
        title: "고민과 피부 상태 확인",
        text: "건조함, 잔주름, 거친 결 중 무엇이 먼저인지 살피고, 염증이나 상처가 있는지도 확인합니다.",
      },
      {
        title: "성분 · 용도별 선택",
        text: "성분과 허가된 사용목적, 바르는 방식인지 주입하는 방식인지 확인해 필요한 방법을 정합니다.",
      },
      {
        title: "변화와 반응 함께 확인",
        text: "당일 붓기만으로 결과를 판단하지 않고 피부 상태와 불편한 증상을 함께 보며 경과를 확인합니다.",
      },
    ],
    compare: {
      title: "스킨부스터, 무엇을 기준으로 구분하나요?",
      lead: "피부결 · 잔주름, 꺼진 부위의 볼륨, 보습 관리는 어떤 차이가 있을까요?",
      columns: [
        {
          name: "스킨부스터",
          maker: "제품별 피부 고민 관리",
          self: true,
        },
        {
          name: "히알루론산 필러",
          maker: "국소 볼륨 · 주름 수복",
        },
        {
          name: "콜라겐부스터",
          maker: "재료별 조직 수복",
        },
        {
          name: "보습 관리",
          maker: "피부 표면 관리",
        },
      ],
      rows: [
        {
          label: "선택 기준",
          values: [
            "성분 · 허가 용도 · 주입 여부",
            "꺼진 위치 · 제품 특성",
            "재료 · 사용목적 · 주입 부위",
            "장벽 상태 · 성분 · 자극 여부",
          ],
        },
        {
          label: "주로 살피는 고민",
          values: [
            "피부결 · 잔주름 등 제품별",
            "국소 꺼짐 · 윤곽 · 주름",
            "주름 · 조직 상태 등 제품별",
            "당김 · 건조함 · 거친 표면",
          ],
        },
        {
          label: "방법",
          values: [
            "주입 또는 외용, 제품별 구분",
            "제품별 허가 방법으로 주입",
            "제품별 허가 방법으로 주입",
            "외용제 · 보습제 사용",
          ],
        },
        {
          label: "회복 확인",
          values: [
            "주입 자국 · 붓기 · 멍 등",
            "붓기 · 멍 · 혈관 관련 증상 등",
            "붓기 · 결절 · 염증 등",
            "자극 · 접촉 반응 등",
          ],
        },
      ],
      note: "※ 각 시술의 일반적인 특징을 정리한 것으로, 어느 시술이 더 낫다는 뜻이 아닙니다. 맞는 시술은 피부 상태와 고민에 따라 다르며, 효과 · 유지 기간은 사람마다 다릅니다.",
    },
    featuresTitle: "스킨부스터를 계획하는 4가지 기준",
    features: [
      {
        title: "리쥬란 · PN 성분을 확인",
        text: "리쥬란은 연어에서 유래한 PN을 주성분으로 하는 제품입니다. 제조사 원료 이미지와 제품 정보를 함께 살펴 피부 상태와 사용목적에 맞는지 확인합니다.",
        image: "/images/official/rejuran-section2_img02.jpg",
        alt: "리쥬란 · PN 성분을 확인 · 제조사 공식 자료",
        fullFrame: false,
        mediaSize: { width: 720, height: 232 },
        mediaEdges: ["#0090a2", "#014b6b"],
      },
      {
        title: "리쥬란 제품과 정품 표시 확인",
        text: "제조사에서 안내하는 제품명과 DOT 표시를 확인합니다. 바르는 화장품과 주입용 제품은 구분하고, 사용할 제품의 설명서에 맞춰 계획합니다.",
        image: "/images/official/rejuran-authentic.png",
        alt: "리쥬란 제품과 정품 표시 확인 · 제조사 공식 자료",
        fullFrame: false,
        mediaSize: { width: 890, height: 1008 },
        mediaEdges: ["#1d2227", "#1d2227"],
      },
      {
        title: "피부 두께와 부위 고려",
        text: "얼굴 전체를 같은 방식으로 접근하지 않고, 피부 두께와 민감한 부위를 살펴 범위를 정합니다.",
        image: "/images/photos/cat-main-skin.webp",
        alt: "피부 부위별 계획 설명용 기존 시술 사진",
      },
      {
        title: "반응을 보며 다음 단계 결정",
        text: "붓기와 멍, 주입 자국을 확인하고 경과에 따라 다음 계획을 정합니다. 추가 시술은 필요성을 다시 살펴 결정합니다.",
        image: "/images/photos/signature-4.webp",
        alt: "피부 경과 관리 설명용 기존 진료 사진",
      },
    ],
    process: [
      {
        title: "상담 · 계획",
        text: "피부 상태와 이전 시술 이력을 살피고, 스킨부스터의 범위와 기대할 수 있는 변화를 함께 정합니다.",
        image: doctorPhotos.consult,
        alt: "대표원장이 피부 분석 화면을 설명하는 상담 장면",
        fullFrame: true,
        coverPosition: "50% 50%",
      },
      {
        title: "마취 · 준비",
        text: "제품과 부위에 따라 마취 방법을 정하고 피부를 깨끗하게 준비합니다. 마취제 알레르기가 있으면 미리 알려 주세요.",
        image: "/images/photos/process-anesthesia.webp",
        alt: "기존 마취 준비 사진",
      },
      {
        title: "시술",
        text: "제품의 사용방법에 맞춰 정한 부위를 시술합니다. 외용 제품은 주입용 제품과 구분해 사용합니다.",
        image: "/images/photos/cat-injection.webp",
        alt: "시술 과정 설명용 기존 주입 시술 사진",
        coverPosition: "43% 50%",
      },
      {
        title: "경과 확인",
        text: "시술 직후 상태를 확인하고, 제품별 주의사항과 다시 진료를 받아야 할 증상을 안내합니다.",
        image: "/images/photos/process-check.webp",
        alt: "기존 시술 후 경과 확인 사진",
      },
    ],
  },
  "/skin/collagen": {
    kind: "procedure",
    diagram: "collagen",
    principleLayout: "figure-first",
    showPrices: true,
    device: {
      name: "콜라겐부스터",
      maker: "재료별 조직 수복 계획",
      image: "/images/photos/cat-skin-care.webp",
      photo: "/images/official/juvelook-product.png",
      text: "콜라겐부스터는 서로 다른 재료의 주입 시술을 묶어 부르는 말입니다. 인체조직에서 얻은 성분과 합성 고분자 재료는 특성이 다릅니다. 제품별 원료와 사용목적을 구분하고 피부 상태와 주입 부위에 맞춰 계획합니다. 사진은 쥬베룩 제품이며, 아래에서 리투오 · 쥬베룩 · 울트라콜의 재료를 나누어 설명합니다.",
      specs: [
        {
          label: "재료 구분",
          value: "인체조직 유래 · 합성 고분자",
        },
        {
          label: "선택 기준",
          value: "제품별 사용목적 · 피부 상태",
        },
        {
          label: "주입 계획",
          value: "부위 · 깊이 · 양 개별 결정",
        },
        {
          label: "경과 확인",
          value: "붓기 · 멍 · 결절 · 염증 등",
        },
      ],
      photoAlt: "쥬베룩 공식 제품 바이알",
      mediaContain: true,
    },
    principle: [
      {
        title: "부위와 고민부터 확인",
        text: "주름, 꺼짐, 피부 두께를 살피고 필요한 변화와 시술로 기대할 수 있는 범위를 정합니다.",
      },
      {
        title: "쥬베룩의 PDLLA 미세입자",
        text: "제조사 자료는 구형의 다공성 PDLLA 입자를 설명합니다. 리투오의 hADM, 울트라콜의 PDO와 재료가 다르므로 제품마다 사용목적과 주입 계획을 구분합니다.",
      },
      {
        title: "안정된 뒤 경과 평가",
        text: "시술 직후 붓기와 시간이 지나며 보이는 변화를 구분하고, 결절감이나 염증 반응이 없는지 함께 확인합니다.",
      },
    ],
    compare: {
      title: "리투오 · 쥬베룩 · 울트라콜, 무엇이 다른가요?",
      lead: "인체조직에서 얻은 성분과 서로 다른 합성 고분자 재료는 어떤 차이가 있을까요?",
      columns: [
        {
          name: "리투오",
          maker: "인체조직 유래",
        },
        {
          name: "쥬베룩",
          maker: "합성 고분자 · 히알루론산",
        },
        {
          name: "울트라콜",
          maker: "합성 고분자 미립구",
        },
      ],
      rows: [
        {
          label: "재료",
          values: [
            "무세포 동종진피(hADM)",
            "폴리-D,L-락트산(PDLLA) · 히알루론산",
            "폴리디옥사논(PDO) 기반 미립구",
          ],
        },
        {
          label: "공식 제품 분류",
          values: ["인체조직", "조직수복용재료 · 의료기기", "의료기기"],
        },
        {
          label: "적용 전 확인",
          values: [
            "원료 특성 · 처리 방법 · 설명 동의",
            "제품 라인 · 함량 · 사용설명서",
            "제품 규격 · 부위 · 사용설명서",
          ],
        },
        {
          label: "경과 확인",
          values: [
            "초기 반응과 이후 피부 상태",
            "붓기 · 덩어리감 · 피부 상태",
            "주름과 주입 부위 반응",
          ],
        },
      ],
      note: "※ 제품명은 재료의 차이를 설명하는 예시이며 실제 사용 제품은 상담 때 확인합니다. 맞는 시술은 피부 상태와 고민에 따라 다르며, 효과 · 유지 기간은 사람마다 다릅니다.",
    },
    featuresTitle: "콜라겐부스터를 계획하는 4가지 기준",
    features: [
      {
        title: "리투오 · 인체조직 유래 hADM",
        text: "리투오는 피부 조직에서 세포를 제거해 얻은 hADM을 사용합니다. 합성 고분자 입자 제품과 원료의 성격이 다르므로 시술 목표와 함께 설명합니다.",
        image: "/images/official/retuo-product.jpg",
        alt: "리투오 · 인체조직 유래 hADM · 제조사 공식 자료",
        fullFrame: false,
        mediaSize: { width: 479, height: 479 },
        mediaEdges: ["#fffeff", "#fffeff"],
      },
      {
        title: "쥬베룩 · PDLLA와 히알루론산",
        text: "쥬베룩은 PDLLA 미세입자와 히알루론산으로 구성됩니다. 제조사의 입자 구조 자료를 바탕으로 제품 특성을 설명하고 피부 두께와 부위에 맞춰 계획합니다.",
        image: "/images/official/juvelook-structure.png",
        alt: "쥬베룩 · PDLLA와 히알루론산 · 제조사 공식 자료",
        fullFrame: false,
        mediaSize: { width: 800, height: 800 },
        mediaFit: "cover",
      },
      {
        title: "울트라콜 · PDO 미세입자",
        text: "울트라콜은 PDO를 재료로 사용하는 제품입니다. 제조사 제품군 이미지를 참고하되, 실제 사용할 규격과 목적은 상담에서 확인합니다.",
        image: "/images/official/ultracol-product.png",
        alt: "울트라콜 · PDO 미세입자 · 제조사 공식 자료",
        fullFrame: false,
        mediaSize: { width: 419, height: 289 },
      },
      {
        title: "덩어리감까지 살피는 경과 확인",
        text: "붓기가 빠지는 과정과 오래가는 결절감을 구분합니다. 열감이나 통증이 동반되면 다음 시술보다 진찰을 먼저 진행합니다.",
        image: "/images/photos/signature-3.webp",
        alt: "경과 확인 설명용 기존 피부 시술 사진",
      },
    ],
    process: [
      {
        title: "상담 · 제품 확인",
        text: "고민과 피부 두께, 이전 주입 이력을 확인하고 사용할 재료와 범위를 정합니다.",
        image: doctorPhotos.consult,
        alt: "대표원장이 피부 분석 화면을 설명하는 상담 장면",
        fullFrame: true,
        coverPosition: "50% 50%",
      },
      {
        title: "마취 · 준비",
        text: "제품과 부위에 맞는 마취 방법을 정하고, 제품의 사용방법에 따라 시술을 준비합니다.",
        image: "/images/photos/process-anesthesia.webp",
        alt: "기존 마취 준비 사진",
      },
      {
        title: "시술",
        text: "제품별 사용목적과 주입 방법을 확인해 정한 부위를 시술합니다. 양과 분포는 피부 상태에 맞춰 조절합니다.",
        image: "/images/photos/cat-injection.webp",
        alt: "시술 과정 설명용 기존 주입 시술 사진",
        coverPosition: "43% 50%",
      },
      {
        title: "경과 확인",
        text: "붓기와 멍, 덩어리감이나 염증 증상을 확인합니다. 마사지를 포함한 관리는 제품별로 따로 안내합니다.",
        image: "/images/photos/process-check.webp",
        alt: "기존 시술 후 경과 확인 사진",
      },
    ],
    principleImage: {
      src: "/images/official/juvelook-structure.png",
      alt: "쥬베룩 공식 PDLLA 미세입자 구조 이미지",
      marks: [],
      layers: [],
      framed: false,
      note: "JUVELOOK · PDLLA 미세입자를 나타낸 제조사 이미지입니다. 실제 입자의 크기와는 다릅니다.",
    },
  },
  "/lifting/laser": {
    kind: "procedure",
    diagram: "laser",
    principleLayout: "figure-first",
    showPrices: true,
    device: {
      name: "포텐자 · 슈링크 유니버스 · 클라리티2",
      maker: "JEISYS · CLASSYS · LUTRONIC",
      image: "/images/photos/retouched/consult.jpg",
      photo: "/images/photos/retouched/consult.jpg",
      photoFullFrame: true,
      text: "슈링크 유니버스는 집속 초음파, 포텐자는 고주파, 클라리티는 레이저를 사용합니다. 처짐 · 피부결 · 모공 중 어떤 고민이 중심인지 보고, 피부 상태에 맞는 장비와 시술 부위를 정합니다. 영상은 고주파 장비인 포텐자의 제조사 소개 장면입니다.",
      specs: [
        {
          label: "초음파",
          value: "슈링크 유니버스 · HIFU",
        },
        {
          label: "고주파",
          value: "포텐자 · RF (팁별 방식 구분)",
        },
        {
          label: "레이저",
          value: "클라리티 · 빛 에너지",
        },
        {
          label: "계획 기준",
          value: "피부 두께 · 고민 부위 · 회복 여유",
        },
      ],
      photoAlt: "대표원장이 피부 분석 화면을 설명하는 상담 장면",
      film: {
        src: "/videos/official-potenza-intro.mp4",
        poster: "/images/official/potenza-intro-poster.jpg",
      },
      mediaContain: true,
    },
    principle: [
      {
        title: "피부 고민 구분",
        text: "꺼짐 · 처짐 · 거친 피부결을 나누어 살핍니다. 비슷해 보이는 고민도 필요한 시술은 다를 수 있습니다.",
      },
      {
        title: "고민에 맞는 에너지 전달",
        text: "초음파는 목표 층에 모이고, 미세침 고주파는 바늘을 통해 에너지를 전달합니다. 레이저는 빛이 흡수되는 성질을 이용합니다.",
      },
      {
        title: "피부 반응과 경과 확인",
        text: "열 자극 뒤 변화는 시간이 걸릴 수 있습니다. 직후의 붓기와 이후의 변화를 구분해 다음 계획을 정합니다.",
      },
    ],
    compare: {
      title: "슈링크 · 포텐자 · 클라리티, 무엇이 다른가요?",
      lead: "초음파 · 고주파 · 레이저는 어떻게 에너지를 전달하고, 어떤 피부 고민을 살펴볼까요?",
      columns: [
        {
          name: "슈링크 유니버스",
          maker: "클래시스",
        },
        {
          name: "포텐자",
          maker: "제이시스메디칼",
        },
        {
          name: "클라리티",
          maker: "루트로닉",
        },
      ],
      rows: [
        {
          label: "에너지",
          values: ["고강도 집속 초음파 (HIFU)", "고주파 (RF)", "레이저"],
        },
        {
          label: "전달 방식",
          values: [
            "목표 층에 초음파 집속",
            "팁에 따라 미세침 또는 표면 전극",
            "피부에 레이저 빛 조사",
          ],
        },
        {
          label: "상담 시 살피는 고민",
          values: [
            "피부 탄력 · 주름",
            "모공 · 흉터 · 피부결 · 탄력",
            "피부 상태에 따른 색소 · 혈관 · 결 관리",
          ],
        },
        {
          label: "시술 후 반응",
          values: [
            "열감 · 압통 · 붓기 가능",
            "붉어짐 · 붓기 · 바늘 자국 가능",
            "붉어짐 · 열감 · 색 변화 가능",
          ],
        },
        {
          label: "선택 기준",
          values: [
            "두께 · 처짐 부위 · 목표 층",
            "피부 두께 · 팁 · 회복 여유",
            "피부 톤 · 병변 · 사용 파장",
          ],
        },
      ],
      note: "※ 장비의 일반적인 방식 비교이며 실제 보유 모델 · 팁과 시행 범위는 상담에서 확인합니다. 맞는 방법은 피부 상태와 고민에 따라 다르며, 통증 · 효과 · 유지 기간에는 개인차가 있습니다.",
    },
    featuresTitle: "레이저리프팅의 4가지 특징",
    features: [
      {
        title: "슈링크 유니버스 · 초음파를 목표 층에",
        text: "집속 초음파가 한 지점에 모이는 성질을 이용합니다. 제조사 모식도처럼 에너지가 모이는 깊이를 구분하고, 피부 두께와 처짐 부위에 맞춰 카트리지를 정합니다.",
        image: "/images/official/shurink-principle.jpg",
        alt: "슈링크 유니버스 · 초음파를 목표 층에 · 제조사 공식 자료",
        fullFrame: false,
        mediaSize: { width: 640, height: 263 },
        mediaEdges: ["#f3f5f7", "#f3f5f7"],
      },
      {
        title: "포텐자 · 팁에 따라 달라지는 RF",
        text: "미세침 팁은 피부 안으로 고주파 에너지를 전달합니다. 영상은 제조사의 미세침 RF 작동 예시이며, 시술 목적과 피부 상태에 따라 팁과 설정을 구분합니다.",
        image: "/images/official/potenza-principle-poster.jpg",
        alt: "포텐자 · 팁에 따라 달라지는 RF · 제조사 공식 자료",
        fullFrame: false,
        mediaSize: { width: 1280, height: 720 },
        mediaEdges: ["#bbc9d1", "#a7bbce"],
        mediaFit: "contain",
        video: "/videos/official-potenza-principle.mp4",
      },
      {
        title: "클라리티2 · 파장과 조사 범위 조절",
        text: "클라리티2는 755nm와 1064nm 파장을 사용하는 레이저입니다. 초음파 · 고주파와 작용 방식이 달라, 피부 고민에 맞는 사용목적과 조사 범위를 먼저 확인합니다.",
        image: "/images/official/clarity-poster.jpg",
        alt: "클라리티2 · 파장과 조사 범위 조절 · 제조사 공식 자료",
        fullFrame: false,
        mediaSize: { width: 1280, height: 768 },
        video: "/videos/official-clarity.mp4",
      },
      {
        title: "회복 일정까지 포함한 계획",
        text: "중요한 일정을 확인하고, 붉어짐이나 붓기가 생길 가능성을 설명합니다. 경과를 본 뒤 추가 시술 여부를 정합니다.",
        image: "/images/photos/clinic-4.webp",
        alt: "세안과 회복 관리 안내에 사용하는 병원 파우더룸 사진",
      },
    ],
    process: [
      {
        title: "1:1 상담",
        text: "처짐 · 피부결 · 모공을 나누어 살피고 기존 시술과 복용약을 확인합니다.",
        image: doctorPhotos.consult,
        alt: "대표원장이 피부 분석 화면을 설명하는 상담 장면",
        fullFrame: true,
        coverPosition: "50% 50%",
      },
      {
        title: "마취 · 시술 준비",
        text: "장비에 맞는 통증 관리와 마취 여부를 안내하고 피부를 준비합니다. 레이저는 적합한 눈 보호 방법도 확인합니다.",
        image: "/images/photos/process-anesthesia.webp",
        alt: "시술 부위에 마취 크림을 바르는 참고 사진",
      },
      {
        title: "장비별 시술",
        text: "정한 방식과 부위에 맞춰 시술하며, 불편감이나 피부 반응에 따라 조절합니다.",
        image: doctorPhotos.laser,
        alt: "보호 안경을 착용한 대표원장의 얼굴 부위 레이저 시술 장면",
        fullFrame: true,
        coverPosition: "35% 50%",
      },
      {
        title: "경과 확인",
        text: "피부 상태와 주의사항을 확인하고, 회복 뒤 변화에 따라 다음 계획을 안내합니다.",
        image: "/images/photos/process-check.webp",
        alt: "시술 후 피부 상태를 확인하는 모습",
      },
    ],
    principleImage: {
      src: "/images/official/potenza-principle-poster.jpg",
      alt: "포텐자의 미세침과 고주파 에너지 전달을 보여주는 제조사 원리 영상",
      marks: [],
      layers: [],
      framed: false,
      note: "JEISYS MEDICAL · 포텐자 미세침 RF 원리. 팁에 따라 작동 방식이 달라집니다.",
      video: "/videos/official-potenza-principle.mp4",
    },
  },
  "/lifting/thread": {
    kind: "procedure",
    diagram: "thread",
    principleLayout: "figure-first",
    showPrices: true,
    device: {
      name: "실리프팅",
      maker: "흡수성 의료용 실",
      image: "/images/photos/retouched/consult.jpg",
      photo: "/images/official/mint-product.png",
      photoFullFrame: false,
      text: "실리프팅은 흡수성 의료용 실을 피부 아래에 넣어 처진 조직을 받치고 위치를 조절하는 시술입니다. 돌기가 있는 실은 조직을 물리적으로 지지하며, 재질과 구조에 따라 계획이 달라집니다. 피부 두께와 조직의 무게, 당길 방향을 함께 살펴 시술 범위를 정합니다. 제품 이미지는 민트실의 제조사 제품군이며, 사용할 규격은 진찰 후 선택합니다.",
      specs: [
        {
          label: "방법",
          value: "흡수성 실 삽입 · 조직 지지",
        },
        {
          label: "설계 기준",
          value: "피부 두께 · 처짐 · 조직 무게",
        },
        {
          label: "실 선택",
          value: "제품별 재질 · 구조 · 사용목적",
        },
        {
          label: "경과",
          value: "붓기 · 멍 · 당김 · 비대칭 등",
        },
      ],
      photoAlt: "한스바이오메드 MINT 흡수성 실 제품군",
      mediaContain: true,
    },
    principle: [
      {
        title: "처짐과 피부 두께 확인",
        text: "처진 부위와 지방량, 피부 두께를 확인하고 실이 조직을 지지할 방향과 범위를 정합니다.",
      },
      {
        title: "민트실의 돌기가 조직을 지지",
        text: "그림은 돌기가 있는 실과 주변 조직의 관계를 설명합니다. 실의 구조와 사용목적을 확인하고 조직을 지지할 층과 방향을 정합니다.",
      },
      {
        title: "모양과 불편감 함께 관찰",
        text: "초기 당김과 붓기가 안정되는 과정을 살피고, 패임이나 비대칭, 실 노출이 없는지 경과를 확인합니다.",
      },
    ],
    compare: {
      title: "실리프팅, 다른 윤곽 관리와 어떻게 다른가요?",
      lead: "실의 지지 · 에너지 자극 · 볼륨 보완은 어떻게 다르고, 어떤 고민을 먼저 살펴볼까요?",
      columns: [
        {
          name: "실리프팅",
          maker: "실의 물리적 지지",
          self: true,
        },
        {
          name: "초음파 · 고주파",
          maker: "에너지를 이용한 관리",
        },
        {
          name: "히알루론산 필러",
          maker: "국소 볼륨 · 주름 수복",
        },
      ],
      rows: [
        {
          label: "방법",
          values: [
            "의료용 실을 피부 아래에 삽입",
            "장비별 에너지를 목표 조직에 전달",
            "제품별 허가 방법에 따라 주입",
          ],
        },
        {
          label: "계획할 때 보는 점",
          values: [
            "처짐 방향 · 피부 두께 · 조직 무게",
            "피부 상태 · 목표 층 · 에너지",
            "꺼진 위치 · 제품 특성 · 주입 층",
          ],
        },
        {
          label: "주요 차이",
          values: [
            "조직을 받쳐 위치를 조절",
            "열 자극 등을 통한 탄력 관리",
            "국소 조직의 볼륨과 모양 보완",
          ],
        },
        {
          label: "경과 확인",
          values: [
            "당김 · 붓기 · 패임 · 비대칭",
            "열감 · 붓기 · 감각 변화 등",
            "붓기 · 멍 · 혈관 관련 증상 등",
          ],
        },
      ],
      note: "※ 각 시술의 일반적인 특징을 정리한 것으로, 어느 시술이 더 낫다는 뜻이 아닙니다. 맞는 시술은 피부 상태와 고민에 따라 다르며, 효과 · 유지 기간은 사람마다 다릅니다.",
    },
    featuresTitle: "실리프팅을 계획하는 4가지 기준",
    features: [
      {
        title: "처짐 방향부터 확인",
        text: "당기고 싶은 부위뿐 아니라 조직의 무게와 움직임을 함께 봅니다. 얼굴 전체의 균형 안에서 방향을 정합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "실리프팅 상담 안내에 사용하는 병원 상담실 사진",
      },
      {
        title: "민트실 · 재질과 돌기 구조 확인",
        text: "민트실은 PDO 재질의 흡수성 실입니다. 제조사의 360° 나선형 돌기 구조를 참고해 피부 두께와 조직의 무게에 맞는 규격과 배치를 정합니다.",
        image: "/images/official/mint-structure.png",
        alt: "민트실 · 재질과 돌기 구조 확인 · 제조사 공식 자료",
        fullFrame: false,
        mediaSize: { width: 550, height: 550 },
        mediaEdges: ["#fcfaff", "#fdfbff"],
      },
      {
        title: "개수와 함께 보는 범위 · 배치",
        text: "실 개수 하나로 결과를 정하지 않습니다. 필요한 범위와 지지 방향을 정하고 피부에 가해질 부담을 함께 고려합니다.",
        image: "/images/photos/clinic-4.webp",
        alt: "병원 세안 · 파우더룸의 기존 사진",
      },
      {
        title: "초기 모양과 회복을 함께 확인",
        text: "붓기와 당김, 피부 패임을 살피고 비대칭이나 실 노출 같은 불편이 있으면 진료로 확인합니다.",
        image: "/images/photos/clinic-6.webp",
        alt: "경과 진료 방문 안내에 사용하는 병원 복도 사진",
      },
    ],
    process: [
      {
        title: "상담 · 디자인",
        text: "처짐과 피부 두께, 이전 시술 이력을 보고 지지 방향과 실의 종류 · 범위를 정합니다.",
        image: doctorPhotos.consult,
        alt: "대표원장이 피부 분석 화면을 설명하는 상담 장면",
        fullFrame: true,
        coverPosition: "50% 50%",
      },
      {
        title: "마취 · 준비",
        text: "시술 부위와 마취 방법을 확인한 뒤 피부를 소독하고 준비합니다. 마취제 알레르기는 미리 알려 주세요.",
        image: "/images/photos/process-anesthesia.webp",
        alt: "기존 마취 준비 사진",
      },
      {
        title: "시술",
        text: "제품별 사용방법에 맞춰 계획한 층과 방향에 실을 넣고, 조직의 지지와 좌우 균형을 확인합니다.",
        image: "/images/photos/cat-main-petit.webp",
        alt: "기존 피부 주입 시술 참고 사진",
      },
      {
        title: "경과 확인",
        text: "붓기와 통증, 당김이나 패임을 확인하고, 압박 · 마사지 · 일상생활 주의사항을 따로 안내합니다.",
        image: "/images/photos/process-check.webp",
        alt: "기존 시술 후 경과 확인 사진",
      },
    ],
    principleImage: {
      src: "/images/principles/thread.webp?v=20261026b",
      alt: "돌기가 있는 실과 주변 결합조직의 지지 구조를 확대한 입체 개념도",
      marks: [],
      layers: [],
      framed: true,
      note: "돌기가 있는 실과 주변 조직의 관계를 표현한 설명용 모식도입니다. 특정 제품의 실제 구조 · 크기 · 삽입 깊이와는 다를 수 있습니다.",
    },
  },
  "/acne-pore": {
    kind: "procedure",
    diagram: "acne",
    principleLayout: "figure-first",
    showPrices: true,
    device: {
      name: "여드름 · 모공 치료",
      maker: "ACNE · MARKS · SCARS · PORES",
      image: doctorPhotos.consult,
      photo: doctorPhotos.consult,
      photoFullFrame: true,
      text: "올라오는 여드름, 붉거나 갈색인 자국, 패인 흉터는 서로 다른 고민입니다. 염증을 먼저 살피고 필요한 약물 치료와 압출 · 각질 관리, 흉터 · 모공 시술을 나누어 계획합니다. 피부가 회복되는 속도를 보며 다음 단계를 정합니다.",
      specs: [
        {
          label: "살피는 고민",
          value: "여드름 · 자국 · 흉터 · 모공",
        },
        {
          label: "치료 선택",
          value: "진료 후 약물 · 관리 · 장비 시술 구분",
        },
        {
          label: "흉터 평가",
          value: "패인 모양 · 깊이 · 피부 상태",
        },
        {
          label: "계획 기준",
          value: "현재 염증 · 피부 민감도 · 회복 여유",
        },
      ],
      photoAlt: "대표원장이 피부 분석 화면을 설명하는 상담 장면",
    },
    principle: [
      {
        title: "지금 생기는 염증부터 확인",
        text: "면포와 염증성 여드름을 구분하고, 생활 습관과 사용 중인 약을 함께 봅니다. 새 흉터를 줄이려면 현재 여드름을 조절하는 과정이 중요합니다.",
      },
      {
        title: "남은 자국과 패인 흉터를 구분",
        text: "색이 남은 자국과 피부가 패인 흉터는 같은 방법으로 치료하지 않습니다. 흉터의 모양과 깊이, 모공이 도드라지는 원인을 나누어 봅니다.",
      },
      {
        title: "회복에 맞춰 순서를 조절",
        text: "피부에 필요한 자극과 회복 시간을 함께 고려합니다. 시술 뒤에는 보습과 자외선 차단을 안내하고, 반응을 보며 치료를 조정합니다.",
      },
    ],
    compare: {
      title: "여드름 관리와 흉터 시술, 어떻게 다른가요?",
      lead: "현재 여드름을 다루는 진료 · 관리와 이미 남은 흉터를 다루는 시술은 어떤 차이가 있을까요?",
      columns: [
        {
          name: "여드름 진료",
          maker: "현재 병변 · 약물 검토",
          self: true,
        },
        {
          name: "압출관리",
          maker: "필요한 면포 선택",
        },
        {
          name: "필링 · 각질 관리",
          maker: "성분 · 피부 상태 확인",
        },
        {
          name: "프락셔널 레이저",
          maker: "흉터 · 피부결 평가",
        },
      ],
      rows: [
        {
          label: "주요 역할",
          values: [
            "여드름 종류에 맞는 치료 계획",
            "필요한 면포의 제거 여부 확인",
            "피부 표면 각질 · 모공 막힘 관리",
            "흉터 · 피부결 평가 후 시술",
          ],
        },
        {
          label: "선택 기준",
          values: [
            "여드름 종류 · 범위 · 병력",
            "면포 · 염증 · 민감도",
            "사용 성분 · 강도 · 피부 민감도",
            "흉터 모양 · 깊이 · 피부 톤",
          ],
        },
        {
          label: "알아둘 점",
          values: [
            "약물 치료가 필요할 수 있음",
            "모든 병변을 압출하지 않음",
            "성분 · 농도 · 피부 자극 확인",
            "붉어짐 · 딱지 · 색 변화 가능",
          ],
        },
        {
          label: "계획 조정",
          values: [
            "새 병변이 생기는지 확인",
            "자극과 회복 상태 확인",
            "피부 반응과 회복 상태 확인",
            "회복과 흉터 변화 확인",
          ],
        },
      ],
      note: "※ 각 치료의 일반적인 특징을 정리한 것으로, 어느 치료가 더 낫다는 뜻이 아닙니다. 맞는 치료는 피부 상태와 고민에 따라 다르며, 효과 · 회복 기간은 사람마다 다릅니다.",
    },
    featuresTitle: "여드름 · 모공 치료에서 살피는 4가지",
    features: [
      {
        title: "염증과 흔적을 나누어 봅니다",
        text: "지금 올라오는 여드름과 남은 자국 · 흉터를 구분합니다. 한 가지 장비로 모두 해결한다고 설명하지 않습니다.",
        image: "/images/photos/hero-consult.webp",
        alt: "대표원장이 피부 분석 화면을 설명하는 상담 장면",
        fullFrame: true,
      },
      {
        title: "상태에 맞는 순서를 정합니다",
        text: "통증이 있는 염증을 먼저 살피고, 피부가 안정되면 흉터와 모공 치료를 논의합니다. 사용 중인 여드름 약도 함께 확인합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "진료 계획을 설명하는 병원 상담실 사진",
      },
      {
        title: "피부의 회복 여유를 남깁니다",
        text: "관리 강도와 시술 범위를 정할 때 붉어짐 · 건조함 등 현재 상태를 고려합니다. 자극을 반복하기보다 회복 경과를 봅니다.",
        image: "/images/photos/hero-about.webp",
        alt: "경과 진료 방문을 설명하는 병원 대기 공간 사진",
      },
      {
        title: "일상 관리까지 이어갑니다",
        text: "세안과 보습, 자외선 차단, 손으로 짜는 습관을 함께 점검합니다. 다음 진료에서는 새 병변과 자극 여부를 확인합니다.",
        image: "/images/photos/clinic-1.webp",
        alt: "다음 진료 방문을 설명하는 병원 접수 공간 사진",
      },
    ],
    process: [
      {
        title: "1:1 상담",
        text: "여드름 단계와 자국 · 흉터를 살피고, 복용약과 사용 중인 화장품을 확인합니다.",
        image: doctorPhotos.consult,
        alt: "대표원장이 피부 분석 화면을 설명하는 상담 장면",
        fullFrame: true,
        coverPosition: "50% 50%",
      },
      {
        title: "마취 · 시술 전 준비",
        text: "선택한 관리에 맞춰 세안과 소독을 진행합니다. 필요한 시술에만 마취를 적용합니다.",
        image: "/images/photos/process-anesthesia.webp",
        alt: "시술 전 마취 크림을 바르는 참고 사진",
      },
      {
        title: "단계별 치료",
        text: "진료 때 정한 범위에서 관리 또는 장비 시술을 진행하며 피부 반응을 확인합니다.",
        image: doctorPhotos.laser,
        alt: "보호 안경을 착용한 대표원장의 얼굴 부위 레이저 시술 장면",
        fullFrame: true,
        coverPosition: "35% 50%",
      },
      {
        title: "경과 확인",
        text: "피부 자극과 새 여드름 여부를 확인하고, 홈케어와 다음 진료 계획을 안내합니다.",
        image: "/images/photos/process-check.webp",
        alt: "진료 후 피부 상태를 확인하는 모습",
      },
    ],
  },
  "/removal/hair": {
    kind: "procedure",
    diagram: "hair",
    principleLayout: "figure-first",
    showPrices: true,
    device: {
      name: "클라리티2 레이저 제모",
      maker: "CYNOSURE LUTRONIC",
      image: "/images/photos/cat-hair-removal.webp",
      photo: "/images/photos/cat-hair-removal.webp",
      text: "레이저 제모는 털의 멜라닌 색소가 빛을 흡수하는 성질을 이용해 모낭에 열을 전달하는 시술입니다. 털의 굵기와 색, 피부 톤을 함께 살피고 부위에 맞게 설정을 조절합니다. 한 번에 모든 털을 없애기보다 자라는 양을 줄이는 방향으로 계획합니다.",
      specs: [
        {
          label: "방식",
          value: "털의 색소가 흡수하는 레이저 빛 이용",
        },
        {
          label: "살피는 요소",
          value: "피부 톤 · 털의 색 · 굵기 · 부위",
        },
        {
          label: "목표",
          value: "자라는 털의 양 감소",
        },
        {
          label: "시술 계획",
          value: "성장 주기와 피부 반응에 따라 조정",
        },
      ],
      photoAlt: "기존 레이저 장비실 참고 사진",
      film: {
        src: "/videos/official-clarity.mp4",
        poster: "/images/official/clarity-poster.jpg",
      },
      mediaContain: true,
    },
    principle: [
      {
        title: "피부와 털의 차이를 확인",
        text: "피부 톤과 털의 색 · 굵기를 함께 확인합니다. 최근 태닝이나 피부 자극이 있으면 시술 시기를 먼저 조정할 수 있습니다.",
      },
      {
        title: "모낭에 에너지를 전달하며 범위 확인",
        text: "털의 멜라닌이 흡수한 빛이 열로 바뀌어 모낭에 작용합니다. 그림은 털의 색소와 모낭에 에너지가 전달되는 개념이며, 피부 상태에 맞춰 에너지와 냉각을 조절합니다.",
      },
      {
        title: "다시 자라는 양을 보며 조정",
        text: "털마다 성장 단계가 달라 한 번의 시술에 모두 같은 반응을 보이지 않습니다. 자라는 양과 피부 회복을 확인해 다음 시기를 안내합니다.",
      },
    ],
    compare: {
      title: "레이저 · 면도 · 왁싱은 어떻게 다른가요?",
      lead: "털을 정리하는 위치와 다시 자라는 양, 피부에 주는 자극은 어떤 차이가 있을까요?",
      columns: [
        {
          name: "레이저 제모",
          maker: "빛 에너지",
          self: true,
        },
        {
          name: "면도",
          maker: "피부 표면의 털 절단",
        },
        {
          name: "왁싱 · 뽑기",
          maker: "털을 뿌리째 제거",
        },
      ],
      rows: [
        {
          label: "작용",
          values: [
            "털의 색소를 통해 모낭에 열 전달",
            "피부 밖으로 나온 털을 자름",
            "털을 당겨 제거",
          ],
        },
        {
          label: "관리 방향",
          values: [
            "자라는 털의 양을 줄임",
            "그때 자란 털을 정리",
            "그때 자란 털을 제거",
          ],
        },
        {
          label: "알아둘 점",
          values: [
            "털 색 · 피부 톤에 따라 반응 다름",
            "베임 · 면도 자극 가능",
            "당김 · 피부 자극 가능",
          ],
        },
        {
          label: "레이저 전 관리",
          values: [
            "피부 상태 확인 후 진행",
            "안내받은 시점에 짧게 정리",
            "레이저 전후에는 피하도록 안내",
          ],
        },
      ],
      note: "※ 각 제모 방법의 일반적인 특징을 정리한 것으로, 어느 방법이 모두에게 더 낫다는 뜻이 아닙니다. 맞는 방법과 시술 간격 · 반응은 피부와 털 상태에 따라 다릅니다.",
    },
    featuresTitle: "레이저 제모에서 확인하는 4가지",
    features: [
      {
        title: "클라리티2 · 피부와 털에 맞춘 설정",
        text: "클라리티2는 755nm와 1064nm 파장을 사용합니다. 털의 색 · 굵기와 피부 톤, 최근 태닝 여부를 함께 살펴 적용할 설정을 정합니다.",
        image: "/images/official/clarity-poster.jpg",
        alt: "클라리티2 · 피부와 털에 맞춘 설정 · 제조사 공식 자료",
        fullFrame: false,
        mediaSize: { width: 1280, height: 768 },
        video: "/videos/official-clarity.mp4",
      },
      {
        title: "IntelliTrak · 조사 범위를 확인",
        text: "제조사의 핸드피스에는 움직임에 따른 조사 간격을 조절하는 IntelliTrak 기능이 적용되어 있습니다. 원하는 경계와 남길 부분을 먼저 확인하고 시술 범위를 정합니다.",
        image: "/images/official/clarity-tracking.png",
        alt: "IntelliTrak · 조사 범위를 확인 · 제조사 공식 자료",
        fullFrame: false,
        mediaSize: { width: 408, height: 464 },
        mediaEdges: ["#ffffff", "#ffffff"],
      },
      {
        title: "온도 표시와 피부 반응을 함께",
        text: "클라리티2는 시술 중 피부 표면 온도를 확인하는 기능을 제공합니다. 표시값만으로 판단하지 않고 열감과 피부 반응, 냉각 상태를 함께 살핍니다.",
        image: "/images/official/clarity-temperature.png",
        alt: "온도 표시와 피부 반응을 함께 · 제조사 공식 자료",
        fullFrame: false,
        mediaSize: { width: 841, height: 328 },
        mediaEdges: ["#f4f2ef", "#f4f2ef"],
      },
      {
        title: "다음 예약은 자라는 상태에 맞춰",
        text: "털이 얼마나 다시 자라는지, 자극이 남아 있는지 확인합니다. 미리 정한 횟수를 채우는 것보다 경과에 맞춰 계획을 조정합니다.",
        image: "/images/photos/clinic-6.webp",
        alt: "경과 진료 방문 안내에 사용하는 병원 복도 사진",
      },
    ],
    process: [
      {
        title: "1:1 상담",
        text: "부위와 원하는 범위를 정하고, 피부 톤 · 털 굵기 · 복용약 · 태닝 여부를 확인합니다.",
        image: doctorPhotos.consult,
        alt: "대표원장이 피부 분석 화면을 설명하는 상담 장면",
        fullFrame: true,
        coverPosition: "50% 50%",
      },
      {
        title: "마취 · 시술 전 준비",
        text: "면도 상태를 확인하고 피부를 정리합니다. 필요한 마취 · 냉각과 파장에 맞는 눈 보호구를 준비합니다.",
        image: "/images/photos/process-anesthesia.webp",
        alt: "필요한 시술 전 마취 크림을 바르는 참고 사진",
      },
      {
        title: "레이저 조사",
        text: "정한 범위에 레이저를 조사하며 불편감과 피부 반응을 확인합니다.",
        image: doctorPhotos.laser,
        alt: "보호 안경을 착용한 대표원장의 얼굴 부위 레이저 시술 장면",
        fullFrame: true,
        coverPosition: "35% 50%",
      },
      {
        title: "경과 확인",
        text: "붉어짐 등 피부 반응을 살피고, 면도와 보습 · 자외선 차단 방법을 안내합니다.",
        image: "/images/photos/process-check.webp",
        alt: "시술 후 피부 상태를 확인하는 모습",
      },
    ],
    principleImage: {
      src: "/images/principles/hair.webp?v=20261026b",
      alt: "털의 색소와 모낭에 레이저 에너지가 작용하는 원리를 보여 주는 입체 개념도",
      marks: [],
      layers: [],
      framed: true,
      note: "털의 멜라닌과 모낭에 에너지가 작용하는 개념을 표현했습니다. 실제 크기 · 깊이 · 빛의 색이나 시술 결과를 재현한 그림은 아닙니다.",
    },
  },
  "/removal/tattoo": {
    kind: "procedure",
    diagram: "pigment",
    principleLayout: "figure-first",
    showPrices: true,
    device: {
      name: "피코케이 레이저 문신제거",
      maker: "SPECLIPSE · PICO-K",
      image: "/images/photos/cat-hair-removal.webp",
      photo: "/images/official/pico-picok_img_6.png",
      text: "문신제거는 피부에 들어간 색소에 레이저를 조사해 입자를 잘게 나누고, 몸이 이를 처리하는 과정을 이용합니다. 색소의 색 · 양과 피부 상태에 따라 반응이 달라 완전한 제거를 보장하지는 않습니다. 눈썹과 아이라인은 눈과 가까운 만큼 시술 가능 여부와 보호 방법부터 확인합니다.",
      specs: [
        {
          label: "대상 평가",
          value: "반영구의 색 · 범위 · 피부 상태",
        },
        {
          label: "방식",
          value: "색소에 맞는 레이저 · 설정 선택",
        },
        {
          label: "눈가 시술",
          value: "적합한 눈 보호구 · 시행 가능 여부 확인",
        },
        {
          label: "경과",
          value: "색 변화와 피부 회복을 보며 계획 조정",
        },
      ],
      photoAlt: "스페클립스 PICO-K 제조사 공식 장비 이미지",
      mediaContain: true,
    },
    principle: [
      {
        title: "색소와 피부를 함께 확인",
        text: "시술받은 시기와 덧입힌 이력, 가려움이나 알레르기 반응을 확인합니다. 눈에 보이는 색만으로 안에 들어간 색소를 모두 알 수는 없습니다.",
      },
      {
        title: "색소에 맞는 빛을 선택",
        text: "색소마다 흡수하는 빛이 달라 레이저와 설정을 나누어 봅니다. 피부를 무리하게 손상시키지 않도록 범위와 반응을 확인합니다.",
      },
      {
        title: "회복과 색 변화를 기다림",
        text: "잘게 나뉜 색소는 몸의 처리 과정을 거치며 서서히 옅어질 수 있습니다. 피부 회복과 남은 색을 본 뒤 다음 시술을 정합니다.",
      },
    ],
    compare: {
      title: "레이저와 수술적 제거, 어떻게 다른가요?",
      lead: "레이저가 빛을 전달하는 시간과 색소를 다루는 방법은 어떤 차이가 있을까요?",
      columns: [
        {
          name: "나노초 레이저",
          maker: "짧은 시간의 빛 전달",
        },
        {
          name: "피코초 레이저",
          maker: "더 짧은 시간의 빛 전달",
        },
        {
          name: "수술적 제거",
          maker: "문신이 있는 피부 절제",
        },
      ],
      rows: [
        {
          label: "기본 방식",
          values: [
            "빛으로 색소 입자 분해",
            "빛으로 색소 입자 분해",
            "해당 피부를 제거한 뒤 봉합",
          ],
        },
        {
          label: "선택 기준",
          values: [
            "색소 · 피부 톤 · 사용 파장",
            "색소 · 피부 톤 · 사용 파장",
            "문신 크기 · 위치 · 흉터 고려",
          ],
        },
        {
          label: "한계",
          values: [
            "색소 잔여 · 색 변화 가능",
            "색소 잔여 · 색 변화 가능",
            "수술 흉터가 남을 수 있음",
          ],
        },
        {
          label: "회복 계획",
          values: [
            "피부 회복과 색 변화 확인",
            "피부 회복과 색 변화 확인",
            "상처와 봉합 부위 관리",
          ],
        },
      ],
      note: "※ 일반적인 방법 비교이며 실제 제공 시술 목록을 뜻하지 않습니다. 맞는 방법은 색소와 피부 상태에 따라 다르며, 효과 · 회복 기간에는 개인차가 있습니다.",
    },
    featuresTitle: "문신제거에서 먼저 확인하는 4가지",
    features: [
      {
        title: "피코케이 · 짧은 펄스로 색소에 작용",
        text: "피코케이는 1064nm · 532nm 파장을 사용하는 피코초 레이저입니다. 제조사 모식도는 색소에 에너지가 작용하는 원리를 설명하며, 색과 덧입힌 이력에 따라 반응은 달라집니다.",
        image: "/images/official/pico-picok_img_1_2.png",
        alt: "피코케이 · 짧은 펄스로 색소에 작용 · 제조사 공식 자료",
        fullFrame: false,
        mediaSize: { width: 549, height: 549 },
        mediaFit: "cover",
      },
      {
        title: "핸드피스와 조사 범위 선택",
        text: "제조사 핸드피스 자료를 참고해 조사 범위를 확인합니다. 장비 이름만으로 결과를 정하지 않고 현재 색과 피부 상태에 맞는 설정과 예상되는 한계를 설명합니다.",
        image: "/images/official/pico-picok_img_5.png",
        alt: "핸드피스와 조사 범위 선택 · 제조사 공식 자료",
        fullFrame: false,
        mediaSize: { width: 604, height: 355 },
        mediaFit: "contain",
        mediaEdges: ["#f4f2ef", "#f4f2ef"],
      },
      {
        title: "눈가에는 별도의 안전 판단",
        text: "아이라인은 눈을 감는 것만으로 보호되지 않습니다. 적합한 각막 보호구와 숙련된 시술 환경을 확보하기 어렵다면 시행을 미루거나 다른 의료진의 평가를 권합니다.",
        image: "/images/photos/clinic-2.webp",
        alt: "병원 대기 공간의 기존 사진",
      },
      {
        title: "피부 회복을 기다리는 계획",
        text: "빠르게 반복하기보다 상처와 남은 색을 확인합니다. 딱지 관리 · 보습 · 자외선 차단과 연락이 필요한 증상을 안내합니다.",
        image: "/images/photos/clinic-1.webp",
        alt: "경과 진료 방문 안내에 사용하는 병원 접수 공간 사진",
      },
    ],
    process: [
      {
        title: "1:1 상담",
        text: "반영구 이력과 피부 상태를 확인합니다. 눈가는 보호 방법과 시행 가능 여부부터 평가합니다.",
        image: doctorPhotos.consult,
        alt: "대표원장이 피부 분석 화면을 설명하는 상담 장면",
        fullFrame: true,
        coverPosition: "50% 50%",
      },
      {
        title: "마취 · 눈 보호",
        text: "필요한 마취를 진행합니다. 눈꺼풀 부위는 적합한 각막 보호구를 포함해 보호 계획을 확인한 경우에만 진행합니다.",
        image: "/images/photos/process-anesthesia.webp",
        alt: "시술 전 마취 크림을 바르는 참고 사진",
      },
      {
        title: "레이저 시술",
        text: "색소와 피부에 맞춰 범위를 정하고 반응을 확인합니다. 눈가의 안전 조건을 충족하지 못하면 시술하지 않습니다.",
        image: "/images/photos/special-5.webp",
        alt: "문신제거 상담에 사용하는 레이저 진료실 참고 사진",
      },
      {
        title: "경과 확인",
        text: "피부와 색 변화를 확인하고, 상처 관리와 다음 평가 시기를 안내합니다.",
        image: "/images/photos/process-check.webp",
        alt: "시술 후 피부 상태를 확인하는 모습",
      },
    ],
    principleImage: {
      src: "/images/principles/pigment.webp?v=20261026b",
      alt: "피부 속 문신 색소와 레이저 작용으로 잘게 나뉜 입자를 구분한 입체 개념도",
      marks: [],
      layers: [],
      framed: true,
      note: "색소 입자에 레이저가 작용하는 개념을 표현했습니다. 입자 크기 · 빛의 색은 이해를 돕기 위한 표현이며 실제 전후 결과가 아닙니다.",
    },
  },
};
