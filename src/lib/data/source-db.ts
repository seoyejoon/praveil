import "server-only";
import { unstable_cache } from "next/cache";
import { sql } from "./db";
import { hospital as fallbackHospital } from "./mock/hospital";
import type { DocNode, Hospital, Notice, Popup, PostBody, Procedure, ProcedureCategory, ProcedurePrice } from "./types";
import type { ProcedureDetail } from "@/content/procedure-details/common";

// 관리자 DB에서 읽은 데이터를 홈페이지 형태로 바꾼다.
// 결과는 5분간 캐시하고, 관리자에서 저장하면 /api/revalidate 가 "praveil" 태그를 비워 즉시 갱신된다.
export const CACHE_TAG = "praveil";
const cached = <T,>(key: string, fn: () => Promise<T>) => unstable_cache(fn, [key], { tags: [CACHE_TAG], revalidate: 300 });

type Row = Record<string, unknown>;
const str = (value: unknown) => (typeof value === "string" ? value : "");
const obj = (value: unknown): Row => (value && typeof value === "object" && !Array.isArray(value) ? (value as Row) : {});
const arr = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

// ---------- 병원 ----------

const loadHospital = cached("hospital", async () => {
  const [row] = await sql<{ name: string; config: unknown }>(
    `SELECT name, site_builder_config AS config FROM hospitals WHERE status = 'active' ORDER BY id LIMIT 1`,
  );
  return row ?? null;
});

export async function getHospital(): Promise<Hospital> {
  const row = await loadHospital();
  if (!row) return fallbackHospital;
  const config = obj(row.config);
  const clinic = obj(config.praveilClinic);
  const terms = obj(obj(config.websiteAdmin).terms);
  const maps = obj(clinic.mapLinks);
  return {
    ...fallbackHospital,
    name: row.name || fallbackHospital.name,
    director: str(terms.representativeName) || fallbackHospital.director,
    businessNumber: str(terms.businessRegistrationNumber) || fallbackHospital.businessNumber,
    phone: str(clinic.phone) || fallbackHospital.phone,
    address: str(clinic.address) || fallbackHospital.address,
    addressDetail: str(clinic.addressDetail),
    kakaoUrl: str(clinic.kakaoUrl) || "#",
    naverReservationUrl: str(clinic.naverReservationUrl) || "#",
    instagramUrl: str(clinic.instagramUrl) || "#",
    hours: arr(clinic.hours).map((h) => {
      const hour = obj(h);
      return { label: str(hour.label), time: str(hour.time), note: str(hour.note) || undefined, closed: hour.closed === true };
    }),
    lunch: str(clinic.lunch),
    hoursNotice: str(clinic.hoursNotice),
    directions: arr(clinic.directions).map((d) => ({ title: str(obj(d).title), body: str(obj(d).body) })),
    mapLinks: { tmap: str(maps.tmap) || undefined, naver: str(maps.naver) || undefined, kakao: str(maps.kakao) || undefined, google: str(maps.google) || undefined },
  };
}

// ---------- 시술 ----------

const loadCategories = cached("categories", () =>
  sql<ProcedureCategory>(
    `SELECT slug, name, name_en AS "nameEn", description FROM praveil_procedure_categories
     WHERE visible AND hospital_id = (SELECT id FROM hospitals WHERE status = 'active' ORDER BY id LIMIT 1)
     ORDER BY sort_order, id`,
  ),
);

type ProcedureRow = { slug: string; categorySlug: string; name: string; isSignature: boolean; prices: ProcedurePrice[]; detail: ProcedureDetail | null };

const loadProcedures = cached("procedures", () =>
  sql<ProcedureRow>(
    `SELECT p.slug, p.category_slug AS "categorySlug", p.name, p.is_signature AS "isSignature", p.prices, p.detail
     FROM praveil_procedures p
     JOIN praveil_procedure_categories c ON c.hospital_id = p.hospital_id AND c.slug = p.category_slug AND c.visible
     WHERE p.visible AND p.hospital_id = (SELECT id FROM hospitals WHERE status = 'active' ORDER BY id LIMIT 1)
     ORDER BY c.sort_order, p.sort_order, p.id`,
  ),
);

export async function getCategories() {
  return loadCategories();
}

export async function getProcedures(): Promise<Procedure[]> {
  const rows = await loadProcedures();
  return rows.map((row) => ({
    slug: row.slug,
    categorySlug: row.categorySlug,
    name: row.name,
    isSignature: row.isSignature,
    summary: row.detail?.summary || undefined,
    prices: arr(row.prices).map((p) => ({ label: str(obj(p).label), price: str(obj(p).price), note: str(obj(p).note) })),
  }));
}

