// 2026.10 확정 사이트맵 (프라베일 맑고고운의원 홈페이지 제작 범위 확정서)
// 총 16페이지 + 게시판 3개. 대표 시술(쿨소닉 · 쿨페이즈 · 볼륨필러 · 리투오)은 BEST 표기.

export type SitePage = {
  href: string;
  label: string;
  best?: boolean;
  /** 통합 페이지에 들어가는 세부 시술 */
  items?: string[];
};

export type SiteSection = {
  key: string;
  label: string;
  en: string;
  href: string;
  /** 시술 분류 여부 (메인 '진료 분야' 목록에 나온다) */
  treatment?: boolean;
  summary?: string;
  pages: SitePage[];
};

export const sitemap: SiteSection[] = [
  {
    key: "praveil",
    label: "PRAVEIL",
    en: "Praveil",
    href: "/about/philosophy",
    pages: [
      { href: "/about/philosophy", label: "병원소개" },
      { href: "/about/doctor", label: "의료진소개" },
      { href: "/location", label: "진료안내 · 오시는길" },
    ],
  },
  {
    key: "lifting",
    label: "리프팅",
    en: "Lifting",
    href: "/lifting/coolsonic",
    treatment: true,
    summary: "처진 윤곽과 탄력, 피부 층에 맞춘 리프팅",
    pages: [
      { href: "/lifting/coolsonic", label: "쿨소닉", best: true },
      { href: "/lifting/coolphase", label: "쿨페이즈", best: true },
      { href: "/lifting/laser", label: "레이저리프팅", items: ["슈링크 유니버스", "포텐자", "클라리티"] },
      { href: "/lifting/thread", label: "실리프팅", items: ["민트실", "잼버실"] },
    ],
  },
  {
    key: "petit",
    label: "쁘띠시술",
    en: "Petit",
    href: "/petit/filler",
    treatment: true,
    summary: "볼륨과 라인, 주름을 섬세하게",
    pages: [
      {
        href: "/petit/filler",
        label: "필러",
        best: true,
        items: ["볼륨", "이마", "팔자", "입술", "애교", "상안검", "깊은 주름", "목주름"],
      },
      {
        href: "/petit/botox",
        label: "보톡스",
        items: ["표정주름", "턱", "슈퍼턱", "특수부위", "스킨", "승모근", "종아리", "다한증"],
      },
    ],
  },
  {
    key: "skin",
    label: "피부관리",
    en: "Skin Care",
    href: "/skin/retuo",
    treatment: true,
    summary: "피부 속부터 채우는 부스터와 관리",
    pages: [
      { href: "/skin/retuo", label: "리투오", best: true },
      { href: "/skin/booster", label: "스킨부스터", items: ["리쥬란힐러", "리쥬란아이", "엑소좀"] },
      { href: "/skin/collagen", label: "콜라겐부스터", items: ["리투오", "쥬베룩", "울트라콜"] },
    ],
  },
  {
    key: "acne-pore",
    label: "여드름·모공",
    en: "Acne & Pore",
    href: "/acne-pore",
    treatment: true,
    summary: "여드름부터 흉터 · 모공까지 단계별로",
    pages: [
      {
        href: "/acne-pore",
        label: "여드름 · 모공",
        items: ["프락셀", "피코프락셀", "블랙필", "아크네 프로그램", "압출관리", "GA 스케일링"],
      },
    ],
  },
  {
    key: "removal",
    label: "제모·문신제거",
    en: "Removal",
    href: "/removal/hair",
    treatment: true,
    summary: "레이저 제모와 눈썹 · 아이라인 문신제거",
    pages: [
      { href: "/removal/hair", label: "레이저제모", items: ["여성", "남성"] },
      { href: "/removal/tattoo", label: "문신제거", items: ["눈썹", "아이라인", "언더라인"] },
    ],
  },
  {
    key: "community",
    label: "커뮤니티",
    en: "Community",
    href: "/notice",
    pages: [
      { href: "/notice?type=notice", label: "공지사항" },
      { href: "/notice?type=event", label: "이벤트" },
      { href: "/before-after", label: "전후사진" },
    ],
  },
];

/** 아직 만들지 않은 페이지 (메인 시안 단계): '준비 중' 화면으로 연결 */
export const pendingPaths = sitemap
  .flatMap((s) => s.pages.map((p) => p.href))
  .filter((href) => !href.startsWith("/about") && !href.startsWith("/location") && !href.startsWith("/notice"));

export function findPage(path: string) {
  for (const section of sitemap) {
    const page = section.pages.find((p) => p.href === path);
    if (page) return { section, page };
  }
  return null;
}
