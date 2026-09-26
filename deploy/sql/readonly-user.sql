-- 홈페이지 전용 "읽기 전용" DB 계정. 홈페이지는 관리자 DB를 읽기만 한다.
-- 사용: sudo -u postgres psql -d psbox_admin -v pw="'여기에_새_비밀번호'" -f readonly-user.sql
-- (관리자에서 npm run praveil:setup 을 먼저 실행해 프라베일 테이블을 만든 뒤 실행)

CREATE ROLE praveil_web LOGIN PASSWORD :pw;
GRANT CONNECT ON DATABASE psbox_admin TO praveil_web;
GRANT USAGE ON SCHEMA public TO praveil_web;
GRANT SELECT ON hospitals, posts, praveil_procedure_categories, praveil_procedures, praveil_popups TO praveil_web;
-- 로그인 여부 확인용 (회원 세션만 읽는다)
GRANT SELECT ON website_members, website_member_sessions TO praveil_web;
