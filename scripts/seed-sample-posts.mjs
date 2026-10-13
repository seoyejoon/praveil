// 보여주기용 공지 3 · 이벤트 3 을 관리자 DB에 게시글로 등록 (관리자에서 수정 · 삭제 가능)
// 서버에서: node --env-file=/opt/psbox-admin-only/.env.local seed-sample-posts.mjs
//  - 같은 제목이 이미 있으면 건너뜀 (여러 번 실행해도 중복 안 됨)
import pg from "pg";

const base = "https://praveil.com";
const doc = (paras) =>
  "hs-column-json-v1:" +
  JSON.stringify({
    type: "doc",
    content: paras.map((text) => ({
      type: "paragraph",
      content: [{ type: "text", text }],
    })),
  });
const eventBody = (n, alt) =>
  "hs-event-images-v1:" +
  JSON.stringify({
    version: 1,
    images: [{ id: `sample-${n}`, url: `${base}/images/test/test-event-${n}.webp`, alt }],
  });

// [게시판, 분류, 제목, 요약, 본문, 대표 이미지, 게시일(KST)]
const posts = [
  ["notice", "공지사항", "추석 연휴 휴진 안내", "", doc(["추석 연휴 기간(10월 5일 ~ 10월 7일) 동안 휴진합니다.", "10월 8일(수)부터 정상 진료하며, 예약은 네이버 예약으로 미리 해 주세요."]), "", "2026-10-01 10:00"],
  ["notice", "공지사항", "목요일 야간진료 안내", "", doc(["매주 목요일은 오후 8시 30분까지 진료합니다.", "퇴근 후에도 편하게 방문해 주세요."]), "", "2026-09-25 10:00"],
  ["notice", "공지사항", "홈페이지 회원 전용 전후사진 안내", "", doc(["전후사진 게시판의 시술 전 사진은 의료법에 따라 로그인한 회원에게만 보입니다.", "회원가입 후 확인해 주세요."]), "", "2026-09-20 10:00"],
  ["event", "이벤트", "10월 리프팅 이벤트", "2026.10.01 ~ 2026.10.31", eventBody(1, "10월 리프팅 이벤트"), `${base}/images/test/test-event-1.webp`, "2026-10-01 09:00"],
  ["event", "이벤트", "스킨부스터 첫 방문 이벤트", "2026.10.01 ~ 2026.12.31", eventBody(2, "스킨부스터 첫 방문 이벤트"), `${base}/images/test/test-event-2.webp`, "2026-09-30 09:00"],
  ["event", "이벤트", "여름 제모 패키지", "2026.07.01 ~ 2026.08.31", eventBody(3, "여름 제모 패키지"), `${base}/images/test/test-event-3.webp`, "2026-07-01 09:00"],
];

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  const { rows } = await client.query("SELECT id FROM hospitals WHERE status='active' ORDER BY id LIMIT 1");
  if (!rows[0]) throw new Error("활성 병원이 없습니다.");
  const h = rows[0].id;
  let added = 0;
  for (const [board, category, title, summary, content, cover, at] of posts) {
    const dup = await client.query("SELECT 1 FROM posts WHERE hospital_id=$1 AND board_id=$2 AND title=$3", [h, board, title]);
    if (dup.rowCount) continue;
    await client.query(
      `INSERT INTO posts (hospital_id,board_id,category,title,summary,content,cover_image_url,status,published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'published',($8::timestamp AT TIME ZONE 'Asia/Seoul'))`,
      [h, board, category, title, summary, content, cover, at],
    );
    added++;
  }
  console.log(`게시글 ${added}개 등록 (이미 있던 글은 건너뜀)`);
} finally {
  await client.end();
}
