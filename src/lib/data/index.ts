// 홈페이지가 데이터를 읽는 유일한 통로.
// DATABASE_URL 이 있으면 관리자 DB(source-db.ts)를, 없으면 임시 데이터(mock/)를 읽는다.
import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { doctor, features, hospital } from "./mock/hospital";
import { categories, procedures } from "./mock/procedures";
import { notices, popups } from "./mock/board";
import { hasDatabase } from "./db";
import { demoBeforeAfter, demoNotices, showDemo } from "./demo";
import * as db from "./source-db";
import { procedureDetails } from "@/content/procedure-details";
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
    // 외부 분석 도구: 관리자에서 켠 것만 개인정보처리방침에 적음
    kind === "privacy" ? Object.keys(await getTracking()) : [],
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

// 게시판 연결을 확인하려고 올린 샘플 글은 홈페이지에 싣지 않는다
// (관리자에서 제목을 바꾸면 필터에 걸리지 않아 다시 올라온다)
const isCheckSample = (title: string) => title.startsWith("[확인용 샘플]");

export async function getNotices() {
  const list = (
    hasDatabase
      ? await db.getNotices()
      : [...notices].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  ).filter((n) => !isCheckSample(n.title));
  // 미리보기: 보여주기용 공지 · 이벤트 예시를 함께 (DB의 [테스트] 글은 겹치므로 숨김)
  if (showDemo)
    return [
      ...demoNotices,
      ...list.filter((n) => !n.title.startsWith("[테스트]")),
    ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return list;
}

export async function getNotice(id: number) {
  return (await getNotices()).find((n) => n.id === id);
}

// 관리자(admin.praveil.com)에 로그인한 브라우저면 '비공개 발행' 글도 섞어서 보여 준다.
// 관리자 로그인 때 받은 pv_admin_preview 쿠키를 DB 세션과 대조해 확인한다.
export async function isAdminViewer() {
  if (!hasDatabase) return false;
  const token = (await cookies()).get("pv_admin_preview")?.value;
  if (!token || token.length > 200) return false;
  return db
    .isWebsiteAdminToken(createHash("sha256").update(token).digest("hex"))
    .catch(() => false);
}

export async function getNoticesForViewer() {
  const list = await getNotices();
  if (!(await isAdminViewer())) return list;
  const hidden = (await db.getPrivateNotices()).filter(
    (n) => !isCheckSample(n.title),
  );
  return [...hidden, ...list].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export async function getNoticeForViewer(id: number) {
  return (await getNoticesForViewer()).find((n) => n.id === id);
}

export async function getPopups() {
  const saved = hasDatabase ? await db.getPopups() : popups;
  // 관리자 연결 확인용으로 만든 '연결 테스트' 팝업은 홈페이지에 띄우지 않음
  return saved.filter((p) => !p.title.includes("연결 테스트"));
}

// 시술 상세 원고: 관리자에서 고친 내용이 있으면 그것을, 없으면 코드의 원고를 쓴다.
export async function getProcedureDetail(slug: string) {
  const fromDb = hasDatabase ? await db.getProcedureDetail(slug) : null;
  return fromDb ?? procedureDetails[slug];
}

// 전후사례: 회원이 아니면 시술 전 사진 주소를 지워서 내려준다 (화면에서 흐리게 가리는 것만으로는 사진이 새어 나갈 수 있음)
export async function getBeforeAfterCases(member: boolean) {
  const real = (hasDatabase ? await db.getBeforeAfter() : []).filter(
    (c) => !isCheckSample(c.title),
  );
  const list = showDemo ? [...demoBeforeAfter, ...real] : real;
  return member
    ? list
    : list.map((c) => ({
        ...c,
        stages: c.stages.map((st) => ({ ...st, before: "" })),
      }));
}

// 외부 서비스 (구글 · 네이버 · 메타 · 카카오): 관리자에서 켠 것만
export async function getTracking(): Promise<Record<string, string>> {
  return hasDatabase ? db.getTracking() : {};
}
