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

// Only named products already present in the clinic's treatment content are mapped.
// Unconfirmed brands (botulinum toxin, exosomes, etc.) keep their general diagrams.
// Coolsonic and Coolphase use in-section videos through device-story.ts.
// 필러는 '어떤 제품을 쓰나요?' 섹션과 겹쳐 뺌 (2026-10-31)
export const treatmentMedia: Record<string, ProductMedia[]> = {};
