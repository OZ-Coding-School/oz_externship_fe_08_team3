# Refactor Skills — README

QnA 플랫폼 (React 19.2 + TS 5.9 + Vite 8 + Tailwind v4) 리팩토링용 스킬 묶음.
도메인 단위 일괄 진행 (common → qna → chatbot) + React 19 패턴 최우선 + 안전망 강제.

## 스킬 목록 (호출 순서대로)

| #   | 스킬                         | 역할                                                                          | 우선순위 |
| --- | ---------------------------- | ----------------------------------------------------------------------------- | -------- |
| 1   | `react-19-modernize`         | 컴파일러 전제 메모이제이션 제거, use(), useActionState, Activity, ref-as-prop | ★★★★★    |
| 2   | `tanstack-query-v5-patterns` | queryOptions 팩토리, useSuspenseQuery, 낙관적 업데이트                        | ★★★★★    |
| 3   | `zustand-v5-patterns`        | useShallow 강제, slice 분해, persist 안전화                                   | ★★★★     |
| 4   | `declarative-refactor`       | if-else → 룩업, 명령형 → 선언형, 가드 절                                      | ★★★★     |
| 5   | `hash-structure-optimize`    | Array.find → Map, 권한 체크 → Set, ES2024+                                    | ★★★      |
| 6   | `complexity-measure`         | baseline 측정, 우선순위 큐 생성                                               | ★★★      |
| 7   | `cls-eliminate`              | 이미지/폰트/스켈레톤/포털로 CLS 0                                             | ★★★      |
| 8   | `tailwind-v4-tokenize`       | @theme 토큰, 임의 값 제거, 컨테이너 쿼리                                      | ★★       |
| 9   | `a11y-audit`                 | dialog/popover, aria-live, 키보드 네비, WCAG 2.2                              | ★★       |
| 10  | `refactor-safety-check`      | 타입/린트/E2E/번들/복잡도 회귀 검증 — **항상 마지막**                         | ★★★★★    |

## 디렉토리 구조

```
.claude/skills/
├── react-19-modernize/SKILL.md
├── tanstack-query-v5-patterns/SKILL.md
├── zustand-v5-patterns/SKILL.md
├── declarative-refactor/SKILL.md
├── hash-structure-optimize/SKILL.md
├── complexity-measure/SKILL.md
├── cls-eliminate/SKILL.md
├── tailwind-v4-tokenize/SKILL.md
├── a11y-audit/SKILL.md
└── refactor-safety-check/SKILL.md
```

Claude Code는 `.claude/skills/<name>/SKILL.md` 를 자동으로 인식한다.

## 표준 리팩토링 워크플로우

### Phase 0 — Baseline (1회)

```
1. complexity-measure 실행 → reports/baseline/ 생성
2. a11y-audit 실행 (read-only) → 위반 baseline
3. refactor-safety-check의 Step 7 (bundle) baseline
4. git commit -m "chore: refactor baseline"
```

### Phase 1~N — 도메인 단위 일괄 (common → qna → chatbot)

각 도메인마다:

```
1. complexity-measure로 해당 도메인의 우선순위 파일 식별
2. (필요 시) declarative-refactor + hash-structure-optimize로 복잡도 낮추기
3. react-19-modernize 일괄 적용
   - 메모이제이션 제거
   - forwardRef 제거
   - 폼은 useActionState/useOptimistic
   - 적절한 곳에 use(), Activity
4. tanstack-query-v5-patterns (features 영향 시)
5. zustand-v5-patterns (store 영향 시)
6. tailwind-v4-tokenize로 스타일 정리
7. a11y-audit로 접근성 보강
8. cls-eliminate로 시프트 잡기
9. refactor-safety-check ← 무조건 마지막
10. 통과하면 PR/커밋, baseline 갱신
```

## 도메인별 진입 노트

### common (`src/components/common/*`)

가장 영향 범위 큼. 다른 모든 영역에서 사용. 한 번 깨지면 전체 깨짐.

**핵심 변경:**

