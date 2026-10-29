// 방문 통계 점검 때 만든 테스트 기록 삭제 (오늘 21:40 KST 이전 기록, 임시)
import pg from "pg";
const c = new pg.Client({ connectionString: process.env.DATABASE_URL });
await c.connect();
const r = await c.query("DELETE FROM analytics_events WHERE created_at < '2026-10-29 21:40:00+09' RETURNING id");
console.log(`테스트 기록 삭제: ${r.rowCount}건`);
await c.end();
