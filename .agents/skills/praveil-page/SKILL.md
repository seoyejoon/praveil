---
name: praveil-page
description: 프라베일 홈페이지에서 시술 페이지를 필러 · 쿨소닉 형식으로 만들거나 맞출 때 사용. 첫 화면(scene), 소개 · 원리 · 비교 · 특징 · 과정(device-story), FAQ 12개, 세부 시술 카드를 데이터 파일에 채우는 순서. "페이지 만들어", "필러 형식으로", "쿨소닉처럼" 요청에 사용.
---

# 시술 페이지 만들기 (필러 · 쿨소닉 형식)

먼저 저장소 맨 위 `AGENTS.md` 를 읽고 지킵니다. 문구는 `praveil-copy` 스킬, 확인은 `praveil-check` 스킬을 따릅니다.

## 0. 기준부터 보기 (매번)
- `src/content/treatments.ts` 의 `/petit/filler`, `/lifting/coolsonic` 항목
- `src/content/device-story.ts` 의 `"/petit/filler"`(시술형), `"/lifting/coolsonic"`(장비형)
- `src/content/faq-detail.ts` 의 두 FAQ
- 로컬에서 두 페이지를 PC · 모바일로 열어 섹션 순서와 간격을 눈으로 확인

새 페이지는 **위 데이터와 같은 모양의 데이터를 채우는 것**이 거의 전부입니다.
컴포넌트를 고쳐야 할 것 같으면, 먼저 데이터 옵션으로 되는지 확인하고 PR 본문에 이유를 적습니다.

## 1. 첫 화면 `scene` (treatments.ts)
필러 · 쿨소닉처럼 사진형 첫 화면을 씁니다.
```ts
scene: {
  src: photo("best-<이름>"),        // PC: 3000×1000 (3:1), 오른쪽에 원장 · 장비, 왼쪽은 빈 벽
  mobileSrc: photo("best-<이름>-m"), // 모바일 세로 사진
  position: "70% 28%",              // 사진이 잘리면 조정 (기본 "92% center")
  chips: [                           // 사진 위 유리 카드 2개 (x: 카드 오른쪽 끝 %, y: 카드 위 %)
    { x: 59, y: 22, en: "Design", label: "짧은 특징 한 줄" },
    { x: 56, y: 48, en: "Genuine", label: "짧은 특징 한 줄" },
  ],
},
```
- 사진이 아직 없으면 `scene` 을 넣지 말고 `// 확인 필요: 첫 화면 사진 (PC 3000×1000 · 모바일 세로)` 만 남깁니다.
- 메인 BEST 사진(`best-coolphase`, `best-retuo`)은 첫 화면용(3:1)이 아니므로 `scene` 에 임의로 쓰지 않습니다.
- 카드가 얼굴 · 손 · 장비를 가리지 않는지 PC 화면 사진으로 확인합니다.

## 2. 본문 (device-story.ts)
`DeviceStory` 타입을 따릅니다. 시술형이면 `kind: "procedure"`.
1. `device`: name · maker · text · specs 4줄, 시술형은 `photo` 에 기존 사진
2. `principle` 3단계 + `diagram` (있는 그림: hifu, rf, filler, botox, matrix, booster, collagen, laser, thread, acne, hair, pigment. 생략하면 초음파 그림).
   맞는 그림이 없을 때만 `DeviceStory.tsx` 의 기존 그림과 같은 크기(viewBox 600×420) · 같은 색으로 새로 그립니다.
3. `compare`: 함께 비교되는 시술 3~4개, 일반적인 특징만, `title` · `lead` 는 질문형
4. `featuresTitle` + `features` 4개 (사진은 같은 페이지 안에서 겹치지 않게)
5. `process` 4단계: 상담 · 마취 · 시술 · 경과 확인 (사진 process-consult, process-anesthesia, 시술 장면, process-check)
6. 가격 표가 필요한 시술은 `showPrices: true` (가격은 관리자에서 넣으므로 숫자를 쓰지 않음)

## 3. FAQ (faq-detail.ts)
12개. 순서: 어떤 시술 → 누구에게 → 다른 시술과 차이 → 통증 · 마취 → 회복 · 일상 → 변화 시점 · 유지 → 횟수 · 간격 → 부작용 → 같이 받기 → 주의할 분 → 비용 → 상담 때 확인할 것.
질문은 환자가 실제로 묻는 말투 (`~인가요?`, `~해도 되나요?`).

## 4. 세부 시술 카드 `items` (treatments.ts)
`{ name, text }` 형식 유지. 아이콘 · 사진은 병원이 나중에 주므로 `image` 는 비워 둡니다.

## 5. 끝나면
`praveil-check` 스킬로 점검 → 페이지 하나당 커밋 1개 → PR.
