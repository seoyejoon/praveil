# Codex 작업 시키는 법

Codex 는 저장소의 `AGENTS.md`(규칙)와 `.agents/skills/`(작업 순서)를 자동으로 읽습니다.
그래서 요청은 **무엇을 할지만 짧게** 쓰면 됩니다.

## 스킬 (따로 설치할 필요 없음)
| 스킬 | 언제 | 직접 부르기 |
|---|---|---|
| `praveil-page` | 시술 페이지를 필러 · 쿨소닉 형식으로 만들기 · 맞추기 | `$praveil-page` |
| `praveil-copy` | 원고 · FAQ 쓰기 · 고치기 | `$praveil-copy` |
| `praveil-check` | 커밋 · PR 전 점검 | `$praveil-check` |

요청에 맞는 스킬을 Codex 가 알아서 고릅니다. 확실히 쓰게 하려면 요청 앞에 `$스킬이름` 을 붙입니다.

## 요청 예시 (복사해서 쓰기)

**페이지 만들기**
```
$praveil-page 브랜치 codex/<작업이름> 에서 /lifting/coolphase, /petit/botox 를 필러 · 쿨소닉 페이지와 같은 구성으로 맞춰 줘.
사진 · 아이콘은 기존 것을 임시로 쓰고 확인 필요로 남겨. 끝나면 $praveil-check 로 점검하고 PR 올려 줘.
```

**첫 화면 사진 넣기** (사진 파일을 `public/images/photos/` 에 먼저 넣고)
```
$praveil-page best-botox.webp(PC), best-botox-m.webp(모바일)을 /petit/botox 첫 화면 scene 으로 넣어 줘.
사진 파일은 다시 압축하지 마. 카드 2개가 얼굴을 가리지 않게 위치 잡고 PR 올려 줘.
```

**원고 고치기**
```
$praveil-copy /skin/booster FAQ 를 더 짧고 쉽게 다듬어 줘. 내용은 바꾸지 말고 말투만.
```

**원장님 확인 내용 반영**
```
아래 원장님 답변을 확인 필요 주석 자리에 반영하고, 반영한 주석은 지워 줘. PR 올려 줘.
- 보톡스 제품: ○○○
- ...
```

## 순서
1. Codex 에게 요청 → Codex 가 `codex/...` 브랜치에 PR 을 올림
2. Claude 에게 "PR 올라왔어, 검토해줘" → 검토 · 세부 수정 · 병합 · 배포
3. 잠긴 페이지는 공개 전까지 손님에게 "준비 중"으로 보임
