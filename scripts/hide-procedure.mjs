// 가격이 모두 삭제된 '토닝레이저 패키지'를 숨김 (일회용, 실행 후 삭제)
// 서버에서: node --env-file=/opt/psbox-admin-only/.env.local hide-procedure.mjs
import pg from "pg";

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  const r = await client.query(
    `UPDATE praveil_procedures SET visible = false
     WHERE slug = 'toning-package'
       AND hospital_id = (SELECT id FROM hospitals WHERE status = 'active' ORDER BY id LIMIT 1)
     RETURNING name, visible`,
  );
  console.log(r.rowCount ? `숨김: ${r.rows[0].name}` : "시술 없음");
} finally {
  await client.end();
}
