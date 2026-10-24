# 프라베일 맑고고운의원 홈페이지: 작업 규칙

Codex · Claude 공통 규칙입니다. 작업을 시작하기 전에 끝까지 읽어 주세요.
자세한 작업 순서는 `.agents/skills/` 의 스킬을 따릅니다.

## 역할 나누기
- **Codex**: 페이지 틀 · 레이아웃 · 1차 원고를 만들고 PR 을 올립니다. 양이 많은 반복 작업을 맡습니다.
- **Claude**: PR 검토, 문구 · 사진 · 간격 같은 세부 다듬기, 배포를 맡습니다.
- 그래서 Codex 는 **기존 디자인을 그대로 따르는 것**이 가장 중요합니다. 새 디자인을 만들지 마세요.

## 절대 하지 말 것
1. **`claude/brave-noether-qwu6gl` · `main` 에 push 하지 않기.** push 하면 실서버 praveil.com 에 바로 배포됩니다.
   Codex 는 `codex/<작업이름>` 브랜치에서 작업하고 PR 만 올립니다.
2. `src/lib/preview-lock.ts` 를 고쳐서 커밋하지 않기. 확인할 때는 `PREVIEW_UNLOCK=1 pnpm start` 를 씁니다.
3. 비밀번호 · 토큰 · 서버 주소를 코드나 로그에 쓰지 않기 (저장소가 공개입니다).
4. `deploy/`, `.github/workflows/`, `src/middleware.ts`, `next.config.ts`, DB 관련 코드(`src/lib/data/`)는 요청이 없으면 건드리지 않기.
5. 새 패키지를 설치하지 않기. 있는 컴포넌트와 Tailwind 만 씁니다.
6. 병원이 주는 사진을 다시 압축하거나 크기를 바꾸지 않기 (화질이 떨어집니다). 받은 파일을 그대로 복사합니다.
7. 이미 들어가 있는 사진 · 장비 사진(`device`, `image`)을 빼거나 다른 사진으로 바꾸지 않기. 확인이 필요하면 사진은 두고 `// 확인 필요:` 만 남깁니다.

## 기술 구성
- Next.js 15 (App Router, standalone) · React 19 · Tailwind v4 · pnpm · TypeScript
- 원고는 모두 `src/content/` 의 데이터 파일에 있고, 화면은 컴포넌트가 데이터를 읽어 그립니다.
  **페이지를 만들 때는 대부분 데이터만 추가하면 됩니다.** 컴포넌트를 새로 만드는 일은 드뭅니다.

| 파일 | 내용 |
|---|---|
| `src/content/sitemap.ts` | 메뉴 · 주소 |
| `src/content/treatments.ts` | 시술 페이지 기본 원고 (첫 화면 `scene`, 한눈에 보기, 세부 시술 `items`, 주의사항) |
| `src/content/device-story.ts` | 필러 · 쿨소닉 형식 본문 (소개 · 원리 · 비교 · 특징 · 과정) |
| `src/content/faq-detail.ts` | 시술별 FAQ 12개 |
| `src/components/TreatmentDetail.tsx` | 시술 페이지 전체 틀 |
| `src/components/sub/DeviceStory.tsx` | 소개 · 원리 그림 · 비교표 · 특징 · 과정 |
| `src/components/sub/SceneHero.tsx` | 사진형 첫 화면 |
| `src/lib/preview-lock.ts` | 준비 중 잠금 (공개 페이지 목록) |

## 디자인 기준: 필러 · 쿨소닉 페이지
- 기준 페이지: `/petit/filler`(시술형), `/lifting/coolsonic`(장비형). 새 페이지는 이 둘과 **같은 섹션 · 같은 간격 · 같은 컴포넌트**로 만듭니다.
- 색은 `src/app/globals.css` 의 토큰만 씁니다: `ivory` `sand` `taupe` `gold` `mocha` `muted` `espresso` `ink` `line`.
  새 색 코드(`#...`)를 만들지 않습니다. (원리 그림 SVG 는 `DeviceStory.tsx` 의 기존 그림 색을 그대로 씀)
- 글꼴: 본문은 기본, 영문 작은 제목은 `font-display` + `tracking-[0.35em] uppercase`.
- 섹션 제목은 `SectionHead`(영문 + 질문형 제목), 폭은 `Container`, 나타나는 효과는 `Reveal`.
- 화면 크기: PC 1440 과 모바일 390 둘 다 확인. 모바일에서 옆으로 넘치면 안 됩니다.
- 아이콘 · 새 사진은 병원에서 따로 줍니다. 없으면 기존 사진(`public/images/photos/`)을 임시로 쓰고 `// 확인 필요:` 를 남깁니다.

## 원고 규칙 (의료광고)
- 짧고 쉬운 한국어. 원장이 환자에게 설명하는 말투 (`~합니다`, `~드립니다`).
- 최상급 금지: 최고 · 유일 · 최초 · 가장 · 완벽 · 100% · 1위 등.
- 효과 보장 금지 ("반드시", "확실히", "영구적으로"), 다른 병원 · 장비와 우열 비교 금지.
- 겁주는 글 금지: 합병증 증례 · 논문 한계 · 연구 대상자 수 같은 학술 문장은 쓰지 않습니다.
  부작용은 "드물게 ~ 생길 수 있어 ~ 합니다"처럼 차분하게 씁니다.
- 병원이 실제로 쓰는지 모르는 제품명 · 장비 모델 · 가격 · 횟수 · 기간은 지어내지 않습니다.
  모르면 일반적인 표현으로 쓰고 코드에 `// 확인 필요: <무엇을>` 을 남깁니다.
- 별점 · 후기 · 숫자 실적을 만들지 않습니다.
- 가운뎃점은 앞뒤 띄어쓰기 ` · `.
- 출처 링크 `[이름](주소)` 는 FAQ 답변 문단 끝에만 두고, 실제로 열리는 주소(HTTP 200)만 씁니다.

## 확인 (커밋 전에 매번)
```sh
pnpm install --frozen-lockfile
pnpm exec prettier --write <바꾼 파일>
pnpm exec tsc --noEmit && pnpm lint && DATABASE_URL= pnpm build
PREVIEW_UNLOCK=1 DATABASE_URL= pnpm start &      # 잠긴 페이지까지 열어서 실행
node scripts/check-pages.mjs <주소들>             # PC · 모바일 점검 + .shots/ 화면 사진
```
`check-pages` 가 `✗` 를 내면 고친 뒤에 커밋합니다.

## 커밋 · PR
- 한 페이지(또는 한 묶음) 끝날 때마다 커밋 1개. 메시지는 한글 (`보톡스 페이지 첫 화면 구성`).
- PR 본문에 꼭 넣기: 바꾼 페이지 목록, 점검 결과, 페이지별 `확인 필요` 목록, 못 한 것.
