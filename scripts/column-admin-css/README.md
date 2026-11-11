# 원장칼럼 스타일 (src/app/column-admin.css) 다시 만드는 법

홈페이지 칼럼 본문은 관리자 칼럼 편집기 · 미리보기와 **같은 HTML(ColumnRich.tsx) + 같은 CSS**로 그린다.
관리자 스타일을 바꾸고 다시 빌드했다면 아래 순서로 column-admin.css 를 새로 만든다.

1. 관리자 게시판 화면에서 `[...document.styleSheets].map(s => s.href)` 로 CSS 주소를 순서대로 받아
   `public/__admincss/01.css … 10.css` 로 저장한다 (작업 후 삭제, 커밋하지 않음).
2. 로컬 개발 서버에서 칼럼 글 하나를 띄우고, 브라우저 콘솔에서 `extract.js` 를 실행해 결과를 `extracted.css` 로 저장한다.
   (본문 `.pvc .column-content` 와 그 안쪽에 실제로 걸리는 규칙만 남기고, 바깥 틀에 걸리는 규칙은 뺀다)
3. `node scripts/column-admin-css/scope.cjs <postcss 경로> extracted.css src/app/column-admin.css scripts/column-admin-css/vars.json`
   → 모든 선택자를 `.pvc` 안으로 한정하고, 관리자 주황색을 프라베일 색으로 바꾼다.
4. 관리자 화면을 다시 빌드해 CSS 모듈 이름 뒤 해시가 바뀌었으면 ColumnRich.tsx 의 WRAPPERS 도 미리보기 화면 기준으로 고친다.
