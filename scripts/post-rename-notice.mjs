// 병원명 변경 안내: 공지사항 글 + 팝업 등록 (일회용, 실행 후 삭제)
// 서버에서: node --env-file=/opt/psbox-admin-only/.env.local post-rename-notice.mjs
import pg from "pg";

const TITLE = "병원명 변경 안내";
const IMAGE = "https://praveil.com/images/notice/rename-20261116.jpg";
const ALT =
  "병원명 변경 안내: 2026년 11월 16일, 뉴리즈의원 인천점이 프라베일 맑고고운의원으로 새롭게 시작합니다. 의료진 및 직원 변동 없이 병원명만 변경됩니다.";
const p = (text, marks) => ({
  type: "paragraph",
  content: [{ type: "text", text, ...(marks ? { marks } : {}) }],
});
const doc = {
  type: "doc",
  content: [
    p("2026년 11월 16일, 뉴리즈의원 인천점이 프라베일 맑고고운의원으로 새롭게 시작합니다."),
    p("의료진 및 직원 변동 없이 병원명만 변경됨을 안내드립니다.", [{ type: "bold" }]),
    { type: "image", attrs: { src: IMAGE, alt: ALT } },
    p("처음의 마음을 새 이름에 담아, 한 분 한 분의 아름다움을 함께 고민하는 프라베일 맑고고운의원이 되겠습니다."),
  ],
};

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  await client.query("BEGIN");
  const h = (
    await client.query(
      `SELECT id, site_builder_config->'websiteAdmin'->'boards' AS boards FROM hospitals WHERE status = 'active' ORDER BY id LIMIT 1`,
    )
  ).rows[0];
  const board = (h.boards || []).find((b) => b.boardType === "notice" && b.readPermission !== "member");
  if (!board) throw new Error("공지 게시판 없음");

  // 공지 글 (같은 제목이 있으면 새로 만들지 않음)
  let post = (
    await client.query("SELECT id FROM posts WHERE hospital_id=$1 AND title=$2 AND board_id=$3", [h.id, TITLE, board.id])
  ).rows[0];
  if (post) console.log(`공지 이미 있음: ${post.id}`);
  else {
    const last = (
      await client.query("SELECT author FROM posts WHERE hospital_id=$1 AND board_id=$2 ORDER BY id DESC LIMIT 1", [h.id, board.id])
    ).rows[0];
    post = (
      await client.query(
        `INSERT INTO posts (hospital_id, title, summary, content, category, board_id, cover_image_url, status, author, published_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,'published',$8,CURRENT_TIMESTAMP) RETURNING id`,
        [
          h.id,
          TITLE,
          "2026년 11월 16일, 뉴리즈의원 인천점이 프라베일 맑고고운의원으로 새롭게 시작합니다.",
          "hs-column-json-v1:" + JSON.stringify(doc),
          board.name,
          board.id,
          IMAGE,
          last?.author || "프라베일 맑고고운의원",
        ],
      )
    ).rows[0];
    await client.query("UPDATE posts SET slug = 'post-' || id::text WHERE id=$1", [post.id]);
    console.log(`공지 등록: ${post.id} (${board.name})`);
  }

  // 팝업 (맨 앞에, 누르면 공지 글로)
  const dup = await client.query("SELECT id FROM praveil_popups WHERE hospital_id=$1 AND title=$2", [h.id, TITLE]);
  if (dup.rowCount) console.log(`팝업 이미 있음: ${dup.rows[0].id}`);
  else {
    const r = await client.query(
      `INSERT INTO praveil_popups (hospital_id,title,image_url,body,link_url,device,visible,sort_order)
       VALUES ($1,$2,$3,'',$4,'all',true,-1) RETURNING id`,
      [h.id, TITLE, IMAGE, `/notice/${post.id}`],
    );
    console.log(`팝업 등록: ${r.rows[0].id} → /notice/${post.id}`);
  }
  await client.query("COMMIT");
  const all = await client.query("SELECT id,title,visible,sort_order FROM praveil_popups WHERE hospital_id=$1 ORDER BY sort_order,id", [h.id]);
  console.log(`팝업 ${all.rowCount}개: ${all.rows.map((x) => `${x.id} ${x.title}${x.visible ? "" : " (숨김)"}`).join(" / ")}`);
} catch (e) {
  await client.query("ROLLBACK");
  throw e;
} finally {
  await client.end();
}
