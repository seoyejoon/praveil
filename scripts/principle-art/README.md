# 시술 원리 일러스트

11개 원리 그림을 로컬 WebGL로 제작합니다. 외부 이미지, 제조사 상표,
환자 자료, 외부 API를 사용하지 않습니다. 실제 장비 외형, 해부학적 비율,
시술 깊이 · 용량 · 결과를 재현하는 그림이 아닙니다.

웹페이지에서는 렌더러를 실행하지 않고 정적인 WebP만 표시합니다.
`public/images/principles/`에 PC용 1600×1000과 모바일용 800×500을 함께 둡니다.
번호와 설명은 `src/content/principle-illustrations.ts` 및
`src/components/sub/TreatmentPrinciple.tsx`에서 HTML로 표시합니다.
쿨소닉의 기존 그림 · 라벨 · 동작은 이 컴포넌트를 사용하지 않습니다.

## 다시 생성

이미 설치된 Playwright · Sharp와 Chromium을 사용합니다. 패키지를 추가로 설치하지 않습니다.

```powershell
$env:PRAVEIL_ART_TOOLS = '<기존 Playwright와 Sharp가 있는 node_modules 경로>'
$env:CHROME_PATH = '<설치된 Chrome 실행 파일 경로>'
node scripts/principle-art/render.mjs
```

렌더링 중 네트워크 요청은 차단됩니다. `scene.js`의 고정 시드로 같은 그림을
재현하며 `landmarks.json`에는 장면 좌표를 이미지 좌표로 투영한 기준점을 기록합니다.
실제 HTML 라벨 좌표는 작은 화면의 번호 겹침을 방지하도록 별도로 조정할 수 있습니다.

## 시각적 의미

- RF는 넓은 열 자극, HIFU는 집속점을 사용해 표현을 구분합니다.
- 보톡스는 피부 단면 대신 신경 · 근육 접합부를 확대한 별도 장면입니다.
- 리투오의 기질, 콜라겐부스터의 서로 다른 재료는 구조 차이의 개념도입니다.
- 스킨부스터는 도포와 주입을 구분하고 특정 성분의 공통 효과를 단정하지 않습니다.
- 실리프팅은 돌기 있는 실의 예시입니다. 모든 제품의 구조를 뜻하지 않습니다.
- 여드름은 막힘 · 염증 · 흉터를, 문신은 색소 입자와 작은 입자를 구분합니다.
- 기존 본문 · 제품명 · 시술 조건 · 사진 · 가격은 변경하지 않습니다.
