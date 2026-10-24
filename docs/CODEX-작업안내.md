# Codex 작업 안내: 시술 페이지 10개를 필러 · 쿨소닉 페이지 구성으로

## 목표
`/lifting/coolsonic`, `/petit/filler` 와 같은 구성(시술 소개 · 원리 · 비교 · 4가지 특징 · 과정 · FAQ 12 · 블로그 · 리뷰)을
나머지 10개 시술 페이지에 적용한다. **레이아웃과 원고만** 잡는다. 아이콘 · 새 사진은 병원에서 나중에 준다.

| 순서 | 주소 | 종류 |
|---|---|---|
| 1 | /lifting/coolphase | 장비 (kind 생략) |
| 2 | /petit/botox | 시술 (`kind: "procedure"`) |
| 3 | /skin/retuo | 시술 |
| 4 | /skin/booster | 시술 |
| 5 | /skin/collagen | 시술 |
| 6 | /lifting/laser | 장비 |
| 7 | /lifting/thread | 시술 |
| 8 | /acne-pore | 시술 |
| 9 | /removal/hair | 장비 |
| 10 | /removal/tattoo | 장비 |

## 꼭 지킬 것
- **브랜치**: `codex/pages-rollout` 에서만 작업. `claude/brave-noether-qwu6gl` 과 `main` 에는 절대 push 하지 말 것
  (push 하면 실서버 praveil.com 에 자동 배포됨). 끝나면 PR 만 올린다.
- 페이지 하나 끝날 때마다 커밋 1개 (`<시술명> 페이지 구성` 형식, 한글).
- 새 패키지 설치 금지. 기존 컴포넌트만 사용.
- `src/lib/preview-lock.ts`(준비 중 잠금)는 건드리지 말 것.

## 참고할 예시 (그대로 따라 하기)
- 커밋 `13ad8fb` (필러 페이지): 무엇을 어디에 넣었는지 전부 들어 있음
- `src/content/device-story.ts` 의 `"/petit/filler"`(시술형), `"/lifting/coolsonic"`(장비형)
- `src/content/faq-detail.ts` 의 두 시술 FAQ

## 페이지마다 할 일
1. `src/content/device-story.ts` 에 항목 추가
   - `device`: name · maker · text · specs 4줄. 사진은 `photo` 에 기존 사진(`public/images/photos/`) 중 맞는 것
   - `principle` 3단계 (원리 그림이 없으면 `diagram` 은 생략 → 기본 그림. 초음파 장비가 아니면 그림이 어색하므로
     필요하면 `src/components/sub/DeviceStory.tsx` 의 `FillerDiagram` 처럼 단순한 SVG 를 새로 만들 것)
   - `compare`: 같이 비교되는 시술 · 장비 3~4개, 일반적인 특징만 (title · lead 는 시술에 맞게)
   - `featuresTitle` + `features` 4개 (사진은 기존 사진 재사용, 같은 페이지 안에서 겹치지 않게)
   - `process` 4단계 (상담 · 마취 · 시술 · 경과 확인 / 사진: process-consult, process-anesthesia, 시술 장면, process-check)
   - 가격 안내가 필요한 시술은 `showPrices: true`
2. `src/content/faq-detail.ts` 에 FAQ 12개 (원장이 설명하는 말투, `[이름](주소)` 출처는 문단 끝)
3. `src/content/treatments.ts` 의 `description` 을 한 줄 소개로 다듬기 (`scene` 은 사진이 정해지면 나중에)

## 원고 규칙
- 짧고 쉬운 한국어. 최상급 표현 금지 (최고, 유일, 최초, 가장 …)
- 효과 보장 표현 금지, 다른 병원 · 장비와 우열 비교 금지 (비교표 아래 note 문구 유지)
- 가운뎃점은 앞뒤 띄어쓰기 ` · `
- 병원이 실제로 보유했는지 모르는 장비 · 제품 이름, 가격, 시술 횟수는 지어내지 말 것.
  모르면 일반적인 표현으로 쓰고 코드에 `// 확인 필요:` 주석을 남길 것
- 출처 링크는 실제로 열리는 주소(HTTP 200)만. 확인 못 하면 넣지 말 것

## 확인 (커밋 전에 매번)
```sh
pnpm install
pnpm exec prettier --write <바꾼 파일>
pnpm exec tsc --noEmit && pnpm lint && DATABASE_URL= pnpm build
```
로컬에서 `DATABASE_URL= pnpm start` 후 해당 주소가 열리는지, 모바일(390px) 화면에서 옆으로 넘치지 않는지 확인.
(잠금 때문에 '준비 중'이 뜨면 확인할 때만 `src/lib/preview-lock.ts` 의 `LOCKED` 를 잠시 false 로 — 커밋하지 말 것)

## 끝나면
PR 제목: `시술 페이지 10개 구성 (필러 · 쿨소닉 형식)` — 본문에 페이지별 `확인 필요` 목록을 정리.
