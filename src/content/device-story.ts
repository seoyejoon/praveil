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
    /** 제품 사진 뒤에 깔 배경색 (흰 배경 제품 컷이 어두운 카드에서 떠 보이지 않게) */
    mediaBg?: string;
    /** 같은 사진의 여러 크기 (srcset). 화면 폭에 맞는 파일을 받도록 */
    photoSrcSet?: string;
    /** 사진 아래 출처 · 설명 한 줄 */
    photoCaption?: string;
    /** 원본 크기. 작은 원본을 칸 크기에 맞춰 억지로 늘리지 않도록 상한으로 쓴다 */
    mediaSize?: { width: number; height: number };
    /** 제조사 브랜드 영상 (있으면 사진 대신) */
    /** edge: 영상 비율이 칸과 달라 남는 자리를 채울 색 (영상 가장자리 색) */
    film?: { src: string; poster: string; edge?: string; fadeFrom?: string };
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
    /** 자료 원본 비율 (예: "16 / 9"). 8:5 가 아니면 적어야 위아래 여백 없이 꽉 참 */
    figureAspect?: string;
    /** 출처 글을 아래 띠 대신 그림 위에 얹음 (그림이 칸을 끝까지 채움) */
    noteOverlay?: boolean;
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
    columns: { name: string; maker?: string; owned?: boolean; self?: boolean }[];
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
      /** 제품 사진 (배경 없는 제품 사진이 잘 맞음, 4:3 칸에 전체가 보이게) */
      image?: string;
      text: string;
      tags: string[];
    }[];
    /** 칸이 남을 때 채우는 안내 카드 */
    guide?: { title: string; text: string };
    note: string;
  };
  /** 특징 파트 제목 (없으면 "○○만의 특별함") */
  featuresTitle?: string;
  /** 특징 사진 칸의 가로세로 비율을 하나로 맞출 때 (예: 4 / 3). 없으면 사진마다 원본 비율 */
  featuresRatio?: number;
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
    /** 사진 아래에 보이는 설명 (AI 설명용 모식도 표시 등) */
    caption?: string;
    /** 같은 사진의 여러 크기 (srcset) */
    mediaSrcSet?: string;
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

// 사진을 바꿔도 이름이 같으면 브라우저가 30일 동안 옛 사진을 보여 줘, 첫 화면 사진에만 버전을 붙임
const photo = (name: string) =>
  `/images/photos/${name}.webp${name.startsWith("hero-") ? "?v=20261104" : ""}`;
const cs = (name: string) => `/images/coolsonic/${name}.webp`;

