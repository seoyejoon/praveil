// 가격표 항목 이름 오타 수정: 배렛나루 · 구렛나루 → 구레나룻 (일회용, 실행 후 삭제)
// 서버에서: node --env-file=/opt/psbox-admin-only/.env.local fix-price-label.mjs
import pg from "pg";

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  const r = await client.query(
    `UPDATE praveil_procedures
        SET prices = replace(replace(prices::text, '배렛나루', '구레나룻'), '구렛나루', '구레나룻')::jsonb
      WHERE hospital_id = (SELECT id FROM hospitals WHERE status = 'active' ORDER BY id LIMIT 1)
        AND (prices::text LIKE '%배렛나루%' OR prices::text LIKE '%구렛나루%')
      RETURNING slug, name`,
  );
  console.log(`수정한 시술 ${r.rowCount}개: ${r.rows.map((x) => x.name).join(", ")}`);
  const left = await client.query(
    `SELECT count(*)::int AS n FROM praveil_procedures
      WHERE prices::text LIKE '%배렛나루%' OR prices::text LIKE '%구렛나루%'`,
  );
  console.log(`남은 오타: ${left.rows[0].n}`);
} finally {
  await client.end();
}
