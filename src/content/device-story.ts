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
    /** 인물용 덮개 없이, 칸을 꽉 채워 보여 줌 (제품 연출 사진) */
    mediaFill?: boolean;
    /** 칸을 채울 때 어느 쪽을 남길지 (object-position) */
    mediaPosition?: string;
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
    film?: {
      src: string;
      poster: string;
      edge?: string;
      fadeFrom?: string;
      /** 16:9 에 가까운 영상은 좁은 화면에서도 칸을 꽉 채운다 (좌우 띠 없이) */
      fit?: "cover";
    };
    text: string;
    specs: { label: string; value: string }[];
  };
  /** "○○, 어떤 시술인가요?" 대신 쓸 제목 */
  aboutTitle?: string;
  /** "○○, 어떻게 진행되나요?" 대신 쓸 제목 */
  processTitle?: string;
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
    lead?: string;
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
  /** 특별함 머리글 아래 한 줄 */
  featuresLead?: string;
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
    /** 자르고 채울 때 어느 쪽을 남길지 (object-position) */
    mediaPosition?: string;
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
    /** 장비 사진: 케이블 · 바퀴까지 다 보이도록 여백을 두고 전체를 담는다 */
    fit?: "device";
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
      name: "CoolSoniq",
      maker: "ASTERASYS",
      image: "/images/equipment/hero/coolsonic.webp",
      film: {
        src: "/videos/coolsonic-brand.mp4",
        poster: cs("coolsonic-brand"),
        edge: "linear-gradient(#3e4748, #273132)",
      },
      text: "쿨소닉은 고강도 집속 초음파(HIFU)에 ACC 냉각 기술을 적용한 리프팅 장비입니다. 피부 표면을 냉각해 보호하면서 1.5 · 3.0 · 4.5mm 깊이에 에너지를 나누어 전달해 근막층(SMAS)까지 단계적으로 리프팅합니다.",
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
        text: "진피층부터 근막층(SMAS)까지 부위별로 깊이를 선택해 미세한 열응고점을 촘촘하게 형성합니다.",
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
      title: "쿨소닉, 다른 리프팅 장비와 어떻게 다른가요?",
      columns: [
        { name: "쿨소닉", maker: "아스테라시스", self: true },
        { name: "울쎄라", maker: "멀츠" },
        { name: "슈링크 유니버스", maker: "클래시스" },
        { name: "써마지 FLX", maker: "솔타메디칼" },
      ],
      rows: [
        {
          label: "시술 방식",
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
          label: "장비 특징",
          values: [
            "표면 냉각 · 굴곡 부위 밀착",
            "초음파 영상으로 층 확인",
            "다양한 시술 모드 · 얼굴 · 바디",
            "피부 전반 균일 가열 · 탄력 · 피부결",
          ],
        },
        {
          label: "시술 효과",
          values: [
            "턱선 · 볼 처짐, 윤곽",
            "깊은 처짐, 윤곽",
            "윤곽 · 탄력",
            "탄력 · 피부결 · 잔주름",
          ],
        },
        {
          label: "회복 기간",
          values: [
            "일상생활 바로 가능",
            "일상생활 바로 가능",
            "일상생활 바로 가능",
            "일상생활 바로 가능",
          ],
        },
      ],
      note: "※ 각 장비의 일반적인 특징을 정리한 것으로, 어느 장비가 더 낫다는 뜻이 아닙니다. 맞는 장비는 피부 상태와 고민에 따라 다르며, 통증 · 효과 · 유지 기간은 사람마다 다릅니다. 비교 장비의 본원 보유 여부를 뜻하지 않습니다.",
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
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "마취",
        text: "시술 부위에 마취 크림을 도포해 시술 중 불편감을 줄입니다.",
        image: photo("process-anesthesia-model-a"),
        alt: "시술 부위에 마취 크림을 바르는 모습",
      },
      {
        title: "시술",
        text: "피부 표면을 냉각하면서 상담 때 정한 깊이에 맞춰 층별로 나누어 시술합니다.",
        image: doctorPhotos.coolsonic,
        alt: "대표원장이 쿨소닉으로 얼굴 부위를 시술하는 장면",
        fullFrame: true,
        coverPosition: "42% 50%",
      },
      {
        title: "경과 확인",
        text: "시술 직후 상태를 확인하고, 주의사항과 다음 관리 시기를 안내합니다.",
        image: "/images/photos/clinic-5-no-brown-wrap-20261105.webp",
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
      image: "/images/photos/intro-filler-products-5brands-20261107-v2.webp",
      photo: "/images/photos/intro-filler-products-5brands-20261107-v2.webp",
      photoAlt: "뉴라미스 · 레나 · 레스틸렌 · 벨로테로 · 큐티필 제품군을 모은 연출 사진",
      // 인물용 덮개 · 확대 없이 칸을 꽉 채운다
      mediaFill: true,
      text: "필러는 히알루론산(HA) 성분을 피부 아래에 넣어 꺼진 부위의 볼륨을 채우고, 얼굴의 비율과 라인을 다듬는 시술입니다. 부위마다 필요한 단단함과 퍼짐이 달라, 넣는 층과 제품을 나누어 사용합니다.",
      specs: [
        { label: "성분", value: "히알루론산 (HA)" },
        { label: "주입 층", value: "진피층 ~ 골막 위 (부위별)" },
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
      items: [
        {
          name: "뉴라미스",
          en: "Neuramis",
          maker: "메디톡스 · 국내",
          text: "메디톡스의 독자적인 2단계 가교 공법(SHAPE™ 기술)으로 히알루론산 결합 효율을 높인 제품입니다. 미반응 잔류 가교제(BDDE)를 철저히 정제해 시술 후 부기나 이물 반응 부담을 낮춰 안정성과 지속력이 뛰어납니다.",
          image: "/images/product-cards/neuramis-card-v2.svg",
          tags: ["히알루론산", "국산"],
        },
        {
          name: "레나",
          maker: "국내 제조 · 미세 입자 균일화 히알루론산",
          text: "독자적인 입자 균일화 기술로 미세 구형 입자의 크기를 정밀하게 제어했습니다. 고른 입자 배열 덕분에 주입 시 일정한 압출력을 유지하여, 조직 내 뭉침이나 과주입 우려 없이 부드럽고 정교한 몰딩을 기대할 수 있습니다.",
          image: "/images/product-cards/lena-card-v2.svg",
          tags: ["히알루론산", "국산"],
        },
        {
          name: "레스틸렌",
          en: "Restylane",
          maker: "갈더마 · 스웨덴",
          text: "1996년 출시 이후 약 30년간 전 세계적으로 방대한 임상 데이터를 축적한 글로벌 오리지널 히알루론산 필러입니다. 특허받은 NASHA™ 및 OBT™ 공법을 통해 우수한 탄성과 지지력을 바탕으로 자연스러운 시술 효과를 기대할 수 있습니다.",
          image: "/images/product-cards/restylane-card-v3-20261105.svg",
          tags: ["히알루론산", "수입"],
        },
        {
          name: "벨로테로",
          en: "Belotero",
          maker: "멀츠 · 독일",
          text: "독일 멀츠(Merz)사에서 개발한 프리미엄 히알루론산(HA) 필러로, 특허받은 CPM™(다밀도 공법) 기술을 적용해 피부 조직과 이물감 없이 자연스럽게 밀착되어 시술 후 틴들 현상(푸르스름 비침)이나 울퉁불퉁함 없이 매끄러운 볼륨을 기대할 수 있습니다.",
          image: "/images/product-cards/belotero-card-v2.svg",
          tags: ["히알루론산", "수입"],
        },
        {
          // 확인 필요: 큐티필 제조사 표기 (에스테팜 · QTFILL PLUS 기준으로 정리)
          name: "큐티필",
          en: "QTFill",
          maker: "에스테팜 · 국내",
          text: "에스테팜(S.Thepharm)의 독자적인 UHD(초고밀도) 가교 기술을 적용한 국산 히알루론산(HA) 필러입니다. 화학 가교제(BDDE)의 사용량을 낮추면서도 결합력을 높여 체내 잔류 성분 부담을 줄였으며, 우수한 생체 적합성을 바탕으로 편안하고 안정적인 볼륨감을 기대할 수 있습니다.",
          image: "/images/product-cards/qtfill-card-v2.svg",
          tags: ["히알루론산", "국산"],
        },
      ],
      guide: {
        title: "어떤 제품이 맞을까요?",
        text: "부위마다 필요한 단단함과 퍼짐이 다릅니다. 피부 두께와 원하는 모습, 예산을 함께 보고 상담 때 정합니다.",
      },
      note: "※ 어느 제품이 더 낫다는 뜻이 아니며, 효과와 유지 기간은 사람마다 다릅니다.",
    },
    featuresTitle: "프라베일 필러 시술의 특별함",
    featuresPlacement: "after-ba",
    features: [
      {
        title: "환자 맞춤형 시술 계획",
        text: "꺼진 부위만 채우지 않고 정 · 측면 비율을 함께 분석해 얼굴 전체에 자연스러운 볼륨 라인을 설계합니다.",
        image: "/images/filler/photos/point-01.webp",
        alt: "대표원장이 환자의 얼굴 비율을 살피는 진료 장면",
      },
      {
        title: "부위별 맞춤 제품 선택",
        text: "이마 · 볼 · 입술 등 부위별 피부 두께와 움직임에 맞춰 적합한 입자 크기와 점탄성의 제품을 구분해 적용합니다.",
        image: "/images/photos/feature-filler-products-5brands-20261107-v2.webp",
        alt: "뉴라미스 · 레나 · 레스틸렌 · 벨로테로 · 큐티필의 필러 제품군",
        // 사진 자체에 여백이 있어 자르거나 확대하지 않고 그대로 보여 준다
        mediaFit: "contain",
      },
      {
        title: "정품 · 정량 확인 원칙",
        text: "허가받은 정품 필러만을 사용하며, 시술 전 개봉 상태를 안내하고 계획된 용량을 정확히 준수합니다.",
        image: "/images/photos/special-3.webp",
        alt: "프라베일에 비치된 브랜드 공식 인증 상패",
      },
      {
        title: "과하지 않게, 필요한 만큼",
        text: "처음부터 무리한 용량을 주입하지 않고 자연스러운 선에서 마무리하며, 경과에 따라 미세하게 조율합니다.",
        image: "/images/photos/cat-main-petit-model-a.webp",
        alt: "대표원장이 얼굴 부위에 필러를 주입하는 모습",
      },
    ],
    process: [
      {
        title: "1:1 맞춤 상담",
        text: "개인의 이목구비 비율, 피부 두께, 꺼짐의 깊이, 표정 근육의 움직임을 확인합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "클렌징 및 마취",
        text: "시술 부위를 깨끗하게 클렌징하고 감염 예방을 위해 철저히 소독하고 마취 크림을 도포한 후 약 20~30분간 대기합니다.",
        image: "/images/filler/photos/process-02.webp",
        alt: "시술 부위에 마취 크림을 바르는 모습",
      },
      {
        title: "대표원장 직접 시술",
        text: "사전에 정교하게 준비된 시술 계획을 바탕으로 대표원장님이 직접 시술을 진행합니다.",
        image: "/images/photos/cat-main-petit-model-a.webp",
        alt: "대표원장이 얼굴 부위에 필러를 주입하는 모습",
      },
      {
        title: "결과 확인 및 마무리",
        text: "시술대에 앉아 거울을 보며 볼륨감, 좌우 대칭, 표정 변화 시의 어색함 여부를 의료진과 함께 확인합니다. 필요시 미세한 추가 보정을 거친 후 주입 부위에 재생 테이프나 항생 연고를 도포합니다.",
        image: "/images/photos/clinic-5-no-brown-wrap-20261105.webp",
        alt: "프라베일 관리실",
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
      text: "쿨페이즈는 6.78MHz 모노폴라 고주파 에너지를 진피층 깊숙이 전달하는 탄력 리프팅 시술입니다. 독자적인 직접 접촉식 냉각 기술(DCC™)로 피부 표면을 보호하며 심부열을 균일하게 전달하고 개인마다 다른 피부 두께와 굴곡에 맞춰 샷 수와 에너지 레벨을 정교하게 설계하여 탄력부터 잔주름, 모공, 피부결까지 함께 개선합니다.",
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
        text: "전달된 고주파 열이 콜라겐 섬유를 수축시키고 새로운 콜라겐 · 엘라스틴 재생을 도와, 시간을 두고 점차 탄탄한 피부 변화로 이어집니다.",
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
          label: "제조사",
          values: [
            "아스테라시스 · 한국",
            "솔타메디칼 · 미국",
            "원텍 · 한국",
            "인모드 · 이스라엘",
          ],
        },
        {
          label: "시술 방식",
          values: [
            "모노폴라 RF (단극성)",
            "모노폴라 RF (단극성)",
            "모노폴라 RF (단극성)",
            "바이폴라 RF + 고전압 펄스(HVP)",
          ],
        },
        {
          label: "장비 특징",
          values: [
            "직접 접촉식 냉각 (DCC™)",
            "펄스형 냉각 스프레이 (Cryogen)",
            "접촉 냉각 + 쿨링 가스 분사",
            "실시간 온도 감지 센서 제어",
          ],
        },
        {
          label: "시술 효과",
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
    featuresRatio: 4 / 3,
    featuresTitle: "쿨페이즈 리프팅의 4가지 특징",
    // 특징: 장면이 겹치지 않게 (원리 영상 · 장비 영상 · 팁 영상 · 시술 사진)
    features: [
      {
        title: "표면은 차갑게, 피부 속은 뜨겁게 (DCC™ 기술)",
        text: "접촉면 전체를 지속적으로 급속 냉각하는 DCC™ 기술이 표피를 보호하고 열 자극과 통증 부담을 낮춥니다. 표면 냉각을 이어 가며 시술해 시술 중 부담을 덜고 한층 편안하게 받아보실 수 있습니다.",
        image: "/images/coolphase/principle-feature.webp",
        video: "/videos/coolphase-cooling.mp4",
        alt: "쿨페이즈 팁의 직접 접촉 냉각과 피부 속 고주파 열 전달을 보여 주는 제조사 원리 영상",
        mediaSize: { width: 1280, height: 960 },
      },
      {
        title: "진피 깊은 층까지 도달하는 6.78MHz 모노폴라 RF",
        text: "피부 표면에 머무르지 않고 진피층 깊숙이 심부열을 균일하게 전달하여 콜라겐 수축과 재생을 유도합니다. 처진 윤곽의 타이트닝부터 잔주름, 모공, 거친 피부결까지 함께 고려합니다.",
        image: "/images/coolphase/device.webp",
        video: "/videos/coolphase-device.mp4",
        alt: "쿨페이즈 장비와 핸드피스를 보여 주는 제조사 영상",
        mediaSize: { width: 1280, height: 720 },
        mediaFit: "cover",
      },
      {
        title: "환자별 · 부위별 상태를 고려한 맞춤 팁",
        text: "개인마다 다른 피부 두께와 굴곡에 맞춘 다양한 전용 팁이 준비되어 있습니다. 볼과 턱선 등 넓은 부위부터 눈가 · 입가처럼 굴곡진 부위까지 빈틈없이 밀착하여 시술 사각지대 없이 균일한 타이트닝을 유도합니다.",
        image: "/images/coolphase/tip-loop.webp",
        video: "/videos/coolphase-tip-loop.mp4",
        alt: "쿨페이즈 얼굴용 팁(Face Tip)의 모양을 보여 주는 제조사 영상",
        mediaSize: { width: 960, height: 720 },
      },
      {
        title: "10단계 고주파 에너지 전달",
        text: "피부 탄력도와 통증 민감도에 맞춰 고주파 출력을 1단계부터 10단계까지 정밀하게 조절합니다. 피부 반응에 맞춘 미세 제어로 불필요한 자극은 줄이고, 타깃층에 필요한 열에너지를 안정적으로 전달해 리프팅 효율을 높입니다.",
        image: doctorPhotos.coolphase,
        alt: "대표원장이 쿨페이즈로 얼굴 부위를 시술하는 장면",
        fullFrame: true,
        mediaFit: "cover",
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
        text: "피부 표면을 냉각하면서 계획된 부위에 정밀하게 고주파 에너지를 전달합니다. 시술 중 실시간 피부 반응과 열감을 확인하며 에너지와 샷 수를 조절합니다.",
        image: doctorPhotos.coolphase,
        alt: "대표원장이 쿨페이즈로 얼굴 부위를 시술하는 장면",
        fullFrame: true,
        coverPosition: "50% 50%",
      },
      {
        title: "진정 관리 및 주의사항 안내",
        text: "시술 직후 피부 상태를 꼼꼼히 확인하고 진정 케어를 진행합니다. 당일 세안과 보습 방법, 주의사항 및 권장 관리 주기를 안내해 드립니다.",
        image: "/images/photos/clinic-5-no-brown-wrap-20261105.webp",
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
      image: "/images/photos/intro-botox-products-20261105.webp",
      photo: "/images/photos/intro-botox-products-20261105.webp",
      photoAlt: "뉴럭스 · 코어톡스 · 제오민 제품 상자와 바이알",
      // 인물용 덮개 · 확대 없이 칸을 꽉 채운다
      mediaFill: true,
      text: "보톡스는 보툴리눔 톡신(근육의 움직임을 줄이는 주사)을 이용하는 시술입니다. 움직일 때 생기는 표정주름과 가만히 있어도 남는 주름을 구분하고, 근육의 힘과 표정 습관을 고려하여 계획합니다.",
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
    },
    principle: [
      {
        title: "표정과 근육 움직임 확인",
        text: "표정을 지을 때 주름이 생기는 위치와 근육의 움직임, 좌우 차이를 고려합니다.",
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
          image: "/images/product-cards/newlux-card-v2.svg",
          en: "Newlux",
          maker: "뉴메코(메디톡스 계열) · 국내",
          text: "뉴럭스는 제조 공정에서 동물 유래 성분을 배제하고 불순물을 크게 줄인 차세대 국산 톡신입니다. 빠른 효과 발현과 안정적인 유지력을 기대할 수 있습니다.",

          tags: ["국산"],
        },
        {
          name: "코어톡스",
          image: "/images/product-cards/coretox-card-v2.svg",
          en: "Coretox",
          maker: "메디톡스 · 국내",
          text: "코어톡스는 내성(항체 형성)을 유발하는 원인인 불필요한 복합단백질을 정제 · 제거한 순수 톡신입니다. 주기적인 반복 시술을 계획 중이거나, 바디 라인처럼 대용량 시술 시 내성 부담을 크게 덜 수 있습니다.",

          tags: ["국산"],
        },
        {
          name: "제오민",
          image: "/images/product-cards/xeomin-card-v2.svg",
          en: "Xeomin",
          maker: "멀츠 · 독일",
          text: "제오민은 세계 최초로 복합단백질을 완전히 분리한 프리미엄 수입 순수 톡신입니다. 코어톡스와 마찬가지로 반복 시술에 따른 내성 반응 가능성을 크게 줄여줍니다.",

          tags: ["수입"],
        },
      ],
      note: "※ 제품마다 용량 단위가 달라 숫자만으로 비교하지 않으며, 어느 제품이 더 낫다는 뜻이 아닙니다. 효과와 유지 기간은 사람마다 다릅니다.",
    },
    featuresTitle: "프라베일 보톡스의 특별함",
    featuresPlacement: "after-ba",
    features: [
      {
        title: "정품 · 정량 확인 및 투명한 원칙",
        text: "국내외 승인을 거친 안전한 정품만을 사용하며, 정해진 희석 비율과 적정 용량을 엄격히 준수합니다.",
        image: "/images/photos/special-3.webp",
        alt: "프라베일에 비치된 장비 공식 인증패",
      },
      {
        title: "표정 근육을 고려한 자연스러운 움직임",
        text: "근육의 움직임과 힘의 방향을 정밀하게 분석하여 표정이 어색하게 굳지 않고 자연스럽게 정돈되도록 설계합니다.",
        image: "/images/photos/cat-botox-model-a-v3.webp",
        alt: "주입 시술의 계획을 설명하기 위한 기존 사진",
      },
      {
        title: "장기 시술을 고려한 내성 관리 솔루션",
        text: "반복 시술에서 반응이 떨어지는 부담을 줄이기 위해 복합 단백질을 정제한 톡신 라인업을 갖추고, 권장 주기보다 짧은 간격의 재시술은 권하지 않습니다.",
        image: "/images/photos/hero-consult.webp",
        alt: "프라베일 상담실",
        fullFrame: true,
      },
      {
        title: "피부층과 근육층을 고려한 분할 주입",
        text: "깊은 표정 주름을 완화하는 근육층 타깃과, 미세 잔주름 및 결을 정돈하는 얕은 진피층 타깃을 목적에 맞게 맞춤 적용합니다.",
        image: "/images/photos/cat-injection-model-a.webp",
        alt: "주입 깊이를 설명하기 위한 기존 주사 시술 사진",
      },
    ],

    process: [
      {
        title: "1:1 맞춤 상담 및 진단",
        text: "가만히 있을 때와 표정을 지을 때의 근육 움직임을 고려하고, 이전 시술 주기와 만족도를 확인하여 알맞은 주사 부위와 유닛(용량)을 결정합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "마취 진행",
        text: "주사 부위를 깨끗하게 소독하고 정돈한 뒤, 따끔한 자극과 통증 부담을 덜어드릴 수 있도록 냉각 쿨링기나 마취 크림으로 피부를 준비합니다.",
        image: "/images/photos/process-anesthesia-model-a.webp",
        alt: "피부 준비와 통증 관리를 설명하는 사진",
      },
      {
        title: "부위별 맞춤 시술",
        text: "설계된 핵심 근육 포인트를 정확히 짚어 정품 · 정량의 약물을 주사하며, 주변 표정 근육에 불필요하게 번지지 않도록 세심하게 진행합니다.",
        image: "/images/photos/cat-main-petit-model-a.webp",
        alt: "부위에 맞춰 주사하는 대표원장",
      },
      {
        title: "주의사항 및 경과 안내",
        text: "약물이 바르게 작용할 수 있도록 당일 눕거나 문지르지 않는 등 필수 관리법을 설명해 드리고, 효과가 나타나는 시점과 주의사항을 안내합니다.",
        image: "/images/photos/clinic-5-no-brown-wrap-20261105.webp",
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
      photo: "/images/retuo/product-intro-cutout-v2.png",
      photoAlt: "리투오 제품 상자와 본품 (제조사 공식 자료)",
      mediaContain: true,
      mediaSize: { width: 730, height: 548 },
      text: "리투오(Re2O)는 면역 거부 세포를 제거하고 세포외기질(ECM)만을 정제한 무세포 동종진피(hADM) 스킨부스터입니다. 인체 진피와 동일한 콜라겐과 엘라스틴 등 필수 기저 물질을 직접 보충하여 얇아진 피부의 진피 환경을 개선해주는 시술입니다.",
      specs: [
        { label: "제품 분류", value: "무세포 동종진피(hADM) 스킨부스터" },
        { label: "핵심 원료", value: "정제된 인체 피부 유래 세포외기질(ECM)" },
        {
          label: "유효 성분",
          value: "콜라겐 · 엘라스틴 · 단백질 복합체 등 진피 지지 구조",
        },
        {
          label: "주요 효과",
          value: "얇아진 진피층 · 미세 잔주름 · 탄력 밀도",
        },
        {
          label: "시술 설계",
          value: "부위별 피부 두께와 노화도에 따른 1:1 맞춤 용량 배분",
        },
      ],
    },
    principle: [
      {
        title: "부위별 맞춤 시술 디자인",
        text: "환자분의 고민 부위와 얼굴 굴곡에 맞춰 주입 위치와 용량을 1:1로 정교하게 디자인합니다.",
      },
      {
        title: "타깃 진피층에 맞춘 주입 깊이 설정",
        text: "리투오가 피부 속에 고르게 작용할 수 있도록 부위별 피부 두께에 맞춘 정확한 주입 깊이를 설정합니다.",
      },
      {
        title: "대표원장 1:1 맞춤 시술",
        text: "세밀하게 준비된 시술 계획에 맞춰 대표원장이 모든 시술 과정을 직접 진행합니다.",
      },
    ],
    compare: {
      // 리투오는 스킨부스터로 부르고 있으므로, 묶음 이름 대신 비교 대상을 직접 적는다
      title: "리투오, 쥬베룩 · 울트라콜과 어떻게 다른가요?",
      lead: "프라베일에서 함께 상담하는 주입 시술을 재료별 특징에 따라 정리했습니다.",
      columns: [
        {
          name: "리투오",
          maker: "인체 유래 hADM",
          self: true,
        },
        {
          name: "쥬베룩",
          maker: "PDLLA · HA",
        },
        {
          name: "울트라콜",
          maker: "PDO",
        },
      ],
      rows: [
        {
          label: "주 성분",
          values: [
            "무세포 동종진피 기질 성분",
            "PDLLA 미세입자 · 히알루론산",
            "PDO (폴리디옥사논) 성분",
          ],
        },
        {
          label: "기대 효과",
          values: [
            "피부결 · 잔주름 · 피부 밀도 · 탄력",
            "피부결 · 탄력 · 얕은 부위 꺼짐",
            "피부결 · 탄력 · 전반적인 볼륨",
          ],
        },
        {
          label: "주요 포인트",
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
    featuresRatio: 4 / 3,
    featuresTitle: "리투오의 특별함 4가지",
    features: [
      {
        title: "세포 성분을 제거해 가공한 인체 조직 유래 hADM",
        text: "리투오는 인체 피부 조직에서 세포를 제거하고 얻은 무세포 동종진피(hADM)를 미세하게 가공한 성분입니다. 콜라겐, 엘라스틴, 히알루론산 등 실제 사람의 피부를 이루는 세포외기질(ECM) 성분을 담고 있어 생체 적합성이 높은 편입니다.",
        image: "/images/skin-features/retuo/retuo-point-01-hadm-20261105-v2.webp",
        mediaSrcSet: "/images/skin-features/retuo/retuo-point-01-hadm-20261105-v2-800.webp 800w, /images/skin-features/retuo/retuo-point-01-hadm-20261105-v2.webp 1200w",
        alt: "인체 조직 유래 hADM — AI 설명용 모식도",
      },
      {
        title: "얇아진 피부 속 지지대를 바로 세우는 구조적 보강",
        text: "노화나 외부 자극으로 진피층의 밀도가 떨어지고 얇아진 피부는 일반적인 수분 관리만으로는 유지 기간이 아쉽기 쉽습니다. 리투오는 무너진 피부 속 지지대 환경을 구조적으로 보완하여 속부터 탄탄한 힘을 길러 줍니다.",
        image: "/images/skin-features/retuo/retuo-point-02-dermal-support-20261105-v2.webp",
        mediaSrcSet: "/images/skin-features/retuo/retuo-point-02-dermal-support-20261105-v2-800.webp 800w, /images/skin-features/retuo/retuo-point-02-dermal-support-20261105-v2.webp 1200w",
        alt: "진피의 구조적 지지 — AI 설명용 모식도",
      },
      {
        title: "인체 조직 유래 성분 기반의 생체 적합성",
        text: "합성 고분자 재료와 달리 인체 피부 조직에서 얻은 성분을 기반으로 해 이물감에 대한 부담이 적은 편입니다.",
        image: "/images/skin-features/retuo/retuo-point-03-acellular-matrix-20261105-v2.webp",
        mediaSrcSet: "/images/skin-features/retuo/retuo-point-03-acellular-matrix-20261105-v2-800.webp 800w, /images/skin-features/retuo/retuo-point-03-acellular-matrix-20261105-v2.webp 1200w",
        alt: "무세포 기질과 주변 조직 — AI 설명용 모식도",
      },
      {
        title: "진피 밀도 강화로 완성하는 잔주름 · 결 · 탄력 케어",
        text: "단순히 표면만 일시적으로 채우는 것이 아니라, 피부 속 진피 밀도를 촘촘히 채워 줍니다. 잔주름이 신경 쓰이는 부위나 거칠어진 피부결, 저하된 탄력 전반을 함께 고려합니다.",
        image: "/images/skin-features/retuo/retuo-point-04-skin-texture-20261105-v2.webp",
        mediaSrcSet: "/images/skin-features/retuo/retuo-point-04-skin-texture-20261105-v2-800.webp 800w, /images/skin-features/retuo/retuo-point-04-skin-texture-20261105-v2.webp 1200w",
        alt: "피부결과 진피 구조 — AI 설명용 모식도",
      },
    ],
    process: [
      {
        title: "맞춤 피부 진단",
        text: "피부결과 탄력 저하도를 고려하여 주입 부위와 적정 용량을 설계합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "클렌징 & 마취",
        text: "피부 표면을 정돈한 뒤 통증 완화를 위한 마취 크림을 도포합니다.",
        image: "/images/photos/process-anesthesia-model-a.webp",
        alt: "시술 준비와 통증 관리를 진행하는 장면",
      },
      {
        title: "진피층 정밀 주입",
        text: "타깃 진피층에 유효 성분을 균일한 간격으로 직접 주입합니다.",
        image: "/images/photos/cat-injection-model-a.webp",
        alt: "계획한 부위에 주입을 진행하는 대표원장",
      },
      {
        title: "진정 및 사후 안내",
        text: "엠보싱과 붉은기 진정 케어를 진행한 뒤 일상 주의사항을 안내해 드립니다.",
        image: "/images/photos/clinic-5-no-brown-wrap-20261105.webp",
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
        text: "건조함, 잔주름, 거친 결 중 무엇이 먼저인지 고려하고, 염증이나 상처가 있는지도 확인합니다.",
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
          label: "주요 효과",
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
    featuresRatio: 4 / 3,
    featuresTitle: "스킨부스터를 계획하는 4가지 기준",
    features: [
      {
        title: "리쥬란 · PN 성분을 확인",
        text: "리쥬란은 연어에서 유래한 PN을 주성분으로 하는 제품입니다. 제조사 원료 이미지와 제품 정보를 함께 고려하여 피부 상태와 사용목적에 맞는지 확인합니다.",
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
        text: "얼굴 전체를 같은 방식으로 접근하지 않고, 피부 두께와 민감한 부위를 고려하여 범위를 정합니다.",
        image: "/images/photos/cat-main-skin-model-a.webp",
        alt: "피부 부위별 계획 설명용 기존 시술 사진",
        mediaFit: "cover",
      },
      {
        title: "반응을 보며 다음 단계 결정",
        text: "부기와 멍, 주입 자국을 확인하고 경과에 따라 다음 계획을 정합니다. 추가 시술은 필요성을 다시 확인하여 결정합니다.",
        image: "/images/photos/clinic-5-no-brown-wrap-20261105.webp",
        alt: "프라베일 관리실",
        mediaFit: "cover",
      },
    ],
    process: [
      {
        title: "상담 · 계획",
        text: "피부 상태와 이전 시술 이력을 확인하고, 스킨부스터의 범위와 기대할 수 있는 변화를 함께 정합니다.",
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
        image: "/images/photos/cat-skin-care.webp",
        alt: "시술 과정 설명용 기존 주입 시술 사진",
        coverPosition: "43% 50%",
      },
      {
        title: "경과 확인",
        text: "시술 직후 상태를 확인하고, 제품별 주의사항과 다시 진료를 받아야 할 증상을 안내합니다.",
        image: "/images/photos/clinic-5-no-brown-wrap-20261105.webp",
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
      photo:
        "/images/products/rejuran-healer-confirmed-silver-top-2syringes-20261105.webp",
      photoAlt: "은색 상단과 검정 하단의 리쥬란힐러 박스와 주사기 2개",
      mediaContain: true,
      // 원본 475×512. 박스와 주사기가 잘리지 않게 칸 안에 전체를 담는다
      mediaSize: { width: 475, height: 512 },
      text: "리쥬란힐러는 연어 DNA에서 추출한 고순도 생체 적합 물질인 PN(Polynucleotide)을 진피층에 정밀 주입하는 피부 재생 스킨부스터입니다. 인위적인 볼륨 형성이 아닌 손상된 세포외기질(ECM)과 진피 환경 회복을 유도하여 얇아진 피부의 치밀도를 높이고 무너진 유수분 밸런스를 개선해줍니다.",
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
        text: "거친 피부결과 피부 두께, 눈가처럼 피부가 얇고 예민한 부위의 특성을 고려하고 주입 범위를 정밀하게 계획합니다.",
      },
      {
        title: "PN 성분의 미세 분할 주입",
        text: "숙련된 의료진이 전용 미세 바늘을 이용해 진피층의 정확한 깊이에 유효 성분을 균일하고 촘촘하게 나누어 주입합니다.",
      },
      {
        title: "피부 환경 관리 및 컨디션 확인",
        text: "주입된 PN 성분이 피부 고유의 환경을 다스리는 데 도움을 줍니다.",
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
          label: "주 성분",
          values: [
            "PN 단독 (오리지널)",
            "PN 단독 (점도 조절)",
            "PN 단독 (국내산 연어 DNA)",
            "PN 단독 (연어 유래)",
            "PN 단독 (시리즈 중 M 라인)",
          ],
        },
        {
          label: "시술 부위",
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
            "●●●●○",
            "●●●○○",
            "●●●○○",
            "●●●○○",
            "●●●○○",
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
    featuresRatio: 4 / 3,
    featuresTitle: "리쥬란힐러의 4가지 특징",
    features: [
      {
        title: "인체 적합성이 뛰어난 고순도 생체 고분자 PN 성분",
        text: "연어 DNA에서 추출 · 정제한 폴리뉴클레오티드(PN)는 열에 안정적이며 체내 이물 반응이 극히 적은 물질로, 손상된 피부 기저 환경과 조직 재생 반응을 안정적으로 활성화합니다.",
        image: "/images/skin-features/rejuran/rejuran-point-01-pn-20261105-v2.webp",
        mediaSrcSet: "/images/skin-features/rejuran/rejuran-point-01-pn-20261105-v2-800.webp 800w, /images/skin-features/rejuran/rejuran-point-01-pn-20261105-v2.webp 1200w",
        alt: "PN 성분 — AI 설명용 모식도",
      },
      {
        title: "얇아진 진피층의 치밀도 및 탄력 구조 복원",
        text: "일시적인 표피 수분 공급에 그치지 않고 진피층에 유효 성분을 직접 전달하여 세포외기질(ECM)을 개선하고 무너진 유수분 밸런스와 피부 밀도를 탄탄하게 채워줍니다.",
        image: "/images/skin-features/rejuran/rejuran-point-02-dermis-20261105-v2.webp",
        mediaSrcSet: "/images/skin-features/rejuran/rejuran-point-02-dermis-20261105-v2-800.webp 800w, /images/skin-features/rejuran/rejuran-point-02-dermis-20261105-v2.webp 1200w",
        alt: "진피층의 지지 구조 — AI 설명용 모식도",
      },
      {
        title: "부위별 피부 두께를 고려한 정교한 시술",
        text: "얇은 눈가부터 볼, 움직임이 많은 입가까지 부위마다 피부 두께와 구조는 모두 다릅니다. 피부 속 혈관과 표정 변화까지 섬세하게 계산해, 필요한 깊이에 일정한 간격으로 촘촘하게 나누어 주입합니다.",
        image: "/images/skin-features/rejuran/rejuran-point-03-injection-diagram-20261105-v3.webp",
        mediaSrcSet: "/images/skin-features/rejuran/rejuran-point-03-injection-diagram-20261105-v3-800.webp 800w, /images/skin-features/rejuran/rejuran-point-03-injection-diagram-20261105-v3.webp 1200w",
        alt: "피부 단면에 주입 위치와 분포를 표현한 설명용 모식도",
      },
      {
        title: "피부 본연의 자가 재생력 강화",
        text: "겉만 채우는 방식이 아닌 피부 속 세포 환경부터 바로잡습니다. 피부 장벽 강화부터 얇아진 잔주름, 거친 피부결까지 시간이 지날수록 전반적인 피부 컨디션이 개선됩니다.",
        image: "/images/skin-features/rejuran/rejuran-point-04-doctor-consult-20261105-v3.webp",
        mediaSrcSet: "/images/skin-features/rejuran/rejuran-point-04-doctor-consult-20261105-v3-800.webp 800w, /images/skin-features/rejuran/rejuran-point-04-doctor-consult-20261105-v3.webp 1200w",
        alt: "원장님이 환자와 마주 앉아 대화하는 프라베일 상담 장면",
        caption: "프라베일 원내 상담 장면입니다.",
      },
    ],
    process: [
      {
        title: "1:1 맞춤 상담 및 디자인",
        text: "현재 피부의 건조함, 탄력 저하, 잔주름 부위를 고려하고 피부 두께에 맞춰 알맞은 주사 부위와 적정 용량을 결정합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "클렌징 및 마취 크림 도포",
        text: "시술 부위를 깨끗하게 세안하고 정돈한 뒤, 주사 시 따끔거림과 통증을 덜어드리기 위해 마취 크림을 꼼꼼히 바릅니다.",
        image: "/images/photos/process-anesthesia-model-a.webp",
        alt: "기존 마취 준비 사진",
      },
      {
        title: "진피층 정밀 주사",
        text: "정품 리쥬란힐러를 확인한 후, 피부 속 진피층에 유효 성분을 일정하고 촘촘한 간격으로 나누어 주입합니다.",
        image: "/images/skin-features/rejuran/rejuran-process-03-product-20261105.webp",
        alt: "시술 직전 확인하는 리쥬란 정품 패키지와 주사기",
      },
      {
        title: "진정 관리 및 주의사항 안내",
        text: "시술 직후 올록볼록하게 올라온 엠보싱 자국과 붉은기를 진정시키고, 세안과 화장 시점 등 사후 관리법을 안내해 드립니다.",
        image: "/images/photos/clinic-5-no-brown-wrap-20261105.webp",
        alt: "프라베일 관리실",
      },
    ],
  },
  // 확인 필요: 엑소좀 제품(ISCE) 공식 사진 · 제조사 · 허가 사항 (지금은 기존 진료 사진)
  "/skin/booster/exosome": {
    kind: "procedure",
    diagram: "booster",
    principleLayout: "figure-first",
    principleImage: {
      src: "/images/page-assets/isce-mechanism-skin-microchannels-20261105-v1.webp",
      alt: "피부층과 미세 통로, 표면 도포 성분을 표현한 개념 모식도",
      marks: [],
      layers: [],
      framed: true,
      noteOverlay: true,
      note: "원리 이해를 위한 모식도입니다. 실제 입자 크기 · 도달 깊이나 효과를 나타내지 않습니다.",
    },
    showPrices: true,
    device: {
      name: "엑소좀",
      maker: "ISCE EXOSOME",
      image: "/images/page-assets/isce-product-presentation-20261105-v2.webp",
      // 어두운 섹션에 맞춘 배경형 이미지 (투명 누끼가 아님)
      photo: "/images/page-assets/isce-product-presentation-20261105-v2.webp",
      photoAlt: "ISCE 1 · 2 패키지와 바이알 구성 — 제품 자료를 참고한 AI 이미지",
      mediaContain: true,
      text: "줄기세포 배양액에서 고순도로 분리한 핵심 신호 전달 물질(Exosome)을 진피층에 직접 침투시킵니다. 만성적인 트러블과 붉은 기, 무너진 유수분 밸런스로 지친 피부의 염증 반응을 완화하고 세포 활성화를 유도하여 건강한 피부 환경으로 개선합니다.",
      specs: [
        {
          label: "적용 제품",
          value: "ISCE 엑소좀 (고순도 줄기세포 유래 세포외소포체)",
        },
        {
          label: "주요 대상",
          value: "무너진 피부 장벽, 만성 홍조 · 예민 피부, 유수분 불균형, 피부결 개선",
        },
        {
          label: "침투 방식",
          value:
            "MTS 또는 피부 흡수 유도 장비 (포텐자 펌핑팁을 함께 쓰는 구성은 별도 패키지)",
        },
        {
          label: "권장 주기",
          value: "2~3주 간격 3~5회 집중 시술 권장 (이후 1~2개월 주기 유지 관리)",
        },
        {
          label: "회복 기간",
          value: "당일 가벼운 일상생활 가능 (붉은 기는 24시간 내외 자연 진정)",
        },
      ],
    },
    principle: [
      {
        title: "피부 장벽 상태 및 손상도 진단",
        text: "붉은 기, 민감도, 유수분 밸런스 붕괴 등 피부 장벽의 손상 정도를 고려하여 적합한 침투 깊이와 적용 범위를 설정합니다.",
      },
      {
        title: "고순도 엑소좀 유효 성분 침투",
        text: "미세 채널을 통해 줄기세포 유래 핵심 재생 신호 물질(엑소좀)을 진피층 깊숙이 고르게 침투시킵니다.",
      },
      {
        title: "세포 신호 전달 및 자생력 개선",
        text: "엑소좀이 손상된 세포에 재생 신호를 전달하여 염증 반응을 가라앉히고, 피부 장벽 강화와 건강한 환경 회복을 유도합니다.",
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
            "피부줄기세포 배양액 기술을 적용한 제품으로, 피부 결합력과 탄력을 함께 관리합니다.",
            "임상 자료가 비교적 많이 쌓인 4세대 엑소좀으로, 콜라겐 · 엘라스틴을 함께 관리합니다.",
            "PDRN(연어 성분)이 함께 배합되어 있고, 식물성 엑소좀의 항산화 특성을 함께 관리합니다.",
          ],
        },
      ],
      note: "※ 각 제품의 일반적인 특징을 제조사 자료를 바탕으로 정리한 것으로, 어느 제품이 더 낫다는 뜻이 아닙니다. 맞는 제품은 피부 상태와 고민에 따라 다르며, 효과 · 유지 기간은 사람마다 다릅니다.",
    },
    featuresRatio: 4 / 3,
    featuresTitle: "ISCE 엑소좀의 4가지 특징",
    features: [
      {
        title: "인체표피줄기세포 배양액(EPC-CM) 기반 설계",
        text: "지방이나 골수 등 타 조직 유래 성분과 달리, 피부 본연의 조직 환경과 일치하는 인체표피줄기세포 배양액을 적용하여 피부 세포와의 친화력과 자생 신호 흡수율을 높입니다.",
        image: "/images/skin-features/isce/isce-point-01-conditioned-medium-20261105-v2.webp",
        mediaSrcSet: "/images/skin-features/isce/isce-point-01-conditioned-medium-20261105-v2-800.webp 800w, /images/skin-features/isce/isce-point-01-conditioned-medium-20261105-v2.webp 1200w",
        alt: "표피 유래 세포 배양액 — AI 설명용 모식도",
      },
      {
        title: "피부 상태에 맞춘 관리 계획",
        text: "표피와 진피가 맞닿는 결합 구조(기저막, DEJ)는 나이가 들며 느슨해지기 쉬운 부위입니다. 피부결과 보습, 지금의 피부 상태를 함께 보며 시술 계획을 세웁니다.",
        image: "/images/skin-features/isce/isce-point-02-dej-20261105-v2.webp",
        mediaSrcSet: "/images/skin-features/isce/isce-point-02-dej-20261105-v2-800.webp 800w, /images/skin-features/isce/isce-point-02-dej-20261105-v2.webp 1200w",
        alt: "표피 · 진피 사이 DEJ — AI 설명용 모식도",
      },
      {
        title: "표피 · 유산균 유래 엑소좀 및 다중 성장인자 복합 처방",
        text: "인체표피 엑소좀에 피부 마이크로바이옴 환경을 안정화하는 유산균 엑소좀과 필수 성장인자(hGH, VEGF 등)를 최적 비율로 배합해 염증 진정과 조직 재생 시너지를 유도합니다.",
        image: "/images/skin-features/isce/isce-point-03-vesicle-complex-20261105-v2.webp",
        mediaSrcSet: "/images/skin-features/isce/isce-point-03-vesicle-complex-20261105-v2-800.webp 800w, /images/skin-features/isce/isce-point-03-vesicle-complex-20261105-v2.webp 1200w",
        alt: "소포와 복합 성분 구성 — AI 설명용 모식도",
      },
      {
        title: "4세대 복합 안티에이징 스킨부스터",
        text: "단순 수분 공급을 넘어 얇고 예민해진 피부 장벽의 기저 환경을 근본적으로 복구하며, 미세 잔주름, 거친 피부결, 만성 건조 등 복합적인 피부 노화 징후를 동시에 개선합니다.",
        image: "/images/skin-features/isce/isce-point-04-skin-barrier-20261105-v2.webp",
        mediaSrcSet: "/images/skin-features/isce/isce-point-04-skin-barrier-20261105-v2-800.webp 800w, /images/skin-features/isce/isce-point-04-skin-barrier-20261105-v2.webp 1200w",
        alt: "피부 장벽의 표면 구조 — AI 설명용 모식도",
      },
    ],
    process: [
      {
        title: "진단 및 설계",
        text: "피부 민감도와 장벽 손상도를 분석한 뒤 최적의 침투 장비(포텐자 · MTS 등)를 결정합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "클렌징 · 마취",
        text: "표면 유분과 노폐물을 세안한 뒤 시술 자극 완화를 위해 마취 크림을 도포합니다.",
        image: "/images/photos/process-anesthesia-model-a.webp",
        alt: "기존 마취 준비 사진",
      },
      {
        title: "맞춤 시술 진행",
        text: "고순도 엑소좀 유효 성분을 진피층까지 균일하게 전달합니다.",
        image: "/images/photos/process-isce-03-products-only-20261106-v1.webp",
        alt: "ISCE 1과 ISCE 2 상자 및 바이얼을 배치한 제품 단독 연출 이미지",
      },
      {
        title: "진정 및 사후 케어",
        text: "열감과 붉은기 진정 쿨링 케어 후 장벽 재생을 위한 일상 수칙을 안내해 드립니다.",
        image: "/images/photos/clinic-5-no-brown-wrap-20261105.webp",
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
      text: "콜라겐부스터는 서로 다른 재료의 주입 시술을 묶어 부르는 말입니다. 인체조직에서 얻은 성분과 합성 고분자 재료는 특성이 다릅니다. 제품별 원료와 사용목적을 구분하고 피부 상태와 주입 부위에 맞춰 계획합니다. 사진은 쥬베룩 제품이며, 아래에서 쥬베룩 · 울트라콜의 재료를 나누어 설명합니다.",
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
        text: "주름, 꺼짐, 피부 두께를 고려하고 필요한 변화와 시술로 기대할 수 있는 범위를 정합니다.",
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
    featuresRatio: 4 / 3,
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
        title: "덩어리감까지 점검하는 경과 확인",
        text: "부기가 빠지는 과정과 오래가는 결절감을 구분합니다. 열감이나 통증이 동반되면 다음 시술보다 진찰을 먼저 진행합니다.",
        image: "/images/photos/signature-3.webp",
        alt: "경과 확인 설명용 기존 피부 시술 사진",
        mediaFit: "cover",
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
        image: "/images/photos/cat-skin-care.webp",
        alt: "시술 과정 설명용 기존 주입 시술 사진",
        coverPosition: "43% 50%",
      },
      {
        title: "경과 확인",
        text: "부기와 멍, 덩어리감이나 염증 증상을 확인합니다. 마사지를 포함한 관리는 제품별로 따로 안내합니다.",
        image: "/images/photos/clinic-5-no-brown-wrap-20261105.webp",
        alt: "프라베일 관리실",
      },
    ],
    principleImage: {
      src: "/images/official/juvelook-structure.png",
      alt: "쥬베룩 공식 PDLLA 미세입자 구조 이미지",
      marks: [],
      layers: [],
      framed: false,
      noteOverlay: true,
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
      mediaSize: { width: 298, height: 681 },
      photoAlt: "쥬베룩 공식 제품 바이알",
      mediaContain: true,
      text: "쥬베룩은 자가 콜라겐 생성을 유도하는 고분자 PDLLA(폴리-D,L-락트산) 미세입자와 수분감을 주는 히알루론산(HA) 성분이 결합된 4세대 콜라겐부스터입니다. 일시적으로 외부 물질을 채워 넣는 일반 필러와 달리, 피부 속 세포를 자극해 스스로 콜라겐을 만들도록 돕는 방식이라 시간이 흐를수록 서서히 차오르는 탄력을 확인하게 됩니다.",
      specs: [
        { label: "성분", value: "PDLLA · 히알루론산" },
        { label: "분류", value: "조직수복용재료 · 의료기기" },
        { label: "주입 층", value: "진피층" },
        { label: "용량", value: "2cc · 3cc · 4cc" },
      ],
    },
    principleImage: {
      src: "/images/skin-features/juvelook/juvelook-principle-pdlla-ha-20261105.webp",
      alt: "PDLLA와 히알루론산이 함께 담긴 모습을 표현한 설명용 이미지",
      marks: [],
      layers: [],
      framed: true,
      noteOverlay: true,
      note: "PDLLA와 히알루론산의 구성을 설명하기 위한 AI 이미지입니다. 실제 입자의 크기 · 비율과는 다릅니다.",
    },
    principle: [
      {
        title: "부위별 피부 두께 및 고민 부위 진단",
        text: "부위별 피부 두께와 탄력 상태, 모공 · 꺼짐의 정도를 고려하여 적합한 주입 깊이와 양을 결정합니다.",
      },
      {
        title: "PDLLA + HA 정밀 분할 주입",
        text: "자가 콜라겐 생성을 돕는 PDLLA와 히알루론산(HA)을 뭉침 없이 진피층에 고르게 나누어 주입합니다.",
      },
      {
        title: "자가 콜라겐 재생 및 밀도 개선",
        text: "미세 입자가 피부 속 세포를 자극하여 콜라겐과 엘라스틴을 점진적으로 형성해 탄력과 결을 채웁니다.",
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
          label: "주요 효과",
          values: [
            "모공 · 흉터 · 피부결",
            "깊게 꺼진 볼륨",
            "눈가 잔주름 · 피부결",
            "진피 밀도 · 탄력",
          ],
        },
        {
          label: "효과 시기",
          values: [
            "3~4주 후부터 서서히",
            "4~6주 후부터 서서히",
            "2~3주 후부터 비교적 빠르게",
            "비교적 빠르게 체감",
          ],
        },
      ],
      note: "※ 각 제품의 일반적인 특징을 정리한 것으로, 어느 제품이 더 낫다는 뜻이 아닙니다. 결절 등 이상 반응은 빈도가 낮아도 생길 수 있고, 효과 시기와 유지 기간은 사람마다 다릅니다. 실제 사용할 제품과 양은 피부 상태와 부위를 보고 상담에서 정합니다.",
    },
    featuresRatio: 4 / 3,
    featuresTitle: "쥬베룩 콜라겐부스터의 특징 4가지",
    features: [
      {
        title: "자가 콜라겐 및 엘라스틴 재생 유도",
        text: "생분해성 고분자 PDLLA 성분을 주입해 섬유아세포를 자극하고, 피부가 스스로 탄력 섬유와 콜라겐을 생성하도록 돕습니다. 변화는 서서히 나타나며, 주입 시술에 따른 부작용 가능성도 있습니다.",
        image: "/images/skin-features/juvelook/juvelook-point-01-collagen-20261105-v2.webp",
        mediaSrcSet: "/images/skin-features/juvelook/juvelook-point-01-collagen-20261105-v2-800.webp 800w, /images/skin-features/juvelook/juvelook-point-01-collagen-20261105-v2.webp 1200w",
        alt: "PDLLA와 콜라겐 지지 구조 — AI 설명용 모식도",
      },
      {
        title: "다공성 망상 구조로 뭉침 우려 완화",
        text: "내부가 그물망(망상) 구조인 미세 구형 입자를 사용하며, 시간이 지나면서 체내에서 분해됩니다.",
        image: "/images/skin-features/juvelook/juvelook-point-03-porous-particle-20261105-v2.webp",
        mediaSrcSet: "/images/skin-features/juvelook/juvelook-point-03-porous-particle-20261105-v2-800.webp 800w, /images/skin-features/juvelook/juvelook-point-03-porous-particle-20261105-v2.webp 1200w",
        alt: "PDLLA 다공성 망상 구조 — AI 설명용 모식도",
      },
      {
        title: "PDLLA + 히알루론산(HA) 복합 시너지",
        text: "자가 콜라겐 생성을 유도하는 PDLLA에 수분을 끌어당기는 히알루론산을 배합하여 콜라겐이 차오르는 기간 동안 속건조를 완화하고 부드러운 피부결을 먼저 형성합니다.",
        image: "/images/skin-features/juvelook/juvelook-point-04-ha-hydration-20261105-v2.webp",
        mediaSrcSet: "/images/skin-features/juvelook/juvelook-point-04-ha-hydration-20261105-v2-800.webp 800w, /images/skin-features/juvelook/juvelook-point-04-ha-hydration-20261105-v2.webp 1200w",
        alt: "HA와 수분 환경 — AI 설명용 모식도",
      },
      {
        title: "얕은 진피층 타깃의 미세 결 · 탄력 개선",
        text: "입자가 곱고 부드러워 진피 얕은 층에 촘촘하게 침투할 수 있어 늘어진 나비존 모공, 얕은 패인 흉터, 눈가 · 입가의 미세 잔주름을 탄탄하게 메워줍니다.",
        image: "/images/skin-features/juvelook/juvelook-point-02-cheek-area-20261105-v2.webp",
        mediaSrcSet: "/images/skin-features/juvelook/juvelook-point-02-cheek-area-20261105-v2-800.webp 800w, /images/skin-features/juvelook/juvelook-point-02-cheek-area-20261105-v2.webp 1200w",
        alt: "나비존 · 모공 · 잔주름 부위 — AI 안내 사진",
      },
        ],
    process: [
      {
        title: "진단 및 설계",
        text: "모공 · 흉터 · 잔주름 상태와 피부 두께를 분석한 뒤 수화 약물 용량을 설계합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "클렌징 · 마취",
        text: "표면 위생을 정돈한 뒤 주사 자극 완화를 위해 마취 크림을 도포합니다.",
        image: "/images/photos/process-anesthesia-model-a.webp",
        alt: "기존 마취 준비 사진",
      },
      {
        title: "맞춤 시술 진행",
        text: "결절 위험을 줄이도록 피부 상태에 맞춘 깊이와 간격으로 고르게 나누어 주사합니다.",
        image: "/images/skin-features/juvelook/juvelook-process-03-product-20261105.webp",
        alt: "시술 직전 준비한 쥬베룩 제품과 주사기",
      },
      {
        title: "진정 · 사후 관리",
        text: "엠보싱 진정 관리를 진행하고 자가 콜라겐 형성을 돕는 일상 수칙을 안내해 드립니다.",
        image: "/images/photos/clinic-5-no-brown-wrap-20261105.webp",
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
      mediaSize: { width: 1254, height: 1400 },
      text: "울트라콜은 생분해성 봉합사 성분인 PDO 미세 입자가 진피 내 섬유아세포를 활성화해 내 피부 본연의 자가 콜라겐을 차오르게 만드는 콜라겐 부스터입니다. 이물감이나 결절 우려를 낮춘 매끄러운 구형 입자가 얇아진 피부 속 지지층을 탄탄하게 복원해주는데요. 눈가 잔주름과 결을 정돈하는 100과 꺼진 부위에 자연스러운 볼륨감을 채우는 200 제품을 목적에 맞게 선택하여 사용합니다.",
      specs: [
        {
          label: "주요 성분",
          value: "고순도 생분해성 PDO (Polydioxanone 미세 구형 입자)",
        },
        { label: "제품 분류", value: "KFDA(식약처) 승인 의료기기" },
        {
          label: "라인업 구분",
          value: `울트라콜 100: 진피층 타깃 (모공, 잔주름, 피부결 탄력 개선)
울트라콜 200: 피하층 타깃 (눈밑 꺼짐, 팔자, 자연스러운 볼륨 형성)`,
        },
        {
          label: "시술 용량",
          value: "부위 및 고민 깊이에 따른 맞춤 용량 설계 (1~2바이알 단위)",
        },
        {
          label: "생체 반응",
          value: "자가 콜라겐 생성 유도 후 체내에서 물과 이산화탄소로 분해 (속도는 개인차)",
        },
      ],

    },
    // 원리 그림: PDO 전용 설명 모식도 (20261105 자료)
    principleImage: {
      src: "/images/skin-features/ultracol/ultracol-principle-pdo-20261105-v2.webp",
      alt: "PDO 미세입자와 주변 피부 지지 구조 — AI 설명용 모식도",
      marks: [],
      layers: [],
      framed: true,
      figureAspect: "1586 / 992",
      noteOverlay: true,
      note: "이해를 돕기 위한 AI 설명용 모식도입니다. 실제 조직 사진이나 시술 결과가 아니며 크기 · 비율은 단순화했습니다.",
    },
    principle: [
      {
        title: "고민 부위별 맞춤 타깃 설정",
        text: "거친 피부결과 눈가 잔주름, 꺼진 볼륨 부위를 나누어 고려하고 시술 부위의 특성에 맞는 주입 위치를 설정합니다.",
      },
      {
        title: "맞춤 규격(100 · 200) 정밀 주입",
        text: "피부결과 얕은 잔주름에는 울트라콜 100, 자연스러운 볼륨 탄력에는 울트라콜 200을 선택하여 적정 용량을 고르게 주입합니다.",
      },
      {
        title: "이물감 부담을 줄인 자가 콜라겐 재생",
        text: "체내에서 서서히 분해되는 PDO 미세입자가 피부 속 자가 콜라겐 생성을 유도하여 뭉침 없이 자연스러운 탄력을 채워 갑니다. 변화의 속도와 체감 정도는 개인의 피부 컨디션에 따라 차이가 있을 수 있습니다.",
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
          label: "주요 효과",
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
          label: "제품 특징",
          values: [
            "눈밑 틴달 현상(푸르게 비침) 부담이 적고, 피부 톤 변화를 함께 관리합니다.",
            "녹는 실 성분으로 리프팅과 타이트닝을 함께 관리합니다.",
            "다공성 PDLLA 입자와 히알루론산을 함께 사용합니다.",
            "자가 콜라겐으로 볼륨을 서서히 채웁니다.",
          ],
        },
      ],
      note: "※ 각 제품의 일반적인 특징을 정리한 것으로, 어느 제품이 더 낫다는 뜻이 아닙니다. 결절 등 이상 반응은 빈도가 낮아도 생길 수 있고, 효과 시기와 유지 기간은 사람마다 다릅니다. 실제 사용할 제품과 용량은 피부 상태와 부위를 보고 상담에서 정합니다.",
    },
    featuresRatio: 4 / 3,
    featuresTitle: "울트라콜의 4가지 특징",
    featuresLead:
      "단순한 일시적 채움이 아닌, 자가 조직이 차오르는 과정을 기준으로 시술합니다.",
    features: [
      {
        title: "수술용 봉합사에 쓰이는 녹는 실(PDO) 성분",
        text: "수십 년간 외과 수술용 봉합사로 쓰여 온 PDO(폴리디옥사논) 성분을 사용합니다. 체내에서 일정 기간에 걸쳐 물과 이산화탄소로 분해되어 배출되며, 분해 속도는 사람마다 다릅니다.",
        image: "/images/skin-features/ultracol/ultracol-point-01-pdo-particles-20261105-v2.webp",
        mediaSrcSet: "/images/skin-features/ultracol/ultracol-point-01-pdo-particles-20261105-v2-800.webp 800w, /images/skin-features/ultracol/ultracol-point-01-pdo-particles-20261105-v2.webp 1200w",
        alt: "미세 구형 PDO 입자 — AI 설명용 모식도",
      },
      {
        title: "미세 구형 입자로 가공한 PDO 성분",
        text: "PDO 성분을 미세한 구형 입자로 가공한 제품입니다. 입자 모양만으로 결절 위험이 낮다고 단정하지 않으며, 얇은 피부층에는 주입 깊이와 양을 세심하게 조절합니다.",
        image: "/images/skin-features/ultracol/ultracol-point-02-particle-distribution-20261105-v2.webp",
        mediaSrcSet: "/images/skin-features/ultracol/ultracol-point-02-particle-distribution-20261105-v2-800.webp 800w, /images/skin-features/ultracol/ultracol-point-02-particle-distribution-20261105-v2.webp 1200w",
        alt: "구형 PDO 입자와 주변 조직 — AI 설명용 모식도",
      },
      {
        title: "자가 콜라겐 재생을 유도하는 방식",
        text: "주입된 미세 입자가 진피층 섬유아세포를 자극해 피부가 스스로 콜라겐을 생성하도록 유도합니다. 즉시 부피를 채우는 필러와는 쓰임이 다르며 변화는 서서히 나타납니다. 주입 시술이므로 부작용 가능성도 함께 설명해 드립니다.",
        image: "/images/skin-features/ultracol/ultracol-point-03-collagen-network-20261105-v3.webp",
        alt: "PDO 미세입자 주변의 콜라겐 섬유와 섬유아세포를 표현한 AI 설명용 모식도",
      },
      {
        title: "피부 층과 고민에 맞춘 100 · 200 듀얼 라인업",
        text: "진피 얕은 층에 적용해 잔주름 · 모공 · 피부결을 매끄럽게 정돈하는 울트라콜 100과, 지지층에 주입해 눈 밑 꺼짐 · 팔자주름의 볼륨을 채우는 울트라콜 200으로 세분화되어 있어 부위별 맞춤 시술이 가능합니다.",
        image: "/images/skin-features/ultracol/ultracol-point-04-dual-lineup-20261105-v3.webp",
        alt: "울트라콜 Boost 100mg과 울트라콜 200mg 두 바이알을 나란히 배치한 제품 설명 이미지",
      },
    ],

    process: [
      {
        title: "진단 및 설계",
        text: "피부 탄력과 꺼짐 정도에 맞춰 울트라콜 규격(100 · 200)과 주입 용량을 결정합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "마취 크림 도포 및 준비",
        text: "표면 위생 클렌징과 마취 크림 도포를 진행하고, 수화된 정품 PDO 약물을 확인합니다.",
        image: "/images/photos/process-anesthesia-model-a.webp",
        alt: "기존 마취 준비 사진",
      },
      {
        title: "정교한 맞춤 주입",
        text: "숙련된 노하우를 바탕으로 계획된 부위에 울트라콜 성분을 고르고 촘촘하게 나누어 주입합니다.",
        image: "/images/photos/ultracol-process-03-preparation-20261105-v2.webp",
        alt: "울트라콜 100 · 200 바이알과 보호캡을 씌운 주사기를 준비한 AI 제작 설명 이미지",
      },
      {
        title: "진정 및 경과 안내",
        text: "직후 엠보싱 진정 관리를 진행하고 콜라겐 합성을 돕는 사후 수칙을 전해 드립니다.",
        image: "/images/photos/clinic-5-no-brown-wrap-20261105.webp",
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
        text: "꺼짐 · 처짐 · 거친 피부결을 나누어 고려합니다. 비슷해 보이는 고민도 필요한 시술은 다를 수 있습니다.",
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
          label: "상담 시 고려하는 고민",
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
    featuresRatio: 4 / 3,
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
        mediaFit: "cover",
      },
    ],
    process: [
      {
        title: "1:1 상담",
        text: "처짐 · 피부결 · 모공을 나누어 고려하고 기존 시술과 복용약을 확인합니다.",
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
        image: "/images/photos/clinic-5-no-brown-wrap-20261105.webp",
        alt: "프라베일 관리실",
      },
    ],
    principleImage: {
      src: "/images/official/potenza-principle-poster.jpg",
      alt: "포텐자의 미세침과 고주파 에너지 전달을 보여주는 제조사 원리 영상",
      marks: [],
      layers: [],
      framed: false,
      noteOverlay: true,
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
        // 화면 로고 · 홍보 문구를 지운 편집본 (제조사 원본 무자막 파일이 아님)
        src: "/videos/shrink-device-clean-20261105-v2.mp4",
        poster: "/images/shrink/shrink-device-clean-20261105-v2.webp",
        edge: "linear-gradient(#020707, #080d17)",
      },
      text: "고강도 집속 초음파(HIFU) 에너지를 피하근막(SMAS)층과 진피층에 집중 전달해 미세 열응고점(TCP)을 형성하는 리프팅 장비입니다. 응고된 조직의 수축과 콜라겐 재생을 통해 늘어진 안면 윤곽을 정돈하며, 기존 점(Dot) 모드 외에 선 형태로 에너지를 촘촘하게 연속 전달하는 MP(Micro-Pulsed) 모드를 병행해 시술 정밀도와 속도를 높였습니다.",
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
        title: "피부 속 목표 층(1.5~4.5mm) 집속 조사",
        text: "초음파 에너지를 피부 속 목표 깊이에 모아 미세 열응고점(TCP)을 형성하고 지지 조직의 수축을 유도합니다. 피부 두께와 부위에 맞춰 조사 깊이와 에너지를 정하며, 열 손상 등 부작용 가능성도 함께 고려합니다.",
      },
      {
        title: "Dot(점) · MP(선) 듀얼 조사 모드 교차 적용",
        text: "단일 포인트를 집중 타깃하는 일반(Dot) 모드와 빈틈없이 촘촘하게 연속 전달하는 MP(Micro-Pulsed) 모드를 피부 두께와 굴곡에 맞춰 유연하게 병행합니다.",
      },
      {
        title: "수축 반응 및 점진적 콜라겐 재생 유도",
        text: "응고된 조직의 즉각적인 타이트닝과 함께 자연 치유 과정을 통해 섬유아세포가 활성화되며, 수 주에 걸쳐 새로운 콜라겐이 생성되어 윤곽 탄력을 높입니다. 개선 정도는 개인차가 있습니다.",
      },
    ],
    compare: {
      title: "슈링크 유니버스, 다른 초음파 리프팅과 어떻게 다른가요?",
      lead: "같은 집속 초음파(HIFU) 리프팅이라도 에너지를 전달하는 방식과 핸드피스 구조에 차이가 있습니다. 고민 부위와 피부 상태를 정밀하게 진단하여 적합한 장비를 선택합니다.",
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
            "1.5~4.5mm, 0.5mm 단위",
            "카트리지별",
          ],
        },
      ],
      note: "※ 각 장비의 일반적인 특징을 정리한 것으로, 어느 장비가 더 낫다는 뜻이 아닙니다. 맞는 장비는 피부 상태와 고민에 따라 다르며, 통증 · 효과 · 유지 기간은 사람마다 다릅니다. 비교 장비의 본원 보유 여부를 뜻하지 않습니다.",
    },
    featuresRatio: 4 / 3,
    featuresTitle: "슈링크 유니버스의 4가지 특징",
    features: [
      {
        title: "빈틈없이 에너지를 전달하는 MP 모드",
        text: "일정한 간격으로 열응고점을 만드는 일반(Dot) 모드에 더해 미세한 열응고점을 선처럼 촘촘하게 이어 주는 MP(Micro Pulsed) 모드를 탑재했습니다. 에너지가 끊김 없이 빠르게 조사되어 전체적인 시술 시간과 통증 부담을 줄여 줍니다.",
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
        text: "1.5mm · 2.0mm · 3.0mm · 4.5mm로 세분화된 4가지 카트리지를 활용해 얕은 층의 잔주름부터 깊은 근막층(SMAS)까지 목표 조직에 에너지를 단계별로 전달합니다. 같은 깊이라도 닿는 조직은 사람마다 달라, 개인별 피부 두께와 부위별 노화 상태를 진단하여 카트리지를 조합합니다.",
        image: "/images/shrink/booster-depth.webp?v=20261104b",
        video: "/videos/shrink-booster-depth.mp4?v=20261104b",
        alt: "울트라 부스터 카트리지로 일반 모드(점)와 MP 모드(이어진 고리)의 열응고점이 생기는 모습을 나란히 보여 주는 제조사 영상",
        mediaSize: { width: 1280, height: 720 },
        mediaEdges: ["#000000", "#000000"],
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
        text: "처진 부위와 피부 두께, 이전 시술 이력을 정밀하게 파악하여 적합한 카트리지와 샷 수, 시술 범위를 설계합니다.",
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
        image: "/images/photos/clinic-5-no-brown-wrap-20261105.webp",
        coverPosition: "70% center",
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
      text: "포텐자는 제이시스메디칼에서 개발한 고주파(RF) 리프팅 장비입니다. 본원은 미세한 바늘로 진피층에 직접 고주파를 전달하는 RF팁과, 고주파와 함께 부스터를 넣는 펌핑팁을 피부 상태와 고민에 맞춰 나누어 사용합니다. 바늘 깊이를 0.5~4.0mm 사이에서 조절해 부위별 피부 두께에 맞춰 진피층에 나누어 전달합니다.",
      specs: [
        { label: "방식", value: "고주파 (RF) · 미세침" },
        { label: "팁", value: "RF팁 · 펌핑팁 (미세침 + 부스터 주입)" },
        { label: "바늘 깊이", value: "0.5~4.0mm (0.25mm 단위)" },
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
        title: "피부층에 맞춘 정밀 미세침(Micro-needle) 침투",
        text: "0.5mm부터 최대 4.0mm까지 조절 가능한 절연 · 비절연 미세 바늘이 목표 진피층에 정교하게 침투하여 표피 열 손상 부담을 덜고 물리적인 미세 통로를 형성합니다.",
      },
      {
        title: "모노폴라 · 바이폴라 듀얼 고주파(RF) 에너지 조사",
        text: "깊은 진피층까지 넓고 강하게 심부열을 전달하는 모노폴라(Monopolar)와 얕은 층의 국소 부위를 정밀하게 응고시키는 바이폴라(Bipolar) 모드를 목적에 맞게 교차 적용해 병변을 타깃합니다.",
      },
      {
        title: "조직 응고 및 자가 콜라겐 리모델링",
        text: "진피층에 유도된 열응고 구역(Thermal Coagulation Zone)을 중심으로 피부 본연의 상처 치유 반응이 활성화되며, 새로운 콜라겐과 엘라스틴이 차올라 모공 · 흉터 · 탄력 저하를 개선합니다. 개선 정도는 개인차가 있습니다.",
      },
    ],
    compare: {
      title: "포텐자, 다른 고주파 시술과 어떻게 다른가요?",
      lead: "같은 고주파 시술도 바늘을 쓰는지, 에너지를 어디에 주는지에 따라 쓰임이 다릅니다. 고민과 피부 상태를 함께 고려하여 선택합니다.",
      columns: [
        { name: "포텐자", maker: "제이시스메디칼 · 국내", self: true },
        // 확인 필요: 버츄RF 핸드피스별 고주파 방식 (제조사 자료로 재확인)
        { name: "버츄RF", maker: "SHENB · 한국" },
        { name: "올리지오", maker: "원텍 · 국내" },
        { name: "볼뉴머", maker: "클래시스 · 국내" },
      ],
      rows: [
        {
          label: "시술 방식",
          values: [
            "미세침 고주파",
            "미세침 고주파",
            "비침습 고주파",
            "비침습 고주파",
          ],
        },
        {
          label: "에너지 유형",
          values: ["모노폴라 · 바이폴라", "핸드피스에 따라 다름", "모노폴라", "모노폴라"],
        },
        {
          label: "시술 효과",
          values: [
            "모공 · 피부결 · 흉터 · 탄력",
            "모공 · 흉터 · 피부결",
            "탄력 · 잔주름",
            "탄력 · 잔주름",
          ],
        },
        {
          label: "회복 기간",
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
        text: "미세침 팁이 피부에 순간적으로 접촉하여 진입한 뒤 신속하게 회수되는 방식으로 설계되어 있습니다.",
        image: "/images/potenza/potenza-modes-web-v2.webp",
        video: "/videos/potenza-modes-web-v2.mp4",
        alt: "포텐자 미세침 팁의 접촉, 진입, 회수 과정을 보여주는 자료 영상",
        mediaSize: { width: 1280, height: 720 },
      },
      {
        title: "타깃층별 맞춤 고주파(RF) 에너지 전달",
        text: "미세침을 통해 피부 표면의 손상 부담을 덜고, 진피층 등 필요한 특정 층에 직접적으로 고주파 에너지를 전달합니다.",
        image: "/images/potenza/potenza-tips-web-v2.webp",
        video: "/videos/potenza-tips-web-v2.mp4",
        alt: "미세침을 통한 피부층별 RF 에너지 전달을 보여주는 자료 영상",
        mediaSize: { width: 1280, height: 720 },
      },
      {
        title: "고주파와 부스터의 시너지, 펌핑 팁(Pumping Tip)",
        text: "본원의 포텐자는 고주파만 전달하는 RF팁과, 유효 성분을 함께 넣는 펌핑팁을 모두 갖추고 있습니다. 펌핑팁은 미세침이 진피층에 고주파 열 자극을 주는 동시에 쥬베룩 · 울트라콜 · 엑소좀 같은 부스터를 같은 경로로 함께 주입하는 방식입니다.",
        image: "/images/potenza/potenza-pumping-web-v2.webp",
        video: "/videos/potenza-pumping-web-v2.mp4",
        alt: "포텐자 펌핑팁이 피부 속에 고주파와 함께 부스터를 전달하는 모습을 보여 주는 자료 영상",
        mediaSize: { width: 1280, height: 720 },
      },
      {
        title: "0.5~4.0mm, 0.25mm 단위의 세밀한 깊이 조절",
        text: "바늘의 침투 깊이를 0.5mm에서 최대 4.0mm까지 0.25mm 단위로 아주 정밀하게 조절할 수 있습니다. 피부 두께와 굴곡이 저마다 다른 이마, 볼, 코 주변 등 부위별 특성에 맞춘 맞춤형 시술이 가능합니다.",
        image: "/images/potenza/potenza-depth-web-v2.webp",
        video: "/videos/potenza-depth-web-v2.mp4",
        alt: "포텐자 미세침 팁의 깊이 조절(0.5~4.0mm, 0.25mm 단위)을 보여 주는 자료 영상",
        mediaSize: { width: 1280, height: 720 },
      },
    ],
    process: [
      {
        title: "상담 및 맞춤 플랜 설계",
        text: "피부 두께와 모공 · 흉터 상태를 진단해 바늘 깊이와 팁 종류를 설계합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "클렌징 및 마취 준비",
        text: "피부 표면을 정돈하고 통증 부담을 덜어주는 마취 크림을 도포합니다.",
        image: "/images/photos/process-anesthesia-model-a.webp",
        alt: "기존 마취 준비 사진",
      },
      {
        title: "정교한 맞춤 고주파 시술",
        text: "설정된 깊이에 맞춰 고주파 열을 균일하게 조사하며 부스터를 정밀 침투시킵니다.",
        image: "/images/equipment/potenza-process-03-device-20261106-v1.webp",
        alt: "포텐자 장비 정면 전체 사진",
        fit: "device",
      },
      {
        title: "진정 및 사후 관리",
        text: "붉은기 진정 케어를 진행하고 주의사항을 안내해 드린 뒤 귀가하십니다.",
        image: "/images/photos/clinic-5-no-brown-wrap-20261105.webp",
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
      // 제조사 저작권 문구를 지우고 흰 배경을 잘라내 어두운 카드에 맞춘 버전
      photo: "/images/clarity-video/clarity-device-brand-from-video-v1-cutout.webp",
      photoSrcSet: "/images/clarity-video/clarity-device-brand-from-video-v1-cutout-800.webp 800w, /images/clarity-video/clarity-device-brand-from-video-v1-cutout-1200.webp 1200w, /images/clarity-video/clarity-device-brand-from-video-v1-cutout.webp 1920w",
      photoAlt: "루트로닉 클라리티2 장비와 브랜드 화면 · 제조사 영상 장면",
      photoCaption: "LUTRONIC 제공 클라리티2 장비 소개 영상의 한 장면.",
      // 레이저 제모 쪽과 같은 제조사 소개 영상
      film: {
        src: "/videos/official-clarity.mp4",
        poster: "/images/official/clarity-poster.jpg",
        fit: "cover",
        edge: "linear-gradient(#f2efee, #d4d3d2)",
      },
      mediaContain: true,
      mediaSize: { width: 1920, height: 1080 },
      text: "클라리티2의 1064nm 롱펄스 엔디야그 파장을 활용한 비접촉 레이저 리프팅입니다. 피부에 닿지 않고 진피층에 심부열을 균일하게 쌓아 올려 표면 손상 없이 탄력 · 모공 · 피부결 · 피부 톤을 복합적으로 개선하는 리프팅 시술입니다.",
      specs: [
        { label: "에너지 방식", value: "비접촉 롱펄스 레이저 (Long-pulsed Laser)" },
        { label: "타깃 파장", value: "1064nm (진피층 리프팅 · 모공 타이트닝)" },
        // 상단 요약칸('연고 마취 또는 무마취')과 같은 기준으로 적는다
        {
          label: "통증 관리",
          value: "지능형 냉각 가스 시스템 (대부분 무마취, 필요 시 연고 마취)",
        },
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
      noteOverlay: true,
      note: "LUTRONIC 제공 얼굴 부위 레이저 조사 · 온도 표시 3D 설명 장면입니다. 실제 환자 촬영본이 아닙니다.",
    },
    principle: [
      {
        title: "비접촉 방식의 준장펄스(Quasi-Long Pulse) 연속 조사",
        text: "핸드피스를 피부 표면에서 일정 거리 띄운 상태로 1064nm 롱펄스 레이저를 빠르게 중첩 조사하여 표피에 가해지는 직접적인 물리적 자극과 열 손상 부담을 최소화합니다.",
      },
      {
        title: "표면 온도를 확인하며 쌓는 균일 심부열",
        text: "피부 표면 온도와 피부 반응을 실시간으로 참고하며 진피층에 열에너지를 점진적으로 쌓아 올려, 섬유아세포를 자극하고 진피 환경 리모델링을 활성화합니다. 목표 온도와 조사 조건은 적용 프로토콜과 피부 상태에 따라 달라집니다.",
      },
      {
        title: "콜라겐 재생 및 미세 혈관 타깃 복합 개선",
        text: "새로운 콜라겐과 탄력 섬유 신생으로 피부 탄력과 늘어진 모공, 피부결을 쫀쫀하게 정돈하며, 미세 붉은 혈관에 흡수되는 파장 특성으로 안면 붉은 기와 피부 톤을 맑게 개선합니다. 개선 정도는 개인차가 있습니다.",
      },
    ],
    compare: {
      title: "클라리티 리프팅, 다른 리프팅과 어떻게 다른가요?",
      lead: "같은 리프팅도 레이저인지 고주파인지, 어느 고민을 중심으로 보는지에 따라 쓰임이 다릅니다. 고민과 피부 상태를 함께 고려하여 선택합니다.",
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
          label: "시술 방식",
          values: [
            "피부에 닿지 않게 빠르게 조사",
            "파장 · 핸드피스별",
            "팁을 피부에 접촉",
            "팁을 피부에 접촉",
          ],
        },
        {
          label: "시술 효과",
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
        title: "비접촉 조사로 자극을 줄인 위생적 시술",
        text: "피부 표면에 팁을 직접 대지 않고 일정한 거리를 두고 1064nm 롱펄스 레이저를 조사합니다. 물리적 마찰과 압박이 없어 위생적이며, 접촉으로 인한 2차 피부 자극과 붉은기 부담이 적습니다.",
        image: "/images/clarity-features-v2/clarity-point-01-face-laser-20261105-v2.webp",
        alt: "얼굴 레이저 시술 장면",
        caption: "원내 촬영 장면을 바탕으로 공통 모델을 적용한 이미지입니다.",
        // 3:1 원본을 16:9 칸에 오른쪽 기준으로 담는다 (왼쪽 빈자리는 화면 밖으로)
        mediaFit: "cover",
        mediaPosition: "right center",
        mediaSize: { width: 1920, height: 1080 },
      },
      {
        title: "깊은 진피층까지 빈틈없이 전달되는 에너지",
        text: "균일한 조사 반경을 통해 진피 깊은 층까지 열에너지를 단계적으로 쌓아 올립니다. 차곡차곡 축적된 심부열이 섬유아세포를 자극해 콜라겐과 엘라스틴의 재생 및 탄력 구조 리모델링을 유도합니다.",
        image: "/images/clarity-features-v2/clarity-point-02-dermal-heat-20261105-v2.webp",
        mediaSrcSet: "/images/clarity-features-v2/clarity-point-02-dermal-heat-20261105-v2-800.webp 800w, /images/clarity-features-v2/clarity-point-02-dermal-heat-20261105-v2-1200.webp 1200w, /images/clarity-features-v2/clarity-point-02-dermal-heat-20261105-v2.webp 1920w",
        alt: "피부 속 열 전달을 표현한 설명용 단면",
        caption: "열 전달을 설명하기 위한 AI 모식도입니다. 실제 온도 · 깊이 · 시술 결과를 나타내지 않습니다.",
        mediaFit: "contain",
        mediaSize: { width: 1920, height: 1080 },
      },
      {
        title: "탄력 · 모공 · 피부결 등 올인원 케어",
        text: "느슨해진 진피 지지층을 강화해 처진 탄력, 늘어진 모공, 잔주름을 탄탄하게 잡아줍니다. 동시에 1064nm 파장이 진피 미세 혈관에 작용하여 붉은 기와 칙칙한 안색을 맑고 깨끗하게 가꿔줍니다.",
        image: "/images/clarity-features-v2/clarity-point-03-skin-texture-model-a-20261105-v2.webp",
        mediaSrcSet: "/images/clarity-features-v2/clarity-point-03-skin-texture-model-a-20261105-v2-800.webp 800w, /images/clarity-features-v2/clarity-point-03-skin-texture-model-a-20261105-v2-1200.webp 1200w, /images/clarity-features-v2/clarity-point-03-skin-texture-model-a-20261105-v2.webp 1920w",
        alt: "얼굴 피부결 · 모공 설명용 공통 모델 이미지",
        caption: "피부결 · 모공 · 안색을 설명하기 위한 AI 모델 이미지이며, 실제 시술 결과가 아닙니다.",
        mediaFit: "contain",
        mediaSize: { width: 1920, height: 1080 },
      },
      {
        title: "실시간 온도 모니터링 시스템",
        text: "핸드피스에 탑재된 스마트 센서가 피부 표면 온도를 실시간으로 측정하여 과열 위험을 예방합니다. 유효 열전달 범위 내에서 피부 반응에 맞춰 조사 속도와 강도를 정밀하게 제어해 안정적인 리프팅을 돕습니다.",
        image: "/images/clarity-features-v2/clarity-point-04-temperature-20261105-v2.webp",
        mediaSrcSet: "/images/clarity-features-v2/clarity-point-04-temperature-20261105-v2-800.webp 800w, /images/clarity-features-v2/clarity-point-04-temperature-20261105-v2-1200.webp 1200w, /images/clarity-features-v2/clarity-point-04-temperature-20261105-v2.webp 1920w",
        video: "/videos/clarity-features-v2/clarity-point-04-temperature-20261105-v2.mp4",
        alt: "피부 온도 표시를 보여 주는 제조사 설명 영상",
        caption: "LUTRONIC 제조사 영상의 온도 감지 기능 설명 장면입니다. 실제 환자 측정 기록이 아닙니다.",
        mediaFit: "contain",
        mediaSize: { width: 1920, height: 1080 },
        mediaEdges: ["#000000", "#000000"],
      },
    ],
    process: [
      {
        title: "맞춤 진단 및 플랜 수립",
        text: "피부 톤과 탄력 상태, 광과민성 요소를 확인해 1:1 시술 범위를 설계합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "클렌징 및 안구 보호 준비",
        text: "시술 부위를 클렌징하고 눈 보호를 위한 전용 보안경을 착용합니다.",
        image: "/images/photos/process-anesthesia-model-a.webp",
        alt: "기존 마취 준비 사진",
      },
      {
        title: "비접촉 1064nm 맞춤 조사",
        text: "실시간 피부 온도 모니터링을 바탕으로 1064nm 심부열을 균일하게 조사합니다.",
        image: "/images/photos/retouched/web/laser-model-a.webp",
        alt: "보호 안경을 착용한 대표원장의 얼굴 부위 레이저 시술 장면",
      },
      {
        title: "진정 관리 및 사후 안내",
        text: "즉각적인 열감 진정 케어를 진행하고 일상 보습 · 자외선 차단 수칙을 안내해 드립니다.",
        image: "/images/photos/clinic-5-no-brown-wrap-20261105.webp",
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
      photo: "/images/thread/products/qtl-package-v2-cutout.png",
      photoFullFrame: false,
      text: "실리프팅은 흡수성 의료용 실을 피부 아래에 넣어 처진 조직을 받치고 위치를 조절하는 시술입니다. 돌기가 있는 실은 조직을 물리적으로 지지하며, 재질과 구조에 따라 계획이 달라집니다. 피부 두께와 조직의 무게, 당길 방향을 함께 고려하여 시술 범위를 정합니다. 본원은 QTL실과 잼버실을 갖추고 있으며, 사용할 실과 규격은 진찰 후 선택합니다.",
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
      photoAlt: "QTL실 제품 패키지 이미지 (제조사 공식 자료)",
      mediaContain: true,
    },
    principle: [
      {
        title: "처짐과 피부 두께 확인",
        text: "처진 부위와 지방량, 피부 두께를 확인하고 실이 조직을 지지할 방향과 범위를 정합니다.",
      },
      {
        title: "돌기(코그)가 조직을 지지",
        text: "그림은 돌기가 있는 실과 주변 조직의 관계를 설명합니다. 실의 구조와 사용목적을 확인하고 조직을 지지할 층과 방향을 정합니다.",
      },
      {
        title: "모양과 불편감 함께 관찰",
        text: "초기 당김과 부기가 안정되는 과정을 확인하고, 패임이나 비대칭, 실 노출이 없는지 경과를 확인합니다.",
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
    featuresRatio: 4 / 3,
    featuresTitle: "실리프팅을 계획하는 4가지 기준",
    features: [
      {
        title: "처짐 방향부터 확인",
        text: "당기고 싶은 부위뿐 아니라 조직의 무게와 움직임을 함께 봅니다. 얼굴 전체의 균형 안에서 방향을 정합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "실리프팅 상담 안내에 사용하는 병원 상담실 사진",
        mediaFit: "cover",
      },
      {
        title: "실의 재질과 돌기 구조 확인",
        text: "본원이 쓰는 QTL실과 잼버실은 모두 PDO 계열의 흡수성 실입니다. 돌기(코그)의 모양과 배열, 허가된 사용목적을 확인해 피부 두께와 조직의 무게에 맞는 규격과 배치를 정합니다.",
        // 확인 필요: 돌기 구조 그림 (지금 그림은 일반적인 코그실 구조 설명용)
        image: "/images/official/mint-structure.png",
        alt: "돌기가 있는 흡수성 실의 구조를 설명하는 그림",
        fullFrame: false,
        mediaSize: { width: 550, height: 550 },
        mediaEdges: ["#fcfaff", "#fdfbff"],
      },
      {
        title: "개수와 함께 보는 범위 · 배치",
        text: "실 개수 하나로 결과를 정하지 않습니다. 필요한 범위와 지지 방향을 정하고 피부에 가해질 부담을 함께 고려합니다.",
        image: "/images/photos/clinic-4.webp",
        alt: "병원 세안 · 파우더룸의 기존 사진",
        mediaFit: "cover",
      },
      {
        title: "초기 모양과 회복을 함께 확인",
        text: "부기와 당김, 피부 패임을 확인하고 비대칭이나 실 노출 같은 불편이 있으면 진료로 확인합니다.",
        image: "/images/photos/clinic-6.webp",
        alt: "경과 진료 방문 안내에 사용하는 병원 복도 사진",
        mediaFit: "cover",
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
        image: "/images/photos/thread-insertion-20261105.webp",
        alt: "실을 삽입하는 시술 장면",
      },
      {
        title: "경과 확인",
        text: "부기와 통증, 당김이나 패임을 확인하고, 압박 · 마사지 · 일상생활 주의사항을 따로 안내합니다.",
        image: "/images/photos/clinic-5-no-brown-wrap-20261105.webp",
        alt: "프라베일 관리실",
      },
    ],
    principleImage: {
      src: "/images/principles/thread.webp?v=20261026b",
      alt: "돌기가 있는 실과 주변 결합조직의 지지 구조를 확대한 입체 개념도",
      marks: [],
      layers: [],
      framed: true,
      noteOverlay: true,
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
      image: "/images/thread/products/qtl-package-v2.png",
      photo: "/images/thread/products/qtl-package-v2-cutout.png",
      photoAlt: "QTL 실 제품 패키지 이미지 (제조사 공식 자료)",
      mediaContain: true,
      mediaSize: { width: 730, height: 548 },
      text: `QTL 실리프팅은 정교한 돌기(코그)가 촘촘하게 배열된 몰딩형 녹는 실을 피하층에 삽입하여 중력에 의해 처진 조직을 직접적으로 끌어올려 탄탄하게 고정해 주는 리프팅 시술입니다.

환자분마다 다른 처짐의 방향, 조직의 무게, 피부 두께를 세밀하게 고려하여 실이 들어갈 정확한 층과 벡터(방향), 줄 수 등을 세밀하게 설계합니다.`,
      specs: [
        {
          label: "실 종류",
          value: "체내 흡수성 4세대 몰딩 코그실 (인장력 · 고정력 보강)",
        },
        { label: "마취 방식", value: "국소 마취 (시술 부위 통증 완화)" },
        {
          label: "디자인 기준",
          value: "처짐 방향(벡터) · 연부조직 무게 · 피부 두께 맞춤 설계",
        },
        {
          label: "시술 단위",
          value: "부위별 필요 줄 수에 맞춘 1줄 단위 맞춤 구성",
        },
      ],
    },
    principleImage: {
      src: "/images/principles/thread.webp?v=20261026b",
      alt: "돌기가 있는 실과 주변 결합조직의 지지 구조를 확대한 입체 개념도",
      marks: [],
      layers: [],
      framed: true,
      noteOverlay: true,
      note: "돌기가 있는 실과 주변 조직의 관계를 표현한 설명용 모식도입니다. 특정 제품의 실제 구조 · 크기 · 삽입 깊이와는 다를 수 있습니다.",
    },
    principle: [
      {
        title: "처짐 상태 및 조직 정밀 진단",
        text: "처진 부위의 양상과 지방량, 피부 두께를 세밀하게 고려하여 탄탄하게 지지해 줄 최적의 벡터(방향)와 범위를 설계합니다.",
      },
      {
        title: "몰딩실을 통한 정교한 지지 및 리프팅",
        text: "정해진 층과 방향을 따라 촘촘한 돌기를 가진 몰딩형 녹는 실을 안정적으로 삽입하여 처진 조직을 위로 단단히 받쳐 올립니다.",
      },
      {
        title: "안정화 및 형태 모니터링",
        text: "시술 후 당김과 부기가 서서히 안정되는 과정을 확인하고, 피부 패임이나 비대칭 등 불편한 증세 없이 자연스럽게 자리를 잡는지 꼼꼼하게 확인합니다.",
      },
    ],
    compare: {
      title: "QTL 실리프팅, 다른 실리프팅과 어떻게 다른가요?",
      lead: "같은 몰딩실도 돌기 모양과 배열, 조직을 붙잡는 방식이 다릅니다. 처짐 정도와 피부 두께를 함께 보고 고릅니다.",
      columns: [
        // 소재는 표 첫 행("실의 소재")에 있어 머리글에는 적지 않음
        { name: "QTL실", self: true },
        { name: "민트실" },
        // 확인 필요: 에피티콘 · 블루로즈 세부 사양 (제조사 자료 · 시술 기관 안내 기준으로 정리)
        { name: "에피티콘" },
        { name: "블루로즈" },
      ],
      rows: [
        {
          label: "실의 소재",
          values: [
            "몰딩형 녹는 실",
            "몰딩실 · PDO",
            "제테마 · PDO",
            "몰딩실 · PDO",
          ],
        },
        {
          label: "실의 형태",
          values: [
            "촘촘하게 배열된 돌기",
            "360° 나선형 돌기",
            "여러 리프팅 유닛 구조",
            "360° 몰딩 돌기",
          ],
        },
        {
          label: "고정 방식",
          values: [
            "촘촘한 돌기로 넓게 고정",
            "큰 돌기로 강하게 끌어당김",
            "유닛마다 나누어 안정적으로 지지",
            "큰 돌기로 강력하게 끌어당김",
          ],
        },
        {
          label: "중요 포인트",
          values: [
            "처짐 방향 · 피부 두께",
            "처짐 정도 · 피부 두께",
            "처짐 정도 · 시술 부위",
            "처짐 정도 · 피부 두께",
          ],
        },
        {
          label: "회복 과정",
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
    featuresRatio: 4 / 3,
    featuresTitle: "QTL 실리프팅의 4가지 특징",
    features: [
      {
        title: "처진 방향에 맞춘 입체적 벡터 디자인",
        text: "단순히 실을 일자로 넣는 것이 아니라, 개개인의 얼굴형과 처짐의 방향, 피부 두께를 정밀하게 분석하여 가장 자연스럽고 탄탄하게 지지할 수 있는 방향을 정교하게 설계합니다.",
        image: "/images/thread/features/qtl-point-01-vector-design-v2.webp",
        mediaSrcSet: "/images/thread/features/qtl-point-01-vector-design-v2-800.webp 800w, /images/thread/features/qtl-point-01-vector-design-v2.webp 1200w",
        alt: "피부 조직 안에서 여러 지지 방향을 표현한 설명용 단면도",
      },
      {
        title: "촘촘한 코그(돌기)로 분산되는 고정력",
        text: "정교하게 밀집된 몰딩형 돌기들이 피하 조직을 넓고 균일하게 붙잡아 주어, 한쪽으로 힘이 쏠리지 않고 부드러우면서도 안정적인 리프팅 효과를 유도합니다.",
        image: "/images/thread/features/qtl-point-02-cog-support-v2.webp",
        mediaSrcSet: "/images/thread/features/qtl-point-02-cog-support-v2-800.webp 800w, /images/thread/features/qtl-point-02-cog-support-v2.webp 1200w",
        alt: "실의 돌기와 주변 조직의 관계를 확대한 설명용 모식도",
      },
      {
        title: "탄탄한 유지력과 콜라겐 재생 시너지",
        text: "처진 조직을 물리적으로 단단히 받쳐 올리는 동시에, 삽입된 녹는 실이 서서히 분해되는 과정에서 주변의 콜라겐 생성을 유도하여 속부터 차오르는 탄력 밀도를 더해 줍니다.",
        image: "/images/thread/features/qtl-point-03-collagen-support-v2.webp",
        mediaSrcSet: "/images/thread/features/qtl-point-03-collagen-support-v2-800.webp 800w, /images/thread/features/qtl-point-03-collagen-support-v2.webp 1200w",
        alt: "피부 속 실과 주변 콜라겐 섬유를 표현한 설명용 모식도",
      },
      {
        title: "이물감을 줄인 편안한 마무리와 일상 복귀",
        text: "피부 두께와 층을 고려한 섬세한 자입(Insertion)으로 시술 후 불필요한 패임이나 과도한 당김 현상을 줄이고, 빠르게 일상으로 복귀하실 수 있도록 꼼꼼하게 마무리합니다.",
        image: "/images/thread/features/qtl-point-04-gentle-finish-v2.webp",
        mediaSrcSet: "/images/thread/features/qtl-point-04-gentle-finish-v2-800.webp 800w, /images/thread/features/qtl-point-04-gentle-finish-v2.webp 1200w",
        alt: "피부 표면과 내부 실의 위치 관계를 표현한 설명용 모식도",
      },
    ],
    process: [
      {
        title: "맞춤 상담 및 정밀 계획 수립",
        text: "처짐 양상과 피부 두께를 분석해 최적의 지지 방향과 실 개수 · 범위를 설계합니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "마취 및 철저한 준비",
        text: "시술 부위를 꼼꼼하게 소독한 뒤 통증 부담을 덜어주는 국소 마취를 진행합니다.",
        image: "/images/photos/process-anesthesia-model-a.webp",
        alt: "기존 마취 준비 사진",
      },
      {
        title: "정교한 실 삽입 및 균형 확인",
        text: "설계된 층과 방향에 맞춰 실을 안정적으로 삽입하고 좌우 대칭과 지지력을 맞춥니다.",
        image: "/images/photos/thread-insertion-20261105.webp",
        alt: "기존 피부 시술 참고 사진",
      },
      {
        title: "경과 확인 및 일상 케어 안내",
        text: "부기와 당김, 피부 패임 여부를 체크하고 편안한 일상 복귀 수칙을 안내합니다.",
        image: "/images/photos/clinic-5-no-brown-wrap-20261105.webp",
        coverPosition: "70% center",
        alt: "프라베일 관리실",
      },
    ],
  },
  "/lifting/thread/jamber": {
    kind: "procedure",
    // QTL 과 달리 잼버실은 코일형이라 돌기형 공용 그림(diagram: "thread") 대신 전용 모식도를 쓴다
    principleLayout: "figure-first",
    showPrices: true,
    device: {
      name: "잼버실",
      maker: "JAMBER THREAD",
      image: "/images/thread/products/jamber-package-v2.png",
      photo: "/images/thread/products/jamber-package-v2-cutout.png",
      photoAlt: "잼버실 제품 패키지 (제조사 공식 자료)",
      mediaContain: true,
      mediaSize: { width: 730, height: 548 },
      text: `잼버실은 피부를 강하게 당겨 올리는 일반적인 리프팅 실과 달리, 스프링처럼 촘촘하게 말려 있는 특수 녹는 실을 꺼진 부위의 피하층에 삽입하여 안쪽부터 탄탄한 지지대 역할을 하도록 만드는 볼륨 시술입니다.

나이가 들면서 야위거나 꺼지기 쉬운 눈밑 · 팔자주름 · 앞볼 등의 부위를 인위적이지 않고 입체적으로 채워 매끄러운 윤곽을 완성해 줍니다.`,
      specs: [
        { label: "실 형태", value: "체내 흡수성 스프링(코일)형 녹는 실" },
        {
          label: "시술 목적",
          value: "함몰 부위 물리적 지지 및 자가 콜라겐 생성을 통한 볼륨 복원",
        },
        {
          label: "주요 부위",
          value: "눈 밑 꺼짐(눈물고랑) · 팔자주름 · 옆볼 및 앞볼",
        },
        {
          label: "시술 단위",
          value: "부위별 함몰 깊이와 범위에 맞춘 1줄 단위 맞춤 구성",
        },
      ],
    },
    principleImage: {
      src: "/images/principles/jamber-principle-coil-cutaway-20261106-v3.webp",
      alt: "잼버실의 코일형 구조와 주변 조직을 단순화한 AI 제작 설명 모식도",
      marks: [
        { x: 50, y: 53, label: "코일형 실", side: "right", above: true },
        { x: 17, y: 74, label: "주변 조직", side: "right" },
      ],
      layers: [],
      // 안내 문구는 그림 안에. PC에서 오른쪽 설명 칸 높이에 맞춘 비율(꽉 채움)
      figureAspect: "740 / 507",
      noteOverlay: true,
      note: "잼버실의 코일 구조를 단순화한 AI 설명 모식도입니다. 실제 크기 · 삽입 위치 · 효과를 나타내지 않습니다.",
    },
    principle: [
      {
        title: "꺼진 위치 및 피부 깊이 정밀 진단",
        text: "볼륨이 필요한 부위의 정확한 위치와 꺼진 깊이, 그리고 개개인의 피부 두께를 세밀하게 고려하여 맞춤형 시술 범위를 디자인합니다.",
      },
      {
        title: "캐뉼라를 통한 스프링 실 지지대 형성",
        text: "조직 손상을 줄이는 뭉툭한 캐뉼라를 사용하여 스프링처럼 촘촘하게 말린 녹는 실을 꺼진 부위 아래에 안정적으로 삽입해 탄탄한 지지대를 만듭니다.",
      },
      {
        title: "콜라겐 재생을 통한 볼륨 안착",
        text: "삽입된 스프링 실 사이로 자가 콜라겐이 서서히 차오르면서, 인위적이지 않고 자연스러운 입체 볼륨과 탄력이 부드럽게 자리 잡습니다.",
      },
    ],
    compare: {
      title: "잼버실, 다른 실과 어떻게 다른가요?",
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
          label: "시술 목적",
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
          label: "시술 방식",
          values: [
            "뭉툭한 캐뉼라 사용",
            "제품별 전용 바늘 / 캐뉼라",
            "제품별 전용 바늘",
            "특수 콘(Cone) 고정 바늘",
          ],
        },
        {
          label: "시술 포인트",
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
    featuresRatio: 4 / 3,
    featuresTitle: "잼버실의 특징 4가지",
    features: [
      {
        title: "스프링 구조의 탄탄한 볼륨 지지력",
        text: "스프링처럼 촘촘하게 말려 있는 특수 형태의 녹는 실이 꺼진 부위의 피하층에서 안쪽부터 촘촘하게 받쳐 주어, 인위적이지 않고 자연스러운 입체 볼륨을 만들어 줍니다.",
        image: "/images/thread/features/jamber-point-01-volume-support-v2.webp",
        mediaSrcSet: "/images/thread/features/jamber-point-01-volume-support-v2-800.webp 800w, /images/thread/features/jamber-point-01-volume-support-v2.webp 1200w",
        alt: "피부 안에서 공간을 받치는 코일형 실의 설명용 모식도",
      },
      {
        title: "당기지 않고 채우는 맞춤형 타깃 케어",
        text: "피부를 강제로 당겨 올리는 리프팅 실과 달리, 눈밑 · 팔자주름 · 앞볼 등 나이가 들며 야위거나 꺼진 부위에만 선택적으로 집중하여 부드럽고 매끄러운 선을 완성합니다.",
        image: "/images/thread/features/jamber-point-02-elasticity-v2.webp",
        mediaSrcSet: "/images/thread/features/jamber-point-02-elasticity-v2-800.webp 800w, /images/thread/features/jamber-point-02-elasticity-v2.webp 1200w",
        alt: "유연하게 굽은 코일형 실의 탄성을 표현한 설명용 모식도",
      },
      {
        title: "콜라겐 재생을 통한 탄력 밀도 강화",
        text: "삽입된 실이 서서히 흡수되는 동안 실 주변에서 자가 콜라겐 생성이 유도됩니다. 이에 따른 변화의 정도와 유지 기간에는 개인차가 있습니다.",
        image: "/images/thread/features/jamber-point-03-blunt-cannula-v2.webp",
        mediaSrcSet: "/images/thread/features/jamber-point-03-blunt-cannula-v2-800.webp 800w, /images/thread/features/jamber-point-03-blunt-cannula-v2.webp 1200w",
        alt: "피부 조직과 둥근 캐뉼라 끝부분을 표현한 설명용 단면도",
      },
      {
        title: "이물감을 낮춘 부드러운 안착과 자연스러운 표정",
        text: "피부 조직의 특성을 고려한 섬세한 자입(Insertion)으로 시술 후 과도한 당김이나 딱딱한 이물감을 줄이도록 시술하며, 느껴지는 정도는 사람마다 다릅니다.",
        image: "/images/thread/features/jamber-point-04-collagen-matrix-v2.webp",
        mediaSrcSet: "/images/thread/features/jamber-point-04-collagen-matrix-v2-800.webp 800w, /images/thread/features/jamber-point-04-collagen-matrix-v2.webp 1200w",
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
        image: "/images/photos/thread-insertion-20261105.webp",
        alt: "실을 삽입하는 시술 장면",
      },
      {
        title: "경과 확인",
        text: "부기 · 멍을 확인하고 일상생활 주의사항을 안내합니다.",
        image: "/images/photos/clinic-5-no-brown-wrap-20261105.webp",
        alt: "프라베일 관리실",
      },
    ],
  },
  "/acne-pore": {
    kind: "procedure",
    diagram: "acne",
    aboutTitle: "여드름 · 모공, 어떻게 치료하나요?",
    processTitle: "여드름 · 모공 치료, 어떻게 진행되나요?",
    showPrices: true,
    device: {
      name: "여드름 · 모공 치료",
      maker: "ACNE · MARKS · SCARS · PORES",
      image: doctorPhotos.laser,
      photo: doctorPhotos.laser,
      photoFullFrame: true,
      text: "진행 중인 붉은 염증과 울긋불긋한 색소 자국, 패인 흉터와 늘어진 모공은 발생하는 원인과 치료 접근법이 다릅니다. 현재 피부 장벽 상태와 염증도를 우선 진단하여 피지선 안정화와 맞춤 압출 · 스케일링을 선행하며, 이후 붉은 자국과 모공 · 흉터 재생 시술을 단계별로 나누어 진행합니다. 피부 본연의 회복 속도에 맞춰 무리 없는 치료 플랜을 세웁니다.",
      specs: [
        {
          label: "병변 세분화",
          value: "염증성 여드름 · 색소 침착 · 패인 흉터 · 모공 이완 개별 타깃팅",
        },
        {
          label: "치료법 구분",
          value: "피지선 조절, 맞춤 메디컬 스케일링, 모공 · 흉터 타깃 레이저 병행",
        },
        {
          label: "흉터 정밀 분석",
          value: "패인 흉터의 깊이 및 모공 탄력도에 맞춘 정교한 시술 설계",
        },
        {
          label: "진행 기준",
          value: "피부 민감도, 회복 속도, 일상 다운타임을 고려한 시술 간격",
        },
      ],
      photoAlt: "보호 안경을 착용한 대표원장의 레이저 시술 장면",
    },
    // 요청에 따라 원리 · 비교표 섹션은 쓰지 않는다
    principle: [],
    // 요청에 따라 특별함 섹션은 쓰지 않는다
    features: [],
    process: [
      {
        title: "1:1 상담",
        text: "여드름 단계와 자국 · 흉터를 고려하고, 복용약과 사용 중인 화장품을 확인합니다.",
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
        image: "/images/photos/clinic-5-no-brown-wrap-20261105.webp",
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
      maker: "LUTRONIC",
      image: "/images/photos/cat-hair-removal.webp",
      photo: "/images/photos/cat-hair-removal.webp",
      text: "레이저 제모는 털의 검은 멜라닌 색소에 선택적으로 흡수되는 레이저 빛을 조사하여 모근과 모낭을 목표로 하는 시술입니다. 피부 표면의 부담을 줄이면서 털의 성장 주기(성장기)에 맞춰 단계적으로 모낭의 활동을 낮춰 반영구적인 감모 효과를 기대합니다. 개인의 피부 톤, 털의 굵기와 밀도, 부위별 특성에 맞춰 레이저 에너지를 정밀하게 조절해 자극을 줄이며 진행합니다.",
      specs: [
        {
          label: "시술 방식",
          value: "선택적 광열 융해 · 멜라닌에 반응하는 에너지를 모근까지 전달",
        },
        {
          label: "정밀 점검",
          value: "표피 자극을 줄이기 위한 피부 밝기 · 털의 굵기 및 밀도 분석",
        },
        {
          label: "치료 목표",
          value: "회차를 거듭하며 털의 굵기 · 성장 속도 · 밀도를 점진적으로 낮춤",
        },
        {
          label: "시술 설계",
          value: "털의 성장기 주기에 맞춘 4~6주 간격의 반복 시술 계획",
        },
      ],
      photoAlt: "기존 레이저 장비실 참고 사진",
      film: {
        src: "/videos/official-clarity.mp4",
        poster: "/images/official/clarity-poster.jpg",
        fit: "cover",
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
      title: "레이저 제모 · 면도 · 왁싱은 어떻게 다른가요?",
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
    // 사진 원본 크기가 제각각이라 칸 비율을 하나로 맞춘다
    featuresRatio: 4 / 3,
    featuresTitle: "클라리티2 레이저 제모의 특별함",
    features: [
      {
        title: "755nm · 1064nm 듀얼 파장으로 맞춤형 제모",
        text: "멜라닌 흡수율이 높아 가늘지만 색이 남아 있는 털에 쓰는 755nm 알렉산드라이트 파장과, 피부 깊숙이 도달해 굵고 뿌리 깊은 털에 쓰는 1064nm Nd:YAG 파장을 모두 탑재했습니다. 털의 굵기와 깊이, 피부 톤에 따라 파장과 설정을 나누어 계획하며, 색소가 거의 없는 흰색 · 회색 털은 어느 파장으로도 반응이 제한적입니다.",
        image: "/images/official/clarity-poster.jpg",
        alt: "클라리티2 · 듀얼 파장 · 제조사 공식 자료",
        fullFrame: false,
        video: "/videos/official-clarity.mp4",
        // 5:3 영상이라 4:3 칸에 담으면 위아래가 남는다. 좌우를 조금 잘라 칸을 채움
        mediaFit: "cover",
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
        text: "장비에 실시간 피부 온도 센서가 탑재되어 있어 시술 중 피부 온도를 함께 확인합니다. 표시되는 온도 정보를 참고하면서 의료진이 피부 반응과 열감을 함께 확인하여 조사 조건을 조절하므로, 에너지를 일정하게 유지하면서 피부 자극이나 붉은기를 줄이는 데 도움이 됩니다.",
        image: "/images/official/clarity-temperature.png",
        alt: "클라리티2 · 실시간 피부 온도 표시 · 제조사 공식 자료",
        fullFrame: false,
        mediaSize: { width: 841, height: 328 },
        // 배경이 비치는 자료라 아이보리 위에서는 흰 글자가 보이지 않는다
        mediaEdges: ["#000000", "#000000"],
      },
      {
        title: "인텔리트랙(IntelliTrak) 기술",
        text: "인텔리트랙(IntelliTrak) 센서가 시술 속도를 감지해 에너지 밀도를 일정하게 유지합니다. 샷 중복이나 빈틈없이 균일하게 조사되어 등이나 다리처럼 넓은 부위도 빠르고 정밀하게 시술할 수 있습니다.",
        image: "/images/official/clarity-tracking.png",
        alt: "클라리티2 · 인텔리트랙 · 제조사 공식 자료",
        fullFrame: false,
        mediaSize: { width: 408, height: 464 },
        // 배경이 비치는 자료라 아이보리 위에서는 핸드피스와 설명 글자가 보이지 않는다
        mediaEdges: ["#000000", "#000000"],
      },
    ],
    process: [
      {
        title: "상태 점검 및 시술 준비",
        text: "제모 부위의 피부 상태와 털의 정돈 상태를 확인하고 표면을 깨끗하게 정리하며, 통증에 민감한 부위는 마취 크림이나 냉각 케어로 통증을 줄여줍니다.",
        image: "/images/photos/clinic-3.webp",
        alt: "프라베일 상담실",
      },
      {
        title: "전용 보안경 착용 및 쿨링 세팅",
        text: "레이저 빛으로부터 눈을 보호하기 위해 전용 안경을 착용하고, 피부 표면이 뜨거워지지 않도록 차가운 바람이나 냉각 가스 시스템을 준비합니다.",
        image: "/images/photos/process-anesthesia-model-a.webp",
        alt: "시술 전 준비와 통증 관리를 진행하는 장면",
      },
      {
        title: "부위별 레이저 조사",
        text: "털의 굵기와 피부 톤에 맞춰 알맞은 강도로 조절한 뒤, 놓치는 부위 없이 꼼꼼하게 레이저를 조사합니다.",
        image: doctorPhotos.laser,
        alt: "보호 안경을 착용한 대표원장의 레이저 시술 장면",
        fullFrame: true,
        coverPosition: "35% 50%",
      },
      {
        title: "진정 관리 및 주의사항 안내",
        text: "시술 직후 피부에 남은 열감과 붉은기를 차갑게 진정시키고, 당일 샤워나 외출 시 주의해야 할 점을 안내해 드립니다.",
        image: "/images/photos/clinic-5-no-brown-wrap-20261105.webp",
        alt: "프라베일 관리실",
      },
    ],
    principleImage: {
      src: "/images/principles/hair.webp?v=20261026b",
      alt: "털의 색소와 모낭에 레이저 에너지가 작용하는 원리를 보여 주는 입체 개념도",
      marks: [],
      layers: [],
      framed: true,
      noteOverlay: true,
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
      photo: "/images/official/pico-k-card-20261105.png",
      text: "피부 진피층에 주입된 문신 색소에 특정 파장의 레이저 빛을 조사하여 색소 입자를 미세하게 파쇄하고, 체내 대사 과정을 통해 서서히 배출되도록 돕는 시술입니다. 색소의 색 · 양과 피부 상태에 따라 반응이 달라 완전한 제거를 보장하지는 않습니다. 프라베일에서는 눈썹, 아이라인, 언더라인 등 섬세한 페이스 반영구 색소 제거를 중심으로 진행합니다.",
      specs: [
        {
          label: "작용 원리",
          value: "레이저로 색소 입자를 미세하게 분해해 체내 대사 배출 유도",
        },
        {
          label: "사전 점검",
          value: "반영구 잔여 색상, 주입 깊이, 덧입힌 횟수 및 피부 민감도 확인",
        },
        {
          label: "시술 방식",
          value: "얇은 눈가 피부와 모근을 고려한 부위별 맞춤 레이저 타깃 조사",
        },
        {
          label: "치료 계획",
          value: "색소 배출 반응과 피부 장벽 회복 속도에 맞춘 단계별 제거 플랜",
        },
      ],
      photoAlt: "스페클립스 PICO-K 제조사 공식 장비 이미지",
      // 클라리티처럼 장비 전체가 크게 보이도록 배경을 깐 이미지
      mediaFill: true,
    },
    principle: [
      {
        title: "색소 성상 및 피부 상태 정밀 진단",
        text: "눈에 보이는 표면의 색상뿐 아니라 시술 시기, 덧입힌 횟수, 피부 깊숙이 주입된 잔여 색소의 깊이를 정밀하게 파악합니다. 피부 얇기와 이전의 알레르기 · 민감 반응을 함께 점검해 무리 없는 시술 범위를 설정합니다.",
      },
      {
        title: "색소 맞춤 파장 및 에너지 설정",
        text: "검붉은색, 푸른색 등 색소 종류에 따라 반응하는 파장이 다릅니다. 주변 정상 피부와 눈썹 모근의 불필요한 열 자극을 줄이기 위해 색소 반응도에 맞춘 레이저 파라미터를 적용하여 타깃 색소를 정교하게 파쇄합니다.",
      },
      {
        title: "체내 대사 배출 및 단계별 경과 확인",
        text: "미세하게 분해된 색소 입자는 체내 림프 대사 과정을 거치며 수 주에 걸쳐 서서히 배출됩니다. 피부 장벽이 충분히 회복되고 색소가 옅어지는 경과를 관찰한 뒤, 무리 없는 간격으로 다음 회차 시술을 조율합니다.",
      },
    ],
    compare: {
      title: "레이저와 수술적 제거, 어떻게 다른가요?",
      lead: "프라베일은 피코 레이저(피코케이)로 진행합니다. 레이저가 빛을 전달하는 시간과 색소를 다루는 방법은 어떤 차이가 있을까요?",
      columns: [
        {
          name: "피코 레이저",
          maker: "더 짧은 시간의 빛 전달",
          self: true,
        },
        {
          name: "나노 레이저",
          maker: "짧은 시간의 빛 전달",
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
      note: "※ 일반적인 방법 비교이며 실제 제공 시술 목록을 뜻하지 않습니다. 프라베일은 눈썹 · 아이라인 · 언더라인 반영구 문신제거를 피코 레이저로 진행하며, 수술적 제거는 하지 않습니다. 맞는 방법은 색소와 피부 상태에 따라 다르며, 효과 · 회복 기간에는 개인차가 있습니다.",
    },
    featuresRatio: 4 / 3,
    // 요청에 따라 특별함 섹션은 쓰지 않는다
    features: [],

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
        image: "/images/photos/hero-eyebrow-removal-20261105-v7.webp",
        alt: "대표원장이 눈썹 반영구 문신 부위를 시술하는 AI 연출 이미지",
      },
      {
        title: "경과 확인",
        text: "피부와 색 변화를 확인하고, 상처 관리와 다음 평가 시기를 안내합니다.",
        image: "/images/photos/clinic-5-no-brown-wrap-20261105.webp",
        alt: "프라베일 관리실",
      },
    ],
    principleImage: {
      src: "/images/principles/pigment.webp?v=20261026b",
      alt: "피부 속 문신 색소와 레이저 작용으로 잘게 나뉜 입자를 구분한 입체 개념도",
      marks: [],
      layers: [],
      framed: true,
      noteOverlay: true,
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
    text: `얼굴 보톡스는 근육층이나 피부 진피층에 보톡스를 소량 주입하여, 신경전달물질(아세틸콜린)의 분비를 일시적으로 차단하여 근육의 성장을 억제하는 시술입니다.

주입된 부위의 근육 수축을 억제하거나 피지선 · 땀샘 분비를 조절함으로써 주름 개선, 안면 윤곽 교정, 피부결 개선 등의 효과를 기대할 수 있습니다.`,
    specs: [
      { label: "제품 성분", value: "보툴리눔 독소 A형(Botulinum Toxin Type A)" },
      { label: "시술 원리", value: "목표 근육의 움직임을 일시적으로 조절 및 축소" },
      { label: "시술 계획", value: "개인별 부위 · 표정 습관 · 근육 강도 정밀 진단 후 디자인" },
      { label: "제품 선택", value: "국산 · 수입 정품 제품 중 1:1 상담 후 맞춤 선택" },
    ],
  },
};
deviceStory["/petit/botox/body"] = {
  ...botoxStory,
  device: {
    ...botoxStory.device,
    // 확인 필요: 바디 시술 촬영본 (상담 사진을 쓰지 않아 병원 공간 사진)
    image: "/images/photos/intro-botox-products-20261105.webp",
    photo: "/images/photos/intro-botox-products-20261105.webp",
    photoAlt: "뉴럭스 · 코어톡스 · 제오민 제품 상자와 바이알",
    // 인물용 덮개 · 확대 없이 칸을 꽉 채운다
    mediaFill: true,
    text: "바디 보톡스는 보툴리눔 톡신(근육의 움직임을 줄이는 주사)을 승모근 · 종아리처럼 큰 근육이나 땀이 많은 부위에 쓰는 시술입니다. 근육의 두께와 범위, 땀이 나는 범위를 고려하여 용량과 주사 위치를 정합니다.",
    specs: [
      { label: "시술 방식", value: "보툴리눔 톡신 제제를 타깃 근육층 및 진피층에 정밀 주입" },
      { label: "작용 원리", value: "발달된 근육 부피 축소, 표정 주름 완화 및 국소 땀 분비 억제" },
      { label: "시술 설계", value: "부위별 근육 두께, 활동성, 좌우 대칭성을 고려한 맞춤 시술" },
      { label: "제품 선택", value: "내성 안정성과 시술 목적에 따른 국산 · 수입 정품 제품 선택" },
    ],
  },
  // 바디 전용 사진 · 글 (얼굴 보톡스와 나눠서 씀)
  featuresTitle: "프라베일 바디 보톡스의 특별함",
  features: [
    {
      title: "정품 · 정량 확인 및 투명한 원칙",
      text: "국내외 승인을 거친 안전한 정품만을 사용하며, 정해진 희석 비율과 적정 용량을 엄격히 준수합니다.",
      image: "/images/photos/body-botox-special-01-authentic-preparation-20261105.webp",
      alt: "보톡스 제품 패키지와 바이알, 포장된 준비물을 배치한 AI 제작 설명 이미지",
    },
    {
      title: "체형 밸런스를 고려한 자연스러운 라인",
      text: "골격 구조와 전체적인 신체 비율을 정밀하게 분석하여 무리한 축소가 아닌 매끄럽고 균형 잡힌 바디 라인을 설계합니다.",
      image: "/images/photos/body-botox-special-02-body-balance-20261105.webp",
      alt: "여성 모델의 어깨와 등 라인을 보여주는 AI 제작 설명 이미지",
    },
    {
      title: "고용량 시술을 대비한 내성 예방 솔루션",
      text: "바디 부위는 안면부보다 투여 용량이 큰 만큼, 복합 단백질을 배제한 고순도 순수 톡신을 우선적으로 고려하고 과도한 반복 시술을 피해 내성 위험을 철저히 관리합니다.",
      image: "/images/photos/body-botox-special-03-product-history-review-20261105.webp",
      alt: "보톡스 제품과 기록 서류를 함께 배치한 AI 제작 설명 이미지",
    },
    {
      title: "근육 기능 저하 위험을 줄이는 분할 주입",
      text: "목, 어깨의 지지력이나 보행 등 일상적인 움직임에 불편이 없도록, 특정 부위에 약물이 과도하게 쏠리지 않게 근육층 깊이와 포인트를 정교하게 나누어 분산 주입합니다.",
      image: "/images/photos/body-botox-special-04-trapezius-injection-20261105.webp",
      alt: "승모근과 어깨 부위의 주입 장면을 표현한 AI 제작 설명 이미지",
    },
  ],
  process: [
    {
      title: "맞춤 상담 및 시술 전 상태 확인",
      text: "고민 부위와 시술 이력, 복용 약물을 확인하고, 대표원장이 동적 움직임에 따른 근육 두께와 땀샘 분포 범위를 세밀하게 고려하여 시술 범위를 설계합니다.",
      image: "/images/photos/clinic-3.webp",
      alt: "프라베일 상담실",
    },
    {
      title: "쿨링 및 통증 제어",
      text: "시술 부위를 소독하고 정돈한 뒤, 통증 민감도에 맞춰 쿨링 패드나 마취 크림으로 불편감을 줄입니다.",
      image:
        "/images/photos/body-botox-process-02-shoulder-cooling-20261106-v1.webp",
      alt: "어깨 · 승모근 부위에 보호천으로 감싼 쿨링 패드를 대는 AI 제작 시술 준비 설명 이미지",
    },
    {
      title: "대표원장 1:1 맞춤 정밀 주입",
      text: "정품 · 정량 원칙을 바탕으로, 설정된 타깃 부위에 적정 깊이와 알맞은 압력으로 약물을 균일하게 분산 주입합니다.",
      image: "/images/photos/process-body-botox-injection-20261105.webp",
      alt: "승모근 부위에 주입하는 바디 보톡스 시술 설명 이미지",
    },
    {
      title: "사후 관리 및 주의사항 안내",
      text: "시술 직후 안정적인 회복을 돕는 주의사항을 안내하고, 근육 축소 및 땀샘 억제 경과 시점에 맞춘 사후 관리 계획을 전해 드립니다.",
      image: "/images/photos/clinic-5-no-brown-wrap-20261105.webp",
      alt: "프라베일 관리실",
    },
  ],
  principle: [
    {
      title: "근육 발달도 및 땀샘 범위 정밀 체크",
      text: "어깨를 올리거나 까치발을 들 때 두드러지는 근육의 두께와 비대칭, 땀 분비 부위의 범위를 시술 전 정밀하게 파악합니다.",
    },
    {
      title: "부위별 정교한 다포인트 분산 주입",
      text: "승모근, 종아리처럼 면적이 넓은 바디 부위는 여러 포인트로 균일하게 나누어 주입합니다. 한곳에 뭉치지 않게 분산 주입하여 울퉁불퉁함 없이 매끄러운 라인을 만듭니다.",
    },
    {
      title: "선택적 근육 축소 및 땀샘 분비 억제",
      text: "타깃 부위의 신경 전달을 완화하여 과도하게 쓰이던 큰 근육의 부피를 점진적으로 줄이고, 땀샘의 분비를 억제해 보송한 일상을 돕습니다.",
    },
  ],
};
