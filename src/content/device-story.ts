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
  // 확인 필요: 실제 사용하는 제품이 Re2O인지 Re2O Fine인지, 규격 · 공급 경로 · 사용설명서 · 로트 추적 기준. Fine 보유 또는 눈밑 적용은 추측하지 않음.
  // 확인 필요: 병원에서 사용하는 주입 방법, 깊이 · 양 · 수화/혼합 방법, 마취 방식과 경과 확인 기준. 연구 프로토콜을 본원 방식으로 전재하지 않음.
  // 확인 필요: 인체 유래 원료 설명 · 동의 절차, 제품의 국내 인체조직 분류와 적용 목적을 담당 원장이 검수. 의약품/의료기기와 같은 개별 허가로 표현하지 않음.
  // 확인 필요: 원논문은 20명 · 20주 split-face 연구이며 phADM와 비가교 HA 혼합군 대 HA 대조군. 리투오 단독 효과 또는 장기 안전성 · 유지 기간을 보장하지 않음.
  // 확인 필요: 2026년 혈관 합병증 증례는 원내 시술법과 준비 과정을 직접 확인하지 못한 단일 증례이므로 발생률이나 인과를 확정하지 않음. 혈관 위험과 hADM의 비가역성 설명은 의료진 검수.
  // 확인 필요: 기존 treatment-guide.ts의 '콜라겐을 직접 채워 즉시 밀도 회복' 등 단순화 문구와 정량 유지 기간이 새 hADM 원고와 충돌하는지 별도 점검.
  // 확인 필요: 가격 · 반복 횟수 · 간격 · 회복 일정은 본원 기준을 확인해 안내. 기존 사진은 설명용이며 실제 리투오 시술 사진으로 교체 필요.
  "/skin/retuo": {
    kind: "procedure",
    diagram: "matrix",
    showPrices: true,
    device: {
      name: "리투오 (Re2O)",
      maker: "L&C BIO",
      image: "/images/photos/best-retuo.webp",
      photo: "/images/photos/best-retuo.webp",
      text: "리투오는 인체 유래 무세포 동종진피(hADM)를 사용한 인체조직 제품입니다. 피부를 지지하는 세포외기질(ECM) 성분을 이용하며, 합성 고분자 PLLA 제제와 구성이 다릅니다. 피부결과 탄력 고민을 살피고 제품의 특성과 주의사항을 설명한 뒤 적용 여부를 정합니다.",
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
      photoAlt: "시술 안내에 사용하는 기존 진료 현장 사진",
    },
    principle: [
      {
        title: "피부 상태와 목표 확인",
        text: "거친 피부결, 잔주름, 꺼짐을 나누어 보고 이전 주사 시술과 피부 질환 이력을 확인합니다.",
      },
      {
        title: "무세포 동종진피 성분 적용",
        text: "살아 있는 세포를 넣는 시술이 아니라, 인체 진피에서 세포를 제거해 얻은 기질 성분을 이용합니다.",
      },
      {
        title: "조직 반응과 경과 관찰",
        text: "시술 후 초기 반응이 가라앉는 과정을 확인하고 피부결과 탄력 변화를 관찰합니다. 변화와 유지 정도는 개인마다 다릅니다.",
      },
    ],
    compare: {
      title: "리투오, 다른 주사 시술과 어떻게 다른가요?",
      lead: "성분과 치료 목표가 다르므로 같은 부스터라는 이름만으로 고르지 않습니다.",
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
        title: "인체 유래 원료를 먼저 설명",
        text: "인체조직에서 얻은 무세포 동종진피 제품임을 설명합니다. 원료와 제품 특성을 이해한 뒤 시술 여부를 정합니다.",
        image: "/images/photos/best-retuo.webp",
        alt: "리투오 상담 안내에 사용하는 기존 사진",
      },
      {
        title: "성분이 다른 부스터와 구분",
        text: "인체 유래 기질, 합성 고분자, 히알루론산은 재료가 다릅니다. 이름보다 치료 목표와 재료를 함께 확인합니다.",
        image: "/images/photos/signature-4.webp",
        alt: "피부 상태를 살피는 설명용 기존 사진",
      },
      {
        title: "피부 두께와 시술 이력 확인",
        text: "같은 피부 고민이라도 두께와 이전 시술에 따라 접근이 달라집니다. 적용 범위와 방법을 진찰 후 정합니다.",
        image: "/images/photos/process-consult.webp",
        alt: "피부 상태와 이전 시술을 상담하는 사진",
      },
      {
        title: "이상 반응까지 함께 확인",
        text: "변화뿐 아니라 지속되는 부기, 통증과 피부색 변화도 살핍니다. 인체 유래라는 이유로 부작용 가능성을 제외하지 않습니다.",
        image: "/images/photos/process-check.webp",
        alt: "시술 후 경과 확인을 설명하는 사진",
      },
    ],
    process: [
      {
        title: "1:1 상담",
        text: "피부 상태와 기대하는 변화, 알레르기 · 질환 · 이전 시술을 확인합니다.",
        image: "/images/photos/process-consult.webp",
        alt: "시술 전 상담을 설명하는 사진",
      },
      {
        title: "피부 준비 · 통증 관리",
        text: "제품과 적용 방법을 설명하고 피부 준비와 통증 관리를 진행합니다.",
        image: "/images/photos/process-anesthesia.webp",
        alt: "피부 준비와 통증 관리를 설명하는 사진",
      },
      {
        title: "계획한 부위에 적용",
        text: "진찰로 정한 부위와 방법에 따라 진행하며 피부 반응을 살핍니다.",
        image: "/images/photos/process-treatment.webp",
        alt: "시술 단계 설명에 재사용한 기존 사진",
      },
      {
        title: "경과 · 이상 반응 안내",
        text: "당일 상태를 확인하고 관리 방법과 추가 진료가 필요한 증상을 설명합니다.",
        image: "/images/photos/process-check.webp",
        alt: "경과 확인을 설명하는 사진",
      },
    ],
  },
  // 확인 필요: 실제 취급하는 리쥬란 제품군과 HA 주입용 제품명 · 국내 허가사항 · 시술부위를 확인해야 합니다. 제조사 예시는 보유 제품을 뜻하지 않습니다.
  // 확인 필요: 엑소좀은 제품명 · 제형 · 의료기기/의약품/화장품 분류와 허가 사용방법이 확인되기 전에는 주입 시술이나 회복효과로 안내하지 않습니다.
  // 확인 필요: treatments.ts 기존 headline의 회복력, points의 회복, items의 엑소좀 진정 · 회복 문구와 주입 자국 1~3일/하루 일괄 안내는 원장 검수 후 조정 권장.
  // 확인 필요: 사진은 기존 주입 · 상담 사진을 임시 재사용합니다. 제품별 실제 사진 · 정확한 대체텍스트를 제공받으면 교체해야 합니다.
  // 확인 필요: 실제 마취 방식 · 시술 시간 · 횟수 · 간격 · 가격과 사후관리 기준은 추측하지 않았으며 본원 기준 확인이 필요합니다.
  // 확인 필요: HA 미국 제품 설명서는 성분 · 위험 · 제품별 근거 차이의 예시이며 본원 보유 또는 국내 동일 허가를 뜻하지 않습니다.
  "/skin/booster": {
    kind: "procedure",
    diagram: "booster",
    showPrices: true,
    device: {
      name: "스킨부스터",
      maker: "성분 · 사용목적별 계획",
      image: "/images/photos/cat-skin-booster.webp",
      photo: "/images/photos/cat-skin-booster.webp",
      text: "스킨부스터는 피부결 · 잔주름 같은 고민을 관리하는 여러 제품과 방법을 묶어 부르는 말입니다. PN, 히알루론산 등 성분마다 역할과 사용목적이 달라, 제품명과 피부 상태를 함께 확인해 계획합니다. 바르는 제품과 주입용 제품은 사용방법을 구분합니다.",
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
      photoAlt: "시술 안내에 사용하는 기존 진료 현장 사진",
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
      lead: "함께 비교되는 관리의 목적과 사용방법을 나누어 보면 선택하기 쉽습니다.",
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
        title: "고민을 먼저 구분",
        text: "푸석함과 잔주름, 꺼짐은 살펴볼 원인이 다릅니다. 원하는 변화와 현재 피부 상태부터 함께 정리합니다.",
        image: "/images/photos/hero-consult.webp",
        alt: "피부 고민 상담에 사용하는 기존 상담 사진",
      },
      {
        title: "제품명과 성분 확인",
        text: "같은 스킨부스터라는 이름 안에서도 성분과 사용목적이 다릅니다. 사용할 제품과 설명서를 확인해 계획합니다.",
        image: "/images/photos/special-2.webp",
        alt: "제품별 계획 설명용 기존 시술 사진",
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
        image: "/images/photos/process-consult.webp",
        alt: "기존 진료 상담 사진",
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
      },
      {
        title: "경과 확인",
        text: "시술 직후 상태를 확인하고, 제품별 주의사항과 다시 진료를 받아야 할 증상을 안내합니다.",
        image: "/images/photos/process-check.webp",
        alt: "기존 시술 후 경과 확인 사진",
      },
    ],
  },
  // 확인 필요: 리투오 · 쥬베룩 · 울트라콜의 실제 보유 여부와 제품 라인 · 규격 · 국내 사용목적 · 설명서를 확인해야 합니다. 비교표는 보유 표시를 하지 않았습니다.
  // 확인 필요: collagen 기존 intro/headline의 피부 스스로 채움, items의 리투오 단순 콜라겐 표현은 hADM과 합성고분자 차이를 반영하도록 원장 검수 권장.
  // 확인 필요: collagen 기존 cautions의 일괄 마사지 권고는 제품별 사용설명서에 따른 개별 안내로 조정해야 합니다.
  // 확인 필요: 사용목적과 다른 부위 · 고민에 대한 사용 판단은 담당 원장이 근거와 설명을 확인해야 합니다. 장기 유지 · 재생 · 모공/흉터 효과를 일괄 약속하지 않았습니다.
  // 확인 필요: 재료별 마취 · 주입 깊이 · 희석/준비 · 시술량 · 횟수 · 간격 · 비용과 응급대응은 본원 기준 확인 후 확정해야 합니다.
  // 확인 필요: 사진은 기존 상담 · 주입 사진을 임시 재사용하며 실제 제품/전용 사진은 추후 교체해야 합니다.
  // 확인 필요: 주입 후 심한 통증 · 피부색 변화 · 시야 이상 등 응급 증상은 최종 본원 주의사항에 포함해 안내해야 합니다.
  "/skin/collagen": {
    kind: "procedure",
    diagram: "collagen",
    showPrices: true,
    device: {
      name: "콜라겐부스터",
      maker: "재료별 조직 수복 계획",
      image: "/images/photos/cat-skin-care.webp",
      photo: "/images/photos/cat-skin-care.webp",
      text: "콜라겐부스터는 서로 다른 재료의 주입 시술을 묶어 부르는 말입니다. 리투오는 무세포동종진피(hADM), 쥬베룩은 PDLLA와 히알루론산, 울트라콜은 PDO 기반 미립구를 사용합니다. 성분과 사용목적을 구분하고, 피부 상태와 주입 부위에 맞춰 계획합니다.",
      specs: [
        {
          label: "재료 구분",
          value: "hADM · PDLLA + HA · PDO 기반 미립구",
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
      photoAlt: "시술 안내에 사용하는 기존 진료 현장 사진",
    },
    principle: [
      {
        title: "부위와 고민부터 확인",
        text: "주름, 꺼짐, 피부 두께를 살피고 필요한 변화와 시술로 기대할 수 있는 범위를 정합니다.",
      },
      {
        title: "재료의 성격 구분",
        text: "진피 조직을 바탕으로 한 재료와 합성 고분자 입자 재료를 구분합니다. 사용목적과 주입 방법도 제품별로 확인합니다.",
      },
      {
        title: "안정된 뒤 경과 평가",
        text: "시술 직후 붓기와 시간이 지나며 보이는 변화를 구분하고, 결절감이나 염증 반응이 없는지 함께 확인합니다.",
      },
    ],
    compare: {
      title: "리투오 · 쥬베룩 · 울트라콜, 무엇이 다른가요?",
      lead: "성분과 제품 분류를 먼저 구분합니다. 아래 제품명은 일반적인 자료 비교이며 실제 사용 제품은 상담 때 확인합니다.",
      columns: [
        {
          name: "리투오",
          maker: "hADM",
        },
        {
          name: "쥬베룩",
          maker: "PDLLA + HA",
        },
        {
          name: "울트라콜",
          maker: "PDO 기반 미립구",
        },
      ],
      rows: [
        {
          label: "재료",
          values: [
            "무세포동종진피",
            "폴리-D,L-락트산 · 히알루론산",
            "폴리디옥사논 기반 미립구",
          ],
        },
        {
          label: "공식 제품 분류",
          values: ["인체조직", "조직수복용재료 · 의료기기", "의료기기"],
        },
        {
          label: "공식 안내 목적",
          values: [
            "ECM 주입을 통한 진피 재건",
            "성인 안면부 주름 일시 개선",
            "양측 팔자주름 일시 개선",
          ],
        },
        {
          label: "상담 시 확인",
          values: [
            "조직 특성 · 부위 · 적용 방법",
            "제품 라인 · 함량 · 사용방법",
            "제품 규격 · 부위 · 사용방법",
          ],
        },
      ],
      note: "※ 각 시술의 일반적인 특징을 정리한 것으로, 어느 시술이 더 낫다는 뜻이 아닙니다. 맞는 시술은 피부 상태와 고민에 따라 다르며, 효과 · 유지 기간은 사람마다 다릅니다.",
    },
    featuresTitle: "콜라겐부스터를 계획하는 4가지 기준",
    features: [
      {
        title: "같은 이름 안의 재료 차이",
        text: "조직 유래 재료와 합성 고분자 입자는 성격이 다릅니다. 선택한 제품이 어떤 재료인지부터 설명합니다.",
        image: "/images/photos/hero-consult.webp",
        alt: "재료별 상담 설명에 사용하는 기존 상담 사진",
      },
      {
        title: "피부 두께와 주입 부위 고려",
        text: "얇은 부위와 움직임이 많은 부위는 계획이 달라집니다. 사용할 제품의 용도와 피부 상태를 함께 살핍니다.",
        image: "/images/photos/cat-main-petit.webp",
        alt: "주입 부위 계획 설명용 기존 시술 사진",
      },
      {
        title: "양보다 분포와 목표 확인",
        text: "한 번에 많은 양을 정하기보다 다룰 부위와 기대할 변화를 먼저 정합니다. 주입량과 방법은 제품에 맞춰 결정합니다.",
        image: "/images/photos/special-2.webp",
        alt: "주입 계획 설명용 기존 진료 사진",
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
        image: "/images/photos/process-consult.webp",
        alt: "기존 진료 상담 사진",
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
      },
      {
        title: "경과 확인",
        text: "붓기와 멍, 덩어리감이나 염증 증상을 확인합니다. 마사지를 포함한 관리는 제품별로 따로 안내합니다.",
        image: "/images/photos/process-check.webp",
        alt: "기존 시술 후 경과 확인 사진",
      },
    ],
  },
};
