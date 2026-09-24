// 홈페이지가 데이터를 읽는 유일한 통로.
// 지금은 임시 데이터를 반환하고, 관리자 DB가 연결되면 이 파일의 함수 내부만 DB 조회로 교체한다.
import { doctor, features, hospital } from "./mock/hospital";
import { categories, procedures } from "./mock/procedures";
import { notices, popups } from "./mock/board";

export type * from "./types";

export async function getHospital() {
  return hospital;
}

export async function getDoctor() {
  return doctor;
}

export async function getFeatures() {
  return features;
}

export async function getCategories() {
  return categories;
}

export async function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export async function getProcedures(categorySlug?: string) {
  return categorySlug ? procedures.filter((p) => p.categorySlug === categorySlug) : procedures;
}

export async function getProcedure(categorySlug: string, slug: string) {
  return procedures.find((p) => p.categorySlug === categorySlug && p.slug === slug);
}

export async function getSignatureProcedures() {
  return procedures.filter((p) => p.isSignature);
}

export async function getNotices() {
  return [...notices].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getNotice(id: number) {
  return notices.find((n) => n.id === id);
}

export async function getPopups() {
  return popups;
}