- Modal 4종 (`Modal`, `AlertModal`, `ConfirmModal`, `RestoreModal`) → `<dialog>` + `showModal()`. `focus-trap-react` 제거.
- `Dropdown` → popover API
- `Input`, `Checkbox`, `PasswordInput`, `SearchInput` → forwardRef 제거 + useId
- `Toast` → portal + aria-live
- `Avatar`, `UserAvatar` → width/height + SIZE_PX 토큰
- `Spinner`, `LoadingBox` → role="status"
- `Tabs`, `Pagination` → WAI-ARIA 패턴

**예상 효과:** 번들 -15kb (focus-trap-react 제거), CLS 큰 폭 개선, 키보드 네비게이션 정착.

### qna (`src/components/qna/*`, `src/features/qna/*`, `src/pages/qna/*`)

데이터 페칭이 많고 폼이 핵심.

**핵심 변경:**

- `features/qna/*` 11개 폴더 모두 queryOptions 팩토리로 통일
- `QnaListPage`, `QnaDetailPage`, `QnaWritePage`, `QnaEditPage` → useSuspenseQuery + Suspense 경계
- `QuestionForm`, `AnswerForm`, `CommentForm` → useActionState
- `CommentList`, `AnswerSection` → useOptimistic
- `MarkdownEditor` 내부 분리 (commands.ts/utils.ts/hooks 이미 분리되어 있음, 추가 정리)
- `CategoryFilter`, `useCategorySelector` → Set 기반
- `QuestionCard`의 썸네일 → aspect-ratio
- `ANSWER_ALLOWED_ROLES` → Set

### chatbot (`src/components/chatbot/*`, `src/features/chatbot/*`)

가장 까다로움. SSE, 상태 보존, view 전환.

**핵심 변경:**

- `ChatbotWidget` 열림/닫힘 → `<Activity>`로 상태 보존
- view 분기 (`hub`, `cs`, `qna`) → 컴포넌트 맵
- `chatbotStore` slice 패턴으로 분해
- `MessageList` → role="log", aria-live="polite"
- 스트리밍 메시지 → useOptimistic + 부분 업데이트
- `ChatbotFab` → fixed + portal, CLS 영향 없게
- `useSSEAbort` → useSyncExternalStore 검토
- `ChatbotPageContextSync` → context slice 분리 후 단순화

## 사용 예시 (Claude Code에서)

```
사용자: "common 도메인 리팩토링 시작해줘. Modal부터."

Claude (스킬 자동 트리거):
1. complexity-measure로 Modal 관련 파일의 현재 baseline 확인
2. a11y-audit으로 현재 Modal의 a11y 이슈 식별
3. react-19-modernize로 forwardRef 제거, 폼 현대화
4. a11y-audit으로 <dialog> 마이그레이션 진행
5. tailwind-v4-tokenize로 스타일 정리
6. refactor-safety-check 실행 → 보고서 생성
```

각 스킬의 description이 "반드시 사용한다" 톤이라 Claude가 적극 트리거하도록 설계.

## 점진적 향상 (스킬 v2 후보)

처음에는 위 10개로 시작하고, 막상 진행하면서 필요한 게 보이면 추가:

- `msw-handler-modernize` — MSW v2 패턴, response builder
- `error-boundary-strategy` — ErrorBoundary + Suspense 페어링
- `streaming-test-helpers` — SSE Playwright 헬퍼
- `migration-codemod` — jscodeshift 기반 자동 변환 (메모이제이션 제거 등)
- `i18n-prep` — 한국어 하드코딩 추출, 향후 i18n 준비
- `bundle-analyzer` — rollup-visualizer 통합

## 안전 원칙 (항상)

1. **외부 동작 보존**: 리팩토링은 동작을 바꾸지 않음. 새 기능은 별도 PR.
2. **항상 safety-check**: 도메인 일괄 PR이 크니까 검증 없이 머지 금지.
3. **Baseline 비교**: 모든 메트릭은 baseline 대비로 표현.
4. **사용자 결정 유지**: 회귀나 위험 발견 시 자체 판단으로 진행하지 않고 보고.
5. **롤백 가능**: 각 도메인 = 1 PR. 문제 시 revert로 깔끔히.
