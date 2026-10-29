// 회원 기능 점검용 (임시): 테스트 전후사례 추가 · 테스트 회원 승인 · 모두 정리
// 서버에서: node --env-file=/opt/psbox-admin-only/.env.local member-test.mjs <add|approve|cleanup> [아이디]
//  - 테스트 사례 사진은 AI 가상 예시(public/images/test, 실제 환자 사진 아님)
//  - cleanup: 제목이 '[테스트] 회원 기능 점검' 인 사례와, 'pvtest' 로 시작하는 테스트 회원만 지움
import pg from "pg";

const TITLE = "[테스트] 회원 기능 점검";
const [mode, username] = process.argv.slice(2);
const img = (n) => `https://praveil.com/images/test/ai-coolsonic-1-${n}.webp`;

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  const { rows } = await client.query(
    "SELECT id, site_builder_config->'websiteAdmin'->'boards' AS boards FROM hospitals WHERE status='active' ORDER BY id LIMIT 1",
  );
  const h = rows[0].id;
  if (mode === "add") {
    const board = (rows[0].boards || []).find((b) => b.boardType === "before-after");
    if (!board) throw new Error("전후사진 게시판이 없습니다.");
    const content = "HS_BEFORE_AFTER_V1\n" + JSON.stringify({
      stages: [{ beforeImageUrl: img("before"), afterImageUrl: img("after"), beforeLabel: "시술 전 (가상)", afterLabel: "시술 후 (가상)" }],
      representativeAfter: 0,
    });
    const dup = await client.query("SELECT id FROM posts WHERE hospital_id=$1 AND title=$2", [h, TITLE]);
    if (dup.rowCount) console.log(`이미 있음: ${dup.rows[0].id}`);
    else {
      const r = await client.query(
        `INSERT INTO posts (hospital_id,board_id,category,title,summary,content,cover_image_url,status,published_at)
         VALUES ($1,$2,'리프팅',$3,'AI 가상 예시 · 회원 기능 점검용',$4,$5,'published',CURRENT_TIMESTAMP) RETURNING id`,
        [h, String(board.id), TITLE, content, img("after")],
      );
      console.log(`테스트 사례 추가: ${r.rows[0].id}`);
    }
  } else if (mode === "approve") {
    if (!/^pvtest/.test(username || "")) throw new Error("테스트 아이디만 승인합니다.");
    const r = await client.query("UPDATE website_members SET status='active' WHERE hospital_id=$1 AND username=$2 RETURNING id, status", [h, username]);
    console.log(`승인: ${r.rowCount}건`);
  } else if (mode === "cleanup") {
    const p = await client.query("DELETE FROM posts WHERE hospital_id=$1 AND title=$2 RETURNING id", [h, TITLE]);
    console.log(`테스트 사례 삭제: ${p.rowCount}건`);
    const m = await client.query("SELECT id, username FROM website_members WHERE hospital_id=$1 AND username LIKE 'pvtest%'", [h]);
    // 회원을 참조하는 표(세션 · 동의 기록 등)에서 이 회원 줄만 먼저 지움
    const refs = await client.query(
      `SELECT tc.table_name, kcu.column_name FROM information_schema.table_constraints tc
       JOIN information_schema.key_column_usage kcu ON kcu.constraint_name = tc.constraint_name AND kcu.table_schema = tc.table_schema
       JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
       WHERE tc.constraint_type='FOREIGN KEY' AND ccu.table_name='website_members' AND ccu.column_name='id'`,
    );
    for (const mem of m.rows) {
      for (const ref of refs.rows) {
        const d = await client.query(`DELETE FROM "${ref.table_name}" WHERE "${ref.column_name}" = $1`, [mem.id]);
        if (d.rowCount) console.log(`  ${ref.table_name}: ${d.rowCount}줄`);
      }
      await client.query("DELETE FROM website_members WHERE id=$1", [mem.id]);
      console.log(`테스트 회원 삭제: ${mem.username}`);
    }
    const left = await client.query("SELECT count(*)::int AS n FROM website_members WHERE hospital_id=$1 AND username LIKE 'pvtest%'", [h]);
    console.log(`남은 테스트 회원: ${left.rows[0].n}`);
  } else throw new Error("add | approve <아이디> | cleanup");
} finally {
  await client.end();
}
