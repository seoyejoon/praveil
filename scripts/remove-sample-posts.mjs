// 보여주기용 샘플 공지 3 · 이벤트 3 삭제 (scripts/seed-sample-posts.mjs 로 넣은 글만)
// 서버에서: node --env-file=/opt/psbox-admin-only/.env.local remove-sample-posts.mjs
//  - 제목 · 게시판이 같고, 샘플로 넣은 내용(테스트 이미지 / 샘플 본문)인 글만 지움
import pg from "pg";

const samples = [
  ["notice", "추석 연휴 휴진 안내", "10월 8일(수)부터 정상 진료하며"],
  ["notice", "목요일 야간진료 안내", "퇴근 후에도 편하게 방문해 주세요."],
  ["notice", "홈페이지 회원 전용 전후사진 안내", "회원가입 후 확인해 주세요."],
  ["event", "10월 리프팅 이벤트", "/images/test/test-event-1.webp"],
  ["event", "스킨부스터 첫 방문 이벤트", "/images/test/test-event-2.webp"],
  ["event", "여름 제모 패키지", "/images/test/test-event-3.webp"],
];

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  const { rows } = await client.query("SELECT id FROM hospitals WHERE status='active' ORDER BY id LIMIT 1");
  if (!rows[0]) throw new Error("활성 병원이 없습니다.");
  const h = rows[0].id;
  let removed = 0;
  for (const [board, title, mark] of samples) {
    const r = await client.query(
      "DELETE FROM posts WHERE hospital_id=$1 AND board_id=$2 AND title=$3 AND position($4 in content) > 0 RETURNING id",
      [h, board, title, mark],
    );
    removed += r.rowCount;
    console.log(`${r.rowCount ? "삭제" : "없음"}: ${title}`);
  }
  console.log(`샘플 게시글 ${removed}개 삭제`);
  const left = await client.query("SELECT board_id, title FROM posts WHERE hospital_id=$1 ORDER BY id", [h]);
  console.log(`남은 글 ${left.rowCount}개: ${left.rows.map((x) => `[${x.board_id}] ${x.title}`).join(" / ")}`);
} finally {
  await client.end();
}
