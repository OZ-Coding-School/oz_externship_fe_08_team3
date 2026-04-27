# Commit Frontend Check Skill

## 언제 사용하는가

사용자가 커밋을 요청할 때 **반드시** 이 스킬을 따른다.

트리거 예시:
- "커밋해줘", "커밋해", "commit"
- "git commit" 실행 요청
- "반영해줘", "푸시 전에 커밋" 등 커밋을 전제로 한 모든 요청

## 목적

커밋되는 `.ts` / `.tsx` 파일이 토스 프론트엔드 가이드라인
(`.claude/docs/frontend-design-guide.checklist.md`)을 준수하는지 검사하고,
위반 항목이 있으면 수정한 뒤 개발자에게 보고한다.

## 절차

### 1단계: 검사 대상 파일 확인

```bash
git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx)$'
```

결과가 없으면 즉시 종료 (검사 불필요).

### 2단계: 이전 판정 결과 리셋

`.claude/scripts/rules/frontend-design-guide.checklist.js` 파일을 열고 모든 항목의 `status`를 `"PENDING"`, `violations`를 `[]`로 초기화한다.

### 3단계: 각 체크리스트 항목 판정

`.claude/scripts/rules/frontend-design-guide.checklist.js` 파일의 `checklist` 배열의 각 항목을 순회한다.

각 항목에 대해:
1. `.claude/docs/frontend-design-guide.checklist.md` 의 해당 ID(R-01, P-01 등) 규칙 확인
2. 스테이징된 파일에서 해당 규칙에 관련된 패턴이 있는지 검사
3. 결과를 JS 파일의 해당 항목에 직접 기록:
   - `status: "O"` — 통과
   - `status: "X"` — 위반 (`violations` 배열에 `{ file, line, detail, suggestion }` 추가)
   - `status: "N/A"` — 해당 패턴이 파일에 없음

**예시:**
```js
{
  id: "R-01",
  category: "Readability",
  name: "매직 넘버 명명",
  status: "X",
  violations: [
    {
      file: "src/components/Button.tsx",
      line: 42,
      detail: "리터럴 300이 상수로 추출되지 않음",
      suggestion: "const ANIMATION_DELAY_MS = 300; 으로 상수화"
    }
  ]
}
```

### 4단계: 검사 스크립트 실행

```bash
bash .claude/scripts/check-pre-commit.sh
```

스크립트는 내부적으로 `node scripts/rules/frontend-design-guide.checklist.js` 를 호출한다.

- 모든 status가 `O` 또는 `N/A` → exit 0 → 6단계로
- 하나라도 `X` → exit 1 → 수정 후 반복

### 5단계: 위반 항목 수정 및 반복

스크립트가 `exit 1` 로 종료되면:
1. `violations` 의 `file:line` 과 `suggestion` 을 참고해 코드 수정
2. 수정된 파일을 `git add` 로 재스테이징
3. 해당 항목의 `status` 를 `PENDING` 으로 리셋 후 재판정
4. 3단계부터 다시 반복 (최대 10회)

### 6단계: 개발자 보고

모든 검사가 통과하면 **커밋을 실행하지 말고** 개발자에게 다음 형식으로 보고한다:

```
✅ 프론트엔드 디자인 가이드 검사 완료

[수정된 항목]
- src/components/Button.tsx:42
  R-01 매직 넘버 명명: 300 → ANIMATION_DELAY_MS 로 추출
- src/components/Form.tsx:15
  R-07 복잡한 조건 명명: isValidEmail 변수로 분리

[통과] 15개  [해당없음] 2개  [위반] 0개

이제 커밋을 진행하셔도 됩니다.
`git commit -m "..."` 을 실행해 주세요.
```

## 중요 규칙

- **절대 자동으로 `git commit` 을 실행하지 않는다.** 개발자의 최종 확인 후 수동 커밋을 기다린다.
- 체크리스트 JS 파일은 **이미 존재**한다. 새로 생성하지 말고 `status` 와 `violations` 필드만 업데이트한다.
- 판정 불가능한 경우(규칙이 모호하거나 판단이 어려운 경우)에는 `X` 가 아닌 `N/A` 로 표시하고 이유를 주석으로 남긴다.
- 검사는 스테이징된 파일에만 적용한다. 수정되지 않은 기존 파일은 검사하지 않는다.
- 체크리스트(`docs/frontend-design-guide.checklist.md`) 내용이 변경되었는데 JS에 반영되지 않았다면 개발자에게 알린다.

## 파일 구조

```
프로젝트 루트/
└── .claude/
    ├── docs/
    │   └── frontend-design-guide.checklist.md   (체크리스트 원본 - 사람이 관리)
    ├── scripts/
    │   ├── check-pre-commit.sh                   (실행 스크립트)
    │   └── rules/
    │       └── frontend-design-guide.checklist.js (Claude Code가 status 업데이트)
    └── skills/commit-frontend-check/
        └── SKILL.md                              (이 파일)
```
