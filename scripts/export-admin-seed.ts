// 홈페이지의 현재 임시 데이터(시술 54종 · 분류 11개 · 병원 정보)를 관리자 초기 데이터로 내보낸다.
// 사용: pnpm admin:seed [출력 경로]  (기본: docs/admin-seed.json)
import { writeFileSync } from "node:fs";
import { categories, procedures } from "../src/lib/data/mock/procedures";
import { hospital } from "../src/lib/data/mock/hospital";
import { procedureDetails } from "../src/content/procedure-details";

const out = process.argv[2] ?? "docs/admin-seed.json";

const seed = {
  version: 1,
  clinic: {
    phone: hospital.phone,
    address: hospital.address,
    addressDetail: hospital.addressDetail,
    kakaoUrl: hospital.kakaoUrl === "#" ? "" : hospital.kakaoUrl,
    naverReservationUrl: hospital.naverReservationUrl === "#" ? "" : hospital.naverReservationUrl,
    instagramUrl: hospital.instagramUrl === "#" ? "" : hospital.instagramUrl,
    hours: hospital.hours,
    lunch: hospital.lunch,
    hoursNotice: hospital.hoursNotice,
    directions: hospital.directions,
    mapLinks: hospital.mapLinks,
  },
  categories: categories.map((c, i) => ({ ...c, sortOrder: i })),
  procedures: procedures.map((p, i) => ({
    slug: p.slug,
    categorySlug: p.categorySlug,
    name: p.name,
    isSignature: Boolean(p.isSignature),
    sortOrder: i,
    detail: procedureDetails[p.slug] ?? null,
  })),
};

writeFileSync(out, JSON.stringify(seed, null, 2) + "\n");
console.log(`${out}: 분류 ${seed.categories.length}개, 시술 ${seed.procedures.length}개`);
