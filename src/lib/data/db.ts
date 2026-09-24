import "server-only";
import { Pool, type QueryResultRow } from "pg";

// 관리자와 같은 PostgreSQL을 읽기 전용으로 사용한다. (운영: 읽기 전용 DB 계정 권장)
// DATABASE_URL 이 없으면 홈페이지는 임시 데이터(mock)로 동작한다.
export const hasDatabase = Boolean(process.env.DATABASE_URL);

const globalForPool = globalThis as typeof globalThis & { praveilPool?: Pool };

function pool() {
  globalForPool.praveilPool ??= new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 3,
    idleTimeoutMillis: 30_000,
  });
  return globalForPool.praveilPool;
}

export async function sql<T extends QueryResultRow>(text: string, params: unknown[] = []) {
  const result = await pool().query<T>(text, params);
  return result.rows;
}
