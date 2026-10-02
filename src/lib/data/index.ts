// 홈페이지가 데이터를 읽는 유일한 통로.
// DATABASE_URL 이 있으면 관리자 DB(source-db.ts)를, 없으면 임시 데이터(mock/)를 읽는다.
import { doctor, features, hospital } from "./mock/hospital";
import { categories, procedures } from "./mock/procedures";
import { notices, popups } from "./mock/board";
import { hasDatabase } from "./db";
import { demoBeforeAfter, demoNotices, showDemo } from "./demo";
import * as db from "./source-db";
import { procedureDetails } from "@/content/procedure-details";
import type { Popup } from "./types";
import { resolveHospitalPolicy } from "@/lib/policy";

export type * from "./types";

export async function getHospital() {
  return hasDatabase ? db.getHospital() : hospital;
}

// 이용약관 · 개인정보처리방침: 관리자에 입력한 글이 없으면 기본 문구
export async function getPolicy(kind: "terms" | "privacy") {
  const h = await getHospital();
  const terms = hasDatabase
    ? await db.getPolicyTerms()
    : {
        businessName: h.name,
        representativeName: h.director,
        businessRegistrationNumber: h.businessNumber,
        privacyOfficer: "",
        termsOfService: "",
        privacyPolicy: "",
      };
  return resolveHospitalPolicy(
    {
      name: h.name,
      address: `${h.address} ${h.addressDetail}`.trim(),
      phone: h.phone,
    },
    terms,
    kind,
  );
}

// 원장 소개 · 특장점은 관리자 메뉴가 없어 코드에서 관리한다.
export async function getDoctor() {
  return doctor;
}

export async function getFeatures() {
  return features;
}

export async function getCategories() {
  return hasDatabase ? db.getCategories() : categories;
}

export async function getCategory(slug: string) {
  return (await getCategories()).find((c) => c.slug === slug);
}

export async function getProcedures(categorySlug?: string) {
  const list = hasDatabase ? await db.getProcedures() : procedures;
  return categorySlug
    ? list.filter((p) => p.categorySlug === categorySlug)
    : list;
}

export async function getProcedure(categorySlug: string, slug: string) {
  return (await getProcedures()).find(
    (p) => p.categorySlug === categorySlug && p.slug === slug,
  );
}

export async function getSignatureProcedures() {
  return (await getProcedures()).filter((p) => p.isSignature);
}

export async function getNotices() {
  const list = hasDatabase
    ? await db.getNotices()
    : [...notices].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return showDemo
    ? [...demoNotices, ...list].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      )
    : list;
}

export async function getNotice(id: number) {
  return (await getNotices()).find((n) => n.id === id);
}

// 리뉴얼 오픈 안내 팝업 (관리자에서 등록한 팝업 앞에 항상 붙음)
const sitePopups: Popup[] = [
  {
    id: 900601,
    title: "RENEWAL OPEN 새로운 프라베일 — 프라베일 둘러보기",
    imageUrl: "/images/popup/renewal-open.webp",
    linkUrl: "/about/philosophy",
    device: "all",
  },
];

export async function getPopups() {
  return [...sitePopups, ...(hasDatabase ? await db.getPopups() : popups)];
}

// 시술 상세 원고: 관리자에서 고친 내용이 있으면 그것을, 없으면 코드의 원고를 쓴다.
export async function getProcedureDetail(slug: string) {
  const fromDb = hasDatabase ? await db.getProcedureDetail(slug) : null;
  return fromDb ?? procedureDetails[slug];
}

// 전후사례: 회원이 아니면 시술 전 사진 주소를 지워서 내려준다 (화면에서 흐리게 가리는 것만으로는 사진이 새어 나갈 수 있음)
export async function getBeforeAfterCases(member: boolean) {
  const real = hasDatabase ? await db.getBeforeAfter() : [];
  const list = showDemo ? [...demoBeforeAfter, ...real] : real;
  return member
    ? list
    : list.map((c) => ({
        ...c,
        stages: c.stages.map((st) => ({ ...st, before: "" })),
      }));
}