/** 관리자에 상세 원고가 있으면 그것을, 없으면 null (호출하는 쪽에서 코드 원고로 대체) */
export async function getProcedureDetail(slug: string): Promise<ProcedureDetail | null> {
  const rows = await loadProcedures();
  return rows.find((row) => row.slug === slug)?.detail ?? null;
}

// ---------- 공지 · 이벤트 ----------

const COLUMN_PREFIX = "hs-column-json-v1:";
const EVENT_PREFIX = "hs-event-images-v1:";
const BEFORE_AFTER_PREFIX = "HS_BEFORE_AFTER_V1\n";

function parseBody(content: string): PostBody | null {
  try {
    if (content.startsWith(COLUMN_PREFIX)) return { kind: "doc", doc: JSON.parse(content.slice(COLUMN_PREFIX.length)) as DocNode };
    if (content.startsWith(EVENT_PREFIX)) {
      const parsed = obj(JSON.parse(content.slice(EVENT_PREFIX.length)));
      return {
        kind: "images",
        images: arr(parsed.images).map((image) => ({ url: str(obj(image).url), alt: str(obj(image).alt) })).filter((image) => image.url),
      };
    }
  } catch {
    return null;
  }
  if (content.startsWith(BEFORE_AFTER_PREFIX)) return null;
  return { kind: "text", text: content.replace(/<[^>]+>/g, "") };
}

type PostRow = { id: number; boardId: string | null; category: string; title: string; summary: string; coverImageUrl: string; content: string; publishedAt: string };

const loadNotices = cached("notices", async (): Promise<Notice[]> => {
  const [hospitalRow] = await sql<{ id: number; boards: unknown }>(
    `SELECT id, site_builder_config->'websiteAdmin'->'boards' AS boards FROM hospitals WHERE status = 'active' ORDER BY id LIMIT 1`,
  );
  if (!hospitalRow) return [];
  // 게시판 종류(공지/이벤트)이면서 전체 공개인 게시판만 홈페이지에 싣는다.
  const boards = arr(hospitalRow.boards).map(obj).filter((b) => (b.boardType === "notice" || b.boardType === "event") && b.readPermission !== "member");
  if (!boards.length) return [];
  const typeOf = (post: PostRow) => {
    const board = boards.find((b) => (post.boardId ? b.id === post.boardId : b.name === post.category));
    return board ? (board.boardType as Notice["type"]) : null;
  };
  const rows = await sql<PostRow>(
    `SELECT id, board_id AS "boardId", category, title, summary, cover_image_url AS "coverImageUrl", content,
       to_char(COALESCE(published_at, scheduled_at, created_at) AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD') AS "publishedAt"
     FROM posts
     WHERE hospital_id = $1 AND (status = 'published' OR (status = 'scheduled' AND scheduled_at <= CURRENT_TIMESTAMP))
     ORDER BY COALESCE(published_at, scheduled_at, created_at) DESC, id DESC LIMIT 300`,
    [hospitalRow.id],
  );
  return rows.flatMap((row) => {
    const type = typeOf(row);
    const body = type && parseBody(row.content);
    return type && body
      ? [{ id: row.id, type, title: row.title, summary: row.summary, coverImageUrl: row.coverImageUrl, body, createdAt: row.publishedAt }]
      : [];
  });
});

export async function getNotices() {
  return loadNotices();
}

// ---------- 팝업 ----------

type PopupRow = Popup & { startsAt: string | null; endsAt: string | null };

const loadPopups = cached("popups", () =>
  sql<PopupRow>(
    `SELECT id, title, image_url AS "imageUrl", body, link_url AS "linkUrl", device,
       starts_at::text AS "startsAt", ends_at::text AS "endsAt"
     FROM praveil_popups
     WHERE visible AND hospital_id = (SELECT id FROM hospitals WHERE status = 'active' ORDER BY id LIMIT 1)
     ORDER BY sort_order, id DESC`,
  ),
);

export async function getPopups(): Promise<Popup[]> {
  const now = Date.now();
  const rows = await loadPopups();
  return rows
    .filter((p) => (!p.startsAt || new Date(p.startsAt).getTime() <= now) && (!p.endsAt || new Date(p.endsAt).getTime() >= now))
    .map((p) => ({ id: p.id, title: p.title, imageUrl: p.imageUrl, body: p.body, linkUrl: p.linkUrl, device: p.device }));
}