export const deviceStory: Record<string, DeviceStory> = {
  "/lifting/coolsonic": {
    showPrices: true,
    device: {
      name: "CoolSonic",
      maker: "ASTERASYS",
      image: "/images/equipment/hero/coolsonic.webp",
      film: {
        src: "/videos/coolsonic-brand.mp4",
        poster: cs("coolsonic-brand"),
        edge: "linear-gradient(#3e4748, #273132)",
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
        text: "열 자극을 받은 조직이 수축하고, 시간을 두고 콜라겐 재생을 유도합니다.",
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
      title: "쿨소닉, 다른 리프팅 장비와의 차이점?",
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
    // 네 칸의 크기를 4:3 으로 통일한다
    featuresRatio: 4 / 3,
    features: [
      {
        title: "1.5 · 3.0 · 4.5mm 깊이별 에너지 전달",
        text: "부위에 따라 3가지 어플리케이터를 바꿔가며, 필요한 깊이에 에너지를 전달합니다.",
        image: cs("coolsonic-applicator"),
        video: "/videos/coolsonic-applicator.mp4",
        alt: "쿨소닉 1.5mm · 3.0mm · 4.5mm 어플리케이터",
        mediaFit: "cover",
      },
      {
        title: "얼굴 굴곡에 밀착하는 펜형 어플리케이터",
        text: "쿨소닉의 어플리케이터는 굴곡진 피부에도 밀착하기 쉬운 펜형 구조입니다. 얼굴의 곡면을 따라 접촉하면서 초음파 에너지를 전달합니다.",
        image: cs("handpiece-model-a"),
        alt: "얼굴 곡면을 따라 쿨소닉 펜형 어플리케이터로 시술하는 모습",
        mediaFit: "cover",
      },
      {
        title: "쿨링으로 통증 부담을 줄이는 초음파 리프팅",
        text: "쿨소닉은 피부 표면을 냉각하면서 고강도 집속 초음파(HIFU)를 전달합니다. ACC 냉각 기술을 적용해 시술 중 열감과 통증 부담을 줄였습니다.",
        image: cs("coolsonic-cooling"),
        video: "/videos/coolsonic-cooling.mp4",
        alt: "쿨소닉 ACC 냉각 어플리케이터",
        mediaFit: "cover",
      },
      {
        title: "콜라겐과 탄성섬유의 재생 유도",
        text: "쿨소닉의 집속 초음파는 피부 속 목표 조직에 열응고점을 형성합니다. 이를 통해 콜라겐과 탄성섬유의 재생을 유도해 탄력과 리프팅 효과를 기대할 수 있습니다.",
        image: cs("principle"),
        alt: "피부 속 목표 조직에 열응고점을 만드는 쿨소닉 집속 초음파 원리",
        // 16:9 원본이라 좌우만 조금 잘린다 (위아래 여백 없이 다른 칸과 같은 크기)
        mediaFit: "cover",
      },
    ],
    process: [
      {
        title: "1:1 상담",
        text: "고민과 원하는 변화를 확인하고, 피부 두께와 처짐 방향을 진단해 부위별 깊이와 샷 수를 정합니다.",
        image: "/images/photos/retouched/web/coolsonic-consult.jpg",
        alt: "프라베일 상담실",
        fullFrame: true,
      },
      {
        title: "마취",
        text: "시술 부위에 마취 크림을 도포해 시술 중 불편감을 줄입니다.",
        image: photo("process-anesthesia-model-a"),
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
        image: "/images/photos/clinic-5.webp",
        alt: "프라베일 관리실",
      },
    ],
    video: {
      src: "/videos/hero-coolsonic.mp4",
      poster: photo("hero-coolsonic-model-a"),
      title: ["대표원장이,", "한 샷 한 샷 직접."],
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
      image: "/images/photos/cat-filler-model-a.webp",
      photo: "/images/photos/cat-filler-model-a.webp",
      photoAlt: "대표원장이 환자의 얼굴 부위에 필러를 주입하는 진료 장면",
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
          image: "/images/filler/products/neuramis-lineup.webp",
          tags: ["히알루론산", "국산"],
        },
        {
          // 확인 필요: 레나 영문 이름 · 제조사 · 국산/수입
          name: "레나",
          text: "히알루론산 필러입니다. 볼륨 · 이마 · 팔자 · 입술 · 애교 부위에 씁니다.",
          image: "/images/filler/products/lena-lineup.webp",
          tags: ["히알루론산"],
        },
        {
          name: "레스틸렌",
          en: "Restylane",
          maker: "갈더마 · 스웨덴",
          text: "스웨덴에서 개발된 히알루론산 필러로, 오랫동안 여러 나라에서 쓰여 온 제품입니다. 종류가 다양해 부위에 맞춰 고릅니다.",
          image: "/images/filler/products/restylane-lidocaine.webp",
          tags: ["히알루론산", "수입"],
        },
        {
          name: "벨로테로",
          en: "Belotero",
          maker: "멀츠 · 독일",
          text: "독일에서 만든 히알루론산 필러입니다. 제조사는 피부 속에 고르게 퍼지도록 만든 제품이라고 소개하며, 얕은 주름부터 볼륨까지 종류별로 나누어 씁니다.",
          image: "/images/filler/products/belotero-lineup.webp",
          tags: ["히알루론산", "수입"],
        },
        {
          // 확인 필요: 큐티필 영문 이름 · 제조사 · 국산/수입
          name: "큐티필",
          text: "히알루론산 필러입니다. 볼륨 · 이마 · 팔자 · 입술 · 애교 부위에 씁니다.",
          image: "/images/filler/products/qtfill-lineup.webp",
          tags: ["히알루론산"],
        },
      ],
      guide: {
        title: "어떤 제품이 맞을까요?",
        text: "부위마다 필요한 단단함과 퍼짐이 다릅니다. 피부 두께와 원하는 모습, 예산을 함께 보고 상담 때 정합니다.",
      },
      note: "※ 제조사 공개 자료를 바탕으로 한 일반 정보입니다. 어느 제품이 더 낫다는 뜻이 아니며, 효과와 유지 기간은 사람마다 다릅니다.",
    },
    featuresTitle: "프라베일 필러 시술의 특별함",
    featuresPlacement: "after-ba",
    features: [
      {
        title: "얼굴 전체를 보는 입체 디자인",
        text: "단순히 꺼진 부위만 단편적으로 보지 않고, 정면과 측면의 입체적인 비율을 함께 분석합니다. 얼굴 전체의 조화와 균형 안에서 볼륨을 채울 위치와 적정 용량을 설계하여 자연스러운 라인을 완성합니다.",
        image: "/images/filler/photos/point-01.webp",
        alt: "대표원장이 환자의 얼굴 비율을 살피는 진료 장면",
      },
      {
        title: "부위별 특성을 고려한 맞춤형 제품 선택",
        text: "이마 · 볼 · 입술 · 눈 밑은 피부의 두께와 표정 근육의 움직임이 모두 다릅니다. 각 부위의 해부학적 구조에 맞춰 필러가 안착할 피부 층을 구분하고, 입자의 크기와 단단함(점탄성)을 세밀하게 나누어 적용합니다.",
        image: "/images/photos/cat-filler-model-a.webp",
        alt: "대표원장이 얼굴 부위에 필러를 주입하는 모습",
      },
      {
        title: "필러 정품 · 정량 원칙",
        text: "안전성이 입증된 정품 필러만을 사용하며, 시술 전 환자분이 제품의 개봉 여부를 직접 확인하실 수 있도록 안내합니다. 상담 때 계획한 용량을 정확하게 지킵니다.",
        image: "/images/filler/photos/point-03.jpg",
        alt: "필러 제품 패키지 사진 (판매처 공개 자료)",
        mediaFit: "contain",
      },
      {
        title: "과하지 않게, 필요한 만큼",
        text: "처음부터 무리하게 많은 양을 주입하기보다, 자연스럽고 조화로운 선에서 시술을 마무리합니다. 초기 부기가 빠지고 필러가 자리를 잡은 뒤 경과를 함께 살피며, 필요한 경우에만 미세하게 보완하는 방향을 권해 드립니다.",
        image: "/images/photos/cat-main-petit-model-a.webp",
        alt: "대표원장이 얼굴 부위에 필러를 주입하는 모습",
      },
    ],
    process: [
      {
        title: "1:1 맞춤 상담 및 디자인",
        text: "고민 부위와 선호하시는 이미지를 면밀히 파악하고, 전체적인 얼굴 비율과 피부 두께를 분석하여 볼륨을 채울 정확한 위치와 적합한 물성의 제품, 적정 용량을 설계합니다.",
        image: "/images/filler/photos/process-01.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "부위별 맞춤 마취",
        text: "시술 부위를 깨끗하게 클렌징한 뒤 마취 크림을 도포합니다. 입술이나 눈가처럼 피부가 얇고 신경이 밀집된 예민한 부위는 통증을 줄이기 위해 한층 더 세심하고 충분하게 마취를 진행합니다.",
        image: "/images/filler/photos/process-02.webp",
        alt: "시술 부위에 마취 크림을 바르는 모습",
      },
      {
        title: "정교한 분할 주입 및 몰딩",
        text: "사전 디자인한 부위와 피부 층에 맞춰 필요한 용량만 소량씩 나누어 주입하며, 시술 중간중간 정면과 측면의 입체감 및 좌우 대칭을 확인하며 매끄럽게 라인을 다듬습니다.",
        image: "/images/photos/cat-main-petit-model-a.webp",
        alt: "대표원장이 얼굴 부위에 필러를 주입하는 모습",
      },
      {
        title: "직후 모양 확인 및 케어 안내",
        text: "시술 직후 거울을 통해 채워진 볼륨과 윤곽 라인을 환자분과 함께 확인하고, 필러가 안정적으로 자리 잡을 수 있도록 일상생활 주의사항과 경과 확인 일정을 상세히 안내해 드립니다.",
        image: "/images/filler/photos/process-04.webp",
        alt: "시술 후 환자와 함께 상태를 확인하는 진료 장면",
      },
    ],
  },
  "/lifting/coolphase": {
    diagram: "rf",
    principleLayout: "figure-first",
    showPrices: true,
    // 확인 필요: 6.78MHz (참고 자료 기준, 제조사 사양서로 재확인)
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
        edge: "linear-gradient(#494d4e, #8e9393)",
      },
      text: "쿨페이즈는 6.78MHz 모노폴라 고주파 에너지를 진피층 깊숙이 전달하는 탄력 리프팅 시술입니다. 독자적인 직접 접촉식 냉각 기술(DCC™)로 피부 표면을 보호하며 심부열을 균일하게 전달합니다. 개인마다 다른 피부 두께와 굴곡에 맞춰 샷 수와 에너지 레벨을 정교하게 설계하여 탄력부터 잔주름, 모공, 피부결까지 함께 살핍니다.",
      specs: [
        { label: "방식", value: "모노폴라 고주파 (6.78MHz RF)" },
        { label: "냉각 시스템", value: "DCC™ 직접 접촉식 연속 냉각" },
        { label: "통증 관리", value: "표면 급속 쿨링을 통한 통증 경감" },
        { label: "시술 부위", value: "얼굴 전체 · 턱선 · 눈가 · 목" },
      ],
    },
    principle: [
      {
        title: "밀착 에너지 조사",
        text: "핸드피스 팁을 피부에 고르게 밀착시켜 고주파 에너지를 조사합니다. 부위별 피부 두께와 얼굴 굴곡에 맞춰 섬세하게 조절합니다.",
      },
      {
        title: "표면 냉각 · 심부열 형성",
        text: "진피 속 조직의 저항으로 타이트닝에 필요한 열이 생기는 동시에, DCC 냉각 팁이 표피 온도를 낮춰 열감과 통증을 줄입니다.",
      },
      {
        title: "콜라겐 리모델링",
        text: "전달된 고주파 열이 콜라겐 섬유를 수축시키고 새로운 콜라겐 · 엘라스틴 재생을 도와, 시간을 두고 점차 탄탄한 피부 변화로 이어집니다. 변화의 정도와 시점은 사람마다 다릅니다.",
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
      title: "쿨페이즈, 다른 고주파 장비와 어떻게 다른가요?",
      lead: "상담에서 자주 비교되는 고주파 장비를 방식과 표면 보호 기준으로 정리했습니다.",
      columns: [
        { name: "쿨페이즈", self: true },
        { name: "써마지 FLX" },
        { name: "올리지오" },
        { name: "인모드" },
      ],
      rows: [
        {
          label: "제조사 · 국적",
          values: [
            "아스테라시스 · 한국",
            "솔타메디칼 · 미국",
            "원텍 · 한국",
            "인모드 · 이스라엘",
          ],
        },
        {
          label: "고주파 방식",
          values: [
            "모노폴라 RF (단극성)",
            "모노폴라 RF (단극성)",
            "모노폴라 RF (단극성)",
            "바이폴라 RF + 고전압 펄스(HVP)",
          ],
        },
        {
          label: "표면 보호 · 통증 제어",
          values: [
            "직접 접촉식 냉각 (DCC™)",
            "펄스형 냉각 스프레이 (Cryogen)",
            "접촉 냉각 + 쿨링 가스 분사",
            "실시간 온도 감지 센서 제어",
          ],
        },
        {
          label: "주로 보는 고민",
          values: [
            "탄력 · 잔주름 · 모공 · 피부결",
            "깊은 탄력 · 잔주름 · 피부 밀도",
            "표층 안면 탄력 · 잔주름",
            "이중턱 · 심부볼 윤곽 · 탄력",
          ],
        },
        {
          label: "시술 설계 기준",
          values: [
            "부위별 에너지 · 피부 두께 · 샷 수",
            "전용 팁 · 시술 부위 · 샷 수",
            "전용 팁 · 시술 부위 · 샷 수",
            "고민 부위별 핸드피스(FX · Forma) 선택",
          ],
        },
      ],
      note: "※ 각 장비의 일반적인 방식을 정리한 것으로, 어느 장비가 더 낫다는 뜻이 아닙니다. 프라베일이 모든 장비를 보유한다는 뜻은 아니며, 맞는 방법은 피부 상태와 고민에 따라 다릅니다. 통증 · 효과 · 유지 기간에는 개인차가 있습니다.",
    },
    featuresTitle: "쿨페이즈 리프팅의 4가지 특징",
    // 특징: 장면이 겹치지 않게 (원리 영상 · 장비 영상 · 팁 영상 · 시술 사진)
    features: [
      {
        title: "표면은 차갑게, 피부 속은 뜨겁게 (DCC™ 기술)",
        text: "접촉면 전체를 지속적으로 급속 냉각하는 DCC™ 기술이 표피를 보호하고 열 자극과 통증 부담을 낮춥니다. 표면 냉각을 이어 가며 시술해, 시술 중 부담을 덜고 한층 편안하게 받아보실 수 있습니다.",
        image: "/images/coolphase/principle-feature.webp",
        video: "/videos/coolphase-cooling.mp4",
        alt: "쿨페이즈 팁의 직접 접촉 냉각과 피부 속 고주파 열 전달을 보여 주는 제조사 원리 영상",
        mediaSize: { width: 1280, height: 960 },
      },
      {
        title: "진피 깊은 층까지 도달하는 6.78MHz 모노폴라 RF",
        text: "피부 표면에 머무르지 않고 진피층 깊숙이 심부열을 균일하게 전달하여 콜라겐 수축과 재생을 유도합니다. 처진 윤곽의 타이트닝부터 잔주름, 모공, 거친 피부결까지 함께 살핍니다.",
        image: "/images/coolphase/device.webp",
        video: "/videos/coolphase-device.mp4",
        alt: "쿨페이즈 장비와 핸드피스를 보여 주는 제조사 영상",
        mediaSize: { width: 1280, height: 720 },
      },
      {
        title: "피부 두께와 부위별 반응을 고려한 정밀 조절",
        text: "이마, 눈가, 볼, 턱선은 피부 두께와 굴곡, 열 민감도가 모두 다릅니다. 시술 중 피부 반응과 팁 밀착 상태를 면밀히 살피며, 대표원장이 부위별 특성에 맞춰 에너지 강도와 샷 수를 1:1로 섬세하게 설계 · 조절합니다.",
        image: "/images/coolphase/tip-loop.webp",
        video: "/videos/coolphase-tip-loop.mp4",
        alt: "쿨페이즈 얼굴용 팁(Face Tip)의 모양을 보여 주는 제조사 영상",
        mediaSize: { width: 960, height: 720 },
      },
      {
        title: "다운타임 부담을 덜어낸 빠른 일상 복귀",
        text: "시술 내내 이어지는 연속 냉각이 열감을 바로 가라앉혀 시술 후 붉은기나 붓기 부담이 적은 편입니다. 시술 직후 당일 세안과 메이크업이 가능해 바쁜 일상 중에도 부담 없이 받아보실 수 있습니다.",
        image: doctorPhotos.coolphase,
        alt: "대표원장이 쿨페이즈로 얼굴 부위를 시술하는 장면",
        fullFrame: true,
      },
    ],
    process: [
      {
        title: "맞춤 플랜 상담",
        text: "피부 탄력 고민과 개선을 원하시는 부위, 이전 시술 이력을 꼼꼼히 확인하여 개인별 맞춤 시술 계획을 세웁니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "클렌징 및 시술 준비",
        text: "피부 표면을 깨끗하게 정돈하고 유분기를 제거합니다. 통증 민감도와 피부 상태에 따라 맞춤 마취 또는 쿨링 사전 케어를 진행합니다.",
        image: "/images/photos/process-anesthesia-model-a.webp",
        alt: "피부 준비와 통증 관리를 설명하는 사진",
      },
      {
        title: "대표원장 1:1 맞춤 시술",
        text: "피부 표면을 냉각하면서 계획된 부위에 정밀하게 고주파 에너지를 전달합니다. 시술 중 실시간 피부 반응과 열감을 살피며 에너지와 샷 수를 조절합니다.",
        image: doctorPhotos.coolphase,
        alt: "대표원장이 쿨페이즈로 얼굴 부위를 시술하는 장면",
        fullFrame: true,
        coverPosition: "50% 50%",
      },
      {
        title: "진정 관리 및 주의사항 안내",
        text: "시술 직후 피부 상태를 꼼꼼히 확인하고 진정 케어를 진행합니다. 당일 세안과 보습 방법, 주의사항 및 권장 관리 주기를 안내해 드립니다.",
        image: "/images/photos/clinic-5.webp",
        alt: "프라베일 관리실",
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
      image: "/images/photos/cat-botox-model-a.webp",
      photo: "/images/photos/cat-botox-model-a.webp",
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
          image: "/images/page-assets/nulux-product.png",
          en: "Newlux",
          maker: "뉴메코(메디톡스 계열) · 국내",
          text: "국내에서 만든 보툴리눔 톡신 제제입니다. 제조 과정에서 동물 유래 성분을 쓰지 않는 공정으로 만든 제품으로 소개됩니다.",
          tags: ["국산"],
        },
        {
          name: "코어톡스",
          image: "/images/page-assets/coretox-product.png",
          en: "Coretox",
          maker: "메디톡스 · 국내",
          text: "국내에서 만든 보툴리눔 톡신 제제입니다. 신경독소 외의 복합단백질을 줄인 제품으로 소개됩니다.",
          tags: ["국산"],
        },
        {
          name: "제오민",
          image: "/images/page-assets/xeomin-product.webp",
          en: "Xeomin",
          maker: "멀츠 · 독일",
          text: "독일에서 만든 보툴리눔 톡신 제제입니다. 복합단백질을 제거한 제품으로 소개되며, 여러 나라에서 쓰이고 있습니다.",
          tags: ["수입"],
        },
      ],
      note: "※ 제조사 공개 자료를 바탕으로 한 일반 정보입니다. 제품마다 용량 단위가 달라 숫자만으로 비교하지 않으며, 어느 제품이 더 낫다는 뜻이 아닙니다. 효과와 유지 기간은 사람마다 다릅니다.",
    },
    featuresTitle: "프라베일 보톡스의 특별함",
    featuresPlacement: "after-ba",
    features: [
      {
        title: "동적 표정근과 비대칭 정밀 진단",
        text: "가만히 있는 무표정 상태만 보지 않습니다. 웃거나 찡그릴 때 쓰이는 표정 근육의 움직임과 양측 비대칭, 피부 두께를 면밀히 살펴 주입 포인트를 설정합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "개인별 이력과 부위 맞춤 제제 설계",
        text: "부위별 근육의 크기와 깊이, 이전 보톡스 시술 이력 및 내성 가능성을 꼼꼼히 고려합니다. 환자분의 상태에 알맞은 정품 제제와 용량을 1:1로 맞춤 설계합니다.",
        image: "/images/photos/signature-3.webp",
        alt: "주입 시술의 계획을 설명하기 위한 기존 사진",
      },
      {
        title: "어색함 없는 자연스러운 표정",
        text: "주름을 무조건 굳히는 시술은 표정을 부자연스럽게 만듭니다. 일상 표정의 자연스러움은 유지하면서 신경 쓰이는 잔주름과 과도한 근육 발달만 정교하게 다듬습니다.",
        image: "/images/photos/hero-consult.webp",
        alt: "프라베일 상담실",
        fullFrame: true,
      },
      {
        title: "안정적인 정착을 돕는 경과 케어",
        text: "시술 직후 무리하게 추가 주입하지 않고, 약물이 근육에 안정적으로 작용하는 1~2주간의 변화 과정을 살피며 불편감이나 비대칭 여부를 세심하게 확인합니다.",
        image: "/images/photos/clinic-5.webp",
        alt: "프라베일 관리실",
      },
    ],

    process: [
      {
        title: "1:1 상담",
        text: "고민 부위, 표정, 복용 약과 이전 보툴리눔 톡신 시술 이력을 확인합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "마취 · 통증 관리",
        text: "주사 부위를 확인하고 피부를 준비합니다. 통증 관리 방법은 부위에 맞춰 안내합니다.",
        image: "/images/photos/process-anesthesia-model-a.webp",
        alt: "피부 준비와 통증 관리를 설명하는 사진",
      },
      {
        title: "부위별 주사",
        text: "설계한 부위에 제품별 기준에 맞춰 주사합니다.",
        image: "/images/photos/cat-injection-model-a.webp",
        alt: "부위에 맞춰 주사하는 대표원장",
      },
      {
        title: "주의사항 · 경과 안내",
        text: "당일 주의사항과 변화 관찰 시점, 추가 진료가 필요한 증상을 안내합니다.",
        image: "/images/photos/clinic-5.webp",
        alt: "프라베일 관리실",
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
      image: "/images/retuo/product-intro.webp",
      photo: "/images/retuo/product-intro.webp",
      photoAlt: "리투오 제품 상자와 본품 (제조사 공식 자료)",
      mediaContain: true,
      mediaBg: "#f6f1ec",
      mediaSize: { width: 2520, height: 980 },
      text: "리투오는 기증된 인체 피부 조직에서 세포 성분을 온전히 제거하고 세포외기질(ECM) 성분만 남긴 무세포 동종진피(hADM) 제품입니다. 피부 탄력을 지지하는 콜라겐 등 핵심 성분을 바탕으로, 거칠어진 피부결과 잔주름, 저하된 탄력 밀도 고민을 가진 피부에 원료의 특성을 고려하여 섬세하게 적용합니다.",
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
          value: "피부의 세포외기질 (ECM) 성분",
        },
        {
          label: "시술 계획",
          value: "피부 두께 · 고민 부위 확인 후 1:1 결정",
        },
      ],
    },
    principle: [
      {
        title: "피부 상태와 고민 부위 분석",
        text: "거친 피부결, 미세한 잔주름, 꺼짐 정도를 면밀히 나누어 살피고, 과거 주사 시술 이력이나 피부 질환 유무를 꼼꼼히 확인합니다.",
      },
      {
        title: "무세포 동종진피(hADM) 성분 적용",
        text: "인체 조직 유래의 hADM 성분 특성을 충분히 설명해 드린 뒤, 환자분의 피부 두께와 컨디션에 알맞은 방식으로 적용합니다.",
      },
      {
        title: "조직 안정화 및 피부 변화 관찰",
        text: "시술 후 초기 반응이 가라앉는 과정을 살피며, 서서히 살아나는 피부결과 탄력 밀도의 변화를 함께 관찰합니다. ※ 변화의 속도와 유지 정도는 개인의 피부 상태에 따라 차이가 있습니다.",
      },
    ],
    compare: {
      title: "리투오, 다른 콜라겐부스터와 어떻게 다른가요?",
      lead: "프라베일에서 함께 상담하는 대표적인 콜라겐부스터 라인업을 재료별 특징에 따라 정리했습니다.",
      columns: [
        {
          name: "리투오",
          maker: "인체 유래 hADM",
          self: true,
        },
        {
          name: "쥬베룩",
          maker: "PDLLA · HA",
          owned: true,
        },
        {
          name: "울트라콜",
          maker: "PDO",
          owned: true,
        },
      ],
      rows: [
        {
          label: "주요 재료",
          values: [
            "무세포 동종진피 기질 성분",
            "PDLLA 미세입자 · 히알루론산",
            "PDO (폴리디옥사논) 성분",
          ],
        },
        {
          label: "주로 살피는 고민",
          values: [
            "피부결 · 잔주름 · 피부 밀도 · 탄력",
            "피부결 · 탄력 · 얕은 부위 꺼짐",
            "피부결 · 탄력 · 전반적인 볼륨",
          ],
        },
        {
          label: "상담 시 확인",
          values: [
            "피부 상태와 원료 · 제품 특성",
            "피부 두께 · 용량(cc) · 시술 범위",
            "입자 규격(100 · 200) · 용량 · 범위",
          ],
        },
        {
          label: "경과 관찰",
          values: [
            "초기 안정화 및 이후 피부 변화",
            "부기 · 엠보싱 및 서서히 나타나는 변화",
            "부기 · 엠보싱 및 서서히 나타나는 변화",
          ],
        },
      ],
      note: "※ 각 시술의 일반적인 특징을 정리한 것으로, 어느 시술이 더 낫다는 뜻이 아닙니다. 맞는 시술은 피부 상태와 고민에 따라 다르며, 효과 · 유지 기간은 사람마다 다릅니다.",
    },
    featuresTitle: "리투오의 특별함 4가지",
    features: [
      {
        title: "사람의 실제 피부 성분 그대로, 인체 조직 유래 hADM",
        text: "리투오는 인체 피부 조직에서 세포를 제거하고 얻은 무세포 동종진피(hADM)를 미세하게 가공한 성분입니다. 콜라겐, 엘라스틴, 히알루론산 등 실제 사람의 피부를 이루는 세포외기질(ECM) 성분을 담고 있어 생체 적합성이 높은 편입니다.",
        image: "/images/retuo/box-front.webp",
        alt: "리투오 제품 정면 (제조사 공식 자료)",
        fullFrame: false,
        mediaSize: { width: 1800, height: 878 },
        mediaEdges: ["#f6f1ec", "#f6f1ec"],
      },
      {
        title: "얇아진 피부 속 지지대를 바로 세우는 구조적 보강",
        text: "노화나 외부 자극으로 진피층의 밀도가 떨어지고 얇아진 피부는 일반적인 수분 관리만으로는 유지 기간이 아쉽기 쉽습니다. 리투오는 무너진 피부 속 지지대 환경을 구조적으로 보완하여 속부터 탄탄한 힘을 길러 줍니다.",
        image: "/images/retuo/ecm-diagram.png",
        alt: "리투오 세포외기질(ECM) 구성을 설명하는 제조사 공식 도식",
        fullFrame: false,
        mediaSize: { width: 1401, height: 692 },
        mediaEdges: ["#ffe8e4", "#ffe8e4"],
      },
      {
        title: "인공 합성물 부담을 줄인 생체 적합성",
        text: "인공적으로 합성된 물질에 민감하거나 쉽게 부담을 느끼는 피부에도 편안하게 작용합니다. 본래 내 피부 조직과 유사한 성분 기반이기 때문에 이물감에 대한 우려를 덜고 자연스러운 융화를 돕습니다.",
        image: "/images/retuo/skin-analysis.webp",
        alt: "프라베일 상담실",
        fullFrame: true,
      },
      {
        title: "진피 밀도 강화로 완성하는 잔주름 · 결 · 탄력 케어",
        text: "단순히 표면만 일시적으로 채우는 것이 아니라, 피부 속 진피 밀도를 촘촘히 채워 줍니다. 잔주름이 신경 쓰이는 부위나 거칠어진 피부결, 저하된 탄력 전반을 함께 살핍니다.",
        image: "/images/photos/clinic-5.webp",
        alt: "프라베일 관리실",
      },
    ],
    process: [
      {
        title: "1:1 맞춤 상담 및 피부 진단",
        text: "현재 피부결, 잔주름, 탄력 저하 등 고민 부위를 면밀히 살피고, 기대하시는 변화를 확인합니다. 또한 과거 시술 이력, 알레르기 및 특이 질환 여부를 꼼꼼히 체크하여 시술 계획을 세웁니다.",
        image: "/images/retuo/process-01-consult.webp",
        alt: "프라베일 상담실",
        fullFrame: true,
      },
      {
        title: "맞춤 마취 및 통증 관리",
        text: "시술 부위와 적용 방식(손주사 등)에 맞춰 적절하고 편안한 통증 관리(마취 크림 도포 등)를 진행하며, 시술 전 사용할 제품과 방식을 다시 한번 알기 쉽게 설명해 드립니다.",
        image: "/images/photos/process-anesthesia-model-a.webp",
        alt: "시술 준비와 통증 관리를 진행하는 장면",
      },
      {
        title: "정교한 성분 주입 및 피부 반응 관찰",
        text: "진찰을 통해 미리 계획된 부위와 방법대로 유효 성분을 진피층에 꼼꼼하게 주입하며, 시술 중 피부의 미세한 반응을 세심하게 살피며 진행합니다.",
        image: "/images/retuo/process-03-injection.webp",
        alt: "계획한 부위에 주입을 진행하는 대표원장",
        // 정사각 원본이라 4:5 카드에서 잘리지 않도록 전체를 보여 준다
        fullFrame: true,
      },
      {
        title: "직후 상태 확인 및 케어 안내",
        text: "시술 직후 피부 상태를 편안하게 정돈하고 확인한 뒤, 회복에 도움이 되는 홈케어 요령과 주의사항, 혹시 모를 이상 반응 대처법을 상세히 안내해 드립니다.",
        image: "/images/photos/clinic-5.webp",
        alt: "프라베일 관리실",
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
      image: "/images/photos/cat-skin-booster-model-a.webp",
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
          value: "부기 · 멍 · 주입 자국 등 개인차",
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
        text: "당일 부기만으로 결과를 판단하지 않고 피부 상태와 불편한 증상을 함께 보며 경과를 확인합니다.",
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
            "주입 자국 · 부기 · 멍 등",
            "부기 · 멍 · 혈관 관련 증상 등",
            "부기 · 결절 · 염증 등",
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
        image: "/images/photos/cat-main-skin-model-a.webp",
        alt: "피부 부위별 계획 설명용 기존 시술 사진",
      },
      {
        title: "반응을 보며 다음 단계 결정",
        text: "부기와 멍, 주입 자국을 확인하고 경과에 따라 다음 계획을 정합니다. 추가 시술은 필요성을 다시 살펴 결정합니다.",
        image: "/images/photos/signature-4-model-a.webp",
        alt: "피부 경과 관리 설명용 기존 진료 사진",
      },
    ],
    process: [
      {
        title: "상담 · 계획",
        text: "피부 상태와 이전 시술 이력을 살피고, 스킨부스터의 범위와 기대할 수 있는 변화를 함께 정합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "마취 · 준비",
        text: "제품과 부위에 따라 마취 방법을 정하고 피부를 깨끗하게 준비합니다. 마취제 알레르기가 있으면 미리 알려 주세요.",
        image: "/images/photos/process-anesthesia-model-a.webp",
        alt: "기존 마취 준비 사진",
      },
      {
        title: "시술",
        text: "제품의 사용방법에 맞춰 정한 부위를 시술합니다. 외용 제품은 주입용 제품과 구분해 사용합니다.",
        image: "/images/photos/cat-injection-model-a.webp",
        alt: "시술 과정 설명용 기존 주입 시술 사진",
        coverPosition: "43% 50%",
      },
      {
        title: "경과 확인",
        text: "시술 직후 상태를 확인하고, 제품별 주의사항과 다시 진료를 받아야 할 증상을 안내합니다.",
        image: "/images/photos/clinic-5.webp",
        alt: "프라베일 관리실",
      },
    ],
  },
  "/skin/booster/rejuran": {
    kind: "procedure",
    diagram: "booster",
    principleLayout: "figure-first",
    showPrices: true,
    device: {
      name: "리쥬란힐러",
      maker: "PHARMA RESEARCH",
      image: "/images/photos/cat-skin-booster-model-a.webp",
      photo: "/images/official/rejuran-product.png",
      photoAlt: "파마리서치 공식 리쥬란 제품 이미지",
      mediaContain: true,
      // 원본 327×570. 칸에 맞춰 늘리지 않는다
      mediaSize: { width: 327, height: 570 },
      text: "리쥬란힐러는 연어 유래 PN(폴리뉴클레오티드)을 주성분으로 하는 주입용 스킨부스터 제품입니다. 피부 진피층에 유효 성분을 미세하게 나누어 주입하여 흐트러진 피부결과 탄력을 정돈합니다. 시중에 판매되는 바르는 화장품(리쥬란 코스메틱)과는 구분되는 의료기기이므로, 시술 전 정품 여부와 패키지를 투명하게 확인시켜 드립니다.",
      specs: [
        { label: "주성분", value: "PN (폴리뉴클레오티드)" },
        { label: "제조사", value: "파마리서치 · 국내" },
        { label: "주입 층", value: "진피층" },
        { label: "용량", value: "2cc (가격표 기준)" },
      ],
    },
    principle: [
      {
        title: "피부 두께 및 부위별 상태 확인",
        text: "거친 피부결과 피부 두께, 눈가처럼 피부가 얇고 예민한 부위의 특성을 세심하게 살피고 주입 범위를 정밀하게 계획합니다.",
      },
      {
        title: "PN 성분의 미세 분할 주입",
        text: "숙련된 의료진이 전용 미세 바늘을 이용해 진피층의 정확한 깊이에 유효 성분을 균일하고 촘촘하게 나누어 주입합니다.",
      },
      {
        title: "피부 환경 관리 및 컨디션 확인",
        text: "제조사는 주입된 PN 성분이 피부 고유의 환경을 다스리는 데 도움을 준다고 안내합니다. 개인의 피부 컨디션에 따라 변화의 속도와 체감 정도는 차이가 날 수 있습니다.",
      },
    ],
    compare: {
      title: "리쥬란힐러, 다른 PN 제품과 어떻게 다른가요?",
      lead: "국내에서 쓰이는 PN(폴리뉴클레오티드) 계열 스킨부스터를 제품별로 정리했습니다.",
      columns: [
        { name: "리쥬란 힐러", self: true },
        { name: "리쥬란 아이" },
        { name: "비타란" },
        { name: "리즈네" },
        { name: "릴리이드 M" },
      ],
      rows: [
        {
          label: "주성분 · 구성",
          values: [
            "PN 단독 (오리지널)",
            "PN 단독 (점도 조절)",
            "PN 단독 (국내산 연어 DNA)",
            "PN 단독 (연어 유래)",
            "PN 단독 (시리즈 중 M 라인)",
          ],
        },
        {
          label: "주로 보는 부위 · 목적",
          values: [
            "얼굴 전체 · 피부 장벽과 속건조",
            "눈가 · 눈밑 등 얇은 피부",
            "얼굴 전체 · 눈가 (비타란 아이)",
            "얼굴 전체 · 진피 구조와 피부결",
            "얼굴 전체 · 여러 층을 나누어 주입",
          ],
        },
        {
          label: "통증 정도",
          values: [
            "따끔함이 큰 편",
            "따끔함이 있는 편",
            "따끔함이 있는 편",
            "따끔함이 있는 편",
            "따끔함이 있는 편",
          ],
        },
        {
          label: "제품 특징",
          values: [
            "임상 자료가 축적된 오리지널 라인",
            "얇은 피부에 맞춘 점도로 엠보싱 부담을 줄인 라인",
            "국내산 연어 DNA를 원료로 쓰는 PN 단독 제품",
            "연어 유래 PN 단독 성분으로 진피 구조를 보는 제품",
            "라인업에 따라 HA · 콜라겐 유도 성분과 조합할 수 있는 제품",
          ],
        },
      ],
      note: "※ 각 제품의 일반적인 특징을 정리한 것으로, 어느 제품이 더 낫다는 뜻이 아닙니다. 통증 정도와 회복 과정은 사람마다 다르고, 실제 사용할 제품은 피부 상태와 부위에 따라 상담 후 정합니다.",
    },
    featuresTitle: "리쥬란힐러의 4가지 특징",
    features: [
      {
        title: "생체 적합성이 높은 편인 PN(폴리뉴클레오티드) 성분",
        text: "연어 유래 DNA를 일정 규격으로 정제한 PN 성분을 사용합니다. 제조사는 PN이 피부 고유의 환경과 자생력을 다스리는 데 도움을 준다고 안내합니다.",
        image: "/images/official/rejuran-section2_img02.jpg",
        alt: "리쥬란 · PN 성분을 확인 · 제조사 공식 자료",
        fullFrame: false,
        mediaSize: { width: 720, height: 232 },
        mediaEdges: ["#0090a2", "#014b6b"],
      },
      {
        title: "얇아진 진피층의 밀도와 탄력",
        text: "표면적인 보습에서 멈추지 않고 피부 속 진피층에 직접 유효 성분을 전달해, 거친 피부결을 정돈하고 탄력 밀도를 함께 채워 줍니다.",
        image: "/images/page-assets/praveil-pn-dermis-v1.webp",
        caption: "진피 구조를 단순화한 AI 설명용 모식도",
        alt: "피부 관리 설명용 기존 시술 사진",
      },
      {
        title: "부위별 맞춤 주입",
        text: "피부 두께와 표정 움직임, 잔주름의 깊이가 다른 부위별 특성을 고려하여 적정한 깊이와 간격으로 고르게 주입합니다.",
        image: "/images/photos/signature-4-model-a.webp",
        alt: "부위별 주입 계획 설명용 기존 진료 사진",
      },
      {
        title: "일시적 완화가 아닌 피부 컨디션 관리",
        text: "피부 스스로의 환경을 되찾도록 돕는 것을 목표로 하며, 시간이 지나며 나타나는 컨디션 변화를 경과 진료에서 함께 확인합니다. 변화의 속도와 체감 정도는 사람마다 다릅니다.",
        image: "/images/photos/cat-skin-booster-model-a.webp",
        alt: "스킨부스터 상담 설명용 기존 진료 사진",
      },
    ],
    process: [
      {
        title: "1:1 맞춤 상담 및 계획",
        text: "현재 피부 컨디션, 이전 시술 이력, 최근 필러 시술 여부 등을 꼼꼼히 확인하고 리쥬란힐러의 적용 범위와 용량을 설계합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "마취 크림 도포 및 준비",
        text: "시술 부위를 깨끗하게 정돈한 뒤 마취 크림을 도포하여 편안한 상태를 만듭니다. 평소 마취제 알레르기가 있으신 경우 사전에 미리 알려 주세요.",
        image: "/images/photos/process-anesthesia-model-a.webp",
        alt: "기존 마취 준비 사진",
      },
      {
        title: "정품 확인 및 정교한 주입",
        text: "시술 직전 정품 패키지를 확인시켜 드린 후, 계획된 부위에 미세한 양씩 균일하게 나누어 주입합니다.",
        image: "/images/photos/cat-injection-model-a.webp",
        alt: "시술 과정 설명용 기존 주입 시술 사진",
        coverPosition: "43% 50%",
      },
      {
        title: "직후 경과 확인 및 홈케어 안내",
        text: "시술 직후 엠보싱과 부기 상태를 함께 확인하고, 회복에 도움이 되는 세안 · 화장 시점과 주의사항을 안내해 드립니다.",
        image: "/images/photos/clinic-5.webp",
        alt: "프라베일 관리실",
      },
    ],
  },
  // 확인 필요: 엑소좀 제품(ISCE) 공식 사진 · 제조사 · 허가 사항 (지금은 기존 진료 사진)
  "/skin/booster/exosome": {
    kind: "procedure",
    diagram: "booster",
    principleLayout: "figure-first",
    // 확인 필요: 엑소좀 원리 그림 (리쥬란 PN 그림을 쓰지 않도록 임시로 진료 사진)
    principleImage: {
      src: "/images/photos/cat-skin-booster-model-a.webp",
      alt: "스킨부스터 시술 설명용 기존 진료 사진",
      marks: [],
      layers: [],
    },
    showPrices: true,
    device: {
      name: "엑소좀",
      maker: "ISCE EXOSOME",
      image: "/images/official/isce-set-product.jpg",
      photo: "/images/official/isce-set-product.jpg",
      photoAlt: "ISCE 엑소좀 제품 구성 (제조사 공식 자료)",
      mediaContain: true,
      mediaBg: "#ffffff",
      mediaSize: { width: 400, height: 400 },
      text: "엑소좀은 세포가 내보내는 아주 작은 주머니(엑소좀)에서 얻은 성분을 활용한 스킨부스터입니다. 프라베일은 ISCE 엑소좀을 사용하며, 피부가 예민해지고 컨디션이 떨어졌을 때 단독으로 또는 다른 시술과 함께 계획합니다.",
      specs: [
        { label: "제품", value: "ISCE 엑소좀" },
        { label: "주로 살피는 고민", value: "예민함 · 지친 피부 컨디션" },
        { label: "함께 받는 시술", value: "피부 상태에 따라 상담" },
        { label: "횟수", value: "1회 · 3회 (가격표 기준)" },
      ],
    },
    principle: [
      {
        title: "피부 컨디션 확인",
        text: "예민도와 붉은기, 최근 받은 레이저 · 시술을 먼저 확인합니다.",
      },
      {
        title: "엑소좀 성분 전달",
        text: "정한 범위에 엑소좀 성분을 고르게 전달합니다.",
      },
      {
        title: "피부 컨디션 관리",
        text: "지친 피부 컨디션 관리를 돕는 것을 목표로 하며, 변화의 정도는 사람마다 다릅니다.",
      },
    ],
    compare: {
      title: "엑소좀, 제품별로 어떻게 다른가요?",
      lead: "상담에서 함께 비교하는 엑소좀 제품의 성분과 사용 목적을 정리했습니다. 프라베일은 ISCE 엑소좀을 사용합니다.",
      columns: [
        { name: "ISCE 엑소좀", maker: "더마몰", self: true },
        { name: "ASCE+", maker: "엑소코바이오" },
        { name: "셀엑소좀", maker: "Cellexosome" },
      ],
      rows: [
        {
          label: "주요 성분 · 출처",
          values: [
            "인체표피줄기세포 배양액(EPC-CM) · 유산균 유래 엑소좀 · 성장인자(hGH · VEGF)",
            "인체지방줄기세포 배양액 · 동결건조 엑소좀 · 히알루론산 · 아미노산 · 레티놀",
            "인체지방줄기세포 배양액 · 식물(인삼) 유래 엑소좀 · PDRN 배합",
          ],
        },
        {
          label: "주로 보는 목적",
          values: [
            "기저막(DEJ)과 표피 층 · 항노화와 피부 장벽",
            "트러블 · 여드름 · 모공과 항노화",
            "피부 재생 · 색소 침착 · 손상된 장벽 회복",
          ],
        },
        {
          label: "시술 방법",
          values: [
            "MTS · 기기 침투 · 도포",
            "MTS · 기기 침투 · 도포",
            "MTS · 기기 침투 · 도포",
          ],
        },
        {
          label: "제품 특징",
          values: [
            "피부줄기세포 배양액 기술을 적용한 제품으로, 피부 결합력과 탄력을 함께 살핍니다.",
            "임상 자료가 비교적 많이 쌓인 4세대 엑소좀으로, 콜라겐 · 엘라스틴을 함께 살핍니다.",
            "PDRN(연어 성분)이 함께 배합되어 있고, 식물성 엑소좀의 항산화 특성을 함께 살핍니다.",
          ],
        },
      ],
      note: "※ 각 제품의 일반적인 특징을 제조사 자료를 바탕으로 정리한 것으로, 어느 제품이 더 낫다는 뜻이 아닙니다. 맞는 제품은 피부 상태와 고민에 따라 다르며, 효과 · 유지 기간은 사람마다 다릅니다.",
    },
    featuresTitle: "ISCE 엑소좀의 4가지 특징",
    features: [
      {
        title: "인체표피줄기세포 배양액 기반",
        text: "지방이나 골수 등 다른 부위 유래 줄기세포와 달리, 피부 표면과 가장 유사한 인체표피줄기세포 배양액(EPC-CM)을 기반으로 합니다. 제조사는 이 구성이 피부 세포의 자생력과 성분 흡수를 돕는다고 안내합니다.",
        image: "/images/page-assets/isce-1-product.png",
        mediaFit: "contain",
        mediaSize: { width: 400, height: 400 },
        alt: "피부 상태 확인 설명용 기존 진료실 사진",
      },
      {
        title: "피부 코어인 기저막(DEJ)을 함께 살핌",
        text: "표피와 진피를 연결하는 기저막(DEJ, Dermal-Epidermal Junction) 구조를 함께 살핍니다. 제조사는 이 부위의 결합을 돕는 것을 제품의 목적으로 설명하며, 느슨해진 피부와 탄력 변화를 경과 진료에서 확인합니다.",
        image: "/images/page-assets/praveil-isce-dej-v1.webp",
        caption: "표피 · 진피 경계를 단순화한 AI 설명용 모식도",
        alt: "시술 계획 설명용 기존 시술 사진",
      },
      {
        title: "복합 엑소좀 성분 구성",
        text: "인체표피 유래 엑소좀뿐만 아니라, 피부 면역과 진정에 도움을 준다고 안내되는 유산균 유래 엑소좀과 성장인자(hGH · VEGF 등)가 함께 배합되어 있습니다.",
        image: "/images/official/isce-set-product.jpg",
        alt: "ISCE 엑소좀 제품 구성 (제조사 공식 자료)",
        mediaFit: "contain",
        mediaSize: { width: 400, height: 400 },
      },
      {
        title: "피부 장벽과 전반적인 노화 징후",
        text: "얇고 예민해진 피부의 장벽을 채우는 것을 목적으로 하는 4세대 스킨부스터입니다. 잔주름 · 거친 피부결 · 건조함처럼 함께 나타나는 노화 징후를 나누어 살피며, 변화의 정도와 시점은 사람마다 다릅니다.",
        image: "/images/page-assets/praveil-acne-barrier-v1.webp",
        caption: "피부 구조를 단순화한 AI 설명용 모식도",
        alt: "피부 경과 관리 설명용 기존 진료 사진",
      },
    ],
    process: [
      {
        title: "상담 · 계획",
        text: "피부 상태와 최근 받은 시술을 살피고, 엑소좀을 단독으로 할지 함께 할지 정합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "마취 · 준비",
        text: "필요하면 마취 크림을 바르고 피부를 깨끗하게 준비합니다.",
        image: "/images/photos/process-anesthesia-model-a.webp",
        alt: "기존 마취 준비 사진",
      },
      {
        title: "시술",
        text: "정한 범위에 엑소좀 성분을 고르게 전달합니다.",
        image: "/images/photos/cat-injection-model-a.webp",
        alt: "시술 과정 설명용 기존 주입 시술 사진",
        coverPosition: "43% 50%",
      },
      {
        title: "경과 확인",
        text: "시술 직후 피부 반응을 확인하고, 세안 · 화장 시점과 주의사항을 안내합니다.",
        image: "/images/photos/clinic-5.webp",
        alt: "프라베일 관리실",
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
          value: "부기 · 멍 · 결절 · 염증 등",
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
        text: "시술 직후 부기와 시간이 지나며 보이는 변화를 구분하고, 결절감이나 염증 반응이 없는지 함께 확인합니다.",
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
            "부기 · 덩어리감 · 피부 상태",
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
        text: "부기가 빠지는 과정과 오래가는 결절감을 구분합니다. 열감이나 통증이 동반되면 다음 시술보다 진찰을 먼저 진행합니다.",
        image: "/images/photos/signature-3.webp",
        alt: "경과 확인 설명용 기존 피부 시술 사진",
      },
    ],
    process: [
      {
        title: "상담 · 제품 확인",
        text: "고민과 피부 두께, 이전 주입 이력을 확인하고 사용할 재료와 범위를 정합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "마취 · 준비",
        text: "제품과 부위에 맞는 마취 방법을 정하고, 제품의 사용방법에 따라 시술을 준비합니다.",
        image: "/images/photos/process-anesthesia-model-a.webp",
        alt: "기존 마취 준비 사진",
      },
      {
        title: "시술",
        text: "제품별 사용목적과 주입 방법을 확인해 정한 부위를 시술합니다. 양과 분포는 피부 상태에 맞춰 조절합니다.",
        image: "/images/photos/cat-injection-model-a.webp",
        alt: "시술 과정 설명용 기존 주입 시술 사진",
        coverPosition: "43% 50%",
      },
      {
        title: "경과 확인",
        text: "부기와 멍, 덩어리감이나 염증 증상을 확인합니다. 마사지를 포함한 관리는 제품별로 따로 안내합니다.",
        image: "/images/photos/clinic-5.webp",
        alt: "프라베일 관리실",
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
  "/skin/collagen/juvelook": {
    kind: "procedure",
    diagram: "collagen",
    principleLayout: "figure-first",
    showPrices: true,
    device: {
      name: "쥬베룩",
      maker: "JUVELOOK",
      image: "/images/official/juvelook-skin-30mg.png",
      photo: "/images/official/juvelook-skin-30mg.png",
      mediaBg: "#ffffff",
      mediaSize: { width: 298, height: 681 },
      photoAlt: "쥬베룩 공식 제품 바이알",
      mediaContain: true,
      text: "쥬베룩은 자가 콜라겐 생성을 유도하는 고분자 PDLLA(폴리-D,L-락트산) 미세입자와 수분감을 주는 히알루론산(HA) 성분이 결합된 4세대 콜라겐부스터입니다. 일시적으로 외부 물질을 채워 넣는 일반 필러와 달리, 피부 속 세포를 자극해 스스로 콜라겐을 만들도록 돕는 방식이라 시간이 흐를수록 서서히 차오르는 탄력을 확인하게 됩니다. 변화의 정도와 시점은 사람마다 다릅니다.",
      specs: [
        { label: "성분", value: "PDLLA · 히알루론산" },
        { label: "분류", value: "조직수복용재료 · 의료기기" },
        { label: "주입 층", value: "진피층" },
        { label: "용량", value: "2cc · 3cc · 4cc" },
      ],
    },
    principleImage: {
      src: "/images/official/juvelook-structure.png",
      alt: "쥬베룩 공식 PDLLA 미세입자 구조 이미지",
      marks: [],
      layers: [],
      framed: false,
      note: "JUVELOOK · PDLLA 미세입자를 나타낸 제조사 이미지입니다. 실제 입자의 크기와는 다릅니다.",
    },
    principle: [
      {
        title: "개인별 피부 두께 및 고민 부위 분석",
        text: "거친 피부결, 나이 들어 보이는 탄력 저하, 눈에 띄는 나비존 모공이나 얕은 꺼짐 등 환자분의 주된 피부 고민을 면밀히 파악합니다. 사람마다 얼굴 부위별 피부 두께와 탄성도가 모두 다르므로, 시술 전 이를 정밀하게 진단하는 것이 쥬베룩 시술의 첫걸음입니다.",
      },
      {
        title: "PDLLA와 히알루론산(HA)의 진피층 분할 주입",
        text: "자가 콜라겐 생성을 유도하는 고분자 PDLLA 미세입자와 수분감을 주는 히알루론산(HA)이 함께 배합된 제품을 사용합니다. 한재웅 대표원장의 숙련된 노하우를 바탕으로, 약물이 뭉치거나 손실되지 않도록 진피층의 계획한 깊이에 고르고 촘촘하게 나누어 주입합니다.",
      },
      {
        title: "점진적인 콜라겐 생성 및 세심한 경과 관찰",
        text: "진피층에 안착한 쥬베룩 입자가 시간이 지날수록 세포를 자극하여 자가 콜라겐과 탄력 섬유를 서서히 만들어냅니다. 초기 안정화 과정을 거치며 단단한 덩어리감(결절)이 생기지 않는지, 피부 밀도가 부드럽게 차오르는지 세심하게 관찰하고 안내해 드립니다. 변화의 속도와 정도는 사람마다 다릅니다.",
      },
    ],
    compare: {
      title: "쥬베룩, 다른 콜라겐부스터와 어떻게 다른가요?",
      lead: "상담에서 함께 비교하는 콜라겐부스터를 재료와 작용 방식으로 정리했습니다.",
      columns: [
        { name: "쥬베룩 (스킨)", maker: "PDLLA · HA", self: true },
        { name: "스컬트라", maker: "PLLA" },
        { name: "울트라콜 100", maker: "PDO" },
        { name: "리투오", maker: "인체조직 유래" },
      ],
      rows: [
        {
          label: "주성분",
          values: [
            "PDLLA · 히알루론산",
            "PLLA",
            "PDO (녹는 실 성분)",
            "무세포 동종진피(hADM)",
          ],
        },
        {
          label: "작용 방식",
          values: [
            "콜라겐 생성 유도",
            "콜라겐 생성 유도",
            "콜라겐 생성 유도",
            "진피 성분을 직접 보충",
          ],
        },
        {
          label: "주로 보는 고민",
          values: [
            "모공 · 흉터 · 피부결",
            "깊게 꺼진 볼륨",
            "눈가 잔주름 · 피부결",
            "진피 밀도 · 탄력",
          ],
        },
        {
          label: "결절 보고",
          values: [
            "매우 낮은 편",
            "보통 ~ 높은 편",
            "거의 보고되지 않는 편",
            "보고된 바가 드묾",
          ],
        },
        {
          label: "변화가 보이는 시기",
          values: [
            "3~4주 후부터 서서히",
            "4~6주 후부터 서서히",
            "2~3주 후부터 비교적 빠르게",
            "비교적 빠르게 체감",
          ],
        },
      ],
      note: "※ 각 제품의 일반적인 특징을 정리한 것으로, 어느 제품이 더 낫다는 뜻이 아닙니다. 결절 등 이상 반응은 빈도가 낮아도 생길 수 있고, 변화가 보이는 시기와 유지 기간은 사람마다 다릅니다. 실제 사용할 제품과 양은 피부 상태와 부위를 보고 상담에서 정합니다.",
    },
    featuresTitle: "쥬베룩 스킨부스터의 특징 4가지",
    features: [
      {
        title: "자가 콜라겐 · 엘라스틴 생성 유도",
        text: "인위적인 성분을 채워 넣는 방식이 아니라, 고분자 PLA(PDLLA) 성분이 피부 속에서 서서히 분해되며 세포를 자극합니다. 피부 스스로 콜라겐과 탄력 섬유(엘라스틴)를 만들어내도록 유도하는 방식이며, 변화는 시간을 두고 서서히 나타납니다.",
        image: "/images/photos/cat-main-skin-model-a.webp",
        alt: "주입 범위 설명용 기존 시술 사진",
      },
      {
        title: "나비존 모공과 패인 흉터, 잔주름",
        text: "입자가 작고 부드러워 피부 얕은 층(진피층)에 촘촘하게 시술할 수 있습니다. 노화로 늘어난 나비존 모공과 눈가 · 입가의 잔주름, 패인 여드름 흉터 부위가 차오르도록 돕는 것을 목적으로 합니다.",
        image: "/images/photos/cat-skin-booster-model-a.webp",
        alt: "함께 하는 시술 설명용 기존 진료 사진",
      },
      {
        title: "망상(다공성) 구조로 결절 위험을 낮춤",
        text: "PLLA 제품과 달리 쥬베룩은 입자 내부가 둥글고 구멍이 뚫린 망상 구조로 이루어져 있습니다. 제조사는 이 구조가 피부 속에서 뭉치는 결절(단단한 알갱이)이 생길 확률을 낮춘다고 설명합니다. 빈도가 낮아도 생길 수 있어 경과를 함께 확인합니다.",
        image: "/images/official/juvelook-structure.png",
        alt: "쥬베룩 · PDLLA 미세입자 구조 · 제조사 공식 자료",
        fullFrame: false,
        mediaSize: { width: 800, height: 800 },
        mediaFit: "cover",
      },
      {
        title: "히알루론산(HA) 배합으로 속건조까지",
        text: "콜라겐 생성 성분 외에 물광 주사의 주성분인 히알루론산이 함께 배합되어 있습니다. 콜라겐이 만들어지기까지 걸리는 시간(약 3~4주) 동안 히알루론산이 수분을 끌어당겨, 시술 초기부터 속건조와 피부결의 변화를 먼저 느끼는 경우가 많습니다. 체감 정도는 사람마다 다릅니다.",
        image: "/images/photos/signature-3.webp",
        alt: "경과 확인 설명용 기존 피부 시술 사진",
      },
    ],
    process: [
      {
        title: "1:1 맞춤 상담 및 계획",
        text: "피부 고민의 양상, 환자분의 피부 두께, 이전 주입 시술 이력 등을 꼼꼼히 살피고, 이에 맞는 적정 용량(cc)과 시술 범위를 세밀하게 설계합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "마취 크림 도포 및 준비",
        text: "시술 부위를 깨끗하게 정돈한 뒤 마취 크림을 도포하여 편안한 상태를 만들고, 사용할 쥬베룩 제품의 상태를 사전에 확인시켜 드립니다.",
        image: "/images/photos/process-anesthesia-model-a.webp",
        alt: "기존 마취 준비 사진",
      },
      {
        title: "정교한 진피층 분할 주입",
        text: "숙련된 노하우를 바탕으로 계획된 부위의 진피층에 쥬베룩 성분을 고르고 촘촘하게 나누어 주입합니다.",
        image: "/images/photos/cat-injection-model-a.webp",
        alt: "시술 과정 설명용 기존 주입 시술 사진",
      },
      {
        title: "직후 경과 확인 및 홈케어 안내",
        text: "시술 직후 부기나 엠보싱 상태를 편안하게 정돈하고 확인한 뒤, 콜라겐 생성을 돕기 위한 마사지 요령과 일상생활 주의사항을 안내해 드립니다.",
        image: "/images/photos/clinic-5.webp",
        alt: "프라베일 관리실",
      },
    ],
  },
  "/skin/collagen/ultracol": {
    kind: "procedure",
    diagram: "collagen",
    principleLayout: "figure-first",
    showPrices: true,
    device: {
      name: "울트라콜",
      maker: "ULTRACOL",
      image: "/images/official/ultracol-100-200-vials.webp",
      photo: "/images/official/ultracol-100-200-vials.webp",
      photoAlt: "울트라콜 100 · 200 제품 (제조사 공식 자료)",
      mediaContain: true,
      mediaBg: "#f6f1ec",
      mediaSize: { width: 1254, height: 1400 },
      text: `울트라콜은 오랜 기간 의료용 봉합사(녹는 실)로 쓰여 온 PDO(폴리디옥사논) 성분을 미세 구형 입자로 가공하여 사용하는 콜라겐부스터입니다.

프라베일에서는 환자분의 피부 두께와 고민 부위에 맞춰 섬세한 관리가 가능한 울트라콜 100과 볼륨감을 함께 보완하는 울트라콜 200(볼륨부스터) 두 가지 라인업으로 안내해 드리고 있습니다. 일률적인 방식이 아니라, 시술 부위의 특성과 피부 상태에 맞춰 알맞은 규격과 용량을 1:1 맞춤으로 설계합니다.`,
      specs: [
        { label: "성분", value: "PDO (폴리디옥사논)" },
        { label: "분류", value: "의료기기" },
        { label: "제품", value: "울트라콜100 · 울트라콜200" },
        { label: "용량", value: "2cc ~ 6cc (제품별)" },
      ],
    },
    // 원리 그림: 콜라겐부스터 공통 그림을 쓰고, 설명만 울트라콜에 맞춤
    principleImage: {
      src: "/images/principles/collagen.webp",
      alt: "조직 유래 기질과 합성 고분자 입자를 나란히 구분한 콜라겐부스터 개념도. 울트라콜의 PDO는 합성 고분자 쪽입니다.",
      marks: [],
      layers: [],
      note: "울트라콜의 PDO는 오른쪽 '합성 고분자 입자'에 해당합니다. 재료의 차이를 보여 드리기 위한 그림이며, 실제 크기 · 깊이와는 다릅니다.",
    },
    principle: [
      {
        title: "피부 두께 및 고민 부위 분석",
        text: "푸석해진 피부결, 저하된 탄력, 눈가나 볼 등의 볼륨 꺼짐 고민을 꼼꼼히 살피고 환자분의 개인별 피부 두께와 상태를 정밀하게 분석합니다.",
      },
      {
        title: "맞춤 규격(100 · 200) 선택 및 주입",
        text: "피부 상태와 시술 부위에 맞는 규격(울트라콜 100 또는 볼륨부스터 울트라콜 200)을 선택하고, 적정 용량을 정밀하게 나누어 주입합니다. 울트라콜의 주성분인 PDO는 몸에서 서서히 분해되는 합성 고분자 입자로, 제조사는 진피층의 자가 콜라겐 생성을 유도한다고 안내합니다.",
      },
      {
        title: "점진적인 콜라겐 생성 및 경과 관찰",
        text: "주입된 PDO 입자를 바탕으로 시간이 지날수록 피부 속에서 자가 콜라겐 생성이 서서히 유도됩니다. 초기 안정화 과정을 거치며 덩어리감 없이 매끄럽게 탄력이 차오르는지 세심하게 관찰합니다. 변화의 속도와 체감 정도는 개인의 피부 컨디션에 따라 차이가 있을 수 있습니다.",
      },
    ],
    compare: {
      title: "울트라콜, 다른 콜라겐부스터와 어떻게 다른가요?",
      lead: "상담에서 함께 비교하는 콜라겐부스터를 규격과 목적으로 정리했습니다.",
      columns: [
        { name: "울트라콜 100", maker: "미세 구형 PDO", self: true },
        { name: "울트라콜 200", maker: "고농축 구형 PDO" },
        { name: "쥬베룩 (스킨)", maker: "PDLLA · HA" },
        { name: "쥬베룩 볼륨", maker: "고농축 PDLLA · HA" },
      ],
      rows: [
        {
          label: "주성분",
          values: [
            "미세 구형 PDO (녹는 실)",
            "고농축 구형 PDO",
            "PDLLA · 히알루론산",
            "고농축 PDLLA · 히알루론산",
          ],
        },
        {
          label: "주로 보는 고민",
          values: [
            "눈가 잔주름 · 피부 톤",
            "미세한 볼륨 꺼짐",
            "모공 · 흉터 · 거친 피부결",
            "볼 꺼짐 · 깊은 주름 · 볼륨",
          ],
        },
        {
          label: "주로 보는 부위",
          values: [
            "눈밑 · 눈가 · 얇은 피부",
            "옆볼 · 앞볼 · 팔자주름",
            "얼굴 전체 (진피층)",
            "얼굴 전체 (지방층 위쪽)",
          ],
        },
        {
          label: "결절 보고",
          values: [
            "보고가 드문 편",
            "매우 낮은 편",
            "낮은 편",
            "보통 (주입 숙련도 영향)",
          ],
        },
        {
          label: "제품 특징",
          values: [
            "눈밑 틴달 현상(푸르게 비침) 부담이 적고, 피부 톤 변화를 함께 살핍니다.",
            "녹는 실 성분으로 리프팅과 타이트닝을 함께 살핍니다.",
            "다공성 입자로 결절 부담을 줄이고, 히알루론산으로 속건조를 함께 살핍니다.",
            "자가 콜라겐으로 볼륨을 서서히 채웁니다.",
          ],
        },
      ],
      note: "※ 각 제품의 일반적인 특징을 정리한 것으로, 어느 제품이 더 낫다는 뜻이 아닙니다. 결절 등 이상 반응은 빈도가 낮아도 생길 수 있고, 변화가 보이는 시기와 유지 기간은 사람마다 다릅니다. 실제 사용할 제품과 용량은 피부 상태와 부위를 보고 상담에서 정합니다.",
    },
    featuresTitle: "울트라콜의 4가지 특징",
    features: [
      {
        title: "미세 구형 PDO(녹는 실) 입자",
        text: "수십 년간 외과 수술용 봉합사로 쓰여 온 PDO(폴리디옥사논) 성분을 미세한 구형(Sphere) 입자로 가공해 만든 4세대 콜라겐부스터입니다.",
        image: "/images/official/ultracol-100-200-box-vials.png",
        alt: "울트라콜 100 · 200 제품 상자와 바이알 (제조사 공식 자료)",
        fullFrame: false,
        mediaSize: { width: 419, height: 289 },
        mediaEdges: ["#ffffff", "#ffffff"],
      },
      {
        title: "구형 입자로 결절 부담을 낮춘 구조",
        text: "불규칙한 입자 모양 때문에 피부 속에서 뭉치는 결절이 보고되기도 합니다. 제조사는 표면이 매끄러운 구형 입자와 생분해 특성으로 뭉치는 부담을 낮췄다고 설명합니다. 빈도가 낮아도 결절은 생길 수 있어 경과를 함께 확인합니다.",
        image: "/images/photos/cat-main-skin-model-a.webp",
        alt: "제품 선택 설명용 기존 시술 사진",
      },
      {
        title: "피부가 얇은 눈가 · 눈밑 잔주름",
        text: "입자가 미세하고 부드러워 피부가 얇고 예민해 시술이 까다로웠던 눈가와 눈밑 부위에도 상담할 수 있습니다. 히알루론산 필러에서 보이는 틴달 현상(피부가 푸르게 비치는 현상) 부담이 적은 편이며, 얇아진 진피층의 밀도를 촘촘하게 채워 눈가를 함께 살핍니다.",
        image: "/images/photos/cat-skin-booster-model-a.webp",
        alt: "함께 하는 시술 설명용 기존 진료 사진",
      },
      {
        title: "자가 콜라겐 생성과 피부 톤",
        text: "진피층에 주입된 PDO 입자가 분해되면서 자가 콜라겐과 엘라스틴 생성을 유도합니다. 이 과정에서 피부 톤이 밝아진 느낌을 함께 말씀하시는 분도 있습니다. 변화의 정도와 체감 시점은 사람마다 다릅니다.",
        image: "/images/photos/signature-3.webp",
        alt: "경과 확인 설명용 기존 피부 시술 사진",
      },
    ],
    process: [
      {
        title: "1:1 맞춤 상담 및 계획",
        text: "피부결, 탄력, 볼륨 고민의 양상을 꼼꼼히 살피고 환자분의 피부 두께와 이전 주입 시술 이력을 확인하여, 울트라콜 규격(100 · 200), 용량, 시술 범위를 정밀하게 설계합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "마취 크림 도포 및 준비",
        text: "시술 부위를 깨끗하게 정돈한 뒤 마취 크림을 도포하여 편안한 상태를 만들고, 사용할 울트라콜 제품의 정품 상태와 규격을 사전에 확인시켜 드립니다.",
        image: "/images/photos/process-anesthesia-model-a.webp",
        alt: "기존 마취 준비 사진",
      },
      {
        title: "정교한 맞춤 주입",
        text: "숙련된 노하우를 바탕으로 계획된 부위에 울트라콜 성분을 고르고 촘촘하게 나누어 주입합니다.",
        image: "/images/photos/cat-injection-model-a.webp",
        alt: "시술 과정 설명용 기존 주입 시술 사진",
      },
      {
        title: "직후 경과 확인 및 홈케어 안내",
        text: "시술 직후 부기나 엠보싱 상태를 편안하게 정돈하고 확인한 뒤, 콜라겐 생성을 돕기 위한 관리 요령과 일상생활 주의사항을 안내해 드립니다.",
        image: "/images/photos/clinic-5.webp",
        alt: "프라베일 관리실",
      },
    ],
  },
  "/lifting/laser": {
    kind: "procedure",
    diagram: "laser",
    principleLayout: "figure-first",
    showPrices: true,
    device: {
      name: "포텐자 · 슈링크 유니버스 · 클라리티2",
      maker: "JEISYS · CLASSYS · LUTRONIC",
      image: "/images/photos/retouched/web/consult.jpg",
      photo: "/images/photos/retouched/web/consult.jpg",
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
      photoAlt: "보호 안경을 착용한 대표원장의 레이저 시술 장면",
      film: {
        src: "/videos/official-potenza-intro.mp4",
        poster: "/images/official/potenza-intro-poster.jpg",
        edge: "linear-gradient(#cfdfe0, #cdd9de)",
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
        text: "열 자극 뒤 변화는 시간이 걸릴 수 있습니다. 직후의 부기와 이후의 변화를 구분해 다음 계획을 정합니다.",
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
            "열감 · 압통 · 부기 가능",
            "붉어짐 · 부기 · 바늘 자국 가능",
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
        text: "중요한 일정을 확인하고, 붉어짐이나 부기가 생길 가능성을 설명합니다. 경과를 본 뒤 추가 시술 여부를 정합니다.",
        image: "/images/photos/clinic-4.webp",
        alt: "세안과 회복 관리 안내에 사용하는 병원 파우더룸 사진",
      },
    ],
    process: [
      {
        title: "1:1 상담",
        text: "처짐 · 피부결 · 모공을 나누어 살피고 기존 시술과 복용약을 확인합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "마취 · 시술 준비",
        text: "장비에 맞는 통증 관리와 마취 여부를 안내하고 피부를 준비합니다. 레이저는 적합한 눈 보호 방법도 확인합니다.",
        image: "/images/photos/process-anesthesia-model-a.webp",
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
        image: "/images/photos/clinic-5.webp",
        alt: "프라베일 관리실",
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
  "/lifting/laser/shrink": {
    kind: "procedure",
    diagram: "laser",
    principleLayout: "figure-first",
    showPrices: true,
    // 원리 · 모드 영상 · 그림: 클래시스 슈링크 유니버스 공식 사이트(shurinkuniverse.co.kr) 제품 · 원리 영상 (크기만 줄임)
    // 장비 소개 영상: 클래시스 공식 유튜브 슈링크 유니버스 프로모션 영상에서 장비 장면만 잘라 씀 (소리 없음 · 가로 1280px)
    device: {
      name: "슈링크 유니버스",
      maker: "CLASSYS",
      image: "/images/equipment/hero/shrink-universe.webp",
      film: {
        src: "/videos/shrink-device.mp4?v=20261104",
        poster: "/images/shrink/device.webp?v=20261104",
        edge: "linear-gradient(#020707, #080d17)",
      },
      text: "슈링크 유니버스는 클래시스(CLASSYS)사의 고강도 집속 초음파(HIFU) 리프팅 장비입니다. 피부 속 목표 층에 열응고점(TCP)을 형성하여 처진 윤곽과 탄력을 관리하며, 점 형태로 조사하는 일반(Dot) 모드와 에너지를 선 형태로 촘촘히 전달하는 MP(Micro Pulsed) 모드를 피부 상태에 맞춰 선택합니다.",
      specs: [
        { label: "방식", value: "집속 초음파 (HIFU)" },
        { label: "조사 모드", value: "일반(Dot) · MP 모드" },
        { label: "깊이", value: "1.5 · 2.0 · 3.0 · 4.5mm" },
        { label: "핸드피스", value: "울트라 F · 울트라 부스터" },
      ],
    },
    principleImage: {
      src: "/images/shrink/principle.webp?v=20261104b",
      video: "/videos/shrink-principle.mp4?v=20261104b",
      alt: "같은 4.5mm 깊이에서 일반 모드(점)와 MP 모드(이어진 선)로 열응고점이 생기는 모습을 나란히 보여 주는 제조사 영상",
      framed: true,
      figureAspect: "16 / 9",
      noteOverlay: true,
      marks: [],
      layers: [],
      note: "CLASSYS · 왼쪽 일반(Dot) 모드, 오른쪽 MP 모드. 실제 크기 · 깊이와는 다를 수 있습니다.",
    },
    principle: [
      {
        title: "초음파 에너지 집속",
        text: "고강도 초음파 에너지를 피부 속 목표 깊이(1.5~4.5mm)에 정교하게 집속시켜 미세한 열응고점(TCP)을 형성합니다.",
      },
      {
        title: "일반(Dot) · MP 듀얼 모드",
        text: "점 형태로 조사하는 일반 모드와 선 형태로 촘촘히 전달하는 MP 모드를 시술 부위와 피부 두께에 맞춰 적용합니다.",
      },
      {
        title: "콜라겐 재생과 탄력 개선",
        text: "열응고점이 형성된 조직이 회복되는 과정에서 콜라겐 재생이 유도되어, 처진 피부의 탄력이 서서히 차오릅니다. 개선 정도는 개인차가 있습니다.",
      },
    ],
    compare: {
      title: "슈링크 유니버스, 다른 초음파 리프팅과 차이점",
      lead: "같은 집속 초음파(HIFU) 리프팅이라도 에너지를 전달하는 방식과 핸드피스 구조에 차이가 있습니다. 고민 부위와 피부 상태를 면밀히 진단하여 적합한 장비를 선택합니다.",
      columns: [
        { name: "슈링크 유니버스", maker: "클래시스 · 국내", self: true },
        { name: "슈링크 (1세대)", maker: "클래시스 · 국내" },
        { name: "리니어지", maker: "제이시스메디칼 · 국내" },
        // 확인 필요: 리프테라 세부 사양 (기사 · 시술 기관 안내 기준으로 정리)
        { name: "리프테라", maker: "아스테라시스 · 국내" },
      ],
      rows: [
        {
          label: "에너지",
          values: [
            "집속 초음파 (HIFU)",
            "집속 초음파 (HIFU)",
            "집속 초음파 (HIFU)",
            "집속 초음파 (HIFU)",
          ],
        },
        {
          label: "조사 방식",
          values: [
            "일반(Dot) · MP 모드",
            "일반(Dot) 모드",
            "점(Dot) · 선(Linear) 모드",
            "점(Dot) 방식",
          ],
        },
        {
          label: "핸드피스",
          values: [
            "울트라 F · 둥근 펜형 울트라 부스터",
            "카트리지형",
            "카트리지형",
            "카트리지형 · 펜형(리프테라2)",
          ],
        },
        {
          label: "깊이 선택",
          values: [
            "1.5 · 2.0 · 3.0 · 4.5mm",
            "카트리지별",
            "1.5 ~ 4.5mm, 0.5mm 단위",
            "카트리지별",
          ],
        },
      ],
      note: "※ 위 표는 각 장비의 일반적인 기술 특성을 정리한 자료로 특정 장비의 우위를 의미하지 않으며, 일부 비교 장비는 본원 보유 장비가 아닐 수 있습니다. 적합한 시술과 통증 · 효과 · 유지 기간은 개인의 피부 상태에 따라 다릅니다.",
    },
    featuresTitle: "슈링크 유니버스의 4가지 특징",
    features: [
      {
        title: "빈틈없이 에너지를 전달하는 MP 모드",
        text: "일정한 간격으로 열응고점을 만드는 일반(Dot) 모드에 더해, 미세한 열응고점을 선처럼 촘촘하게 이어 주는 MP(Micro Pulsed) 모드를 탑재했습니다. 에너지가 끊김 없이 빠르게 조사되어 전체적인 시술 시간과 통증 부담을 줄여 줍니다.",
        image: "/images/shrink/ultraf-mode.webp",
        video: "/videos/shrink-ultraf-mode.mp4",
        alt: "울트라 F 핸드피스의 일반 모드와 MP 모드 조사 모양을 보여 주는 제조사 영상",
        mediaSize: { width: 554, height: 554 },
        mediaEdges: ["#000000", "#000000"],
      },
      {
        title: "굴곡진 부위까지 세밀하게 밀착하는 울트라 부스터",
        text: "둥근 펜 타입의 울트라 부스터 핸드피스는 눈가 · 입가 · 턱선처럼 평면 카트리지가 닿기 어려운 굴곡진 부위에 빈틈없이 밀착합니다. 볼꺼짐 등이 우려되는 부위는 정교하게 피하고, 탄력이 필요한 부위에만 에너지를 집중해 시술합니다.",
        image: "/images/shrink/booster-mode.webp",
        video: "/videos/shrink-booster-mode.mp4",
        alt: "둥근 펜형 울트라 부스터 핸드피스의 조사 모양을 보여 주는 제조사 영상",
        mediaSize: { width: 554, height: 554 },
        mediaEdges: ["#000000", "#000000"],
      },
      {
        title: "피부 층별로 세분화된 4가지 깊이 카트리지",
        text: "1.5mm · 2.0mm · 3.0mm · 4.5mm로 세분화된 4가지 카트리지를 활용해, 얕은 표피층의 잔주름부터 깊은 근막층(SMAS)까지 에너지를 단계별로 전달합니다. 개인별 피부 두께와 부위별 노화 상태를 면밀히 진단하여 적절한 깊이를 조합합니다.",
        image: "/images/shrink/booster-depth.webp?v=20261104b",
        video: "/videos/shrink-booster-depth.mp4?v=20261104b",
        alt: "울트라 부스터 카트리지로 일반 모드(점)와 MP 모드(이어진 고리)의 열응고점이 생기는 모습을 나란히 보여 주는 제조사 영상",
        mediaSize: { width: 1280, height: 720 },
      },
      {
        title: "카트리지 교체 없이 실시간 전환하는 듀얼 모드",
        text: "카트리지를 번거롭게 교체할 필요 없이, 시술 도중 화면을 통해 일반 모드와 MP 모드를 실시간으로 변경할 수 있습니다. 불필요한 대기 시간을 줄이고 부위별 특성에 맞는 에너지를 끊김 없이 전달합니다.",
        image: "/images/shrink/mode-switch.webp?v=20261104c",
        video: "/videos/shrink-mode-switch.mp4?v=20261104c",
        alt: "울트라 F 핸드피스 하나로 두 가지 모드를 교체 없이 쓴다고 설명하는 제조사 영상",
        // 제조사 워터마크가 있던 위쪽 띠를 잘라 냄 (1280×664). 자르지 않고 전체를 보여 줌
        mediaSize: { width: 1280, height: 664 },
        mediaEdges: ["#000000", "#000000"],
      },
    ],
    process: [
      {
        title: "1:1 상담 및 설계",
        text: "처진 부위와 피부 두께, 이전 시술 이력을 면밀히 파악하여 적합한 카트리지와 샷 수, 시술 범위를 설계합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "클렌징 및 마취 준비",
        text: "시술 부위를 청결하게 정돈한 뒤 통증 부담을 줄이기 위해 마취 크림을 도포합니다.",
        image: "/images/photos/process-shrink-anesthesia-model-a.webp",
        alt: "시술 전 얼굴에 마취 크림을 고르게 바른 모습",
      },
      {
        title: "대표원장 맞춤 시술",
        text: "부위별 피부 두께와 윤곽 구조에 맞춰 카트리지와 모드를 조절하며 목표 깊이에 초음파 에너지를 전달합니다.",
        image: "/images/photos/process-shrink-treatment-model-a.webp",
        alt: "대표원장이 슈링크 유니버스 핸드피스로 얼굴 시술을 진행하는 모습",
      },
      {
        title: "진정 마무리 및 안내",
        text: "시술 직후 열감과 부기를 확인하고, 세안 · 운동 가능 시점과 사후 관리 주의사항을 안내합니다.",
        image: "/images/photos/clinic-5.webp",
        alt: "프라베일 관리실",
      },
    ],
  },
  "/lifting/laser/potenza": {
    kind: "procedure",
    diagram: "rf",
    principleLayout: "figure-first",
    showPrices: true,
    // 영상: 제이시스메디칼 포텐자 공식 페이지(jeisys.co.kr/brands/potenza) 제품 · 원리 영상에서 장면별로 자름 (크기만 줄임)
    device: {
      name: "포텐자",
      maker: "JEISYS",
      image: "/images/photos/retouched/web/consult.jpg",
      film: {
        src: "/videos/potenza-device-centered-v3.mp4",
        poster: "/images/potenza/potenza-device-centered-v3.webp",
        edge: "#000000",
        // 장비가 가운데 있어 기본 60% 그라디언트가 오른쪽 핸드피스를 덮는다
        fadeFrom: "84%",
      },
      mediaContain: true,
      text: "포텐자는 제이시스메디칼에서 개발한 고주파(RF) 리프팅 장비입니다. 본원은 미세한 바늘로 진피층에 직접 고주파를 전달하는 RF팁과, 고주파와 함께 부스터를 넣는 펌핑팁을 피부 상태와 고민에 맞춰 나누어 사용합니다. 바늘 깊이를 0.5 ~ 4.0mm 사이에서 조절해, 부위별 피부 두께에 맞춰 진피층에 나누어 전달합니다.",
      specs: [
        { label: "방식", value: "고주파 (RF) · 미세침" },
        { label: "팁", value: "RF팁 · 펌핑팁 (미세침 + 부스터 주입)" },
        { label: "바늘 깊이", value: "0.5 ~ 4.0mm (0.25mm 단위)" },
        { label: "함께 하는 관리", value: "PDRN · 엑소좀 · 쥬베룩 등 패키지" },
      ],
    },
    principleImage: {
      src: "/images/potenza/potenza-principle-web-v2.webp",
      video: "/videos/potenza-principle-web-v2.mp4",
      alt: "미세침이 피부에 들어가 피부층별로 RF 에너지를 전달하는 과정을 보여 주는 자료 영상",
      framed: true,
      figureAspect: "16 / 9",
      noteOverlay: true,
      marks: [],
      layers: [],
      note: "JEISYS MEDICAL · 층별 고주파 전달과 바이폴라 · 모노폴라 방식. 실제 크기 · 깊이와는 다를 수 있습니다.",
    },
    principle: [
      {
        title: "피부 상태 및 고민 진단",
        text: "모공 · 피부결 · 탄력 · 흉터 등 주된 고민 부위와 개인별 피부 두께를 면밀히 파악하여 바늘 깊이와 에너지 강도를 정합니다.",
      },
      {
        title: "층별 고주파 에너지 전달",
        text: "미세한 바늘이 정한 깊이까지 들어가 진피층에 고주파 열을 직접 전달합니다. 부위마다 깊이를 달리해 층을 나누어 전달합니다.",
      },
      {
        title: "콜라겐 재생과 피부결 정돈",
        text: "전달된 열 자극으로 콜라겐이 재생되며 모공 · 피부결 · 탄력의 변화가 서서히 나타납니다. 개선 정도와 발현 시기는 개인의 피부 상태에 따라 차이가 있습니다.",
      },
    ],
    compare: {
      title: "포텐자, 다른 고주파 시술과 차이점",
      lead: "같은 고주파 시술도 바늘을 쓰는지, 에너지를 어디에 주는지에 따라 쓰임이 다릅니다. 고민과 피부 상태를 함께 살펴 선택합니다.",
      columns: [
        { name: "포텐자", maker: "제이시스메디칼 · 국내", self: true },
        // 확인 필요: 버츄RF 고주파 종류 (제조사 자료로 재확인)
        { name: "버츄RF", maker: "큐테라 · 미국" },
        { name: "올리지오", maker: "원텍 · 국내" },
        { name: "볼뉴머", maker: "클래시스 · 국내" },
      ],
      rows: [
        {
          label: "에너지 방식",
          values: [
            "미세침 고주파",
            "미세침 고주파",
            "비침습 고주파",
            "비침습 고주파",
          ],
        },
        {
          label: "고주파 종류",
          values: ["모노폴라 · 바이폴라", "바이폴라", "모노폴라", "모노폴라"],
        },
        {
          label: "주요 고민",
          values: [
            "모공 · 피부결 · 흉터 · 탄력",
            "모공 · 흉터 · 피부결",
            "탄력 · 잔주름",
            "탄력 · 잔주름",
          ],
        },
        {
          label: "회복 및 다운타임",
          values: [
            "깊이에 따라 상이 (붉은기 · 미세 바늘 자국)",
            "붉은기 · 미세 바늘 자국",
            "일시적 붉은기 · 열감",
            "일시적 붉은기 · 열감",
          ],
        },
      ],
      note: "※ 각 장비의 일반적인 특징을 정리한 것으로, 어느 장비가 더 낫다는 뜻이 아닙니다. 맞는 장비는 피부 상태와 고민에 따라 다르며, 통증 · 효과 · 유지 기간은 사람마다 다릅니다. 비교 장비의 본원 보유 여부를 뜻하지 않습니다.",
    },
    featuresTitle: "포텐자의 4가지 특징",
    features: [
      {
        title: "미세침 팁의 정교한 진입 시스템",
        text: "미세침 팁이 피부에 순간적으로 접촉하여 진입한 뒤 신속하게 회수되는 방식으로 설계되어 있습니다. ※ 실제 시술 시 적용되는 팁의 종류와 세부 설정은 개개인의 피부 상태와 고민 부위에 맞춰 정교하게 결정됩니다.",
        image: "/images/potenza/potenza-modes-web-v2.webp",
        video: "/videos/potenza-modes-web-v2.mp4",
        alt: "포텐자 미세침 팁의 접촉, 진입, 회수 과정을 보여주는 자료 영상",
        mediaSize: { width: 1280, height: 720 },
      },
      {
        title: "타깃층별 맞춤 고주파(RF) 에너지 전달",
        text: "미세침을 통해 피부 표면의 손상 부담을 덜고, 진피층 등 필요한 특정 층에 직접적으로 고주파 에너지를 전달합니다. ※ 도식화된 이미지는 이해를 돕기 위한 참고용이며, 실제 침투 깊이는 피부 두께에 따라 다르게 적용됩니다.",
        image: "/images/potenza/potenza-tips-web-v2.webp",
        video: "/videos/potenza-tips-web-v2.mp4",
        alt: "미세침을 통한 피부층별 RF 에너지 전달을 보여주는 자료 영상",
        mediaSize: { width: 1280, height: 720 },
      },
      {
        title: "고주파와 부스터의 시너지, 펌핑 팁(Pumping Tip)",
        text: "본원의 포텐자는 유효 성분 침투에 특화된 펌핑 팁을 중심으로 운영됩니다. 미세침이 진피층에 고주파 열 자극을 주는 동시에, 쥬베룩이나 엑소좀 같은 프리미엄 부스터를 동일한 경로로 함께 주입하여 시너지 효과를 높입니다. ※ 환자분의 피부 타입과 고민 유형에 가장 적합한 부스터를 1:1로 매칭해 드립니다.",
        image: "/images/potenza/potenza-pumping-web-v2.webp",
        video: "/videos/potenza-pumping-web-v2.mp4",
        alt: "포텐자 펌핑팁이 피부 속에 고주파와 함께 부스터를 전달하는 모습을 보여 주는 자료 영상",
        mediaSize: { width: 1280, height: 720 },
      },
      {
        title: "0.5 ~ 4.0mm, 0.25mm 단위의 세밀한 깊이 조절",
        text: "바늘의 침투 깊이를 0.5mm에서 최대 4.0mm까지 0.25mm 단위로 아주 정밀하게 조절할 수 있습니다. 피부 두께와 굴곡이 저마다 다른 이마, 볼, 코 주변 등 부위별 특성에 맞춘 맞춤형 시술이 가능합니다.",
        image: "/images/potenza/potenza-depth-web-v2.webp",
        video: "/videos/potenza-depth-web-v2.mp4",
        alt: "포텐자 미세침 팁의 깊이 조절(0.5 ~ 4.0mm, 0.25mm 단위)을 보여 주는 자료 영상",
        mediaSize: { width: 1280, height: 720 },
      },
    ],
    process: [
      {
        title: "상담 및 맞춤 플랜 설계",
        text: "모공 · 피부결 · 탄력 · 흉터 등 주요 피부 고민과 개인별 피부 두께를 면밀히 진단하여 알맞은 바늘 깊이와 시술 범위를 설계합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "클렌징 및 마취 준비",
        text: "시술 부위를 청결하게 정돈한 뒤, 통증 부담을 줄이고 편안하게 받으실 수 있도록 마취 크림을 꼼꼼하게 도포합니다.",
        image: "/images/photos/process-anesthesia-model-a.webp",
        alt: "기존 마취 준비 사진",
      },
      {
        title: "정교한 맞춤 고주파 시술",
        text: "진단한 바늘 깊이를 바탕으로 피부 층별 고민 부위에 고주파 에너지를 정밀하고 균일하게 전달하며, 계획한 부스터를 함께 넣습니다.",
        image: "/images/photos/retouched/web/laser-model-a.webp",
        alt: "대표원장의 얼굴 부위 장비 시술 장면",
      },
      {
        title: "진정 마무리 및 사후 안내",
        text: "시술 직후 붉은기와 미세 자국을 차분하게 진정시키고, 세안 및 메이크업 가능 시점과 일상 속 주의사항을 세심하게 안내해 드립니다.",
        image: "/images/photos/clinic-5.webp",
        alt: "프라베일 관리실",
      },
    ],
  },
  "/lifting/laser/clarity": {
    kind: "procedure",
    diagram: "laser",
    principleLayout: "figure-first",
    showPrices: true,
    // 그림 · 영상: 루트로닉 클라리티2 공식 자료 (kr.lutronic.com · cynosure.com). 장면이 겹치지 않게 나눠 씀
    device: {
      name: "클라리티2",
      maker: "LUTRONIC",
      // 장비가 크게 보이는 기존 제조사 사진 유지 (08 패키지의 장비 컷은 작게 보여 되돌림)
      image: "/images/clarity-video/clarity-device-brand-from-video-v1.webp",
      photo: "/images/clarity-video/clarity-device-brand-from-video-v1.webp",
      photoSrcSet: "/images/clarity-video/clarity-device-brand-from-video-v1-800.webp 800w, /images/clarity-video/clarity-device-brand-from-video-v1-1200.webp 1200w, /images/clarity-video/clarity-device-brand-from-video-v1.webp 1920w",
      photoAlt: "루트로닉 클라리티2 장비와 브랜드 화면 · 제조사 영상 장면",
      photoCaption: "LUTRONIC 제공 클라리티2 장비 소개 영상의 한 장면.",
      mediaContain: true,
      mediaBg: "#f7f7f7",
      mediaSize: { width: 1920, height: 1080 },
      text: "클라리티2의 1064nm 롱펄스 엔디야그 파장을 활용한 비접촉 레이저 리프팅입니다. 피부에 닿지 않고 진피층에 심부열을 균일하게 쌓아 올려 표면 손상 없이 탄력 · 모공 · 피부결 · 피부 톤을 함께 살핍니다.",
      specs: [
        { label: "에너지 방식", value: "비접촉 롱펄스 레이저 (Long-pulsed Laser)" },
        { label: "타깃 파장", value: "1064nm (진피층 리프팅 · 모공 타이트닝)" },
        { label: "통증 관리", value: "지능형 냉각 가스 시스템 (무마취 진행)" },
        { label: "연계 관리", value: "LDM 진정 · 재생 케어 · PDRN 복합 설계" },
      ],
    },
    principleImage: {
      src: "/images/clarity-video/clarity-face-demo-from-video-v1.webp",
      alt: "얼굴 부위에 레이저를 조사하며 피부 온도를 표시하는 제조사 3D 설명 장면",
      framed: true,
      figureAspect: "16 / 9",
      marks: [],
      layers: [],
      note: "LUTRONIC 제공 얼굴 부위 레이저 조사 · 온도 표시 3D 설명 장면입니다. 실제 환자 촬영본이 아닙니다.",
    },
    principle: [
      {
        title: "피부에 닿지 않게 조사",
        text: "핸드피스를 피부에서 살짝 띄운 채 1064nm 레이저를 빠르게 여러 번 지나가듯 조사합니다.",
      },
      {
        title: "진피층에 열을 고르게 쌓음",
        text: "넓은 조사 크기로 얼굴 전체에 열을 고르게 전달해, 진피층의 콜라겐 재생을 돕습니다.",
      },
      {
        title: "탄력 · 피부결 · 톤 관리",
        text: "탄력과 모공 · 피부결, 붉은 톤을 함께 살피며 경과를 봅니다. 변화의 정도는 사람마다 다릅니다.",
      },
    ],
    compare: {
      title: "클라리티 리프팅, 다른 리프팅과 차이점",
      lead: "같은 리프팅도 레이저인지 고주파인지, 어느 고민을 중심으로 보는지에 따라 쓰임이 다릅니다. 고민과 피부 상태를 함께 살펴 선택합니다.",
      columns: [
        { name: "클라리티 이너리프팅", maker: "루트로닉 · 국내", self: true },
        { name: "엑셀V", maker: "큐테라 · 미국" },
        { name: "볼뉴머", maker: "클래시스 · 국내" },
        { name: "올리지오", maker: "원텍 · 국내" },
      ],
      rows: [
        {
          label: "에너지",
          values: [
            "레이저 (1064nm 롱펄스)",
            "레이저 (532 · 1064nm)",
            "모노폴라 고주파 (RF)",
            "모노폴라 고주파 (RF)",
          ],
        },
        {
          label: "조사 방식",
          values: [
            "피부에 닿지 않게 빠르게 조사",
            "파장 · 핸드피스별",
            "팁을 피부에 접촉",
            "팁을 피부에 접촉",
          ],
        },
        {
          label: "주로 상담하는 고민",
          values: [
            "탄력 · 모공 · 피부결 · 붉은 톤",
            "홍조 · 혈관 · 색소",
            "탄력 · 잔주름",
            "탄력 · 잔주름",
          ],
        },
        {
          label: "회복",
          values: [
            "대부분 당일 일상생활",
            "붉은기 · 부기 개인차",
            "붉은기 · 열감 개인차",
            "붉은기 · 열감 개인차",
          ],
        },
      ],
      note: "※ 각 장비의 일반적인 특징을 정리한 것으로, 어느 장비가 더 낫다는 뜻이 아닙니다. 맞는 장비는 피부 상태와 고민에 따라 다르며, 통증 · 효과 · 유지 기간은 사람마다 다릅니다. 비교 장비의 본원 보유 여부를 뜻하지 않습니다.",
    },
    featuresTitle: "클라리티 리프팅의 4가지 특징",
    features: [
      {
        title: "피부에 닿지 않는 위생적인 비접촉 조사",
        text: "피부 표면에 직접 팁을 대지 않고 살짝 띄운 상태에서 1064nm 롱펄스 에너지를 빠르게 공중 조사합니다. 피부 마찰이나 압박 없이 위생적이며, 팁 접촉으로 인한 표면 자극을 줄입니다.",
        image: "/images/clarity-video/clarity-handpiece-from-video-v1.webp",
        mediaSrcSet: "/images/clarity-video/clarity-handpiece-from-video-v1-800.webp 800w, /images/clarity-video/clarity-handpiece-from-video-v1-1200.webp 1200w, /images/clarity-video/clarity-handpiece-from-video-v1.webp 1920w",
        alt: "클라리티2 핸드피스 구조를 설명하는 제조사 영상 장면",
        caption: "LUTRONIC 제공 클라리티2 핸드피스 구조 설명 장면.",
        mediaFit: "contain",
        mediaSize: { width: 1920, height: 1080 },
        mediaEdges: ["#f7f7f7", "#f7f7f7"],
      },
      {
        title: "진피 깊은 층까지 균일하게 축적되는 심부열",
        text: "넓고 안정적인 스팟 사이즈를 활용해 피부 속 진피층까지 열에너지를 촘촘하게 쌓아 올립니다. 축적된 열감이 진피 내 섬유아세포를 자극하여 콜라겐과 엘라스틴의 자연스러운 재생을 유도합니다.",
        image: "/images/clarity-video/clarity-wavelengths-from-video-v1.webp",
        mediaSrcSet: "/images/clarity-video/clarity-wavelengths-from-video-v1-800.webp 800w, /images/clarity-video/clarity-wavelengths-from-video-v1-1200.webp 1200w, /images/clarity-video/clarity-wavelengths-from-video-v1.webp 1920w",
        alt: "755nm · 1064nm 파장 지원을 설명하는 제조사 영상 장면",
        caption: "LUTRONIC 제공 755nm · 1064nm 파장 지원 설명 장면. 이 페이지는 1064nm를 활용한 시술을 안내합니다.",
        mediaFit: "contain",
        mediaSize: { width: 1920, height: 1080 },
        mediaEdges: ["#f7f7f7", "#f7f7f7"],
      },
      {
        title: "탄력 · 모공 · 피부결 · 안색의 올인원 케어",
        text: "처진 피부 밀도를 속부터 채워 늘어진 모공과 잔주름을 함께 살피고, 미세 혈관 안정화를 통해 붉은기와 칙칙한 피부 톤을 맑고 매끄럽게 정돈합니다.",
        image: "/images/clarity-video/clarity-intellitrak-from-video-v1.webp",
        mediaSrcSet: "/images/clarity-video/clarity-intellitrak-from-video-v1-800.webp 800w, /images/clarity-video/clarity-intellitrak-from-video-v1-1200.webp 1200w, /images/clarity-video/clarity-intellitrak-from-video-v1.webp 1920w",
        alt: "IntelliTrak 기술을 설명하는 제조사 영상 장면 (다리 부위 제모 시연)",
        caption: "LUTRONIC 제공 IntelliTrak 기술 설명 장면 — 다리 부위 제모 시연 예시입니다.",
        mediaFit: "contain",
        mediaSize: { width: 1920, height: 1080 },
        mediaEdges: ["#f7f7f7", "#f7f7f7"],
      },
      {
        title: "실시간 온도 모니터링 시스템",
        text: "시술 중 피부 표면의 온도를 실시간으로 체크할 수 있어, 열이 과도하게 쌓이지 않도록 안전하게 살피며 에너지 세기를 세심하게 조절합니다.",
        image: "/images/clarity-video/clarity-temperature-from-video-v1.webp",
        mediaSrcSet: "/images/clarity-video/clarity-temperature-from-video-v1-800.webp 800w, /images/clarity-video/clarity-temperature-from-video-v1-1200.webp 1200w, /images/clarity-video/clarity-temperature-from-video-v1.webp 1920w",
        alt: "피부 온도 감지 표시 화면을 보여 주는 제조사 영상 장면",
        caption: "LUTRONIC 제공 피부 온도 감지 표시 화면. 실제 환자 측정 기록이 아닙니다.",
        mediaFit: "contain",
        mediaSize: { width: 1920, height: 1080 },
        mediaEdges: ["#f7f7f7", "#f7f7f7"],
      },
    ],
    process: [
      {
        title: "상담 및 맞춤 플랜 설계",
        text: "현재의 피부 톤, 탄력 고민의 양상과 함께 최근 햇빛 노출 여부, 복용 중인 약물 등을 면밀히 확인하여 가장 알맞은 시술 범위를 정합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "안전 보호 및 시술 준비",
        text: "레이저 조사 시 눈을 안전하게 보호하는 방법을 철저히 확인한 뒤 시술 부위를 깨끗하게 정돈합니다. ※ 따뜻한 열감이 걱정되시거나 민감하신 경우 사전에 편하게 말씀해 주세요.",
        image: "/images/photos/process-anesthesia-model-a.webp",
        alt: "기존 마취 준비 사진",
      },
      {
        title: "비접촉식 맞춤 레이저 조사",
        text: "피부 상태와 고민 부위에 맞게 설정된 파장과 에너지 세기를 바탕으로, 핸드피스를 이용해 얼굴 전체에 부드럽고 균일하게 레이저를 조사합니다.",
        image: "/images/photos/retouched/web/laser-model-a.webp",
        alt: "보호 안경을 착용한 대표원장의 얼굴 부위 레이저 시술 장면",
      },
      {
        title: "진정 케어 및 홈케어 안내",
        text: "시술 직후 일시적인 붉은기와 열감을 차분하게 진정시키고, 일상 속에서 철저한 자외선 차단과 보습을 관리하실 수 있도록 세심하게 안내해 드립니다.",
        image: "/images/photos/clinic-5.webp",
        alt: "프라베일 관리실",
      },
    ],
  },
  "/lifting/thread": {
    kind: "procedure",
    diagram: "thread",
    principleLayout: "figure-first",
    showPrices: true,
    device: {
      name: "실리프팅",
      maker: "흡수성 의료용 실",
      image: "/images/photos/retouched/web/consult.jpg",
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
          value: "부기 · 멍 · 당김 · 비대칭 등",
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
        text: "초기 당김과 부기가 안정되는 과정을 살피고, 패임이나 비대칭, 실 노출이 없는지 경과를 확인합니다.",
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
            "당김 · 부기 · 패임 · 비대칭",
            "열감 · 부기 · 감각 변화 등",
            "부기 · 멍 · 혈관 관련 증상 등",
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
        text: "부기와 당김, 피부 패임을 살피고 비대칭이나 실 노출 같은 불편이 있으면 진료로 확인합니다.",
        image: "/images/photos/clinic-6.webp",
        alt: "경과 진료 방문 안내에 사용하는 병원 복도 사진",
      },
    ],
    process: [
      {
        title: "상담 · 디자인",
        text: "처짐과 피부 두께, 이전 시술 이력을 보고 지지 방향과 실의 종류 · 범위를 정합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "마취 · 준비",
        text: "시술 부위와 마취 방법을 확인한 뒤 피부를 소독하고 준비합니다. 마취제 알레르기는 미리 알려 주세요.",
        image: "/images/photos/process-anesthesia-model-a.webp",
        alt: "기존 마취 준비 사진",
      },
      {
        title: "시술",
        text: "제품별 사용방법에 맞춰 계획한 층과 방향에 실을 넣고, 조직의 지지와 좌우 균형을 확인합니다.",
        image: "/images/photos/cat-main-petit-model-a.webp",
        alt: "기존 피부 주입 시술 참고 사진",
      },
      {
        title: "경과 확인",
        text: "부기와 통증, 당김이나 패임을 확인하고, 압박 · 마사지 · 일상생활 주의사항을 따로 안내합니다.",
        image: "/images/photos/clinic-5.webp",
        alt: "프라베일 관리실",
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
  "/lifting/thread/qtl": {
    kind: "procedure",
    diagram: "thread",
    principleLayout: "figure-first",
    showPrices: true,
    device: {
      name: "QTL 실리프팅",
      maker: "QTL THREAD",
      image: "/images/thread/products/qtl-package.jpg",
      photo: "/images/thread/products/qtl-package.jpg",
      photoAlt: "QTL 실 제품 패키지 이미지 (제조사 공식 자료)",
      mediaContain: true,
      mediaBg: "#ffffff",
      mediaSize: { width: 600, height: 380 },
      text: `QTL 실리프팅은 정교한 돌기(코그)가 촘촘하게 배열된 몰딩형 녹는 실을 피하층에 삽입하여, 중력에 의해 처진 조직을 직접적으로 끌어올려 탄탄하게 고정해 주는 리프팅 시술입니다.

환자분마다 다른 처짐의 방향, 조직의 무게, 피부 두께를 면밀히 살피어 실이 들어갈 정확한 층과 벡터(방향), 그리고 최적의 개수를 세심하게 설계합니다.`,
      specs: [
        { label: "실 종류", value: "몰딩형 녹는 실 (촘촘한 돌기)" },
        { label: "마취", value: "국소 마취" },
        { label: "설계 기준", value: "처짐 방향 · 피부 두께 · 조직 무게" },
        { label: "가격 안내", value: "1줄 기준" },
      ],
    },
    principleImage: {
      src: "/images/principles/thread.webp?v=20261026b",
      alt: "돌기가 있는 실과 주변 결합조직의 지지 구조를 확대한 입체 개념도",
      marks: [],
      layers: [],
      framed: true,
      note: "실과 주변 조직의 관계를 표현한 설명용 모식도입니다. 특정 제품의 실제 구조 · 크기 · 삽입 깊이와는 다를 수 있습니다.",
    },
    principle: [
      {
        title: "처짐 상태 및 조직 정밀 진단",
        text: "처진 부위의 양상과 지방량, 피부 두께를 면밀히 살피어 탄탄하게 지지해 줄 최적의 벡터(방향)와 범위를 설계합니다.",
      },
      {
        title: "몰딩실을 통한 정교한 지지 및 리프팅",
        text: "정해진 층과 방향을 따라 촘촘한 돌기를 가진 몰딩형 녹는 실을 안전하게 삽입하여, 처진 조직을 위로 단단히 받쳐 올립니다.",
      },
      {
        title: "안정화 및 형태 모니터링",
        text: "시술 후 당김과 부기가 서서히 안정되는 과정을 살피고, 피부 패임이나 비대칭 등 불편한 증세 없이 자연스럽게 자리를 잡는지 꼼꼼하게 확인합니다.",
      },
    ],
    compare: {
      title: "QTL 실리프팅, 다른 실리프팅과 차이점",
      lead: "같은 몰딩실도 돌기 모양과 배열, 조직을 붙잡는 방식이 다릅니다. 처짐 정도와 피부 두께를 함께 보고 고릅니다.",
      columns: [
        // 소재는 표 첫 행("실 종류 및 소재")에 있어 머리글에는 적지 않음
        { name: "QTL실", self: true },
        { name: "민트실" },
        // 확인 필요: 에피티콘 · 블루로즈 세부 사양 (제조사 자료 · 시술 기관 안내 기준으로 정리)
        { name: "에피티콘" },
        { name: "블루로즈" },
      ],
      rows: [
        {
          label: "실 종류 및 소재",
          values: [
            "몰딩형 녹는 실",
            "몰딩실 · PDO",
            "제테마 · PDO",
            "몰딩실 · PDO",
          ],
        },
        {
          label: "돌기 모양",
          values: [
            "촘촘하게 배열된 돌기",
            "360° 나선형 돌기",
            "여러 리프팅 유닛 구조",
            "360° 몰딩 돌기",
          ],
        },
        {
          label: "조직을 잡는 방식",
          values: [
            "촘촘한 돌기로 넓게 고정",
            "큰 돌기로 강하게 끌어당김",
            "유닛마다 나누어 안정적으로 지지",
            "큰 돌기로 강력하게 끌어당김",
          ],
        },
        {
          label: "상담 시 확인 포인트",
          values: [
            "처짐 방향 · 피부 두께",
            "처짐 정도 · 피부 두께",
            "처짐 정도 · 시술 부위",
            "처짐 정도 · 피부 두께",
          ],
        },
        {
          label: "공통 회복 과정",
          values: [
            "부기 · 멍 · 당김 (개인차 있음)",
            "부기 · 멍 · 당김 (개인차 있음)",
            "부기 · 멍 · 당김 (개인차 있음)",
            "부기 · 멍 · 당김 (개인차 있음)",
          ],
        },
      ],
      note: "※ 각 실의 일반적인 특징을 정리한 것으로, 어느 실이 더 낫다는 뜻이 아닙니다. 맞는 실은 처짐 정도와 피부 상태에 따라 다르며, 효과 · 유지 기간은 사람마다 다릅니다. 비교한 실의 본원 사용 여부를 뜻하지 않습니다.",
    },
    featuresTitle: "QTL 실리프팅의 4가지 특징",
    features: [
      {
        title: "처진 방향에 맞춘 입체적 벡터 디자인",
        text: "단순히 실을 일자로 넣는 것이 아니라, 개개인의 얼굴형과 처짐의 방향, 피부 두께를 면밀히 분석하여 가장 자연스럽고 탄탄하게 지지할 수 있는 방향을 정교하게 설계합니다.",
        image: "/images/thread/features/qtl-point-01-vector-design-v2.webp",
        alt: "피부 조직 안에서 여러 지지 방향을 표현한 설명용 단면도",
      },
      {
        title: "촘촘한 코그(돌기)로 분산되는 고정력",
        text: "정교하게 밀집된 몰딩형 돌기들이 피하 조직을 넓고 균일하게 붙잡아 주어, 한쪽으로 힘이 쏠리지 않고 부드러우면서도 안정적인 리프팅 효과를 이끌어냅니다.",
        image: "/images/thread/features/qtl-point-02-cog-support-v2.webp",
        alt: "실의 돌기와 주변 조직의 관계를 확대한 설명용 모식도",
      },
      {
        title: "탄탄한 유지력과 콜라겐 재생 시너지",
        text: "처진 조직을 물리적으로 단단히 받쳐 올리는 동시에, 삽입된 녹는 실이 서서히 분해되는 과정에서 주변의 콜라겐 생성을 유도하여 속부터 차오르는 탄력 밀도를 더해 줍니다.",
        image: "/images/thread/features/qtl-point-03-collagen-support-v2.webp",
        alt: "피부 속 실과 주변 콜라겐 섬유를 표현한 설명용 모식도",
      },
      {
        title: "이물감을 줄인 편안한 마무리와 일상 복귀",
        text: "피부 두께와 층을 고려한 섬세한 자입(Insertion)으로 시술 후 불필요한 패임이나 과도한 당김 현상을 줄이고, 빠르게 일상으로 복귀하실 수 있도록 꼼꼼하게 마무리합니다.",
        image: "/images/thread/features/qtl-point-04-gentle-finish-v2.webp",
        alt: "피부 표면과 내부 실의 위치 관계를 표현한 설명용 모식도",
      },
    ],
    process: [
      {
        title: "맞춤 상담 및 정밀 계획 수립",
        text: "개개인의 처진 양상, 피부 두께, 그리고 이전 시술 이력 등을 면밀히 확인하여 가장 안정적인 지지 방향과 최적의 실 개수 및 범위를 정교하게 설계합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "안전한 마취 및 철저한 준비",
        text: "시술 부위를 깨끗하게 소독한 뒤 국소 마취를 진행합니다. ※ 마취제 알레르기나 특이 체질이 있으신 경우 사전에 반드시 의료진에게 알려 주시기 바랍니다.",
        image: "/images/photos/process-anesthesia-model-a.webp",
        alt: "기존 마취 준비 사진",
      },
      {
        title: "정교한 실 삽입 및 균형 확인",
        text: "사전 계획한 해부학적 층과 방향에 따라 실을 안전하게 삽입하고, 조직이 단단히 지지되는지와 좌우 대칭이 조화로운지 꼼꼼하게 살핍니다.",
        image: "/images/photos/cat-main-petit-model-a.webp",
        alt: "기존 피부 시술 참고 사진",
      },
      {
        title: "경과 확인 및 일상 케어 안내",
        text: "시술 직후 나타날 수 있는 부기, 당김, 미세한 패임 여부를 꼼꼼히 체크하고, 편안한 일상 복귀를 위한 주의사항을 친절하게 안내해 드립니다.",
        image: "/images/photos/clinic-5.webp",
        alt: "프라베일 관리실",
      },
    ],
  },
  "/lifting/thread/jamber": {
    kind: "procedure",
    diagram: "thread",
    principleLayout: "figure-first",
    showPrices: true,
    device: {
      name: "잼버실",
      maker: "JAMBER THREAD",
      image: "/images/thread/products/jamber-lineup.png",
      photo: "/images/thread/products/jamber-lineup.png",
      photoAlt: "잼버실 Ex · M · Classic 제품 이미지 (제조사 공식 자료)",
      mediaContain: true,
      mediaBg: "#ffffff",
      mediaSize: { width: 1860, height: 830 },
      text: `잼버실은 피부를 강하게 당겨 올리는 일반적인 리프팅 실과 달리, 스프링처럼 촘촘하게 말려 있는 특수 녹는 실을 꺼진 부위의 피하층에 삽입하여 안쪽부터 탄탄한 지지대 역할을 하도록 만드는 볼륨 시술입니다.

나이가 들면서 야위거나 꺼지기 쉬운 눈밑 · 팔자주름 · 앞볼 등의 부위를 인위적이지 않고 입체적으로 채워 매끄러운 윤곽을 완성해 줍니다.`,
      specs: [
        { label: "실 모양", value: "스프링(코일)형 녹는 실" },
        { label: "목적", value: "꺼진 부위 볼륨 (당기는 실이 아님)" },
        { label: "주로 살피는 부위", value: "눈밑 · 팔자 · 앞볼" },
        { label: "가격 안내", value: "1줄 기준" },
      ],
    },
    principleImage: {
      src: "/images/principles/thread.webp?v=20261026b",
      alt: "실과 주변 결합조직의 지지 구조를 확대한 입체 개념도",
      marks: [],
      layers: [],
      framed: true,
      note: "돌기가 있는 실을 예로 든 설명용 모식도입니다. 잼버실은 스프링 모양으로 꺼진 부위를 받치는 볼륨형 실로, 실제 구조 · 크기 · 삽입 깊이와는 다릅니다.",
    },
    principle: [
      {
        title: "꺼진 위치 및 피부 깊이 정밀 진단",
        text: "볼륨이 필요한 부위의 정확한 위치와 꺼진 깊이, 그리고 개개인의 피부 두께를 면밀히 살피어 맞춤형 시술 범위를 디자인합니다.",
      },
      {
        title: "캐뉼라를 통한 스프링 실 지지대 형성",
        text: "조직 손상을 줄이는 뭉툭한 캐뉼라를 사용하여, 스프링처럼 촘촘하게 말린 녹는 실을 꺼진 부위 아래에 안전하게 삽입해 탄탄한 지지대를 만듭니다.",
      },
      {
        title: "콜라겐 재생을 통한 볼륨 안착",
        text: "삽입된 스프링 실 사이로 자가 콜라겐이 서서히 차오르면서, 인위적이지 않고 자연스러운 입체 볼륨과 탄력이 부드럽게 자리 잡습니다. ※ 볼륨이 형성되고 유지되는 정도는 개인의 피부 상태와 체질에 따라 차이가 있을 수 있습니다.",
      },
    ],
    compare: {
      title: "잼버실, 다른 실과의 차이점",
      lead: "실리프팅도 살을 당기는 실과 꺼진 곳을 채우는 실로 나뉩니다. 고민이 처짐인지 꺼짐인지 먼저 보고 고릅니다.",
      // 확인 필요: 캐번실 · 테스실 · 실루엣소프트 세부 사양 (제조사 자료로 재확인)
      columns: [
        { name: "잼버실", maker: "볼륨 실", self: true },
        { name: "캐번실", maker: "볼륨 실" },
        { name: "테스실", maker: "실리프팅" },
        { name: "실루엣소프트", maker: "리프팅 실" },
      ],
      rows: [
        {
          label: "주된 목적",
          values: [
            "꺼진 부위 볼륨",
            "꺼진 부위 볼륨",
            "탄력 및 볼륨 보조",
            "처진 부위 리프팅",
          ],
        },
        {
          label: "실의 형태",
          values: [
            "스프링(코일) 모양",
            "꼬임(스파이럴) 형태",
            "제품별 코그(돌기) 구조",
            "원뿔(콘) 형태의 디자인",
          ],
        },
        {
          label: "삽입 방식",
          values: [
            "뭉툭한 캐뉼라 사용",
            "제품별 전용 바늘 / 캐뉼라",
            "제품별 전용 바늘",
            "특수 콘(Cone) 고정 바늘",
          ],
        },
        {
          label: "상담 시 확인 포인트",
          values: [
            "꺼진 위치 · 깊이",
            "꺼진 위치 · 피부 두께",
            "피부 두께 · 시술 부위",
            "처짐 방향 · 피부 두께",
          ],
        },
      ],
      note: "※ 각 실의 일반적인 특징을 정리한 것으로, 어느 실이 더 낫다는 뜻이 아닙니다. 맞는 실은 고민과 피부 상태에 따라 다르며, 효과 · 유지 기간은 사람마다 다릅니다. 비교한 실의 본원 사용 여부를 뜻하지 않습니다.",
    },
    featuresTitle: "잼버실의 특징 4가지",
    features: [
      {
        title: "스프링 구조의 탄탄한 볼륨 지지력",
        text: "스프링처럼 촘촘하게 말려 있는 특수 형태의 녹는 실이 꺼진 부위의 피하층에서 안쪽부터 촘촘하게 받쳐 주어, 인위적이지 않고 자연스러운 입체 볼륨을 만들어 줍니다.",
        image: "/images/thread/features/jamber-point-01-volume-support-v2.webp",
        alt: "피부 안에서 공간을 받치는 코일형 실의 설명용 모식도",
      },
      {
        title: "당기지 않고 채우는 맞춤형 타깃 케어",
        text: "피부를 강제로 당겨 올리는 리프팅 실과 달리, 눈밑 · 팔자주름 · 앞볼 등 나이가 들며 야위거나 꺼진 부위에만 선택적으로 집중하여 부드럽고 매끄러운 선을 완성합니다.",
        image: "/images/thread/features/jamber-point-02-elasticity-v2.webp",
        alt: "유연하게 굽은 코일형 실의 탄성을 표현한 설명용 모식도",
      },
      {
        title: "콜라겐 재생을 통한 탄력 밀도 강화",
        text: "삽입된 실이 체내에서 서서히 흡수되는 과정 주변으로 자가 콜라겐 생성이 유도되어, 단순한 물리적 채움에 그치지 않고 피부 속 탄력 밀도와 결이 함께 건강해집니다.",
        image: "/images/thread/features/jamber-point-03-blunt-cannula-v2.webp",
        alt: "피부 조직과 둥근 캐뉼라 끝부분을 표현한 설명용 단면도",
      },
      {
        title: "이물감을 낮춘 부드러운 안착과 자연스러운 표정",
        text: "피부 조직의 특성을 고려한 섬세한 자입(Insertion)으로 시술 후 과도한 당김이나 딱딱한 이물감을 줄여 주어, 표정을 지을 때도 어색함 없이 편안하게 안착됩니다.",
        image: "/images/thread/features/jamber-point-04-collagen-matrix-v2.webp",
        alt: "코일형 실과 주변 콜라겐 섬유의 관계를 표현한 설명용 모식도",
      },
    ],
    process: [
      {
        title: "상담 · 계획",
        text: "꺼진 부위와 피부 두께, 이전 시술 이력을 보고 실의 개수와 범위를 정합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "마취 · 준비",
        text: "시술 부위를 소독하고 국소 마취를 합니다. 마취제 알레르기는 미리 알려 주세요.",
        image: "/images/photos/process-anesthesia-model-a.webp",
        alt: "기존 마취 준비 사진",
      },
      {
        title: "시술",
        text: "계획한 부위에 실을 넣고 모양과 좌우 균형을 확인합니다.",
        image: "/images/photos/cat-main-petit-model-a.webp",
        alt: "기존 피부 시술 참고 사진",
      },
      {
        title: "경과 확인",
        text: "부기 · 멍을 확인하고 일상생활 주의사항을 안내합니다.",
        image: "/images/photos/clinic-5.webp",
        alt: "프라베일 관리실",
      },
    ],
  },
  "/acne-pore": {
    kind: "procedure",
    diagram: "acne",
    principleLayout: "figure-first",
    showPrices: true,
    device: {
      name: "여드름 · 모공 치료",
      maker: "ACNE · MARKS · SCARS · PORES",
      image: doctorPhotos.laser,
      photo: doctorPhotos.laser,
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
      photoAlt: "보호 안경을 착용한 대표원장의 레이저 시술 장면",
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
        image: "/images/principles/acne.webp",
        caption: "여드름 · 모공을 설명하는 모식도",
        alt: "프라베일 상담실",
        fullFrame: true,
      },
      {
        title: "상태에 맞는 순서를 정합니다",
        text: "통증이 있는 염증을 먼저 살피고, 피부가 안정되면 흉터와 모공 치료를 논의합니다. 사용 중인 여드름 약도 함께 확인합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "피부의 회복 여유를 남깁니다",
        text: "관리 강도와 시술 범위를 정할 때 붉어짐 · 건조함 등 현재 상태를 고려합니다. 자극을 반복하기보다 회복 경과를 봅니다.",
        image: "/images/page-assets/praveil-acne-barrier-v1.webp",
        caption: "피부 구조를 단순화한 AI 설명용 모식도",
        alt: "경과 진료 방문을 설명하는 병원 대기 공간 사진",
      },
      {
        title: "일상 관리까지 이어갑니다",
        text: "세안과 보습, 자외선 차단, 손으로 짜는 습관을 함께 점검합니다. 다음 진료에서는 새 병변과 자극 여부를 확인합니다.",
        image: "/images/page-assets/praveil-acne-daily-care-v1.webp",
        caption: "AI로 제작한 일상 피부 관리 설명용 이미지",
        alt: "다음 진료 방문을 설명하는 병원 접수 공간 사진",
      },
    ],
    process: [
      {
        title: "1:1 상담",
        text: "여드름 단계와 자국 · 흉터를 살피고, 복용약과 사용 중인 화장품을 확인합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "마취 · 시술 전 준비",
        text: "선택한 관리에 맞춰 세안과 소독을 진행합니다. 필요한 시술에만 마취를 적용합니다.",
        image: "/images/photos/process-anesthesia-model-a.webp",
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
        image: "/images/photos/clinic-5.webp",
        alt: "프라베일 관리실",
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
        edge: "linear-gradient(#f2efee, #d4d3d2)",
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
    featuresTitle: "클라리티2 레이저 제모의 특별함",
    features: [
      {
        title: "755nm · 1064nm 듀얼 파장으로 맞춤형 제모",
        text: "멜라닌 흡수율이 높아 얇고 연한 털에 반응하는 755nm 알렉산드라이트 파장과, 피부 깊숙이 도달해 굵고 뿌리 깊은 털에 쓰는 1064nm Nd:YAG 파장을 모두 탑재했습니다. 남성의 굵은 수염부터 여성의 미세한 인중 털, 팔 · 다리까지 털의 굵기와 깊이에 따라 파장과 설정을 나누어 계획합니다.",
        image: "/images/official/clarity-poster.jpg",
        alt: "클라리티2 · 듀얼 파장 · 제조사 공식 자료",
        fullFrame: false,
        mediaSize: { width: 1280, height: 768 },
        video: "/videos/official-clarity.mp4",
      },
      {
        // 확인 필요: ICD 냉각을 보여 주는 제조사 이미지 (지금은 병원 공간 사진)
        title: "지능형 냉각 시스템(ICD)으로 통증 부담을 줄임",
        text: "레이저 샷이 조사되기 직전, 영하의 가스를 순간적으로 분사해 피부 표면을 보호하는 지능형 냉각 시스템(ICD, Intelligent Cooling Device)이 작동합니다. 통증 부담과 화상 등 이상 반응의 부담을 줄여 주며, 느끼는 정도는 부위와 사람마다 다릅니다.",
        image: "/images/page-assets/praveil-hair-cooling-v1.webp",
        caption: "냉각 방식을 단순화한 AI 설명용 모식도",
        alt: "시술 안내에 사용하는 병원 공간 사진",
      },
      {
        title: "실시간 피부 온도 감지 시스템",
        text: "장비에 실시간 피부 온도 센서가 탑재되어 있어 시술 중 피부 온도를 함께 확인합니다. 온도가 일정 수준 이상으로 올라가면 레이저 조사가 자동으로 제어되므로, 에너지를 일정하게 유지하면서 피부 자극이나 붉은기를 줄이는 데 도움이 됩니다. 표시값만으로 판단하지 않고 열감과 피부 반응도 함께 살핍니다.",
        image: "/images/official/clarity-temperature.png",
        alt: "클라리티2 · 실시간 피부 온도 표시 · 제조사 공식 자료",
        fullFrame: false,
        mediaSize: { width: 841, height: 328 },
        mediaEdges: ["#f4f2ef", "#f4f2ef"],
      },
      {
        title: "인텔리트랙(IntelliTrack)으로 빠짐없는 시술",
        text: "시술자의 손 움직임 속도를 인식해 레이저 샷이 중첩 없이 조사되는 인텔리트랙 기술이 적용되었습니다. 등 · 허벅지 · 종아리처럼 넓은 부위도 누락 없이 균일하게 시술할 수 있고, 제조사는 기존 방식보다 시술 시간이 크게 단축된다고 안내합니다.",
        image: "/images/official/clarity-tracking.png",
        alt: "클라리티2 · 인텔리트랙 · 제조사 공식 자료",
        fullFrame: false,
        mediaSize: { width: 408, height: 464 },
        mediaEdges: ["#ffffff", "#ffffff"],
      },
    ],
    process: [
      {
        title: "1:1 상담",
        text: "부위와 원하는 범위를 정하고, 피부 톤 · 털 굵기 · 복용약 · 태닝 여부를 확인합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "마취 · 시술 전 준비",
        text: "면도 상태를 확인하고 피부를 정리합니다. 필요한 마취 · 냉각과 파장에 맞는 눈 보호구를 준비합니다.",
        image: "/images/photos/process-anesthesia-model-a.webp",
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
        image: "/images/photos/clinic-5.webp",
        alt: "프라베일 관리실",
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
      text: "문신제거는 피부에 들어간 색소에 레이저를 조사해 입자를 잘게 나누고, 몸이 이를 처리하는 과정을 이용합니다. 색소의 색 · 양과 피부 상태에 따라 반응이 달라 완전한 제거를 보장하지는 않습니다. 프라베일에서는 눈썹 · 아이라인 · 언더라인 반영구 문신제거를 진행하며, 눈과 가까운 만큼 시술 가능 여부와 보호 방법부터 확인합니다.",
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
      note: "※ 일반적인 방법 비교이며 실제 제공 시술 목록을 뜻하지 않습니다. 프라베일은 눈썹 · 아이라인 · 언더라인 반영구 문신제거만 진행하며, 수술적 제거는 하지 않습니다. 맞는 방법은 색소와 피부 상태에 따라 다르며, 효과 · 회복 기간에는 개인차가 있습니다.",
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
        text: "아이라인은 눈을 감는 것만으로 보호되지 않습니다. 눈에 맞는 보호구를 쓰고 진행하며, 눈 상태상 안전하게 진행하기 어렵다면 시술을 미룹니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "피부 회복을 기다리는 계획",
        text: "빠르게 반복하기보다 상처와 남은 색을 확인합니다. 딱지 관리 · 보습 · 자외선 차단과 연락이 필요한 증상을 안내합니다.",
        image: "/images/photos/clinic-5.webp",
        alt: "프라베일 관리실",
      },
    ],
    process: [
      {
        title: "1:1 상담",
        text: "반영구 이력과 피부 상태를 확인합니다. 눈가는 보호 방법과 시행 가능 여부부터 평가합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "마취 · 눈 보호",
        text: "필요한 마취를 진행합니다. 눈꺼풀 부위는 적합한 각막 보호구를 포함해 보호 계획을 확인한 경우에만 진행합니다.",
        image: "/images/photos/process-anesthesia-model-a.webp",
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
        image: "/images/photos/clinic-5.webp",
        alt: "프라베일 관리실",
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

// 보톡스: 얼굴 · 바디 (기본 원고에서 다른 점만 바꿈)
const botoxStory = deviceStory["/petit/botox"];
deviceStory["/petit/botox/face"] = {
  ...botoxStory,
  device: {
    ...botoxStory.device,
    text: "얼굴 보톡스는 근육의 움직임을 완화하는 보툴리눔 톡신을 주입해 표정 주름과 윤곽 라인을 정돈하는 시술입니다. 움직일 때 생기는 주름과 이미 자리 잡은 주름의 상태를 구분하고, 부위별 근육의 강도와 표정 습관에 맞춰 디자인합니다.",
  },
};
deviceStory["/petit/botox/body"] = {
  ...botoxStory,
  device: {
    ...botoxStory.device,
    // 확인 필요: 바디 시술 촬영본 (상담 사진을 쓰지 않아 병원 공간 사진)
    image: "/images/photos/clinic-3.webp",
    photo: "/images/photos/clinic-3.webp",
    photoAlt: "프라베일 상담실",
    text: "바디 보톡스는 보툴리눔 톡신(근육의 움직임을 줄이는 주사)을 승모근 · 종아리처럼 큰 근육이나 땀이 많은 부위에 쓰는 시술입니다. 근육의 두께와 범위, 땀이 나는 범위를 살펴 용량과 주사 위치를 정합니다.",
    specs: [
      { label: "방식", value: "보툴리눔 톡신 제제 주사" },
      { label: "주된 작용", value: "근육 부피 · 땀 분비를 일시적으로 줄임" },
      { label: "시술 계획", value: "근육 두께 · 범위 · 좌우 차이 확인" },
      { label: "제품 선택", value: "국산 · 수입 제품 중 상담 후 선택" },
    ],
  },
  // 살피는 4가지 · 과정: 얼굴(표정) 대신 근육 · 땀 기준으로 (사진은 얼굴 보톡스와 같은 것)
  featuresTitle: "바디 보톡스에서 살피는 4가지",
  features: [
    {
      ...botoxStory.features[0],
      title: "근육 범위 · 두께 확인",
      text: "어깨를 올리거나 까치발을 들 때 근육이 솟는 범위와 두께, 좌우 차이를 함께 확인합니다.",
    },
    {
      ...botoxStory.features[1],
      title: "부위와 제품에 맞춘 계획",
      text: "같은 바디 보톡스도 부위와 제제가 다르면 계획이 달라집니다. 제품 정보와 시술 이력을 확인합니다.",
    },
    {
      ...botoxStory.features[2],
      title: "근육 · 지방 · 부기 구분",
      text: "라인이 굵어 보이는 원인이 근육인지, 지방이나 부기인지 먼저 나누어 보고 기대할 수 있는 변화와 한계를 설명합니다.",
    },
    {
      ...botoxStory.features[3],
      title: "변화가 나타난 뒤 경과 확인",
      text: "근육 부피는 서서히 줄어들어, 시술 직후 추가하기보다 경과를 보고 좌우 라인과 불편감을 확인합니다.",
    },
  ],
  process: [
    {
      ...botoxStory.process[0],
      text: "고민 부위, 근육 · 땀 범위, 복용 약과 이전 보툴리눔 톡신 시술 이력을 확인합니다.",
    },
    ...botoxStory.process.slice(1),
  ],
  principle: [
    {
      title: "근육 · 땀 범위 확인",
      text: "근육이 솟은 범위와 두께, 땀이 많이 나는 범위를 먼저 살핍니다.",
    },
    {
      title: "여러 지점에 나누어 주사",
      text: "큰 근육과 넓은 부위는 여러 지점에 고르게 나누어 넣습니다. 제품마다 용량 단위가 달라 숫자만으로 비교하지 않습니다.",
    },
    {
      title: "신경의 전달 신호 감소",
      text: "신경에서 근육 · 땀샘으로 전달되는 신호를 줄여, 근육의 힘과 땀 분비를 일시적으로 줄입니다.",
    },
  ],
};
