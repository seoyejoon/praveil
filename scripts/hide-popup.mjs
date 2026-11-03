// 리뉴얼 오픈 팝업 숨김 (일회용, 실행 후 삭제 · 관리자 팝업 메뉴에서 다시 켤 수 있음)
// 서버에서: node --env-file=/opt/psbox-admin-only/.env.local hide-popup.mjs
import pg from "pg";

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  const h = (await client.query("SELECT id FROM hospitals WHERE status='active' ORDER BY id LIMIT 1")).rows[0].id;
  const r = await client.query(
    `UPDATE praveil_popups SET visible = false, updated_at = CURRENT_TIMESTAMP
      WHERE hospital_id = $1 AND title LIKE 'RENEWAL OPEN%' RETURNING id, title`,
    [h],
  );
  console.log(`숨김 ${r.rowCount}개: ${r.rows.map((x) => `${x.id} ${x.title}`).join(" / ")}`);
  const all = await client.query("SELECT id,title,visible FROM praveil_popups WHERE hospital_id=$1 ORDER BY sort_order,id", [h]);
  console.log(`팝업: ${all.rows.map((x) => `${x.id} ${x.title}${x.visible ? "" : " (숨김)"}`).join(" / ")}`);
} finally {
  await client.end();
}
