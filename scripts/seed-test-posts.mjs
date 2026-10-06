// 테스트 게시글 넣기: 공지 3 · 이벤트 3 · 전후사례 3 (제목에 [테스트])
// 사용: DATABASE_URL=... node scripts/seed-test-posts.mjs
//  - 다시 실행하면 기존 [테스트] 글을 지우고 새로 넣음 (다른 글은 건드리지 않음)
//  - 지우기만: DATABASE_URL=... node scripts/seed-test-posts.mjs --delete
//  - 공지 · 이벤트만: --news (전후사례 테스트 글은 건드리지 않음)
//  - 사진은 홈페이지 public/images/test 에 있음 (IMAGE_BASE 로 주소 지정, 기본: 미리보기 사이트)
// ※ 테스트용: 전후사례의 시술 전 사진도 공개 주소를 씀. 실제 글은 관리자에서 올리면 보호 저장소에 저장됨.
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL 이 필요합니다.");
const base = (process.env.IMAGE_BASE || "https://praveil.vercel.app").replace(
  /\/$/,
  "",
);
const img = (name) => `${base}/images/test/${name}.webp`;

const doc = (paras) =>
  "hs-column-json-v1:" +
  JSON.stringify({
    type: "doc",
    content: paras.map((text) => ({
      type: "paragraph",
      content: [{ type: "text", text }],
    })),
  });

const notices = [
  [
    "[테스트] 추석 연휴 휴진 안내",
    [
      "추석 연휴 기간 동안 휴진합니다.",
      "연휴 이후 정상 진료하며, 예약은 네이버 예약으로 미리 해 주세요.",
    ],
  ],
  [
    "[테스트] 목요일 야간진료 안내",
    [
      "매주 목요일은 오후 8시 30분까지 진료합니다.",
      "퇴근 후에도 편하게 방문해 주세요.",
    ],
  ],
  [
    "[테스트] 홈페이지 회원 전용 전후사진 안내",
    [
      "전후사진 게시판의 시술 전 사진은 의료법에 따라 로그인한 회원에게만 보입니다.",
    ],
  ],
];
const events = [
  ["[테스트] 10월 리프팅 이벤트", "2026.10.01 ~ 2026.10.31", 1],
  ["[테스트] 스킨부스터 첫 방문 이벤트", "2026.10.01 ~ 2026.12.31", 2],
  ["[테스트] 여름 제모 패키지", "2026.07.01 ~ 2026.08.31", 3],
];
const cases = [
  [
    "[테스트] 쿨소닉 · 쿨페이즈 3개월 경과",
    "리프팅",
    "턱선 · 볼 라인 경과 사례 (테스트)",
    3,
  ],
  ["[테스트] 앞볼 볼륨필러", "쁘띠시술", "앞볼 꺼짐 개선 사례 (테스트)", 1],
  [
    "[테스트] 리투오 2회 경과",
    "피부관리",
    "피부결 · 밀도 경과 사례 (테스트)",
    2,
  ],
];
const afterLabels = ["시술 후 2주", "시술 후 1개월", "시술 후 3개월"];

const client = new pg.Client({
  connectionString: url,
  ssl: /localhost|127\.0\.0\.1/.test(url)
    ? false
    : { rejectUnauthorized: false },
});
await client.connect();
try {
  await client.query("BEGIN");
  const { rows } = await client.query(
    "SELECT id FROM hospitals WHERE status='active' ORDER BY id LIMIT 1",
  );
  if (!rows[0]) throw new Error("활성 병원이 없습니다.");
  const h = rows[0].id;
  const boards =
    (
      await client.query(
        "SELECT site_builder_config->'websiteAdmin'->'boards' AS b FROM hospitals WHERE id=$1",
        [h],
      )
    ).rows[0]?.b ?? [];
  const ids = new Set((Array.isArray(boards) ? boards : []).map((b) => b.id));
  for (const id of ["notice", "event", "before-after"])
    if (!ids.has(id))
      console.warn(
        `⚠ 관리자에 '${id}' 게시판이 없습니다. 관리자 > 게시판 설정에서 먼저 만들어 주세요.`,
      );
  const newsOnly = process.argv.includes("--news");
  const del = await client.query(
    newsOnly
      ? "DELETE FROM posts WHERE hospital_id=$1 AND title LIKE '[테스트]%' AND board_id IN ('notice','event')"
      : "DELETE FROM posts WHERE hospital_id=$1 AND title LIKE '[테스트]%'",
    [h],
  );
  console.log(`기존 테스트 글 ${del.rowCount}개 삭제`);
  if (!process.argv.includes("--delete")) {
    const insert = (
      board,
      category,
      title,
      summary,
      content,
      cover,
      hoursAgo,
    ) =>
      client.query(
        `INSERT INTO posts (hospital_id,board_id,category,title,summary,content,cover_image_url,status,published_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,'published',now() - make_interval(hours => $8))`,
        [h, board, category, title, summary, content, cover, hoursAgo],
      );
    for (const [i, [title, paras]] of notices.entries())
      await insert("notice", "공지사항", title, "", doc(paras), "", 3 - i);
    for (const [i, [title, period, n]] of events.entries()) {
      const u = img(`test-event-${n}`);
      const content =
        "hs-event-images-v1:" +
        JSON.stringify({
          version: 1,
          images: [{ id: `test-${n}`, url: u, alt: title }],
        });
      await insert("event", "이벤트", title, period, content, u, 6 - i);
    }
    for (const [i, [title, category, summary, n]] of (newsOnly
      ? []
      : cases
    ).entries()) {
      const c = i + 1;
      const stages = Array.from({ length: n }, (_, s) => ({
        beforeImageUrl: img(`test-ba-${c}-${s + 1}-before`),
        afterImageUrl: img(`test-ba-${c}-${s + 1}-after`),
        beforeLabel: "시술 전",
        afterLabel: n > 1 ? afterLabels[s] : "시술 후",
      }));
      const content =
        "HS_BEFORE_AFTER_V1\n" +
        JSON.stringify({
          version: 1,
          beforeLabel: "시술 전",
          representativeBefore: 0,
          representativeAfter: n - 1,
          stages,
        });
      await insert(
        "before-after",
        category,
        title,
        summary,
        content,
        stages[n - 1].afterImageUrl,
        3 - i,
      );
    }
    console.log(
      newsOnly ? "공지 3 · 이벤트 3 등록" : "공지 3 · 이벤트 3 · 전후사례 3 등록",
    );
  }
  await client.query("COMMIT");
} catch (e) {
  await client.query("ROLLBACK");
  throw e;
} finally {
  await client.end();
}
