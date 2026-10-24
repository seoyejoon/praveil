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
  // 확인 필요: 쿨페이즈 국내 사용설명서, 본원 보유 팁 종류와 허용 시술 부위, 눈가 보호 기준.
  // 확인 필요: 본원의 통증 관리 방식과 마취 여부. 사진은 기존 이미지를 재사용했으며 실제 쿨페이즈 시술 사진인지 확인 후 교체.
  // 확인 필요: 실제 시술 범위별 샷 수 · 반복 간격 · 가격 · 부가세 · 관리 포함 여부. 초안에는 숫자를 만들지 않음.
  // 확인 필요: 임신 · 수유, 전자 삽입물과 질환별 금기 사항을 쿨페이즈 국내 설명서 기준으로 검수. 써마지 자료를 쿨페이즈의 개별 금기로 단정하지 않음.
  // 확인 필요: FDA K250852 사용목적은 조직응고 · 지혈이며 리프팅 효과를 보증하는 승인으로 표현하지 않음. 비교 장비의 본원 보유 여부는 초안에서 주장하지 않음.
  "/lifting/coolphase": {
    diagram: "rf",
    showPrices: true,
    device: {
      name: "Coolfase",
      maker: "ASTERASYS",
      image: "/images/photos/best-coolphase.webp",
      photo: "/images/photos/best-coolphase.webp",
      text: "쿨페이즈는 피부에 팁을 접촉해 고주파 전류를 전달하는 모노폴라 RF 장비입니다. 조직의 전기 저항으로 열이 생기며, 피부에 닿는 부분은 직접 냉각합니다. 피부 두께와 탄력 저하 정도를 보고 적용 부위와 에너지를 정합니다.",
      specs: [
        {
          label: "에너지",
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
          label: "시술 범위",
          value: "피부 상태 · 사용 팁 확인 후 결정",
        },
      ],
    },
    principle: [
      {
        title: "피부에 고주파 전달",
        text: "팁과 피부의 접촉 상태를 확인하고, 설정한 고주파 에너지를 전달합니다.",
      },
      {
        title: "조직에서 열 발생",
        text: "조직의 전기 저항으로 열이 생깁니다. 피부 표면은 팁으로 냉각하면서 접촉 상태와 반응을 살핍니다.",
      },
      {
        title: "회복 과정의 탄력 변화 관찰",
        text: "고주파 열 자극 이후 콜라겐이 재구성되는 과정을 이용합니다. 변화의 정도와 시점은 개인마다 다릅니다.",
      },
    ],
    compare: {
      title: "쿨페이즈, 다른 리프팅 장비와 무엇이 다른가요?",
      lead: "같은 탄력 고민에도 에너지를 전달하는 방식과 시술 계획은 다릅니다.",
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
    featuresTitle: "쿨페이즈 시술에서 살피는 4가지",
    features: [
      {
        title: "고주파를 이용한 탄력 관리",
        text: "초음파를 한 점에 모으는 방식과 달리 고주파 전류로 조직에 열을 만듭니다. 탄력 저하가 있는 범위를 먼저 살핍니다.",
        image: "/images/photos/best-coolphase.webp",
        alt: "쿨페이즈 안내에 사용하는 기존 사진",
      },
      {
        title: "팁의 직접 접촉 냉각",
        text: "피부에 닿는 팁을 냉각하는 구조입니다. 냉각 기능이 있어도 열감과 통증은 생길 수 있어 시술 중 반응을 확인합니다.",
        image: "/images/photos/signature-2.webp",
        alt: "피부 상태를 살피는 설명용 기존 사진",
      },
      {
        title: "피부 상태에 맞춘 범위 설정",
        text: "얼굴 전체를 같은 설정으로 진행하기보다 피부 두께와 굴곡, 이전 시술 이력을 확인해 계획합니다.",
        image: "/images/photos/process-consult.webp",
        alt: "시술 전 상담을 설명하는 사진",
      },
      {
        title: "당일보다 경과까지 확인",
        text: "당일 열감이나 부기와 이후의 변화를 나누어 봅니다. 경과를 확인한 뒤 추가 관리가 필요한지 정합니다.",
        image: "/images/photos/process-check.webp",
        alt: "시술 후 경과 확인을 설명하는 사진",
      },
    ],
    process: [
      {
        title: "1:1 상담",
        text: "탄력 저하 부위와 피부 두께, 삽입물 · 이전 시술 이력을 확인합니다.",
        image: "/images/photos/process-consult.webp",
        alt: "시술 전 상담을 설명하는 사진",
      },
      {
        title: "피부 준비 · 통증 관리",
        text: "피부와 팁의 접촉 상태를 점검하고 필요한 통증 관리 방법을 설명합니다.",
        image: "/images/photos/process-anesthesia.webp",
        alt: "피부 준비와 통증 관리를 설명하는 사진",
      },
      {
        title: "부위별 시술",
        text: "계획한 범위에 고주파를 전달하며 열감과 피부 반응을 확인합니다.",
        image: "/images/photos/process-treatment.webp",
        alt: "시술 단계 설명에 재사용한 기존 사진",
      },
      {
        title: "경과 확인",
        text: "붉은기와 불편감을 확인하고 세안 · 보습 · 추가 진료가 필요한 증상을 안내합니다.",
        image: "/images/photos/process-check.webp",
        alt: "경과 확인을 설명하는 사진",
      },
    ],
  },
  // 확인 필요: 본원이 실제 사용하는 보툴리눔 톡신 제품명 · 제조사 · 국내 허가사항. 'Botox' 상표 제제 보유를 의미하지 않는 통칭 원고임.
  // 확인 필요: 턱 · 승모근 · 종아리 · 피부 · 다한증 등 기존 treatments.ts 노출 부위별 사용 제제와 국내 허가 범위, 허가 외 사용 설명 기준. 미국 제품 설명서를 국내 모든 제제에 그대로 적용하지 않음.
  // 확인 필요: 부위별 용량 · 냉각 또는 마취 방식 · 경과 확인 시점 · 재시술 간격 · 실제 비용. 제제 간 유닛 환산값은 만들지 않음.
  // 확인 필요: 임신 · 수유, 신경근육 질환, 과거 알레르기, 약물 상호작용 관련 본원 진료 기준 검수.
  // 확인 필요: 재사용한 process-treatment 사진이 실제 주사 시술 사진인지 확인 후 병원 제공 사진으로 교체.
  "/petit/botox": {
    kind: "procedure",
    diagram: "botox",
    showPrices: true,
    device: {
      name: "보톡스",
      maker: "Botulinum Toxin",
      image: "/images/photos/cat-botox.webp",
      photo: "/images/photos/cat-botox.webp",
      text: "보톡스는 보툴리눔 톡신 제제를 주사해 목표 근육의 움직임을 일시적으로 줄이는 시술입니다. 움직일 때 생기는 표정주름과 가만히 있어도 남는 주름을 구분하고, 근육의 힘과 표정 습관을 살펴 계획합니다.",
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
          label: "제제 선택",
          value: "사용 제품과 허가 범위 확인 후 결정",
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
        text: "부위와 제품별 기준에 맞춰 주사 위치와 용량을 정합니다. 서로 다른 제품의 단위를 그대로 바꾸어 쓰지 않습니다.",
      },
      {
        title: "신경의 전달 신호 감소",
        text: "보툴리눔 톡신이 신경의 아세틸콜린 방출을 억제해 근육의 수축을 일시적으로 줄입니다.",
      },
    ],
    compare: {
      title: "주름 고민, 보톡스와 다른 시술은 어떻게 고르나요?",
      lead: "움직임 때문에 생긴 주름인지, 꺼짐이나 피부 탄력이 문제인지 먼저 구분합니다.",
      columns: [
        {
          name: "보톡스",
          maker: "근육 움직임 조절",
          self: true,
        },
        {
          name: "히알루론산 필러",
          maker: "부피 · 윤곽 보완",
        },
        {
          name: "고주파 탄력 관리",
          maker: "열을 이용한 조직 자극",
        },
      ],
      rows: [
        {
          label: "방식",
          values: [
            "보툴리눔 톡신 주사",
            "히알루론산 젤 주입",
            "고주파 에너지 전달",
          ],
        },
        {
          label: "작용 방향",
          values: [
            "목표 근육의 수축을 줄임",
            "조직의 꺼진 부위를 보완",
            "콜라겐 재구성 과정 이용",
          ],
        },
        {
          label: "상담할 고민",
          values: [
            "표정에 따라 깊어지는 주름",
            "꺼짐 · 깊은 주름 · 윤곽",
            "피부 탄력 저하",
          ],
        },
        {
          label: "계획 기준",
          values: [
            "근육의 힘과 표정",
            "넣을 층과 제품 · 양",
            "피부 두께와 적용 범위",
          ],
        },
      ],
      note: "※ 각 시술의 일반적인 특징을 정리한 것으로, 어느 시술이 더 낫다는 뜻이 아닙니다. 맞는 시술은 피부 상태와 고민에 따라 다르며, 효과 · 유지 기간은 사람마다 다릅니다. 비교 항목은 특정 제품의 본원 보유 여부를 뜻하지 않습니다.",
    },
    featuresTitle: "보톡스 시술에서 살피는 4가지",
    features: [
      {
        title: "표정을 보며 주사 위치 설정",
        text: "정면 사진만으로 판단하지 않고 표정을 지을 때의 움직임과 좌우 차이를 함께 확인합니다.",
        image: "/images/photos/cat-botox.webp",
        alt: "보톡스 시술 안내에 사용하는 기존 사진",
      },
      {
        title: "부위와 제품에 맞춘 계획",
        text: "같은 이름의 보톡스 시술도 부위와 제제가 다르면 계획이 달라집니다. 제품 정보와 시술 이력을 확인합니다.",
        image: "/images/photos/signature-3.webp",
        alt: "부위별 시술 계획을 설명하는 기존 사진",
      },
      {
        title: "원하는 표정 변화 함께 확인",
        text: "주름을 줄이고 싶은 정도와 유지하고 싶은 표정을 함께 듣고, 기대할 수 있는 변화와 한계를 설명합니다.",
        image: "/images/photos/process-consult.webp",
        alt: "표정과 고민을 상담하는 설명용 사진",
      },
      {
        title: "변화가 나타난 뒤 경과 확인",
        text: "시술 직후 추가하기보다 변화가 나타나는 과정을 보고 불편감과 좌우 움직임을 확인합니다.",
        image: "/images/photos/process-check.webp",
        alt: "시술 후 경과 확인을 설명하는 사진",
      },
    ],
    process: [
      {
        title: "1:1 상담",
        text: "고민 부위, 표정, 복용 약과 이전 보툴리눔 톡신 시술 이력을 확인합니다.",
        image: "/images/photos/process-consult.webp",
        alt: "시술 전 상담을 설명하는 사진",
      },
      {
        title: "피부 준비 · 필요 시 냉각",
        text: "주사 부위를 확인하고 피부를 준비합니다. 통증 관리 방법은 부위에 맞춰 안내합니다.",
        image: "/images/photos/process-anesthesia.webp",
        alt: "피부 준비와 통증 관리를 설명하는 사진",
      },
      {
        title: "부위별 주사",
        text: "설계한 부위에 제품별 기준에 맞춰 주사합니다.",
        image: "/images/photos/process-treatment.webp",
        alt: "주사 시술 단계 설명에 재사용한 기존 사진",
      },
      {
        title: "주의사항 · 경과 안내",
        text: "당일 주의사항과 변화 관찰 시점, 추가 진료가 필요한 증상을 안내합니다.",
        image: "/images/photos/process-check.webp",
        alt: "경과 확인을 설명하는 사진",
      },
    ],
  },
};
