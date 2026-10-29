// 리뉴얼 오픈 팝업을 관리자 팝업으로 등록 (코드에 있던 팝업을 옮김, 한 번만 실행)
// 서버에서: node --env-file=/opt/psbox-admin-only/.env.local move-renewal-popup.mjs
import pg from "pg";
const TITLE = "RENEWAL OPEN 새로운 프라베일 — 프라베일 둘러보기";
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  const h = (await client.query("SELECT id FROM hospitals WHERE status='active' ORDER BY id LIMIT 1")).rows[0].id;
  const dup = await client.query("SELECT id FROM praveil_popups WHERE hospital_id=$1 AND title=$2", [h, TITLE]);
  if (dup.rowCount) console.log(`이미 있음: ${dup.rows[0].id}`);
  else {
    const r = await client.query(
      `INSERT INTO praveil_popups (hospital_id,title,image_url,body,link_url,device,visible,sort_order)
       VALUES ($1,$2,'https://praveil.com/images/popup/renewal-open.webp','','/about/philosophy','all',true,0) RETURNING id`,
      [h, TITLE],
    );
    console.log(`관리자 팝업으로 등록: ${r.rows[0].id}`);
  }
  const all = await client.query("SELECT id,title,device,visible FROM praveil_popups WHERE hospital_id=$1 ORDER BY sort_order,id", [h]);
  console.log(`팝업 ${all.rowCount}개: ${all.rows.map((x) => `${x.id} ${x.title} (${x.device}${x.visible ? "" : ", 숨김"})`).join(" / ")}`);
} finally { await client.end(); }
