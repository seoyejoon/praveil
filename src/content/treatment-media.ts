/**
 * Previously located manufacturer media and existing clinic-supplied images.
 * No remote poster requests, downloads, or automatic video playback.
 * Inventory and unresolved products: docs/treatment-media-inventory.json.
 */
export type ProductClip = {
  id: string;
  title: string;
} & ({ kind: "vimeo"; videoId: string } | { kind: "file"; src: string });

export type ProductMedia = {
  id: string;
  name: string;
  english: string;
  maker: string;
  description: string;
  image?: { src: string; alt: string; credit: string };
  source: { label: string; href?: string };
  clips?: ProductClip[];
};

const potenza: ProductMedia = {
  id: "potenza",
  name: "포텐자",
  english: "POTENZA",
  maker: "JEISYS MEDICAL",
  description: "제이시스메디칼의 포텐자 장비 소개와 작동 원리 영상입니다.",
  image: {
    src: "/images/equipment/potenza.webp",
    alt: "제이시스메디칼 포텐자 장비 제품 사진",
    credit: "제이시스메디칼 공식 제품 이미지",
  },
  source: {
    label: "제이시스메디칼 제품 안내",
    href: "https://www.jeisys.co.kr/brands/potenza",
  },
  clips: [
    {
      id: "device",
      title: "장비 소개",
      kind: "file",
      src: "https://www.jeisys.co.kr/kor/pub/video/img_product_b01.mp4",
    },
    {
      id: "mechanism",
      title: "작동 원리",
      kind: "file",
      src: "https://www.jeisys.co.kr/kor/pub/video/img_product_b03_2.mp4",
    },
  ],
};

const clarity: ProductMedia = {
  id: "clarity",
  name: "클라리티2",
  english: "CLARITY II",
  maker: "CYNOSURE LUTRONIC",
  description:
    "사이노슈어 루트로닉 공식 제품 페이지에 소개된 클라리티2 영상입니다.",
  image: {
    src: "/images/equipment/clarity.webp",
    alt: "클라리티2 레이저 장비 제품 사진",
    credit: "사이노슈어 루트로닉 공식 제품 이미지",
  },
  source: {
    label: "클라리티2 공식 제품 안내",
    href: "https://www.cynosure.com/product/clarity-ii/",
  },
  clips: [
    {
      id: "device",
      title: "장비 소개",
      kind: "file",
      src: "https://www.cynosure.com/wp-content/uploads/2025/07/PRD-2017-CL-Website-video-updates-Clarity-II-1.mp4",
    },
  ],
};

const shurink: ProductMedia = {
  id: "shurink",
  name: "슈링크 유니버스",
  english: "SHURINK UNIVERSE",
  maker: "CLASSYS",
  description: "클래시스에서 제공한 슈링크 유니버스 제품 이미지입니다.",
  image: {
    src: "/images/equipment/shrink-universe.webp",
    alt: "클래시스 슈링크 유니버스 장비 제품 사진",
    credit: "클래시스 공식 제품 이미지",
  },
  source: {
    label: "클래시스 제품 안내",
    href: "https://classys.co.kr/product/shurink-universe/",
  },
};

const retuo: ProductMedia = {
  id: "retuo",
  name: "리투오",
  english: "Elravie Re2O",
  maker: "엘라비에 리투오",
  description: "병원에서 제공한 엘라비에 리투오 제품 이미지입니다.",
  image: {
    src: "/images/equipment/hero/retuo.webp",
    alt: "엘라비에 리투오 Re2O 제품 패키지",
    credit: "병원 제공 제품 이미지 · 휴메딕스 · 엘앤씨바이오",
  },
  source: { label: "병원 제공 제품 자료" },
};

const juvelook: ProductMedia = {
  id: "juvelook",
  name: "쥬베룩",
  english: "JUVELOOK",
  maker: "JUVELOOK",
  description: "쥬베룩 공식 사이트에 소개된 브랜드 영상입니다.",
  source: { label: "쥬베룩 공식 사이트", href: "https://juvelook.com/" },
  clips: [
    { id: "brand", title: "브랜드 영상", kind: "vimeo", videoId: "1189950163" },
  ],
};

const pico: ProductMedia = {
  id: "pico-k",
  name: "피코케이",
  english: "PICO-K",
  maker: "병원 보유 장비",
  description: "병원에서 촬영한 피코케이 장비 사진입니다.",
  image: {
    src: "/images/equipment/pico-k.webp",
    alt: "병원에서 촬영한 PICO-K 피코 레이저 장비",
    credit: "병원 촬영 장비 사진",
  },
  source: { label: "병원 촬영 자료" },
};

const filler: ProductMedia = {
  id: "filler-example",
  name: "히알루론산 필러 제품 예시",
  english: "Restylane Lidocaine",
  maker: "GALDERMA",
  description:
    "병원에서 제공한 레스틸렌 리도카인 제품 이미지입니다. 실제 사용할 제품은 상담 시 확인합니다.",
  image: {
    src: "/images/equipment/hero/filler.webp",
    alt: "히알루론산 필러 제품 예시인 레스틸렌 리도카인 패키지",
    credit: "병원 제공 갈더마 제품 이미지",
  },
  source: { label: "병원 제공 제품 자료" },
};

// Only named products already present in the clinic's treatment content are mapped.
// Unconfirmed brands (botulinum toxin, exosomes, etc.) keep their general diagrams.
// Coolsonic and Coolphase use in-section videos through device-story.ts.
export const treatmentMedia: Record<string, ProductMedia[]> = {
  "/lifting/laser": [potenza, shurink, clarity],
  "/petit/filler": [filler],
  "/skin/retuo": [retuo],
  "/skin/collagen": [juvelook, retuo],
  "/removal/hair": [clarity],
  "/removal/tattoo": [pico],
};
