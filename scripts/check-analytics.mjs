// 방문 통계가 쌓이는지 확인 (읽기만, 임시)
import pg from "pg";
const c = new pg.Client({ connectionString: process.env.DATABASE_URL });
await c.connect();
const r = await c.query("SELECT event_type, source, count(*)::int n FROM analytics_events WHERE event_day = (now() AT TIME ZONE 'Asia/Seoul')::date GROUP BY 1,2 ORDER BY 1,2");
console.log(`오늘 기록 ${r.rows.reduce((a, x) => a + x.n, 0)}건`); r.rows.forEach((x) => console.log(`  ${x.event_type} · ${x.source}: ${x.n}`));
const g = await c.query("SELECT has_table_privilege('praveil_web','analytics_events','INSERT') i, has_table_privilege('praveil_web','analytics_events','SELECT') s");
console.log(`홈페이지 계정 권한: 추가 ${g.rows[0].i} · 읽기 ${g.rows[0].s}`);
await c.end();
