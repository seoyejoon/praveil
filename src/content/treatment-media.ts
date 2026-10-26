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
  "/petit/filler": [filler],
};
