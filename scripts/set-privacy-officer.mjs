// 개인정보 보호책임자를 '대표원장 한재웅'으로 저장 (관리자 > 약관 및 필수정보와 같은 칸, 일회용 · 실행 후 삭제)
// 서버에서: node --env-file=/opt/psbox-admin-only/.env.local set-privacy-officer.mjs
import pg from "pg";

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  const r = await client.query(
    `UPDATE hospitals
     SET site_builder_config = jsonb_set(
       jsonb_set(site_builder_config, '{websiteAdmin}', COALESCE(site_builder_config->'websiteAdmin', '{}'::jsonb), true),
       '{websiteAdmin,terms}',
       COALESCE(site_builder_config->'websiteAdmin'->'terms', '{}'::jsonb) || jsonb_build_object('privacyOfficer', $1::text),
       true)
     WHERE id = (SELECT id FROM hospitals WHERE status = 'active' ORDER BY id LIMIT 1)
     RETURNING site_builder_config->'websiteAdmin'->'terms'->>'privacyOfficer' AS officer,
               length(COALESCE(site_builder_config->'websiteAdmin'->'terms'->>'privacyPolicy', '')) AS custom_policy`,
    ["대표원장 한재웅"],
  );
  console.log(
    r.rowCount
      ? `저장: ${r.rows[0].officer} (관리자 직접 입력 방침 글자 수: ${r.rows[0].custom_policy})`
      : "병원 없음",
  );
} finally {
  await client.end();
}
