// 장비 시술 페이지의 "장비 이야기" 원고 (장비 소개 · 원리 그림 · 특징 · 시술 장면)
// - 글만 있던 설명을 장비 사진 · 원리 그림 · 실제 시술 장면과 함께 보여 줌
// - 있는 시술만 TreatmentDetail 에서 이 구성으로 바뀜 (지금은 쿨소닉만)
// ※ 임시 원고: 원장님 검토 후 확정해 주세요. 효과를 보장하는 표현 · 다른 병원과의 비교는 쓰지 않습니다.

export type DeviceStory = {
  /** 장비 시술(기본) · 장비가 아닌 시술(필러 등): 제목이 "어떤 장비인가요?" / "어떤 시술인가요?" 로 바뀜 */
  kind?: "device" | "procedure";
  /** 원리 그림 종류 (그림 사진이 없을 때): 초음파(기본) · 필러 */
  diagram?: "hifu" | "filler";
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
    /** 제목 · 설명 (없으면 리프팅 장비 비교 문구) */
    title?: string;
    lead?: string;
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
      },
      {
        title: "얼굴 굴곡에 밀착하는 펜형 어플리케이터",
        text: "쿨소닉의 어플리케이터는 굴곡진 피부에도 밀착하기 쉬운 펜형 구조입니다. 얼굴의 곡면을 따라 접촉하면서 초음파 에너지를 전달합니다.",
        image: cs("handpiece"),
        alt: "얼굴 곡면을 따라 쿨소닉 펜형 어플리케이터로 시술하는 모습",
      },
      {
        title: "쿨링으로 통증 부담을 줄이는 초음파 리프팅",
        text: "쿨소닉은 피부 표면을 냉각하면서 고강도 집속 초음파(HIFU)를 전달합니다. ACC 냉각 기술을 적용해 시술 중 열감과 통증 부담을 줄였습니다.",
        image: cs("coolsonic-cooling"),
        video: "/videos/coolsonic-cooling.mp4",
        alt: "쿨소닉 ACC 냉각 어플리케이터",
      },
      {
        title: "콜라겐과 탄성섬유의 재생 유도",
        text: "쿨소닉의 집속 초음파는 피부 속 목표 조직에 열응고점을 형성합니다. 이를 통해 콜라겐과 탄성섬유의 재생을 유도해 탄력과 리프팅 효과를 기대할 수 있습니다.",
        image: cs("principle"),
        alt: "피부 속 목표 조직에 열응고점을 만드는 쿨소닉 집속 초음파 원리",
      },
    ],
    process: [
      {
        title: "1:1 상담",
        text: "고민과 원하는 변화를 확인하고, 피부 두께와 처짐 방향을 진단해 부위별 깊이와 샷 수를 정합니다.",
        image: photo("process-consult"),
        alt: "대표원장 1:1 상담",
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
        image: photo("process-treatment"),
        alt: "대표원장이 쿨소닉으로 시술하는 모습",
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
    compare: {
      title: "필러, 다른 쁘띠 시술과 어떻게 다른가요?",
      lead: "상담 시 함께 많이 비교하는 시술의 일반적인 특징을 정리했습니다.",
      columns: [
        { name: "필러", maker: "볼륨 보충", self: true },
        { name: "보톡스", maker: "근육 움직임 완화" },
        { name: "스킨부스터", maker: "피부 속 수분 · 결" },
        { name: "콜라겐부스터", maker: "콜라겐 생성 유도" },
      ],
      rows: [
        {
          label: "작용 방식",
          values: [
            "꺼진 곳에 볼륨을 직접 채움",
            "주름을 만드는 근육의 움직임을 줄임",
            "피부 속에 수분 · 영양을 채움",
            "피부 스스로 콜라겐을 만들도록 도움",
          ],
        },
        {
          label: "주로 찾는 고민",
          values: [
            "꺼진 볼 · 이마, 팔자, 입술",
            "이마 · 미간 · 눈가 표정 주름",
            "건조함 · 피부결 · 잔주름",
            "얇아진 피부 · 탄력 · 밀도",
          ],
        },
        {
          label: "효과 시점",
          values: ["시술 직후", "3~7일 후", "1~2주 후", "1~3개월에 걸쳐"],
        },
        {
          label: "회복",
          values: [
            "붓기 · 멍 1~3일",
            "일상생활 바로 가능",
            "작은 엠보 1~3일",
            "붓기 · 엠보 1~3일",
          ],
        },
      ],
      note: "※ 각 시술의 일반적인 특징을 정리한 것으로, 어느 시술이 더 낫다는 뜻이 아닙니다. 맞는 시술은 피부 상태와 고민에 따라 다르며, 효과 · 유지 기간은 사람마다 다릅니다.",
    },
    featuresTitle: "프라베일 필러의 4가지 특징",
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
        image: photo("process-consult"),
        alt: "대표원장 1:1 상담",
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
};
