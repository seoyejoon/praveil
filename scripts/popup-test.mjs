// 팝업 점검용 (임시): 테스트 팝업 추가 · 정리
// 서버에서: node --env-file=/opt/psbox-admin-only/.env.local popup-test.mjs <add|cleanup>
//  - 테스트 팝업은 20분 뒤 자동으로 내려감 (ends_at), 제목이 '[테스트]' 로 시작
import pg from "pg";
const mode = process.argv[2];
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  const h = (await client.query("SELECT id FROM hospitals WHERE status='active' ORDER BY id LIMIT 1")).rows[0].id;
  if (mode === "add") {
    const rows = [
      ["[테스트] 글 팝업 (전체)", "", "진료시간 안내 예시입니다.\n목요일은 오후 8시 30분까지 진료합니다.", "/location", "all", 1],
      ["[테스트] 사진 팝업 (PC)", "https://praveil.com/images/test/test-event-1.webp", "", "/notice", "pc", 2],
      ["[테스트] 사진 팝업 (모바일)", "https://praveil.com/images/test/test-event-2.webp", "", "https://m.booking.naver.com/booking/13/bizes/466071", "mobile", 3],
      ["[테스트] 지난 팝업 (보이면 안 됨)", "", "기간이 끝난 팝업", "", "all", 4],
    ];
    for (const [t, img, body, link, dev, ord] of rows) {
      const expired = t.includes("지난");
      await client.query(
        `INSERT INTO praveil_popups (hospital_id,title,image_url,body,link_url,device,starts_at,ends_at,visible,sort_order)
         VALUES ($1,$2,$3,$4,$5,$6, CURRENT_TIMESTAMP - interval '1 hour', CURRENT_TIMESTAMP + ($7 || ' minutes')::interval, true, $8)`,
        [h, t, img, body, link, dev, expired ? "-30" : "20", ord],
      );
    }
    console.log("테스트 팝업 4개 추가 (20분 뒤 자동 종료)");
  } else if (mode === "cleanup") {
    const r = await client.query("DELETE FROM praveil_popups WHERE hospital_id=$1 AND title LIKE '[테스트]%' RETURNING id", [h]);
    console.log(`테스트 팝업 삭제: ${r.rowCount}개`);
  } else throw new Error("add | cleanup");
  const left = await client.query("SELECT count(*)::int n FROM praveil_popups WHERE hospital_id=$1", [h]);
  console.log(`전체 팝업 수: ${left.rows[0].n}`);
} finally { await client.end(); }
