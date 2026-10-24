---
name: praveil-check
description: 프라베일 홈페이지 변경을 커밋 · PR 하기 전에 점검할 때 사용. 타입 · 린트 · 빌드, 잠긴 페이지까지 열어 PC(1440) · 모바일(390) 화면 점검, 금지 표현 검색, 링크 확인, PR 본문 형식.
---

# 점검하고 PR 올리기

## 1. 코드 점검
```sh
pnpm install --frozen-lockfile
pnpm exec prettier --write <바꾼 파일>
pnpm exec tsc --noEmit && pnpm lint && DATABASE_URL= pnpm build
```

## 2. 화면 점검
```sh
PREVIEW_UNLOCK=1 DATABASE_URL= pnpm start &    # 잠긴 페이지도 열림 (preview-lock.ts 는 고치지 않음)
node scripts/check-pages.mjs /petit/botox /skin/retuo   # 주소를 빼면 시술 페이지 전체
```
- `✗` 가 하나라도 있으면 고칩니다: 상태 코드, 옆으로 넘침, 깨진 사진, 스크립트 오류.
- `.shots/` 의 화면 사진을 직접 열어 필러 · 쿨소닉 페이지(`.shots/pc_petit_filler.png` 등)와 나란히 비교합니다.
  섹션 순서 · 여백 · 글자 크기 · 카드 모양이 같아야 합니다.
- playwright 가 없어 점검을 못 하면 PR 본문에 그렇게 적습니다.

## 3. 원고 점검
```sh
git diff origin/claude/brave-noether-qwu6gl -- src/content | grep -nE "최고|유일|최초|가장|완벽|100%|1위|반드시|영구|부작용 없|통증 없|증례|논문|대상자"
```
나오면 `praveil-copy` 스킬 기준으로 고칩니다.

새로 넣은 출처 링크는 모두 200 인지 확인:
```sh
git diff origin/claude/brave-noether-qwu6gl -- src/content | grep -oE "\]\(https?://[^)]+\)" | sed 's/^](//; s/)$//' | sort -u | while read u; do echo "$(curl -sIL -o /dev/null -m 15 -w '%{http_code}' "$u") $u"; done
```

## 4. 커밋 · PR
- 브랜치는 `codex/<작업이름>`. **`claude/brave-noether-qwu6gl` · `main` 에 push 금지** (실서버 배포됨).
- base 는 `claude/brave-noether-qwu6gl`.
- PR 본문:
```md
## 바꾼 페이지
- /petit/botox: 첫 화면 scene, FAQ 12개 ...

## 점검
- tsc · lint · build 통과
- check-pages: PC · 모바일 ○개 페이지 모두 ✓

## 확인 필요 (원장님 · 병원 확인)
### /petit/botox
- 실제 사용하는 톡신 제품명

## 못 한 것
- 첫 화면 사진 없음 (병원에서 받기)
```
