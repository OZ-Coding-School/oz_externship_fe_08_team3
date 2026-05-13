---
name: refactor-safety-check
description: 리팩토링 직후 회귀를 잡기 위해 항상 실행한다. 타입 체크(tsc), 린트(eslint --max-warnings 0), 단위 테스트(있다면), Playwright E2E, 번들 사이즈 diff, 복잡도 diff, axe a11y diff, baseline 대비 비교 리포트 생성. 다른 리팩토링 스킬(react-19-modernize, declarative-refactor 등)이 변경을 완료한 직후에 반드시 호출된다. 사용자가 "검증", "회귀 확인", "안전망", "PR 전 체크", "리팩토링 끝났어" 같은 표현을 쓸 때도 사용한다. 절대 생략하지 말 것 — 도메인 단위 일괄 리팩토링에서는 이 스킬이 유일한 안전망이다.
---

# Refactor Safety Check

도메인 단위 일괄 리팩토링은 변경 범위가 커서 검증이 필수. 이 스킬은 항상 리팩토링 작업의 **마지막** 단계로 호출된다.

## 실행 순서 (Mandatory)

각 단계는 앞 단계 통과 시에만 진행. 실패 시 즉시 사용자에게 보고하고 중단.

### Step 1: 타입 체크

```bash
pnpm exec tsc --noEmit
```

새 에러 0건이어야 함. 에러 있으면 즉시 rollback 검토.

### Step 2: 린트

```bash
pnpm exec eslint 'src/**/*.{ts,tsx}' --max-warnings 0
```

`--max-warnings 0` 중요 — warning이 늘어났는지도 잡음. Phase 0 baseline에서 이미 warning이 있다면 해당 수치 기준으로.

### Step 3: 포맷

```bash
pnpm exec prettier --check 'src/**/*.{ts,tsx,css,md}'
```

실패 시 `--write` 후 재커밋.

### Step 4: 단위 테스트 (있는 경우)

현재 폴더 구조에 unit test가 없어 보이지만, 있으면:

```bash
pnpm exec vitest run --coverage
```

### Step 5: Playwright E2E

```bash
pnpm exec playwright test
```

**필수 시나리오 (없으면 작성):**

- 로그인 → QnA 목록 → 질문 작성 → 목록에서 확인
- QnA 상세 → 답변 작성 → 댓글 작성
- QnA 상세 → AI 답변 트리거 → 응답 수신
- 챗봇 FAB 열기 → CS 채팅 → 메시지 송수신 → 닫기 → 다시 열기 (메시지 보존 확인 ← Activity 도입 시 핵심)
- 챗봇 QnA 컨텍스트 동기화 (특정 질문 페이지에서 챗봇 열면 컨텍스트 인식)
- 모달 열기 → ESC → 닫힘 (dialog 마이그레이션 검증)
- 키보드만으로 탭 네비게이션, 페이지네이션

### Step 6: 접근성 회귀

```bash
pnpm exec playwright test tests/a11y.spec.ts
```

`@axe-core/playwright` 위반 수가 baseline 대비 줄거나 같아야 함. 늘면 실패.

### Step 7: 번들 사이즈 diff

```bash
pnpm exec vite build
node scripts/compare-bundle.mjs reports/baseline/bundle.json dist
```

`scripts/compare-bundle.mjs`:

```js
import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const [baselinePath, distDir] = process.argv.slice(2)
const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'))

const current = {}
function walk(dir, prefix = '') {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const rel = prefix ? `${prefix}/${name}` : name
    const stat = statSync(full)
    if (stat.isDirectory()) walk(full, rel)
    else current[rel] = stat.size
  }
}
walk(distDir)

const totalBaseline = Object.values(baseline).reduce((a, b) => a + b, 0)
const totalCurrent = Object.values(current).reduce((a, b) => a + b, 0)
const delta = totalCurrent - totalBaseline
const pct = ((delta / totalBaseline) * 100).toFixed(2)

console.log(
  `Bundle: ${(totalBaseline / 1024).toFixed(1)}KB → ${(totalCurrent / 1024).toFixed(1)}KB (${delta >= 0 ? '+' : ''}${pct}%)`
)

writeFileSync('reports/bundle.json', JSON.stringify(current, null, 2))

if (delta > totalBaseline * 0.05) {
  console.error('❌ Bundle size increased by more than 5%')
  process.exit(1)
}
```

5% 이상 증가하면 실패. React Compiler가 들어가면 보통 줄거나 비슷.

### Step 8: 복잡도 diff

```bash
node scripts/measure-complexity.mjs
node scripts/diff-complexity.mjs reports/baseline reports
```

baseline 대비:

- 평균 cognitive complexity ≤ 같거나 낮음
- useEffect 총합 ≤ 같거나 낮음
- 수동 메모이제이션 총합 ≤ 같거나 낮음 (React 19 modernize 시 크게 줄어야 함)

### Step 9: CLS 측정 (선택)

```bash
pnpm exec lhci autorun --config=lighthouserc.json
```

CLS가 baseline보다 안 늘어났는지.

## 보고서 형식

모든 단계 완료 후 사용자에게:

```
## Refactor Safety Check Report

### 변경 범위
- 도메인: common (Modal, Dropdown, Toast 등 12개 컴포넌트)
- 변경 파일: 34개
- LOC: +120 / -456 (-336 순감)

### 검증 결과
✅ tsc: 통과 (에러 0)
✅ eslint: 통과 (warning 18 → 12, -6)
✅ prettier: 통과
✅ Playwright: 47/47 통과
✅ axe-core: 위반 23 → 11 (-12)
✅ 번들: 1.24MB → 1.18MB (-4.8%)
✅ Cognitive complexity 평균: 12.4 → 8.7 (-30%)
✅ useEffect 총합: 42 → 28 (-14)
✅ 수동 메모이제이션: 58 → 6 (-89%)

### 위험 요소
- 챗봇 SSE 시나리오 1건 flaky (재시도 시 통과) — 별도 이슈
- AlertModal의 ESC 동작이 일부 브라우저에서 즉시 닫히지 않음 (dialog::backdrop transition 영향)
  → 권장: transition-duration 단축 또는 prefers-reduced-motion 분기 점검

### 다음 단계
- common 도메인 리팩토링 PR 머지 후 qna 도메인 시작
- baseline 업데이트: reports/baseline ← reports
```

## 실패 시 행동

- **타입 에러**: 즉시 사용자에게 보고, rollback 옵션 제시
- **테스트 실패**: 어느 시나리오인지 명시. 회귀인지 테스트 코드의 stale인지 판단해서 보고
- **번들 5% 초과**: 어떤 파일/모듈이 커졌는지 보고 (rollup-plugin-visualizer 결과 참조)
- **복잡도 증가**: 어느 파일이 회귀했는지 보고

절대 자체 판단으로 무시하지 않음. 항상 사용자 결정.

## CI 통합

`.github/workflows/refactor-check.yml` 또는 husky pre-push:

```yaml
- run: pnpm exec tsc --noEmit
- run: pnpm exec eslint . --max-warnings 0
- run: pnpm exec prettier --check .
- run: pnpm exec playwright install --with-deps
- run: pnpm exec playwright test
- run: pnpm exec vite build
- run: node scripts/compare-bundle.mjs reports/baseline/bundle.json dist
```

PR마다 자동 실행.

## husky pre-commit (현재 프로젝트에 있음)

`.husky/pre-commit`에 추가:

```sh
pnpm exec lint-staged
pnpm exec tsc --noEmit
```

타입 체크는 pre-commit에서 비싸지만, 도메인 일괄 리팩토링 기간에는 활성화 권장.

## 함께 쓰는 스킬

이 스킬은 항상 마지막. 앞에 호출된 스킬들:

- `react-19-modernize` → safety-check
- `tanstack-query-v5-patterns` → safety-check
- `declarative-refactor` → safety-check
- 등등 모두 → safety-check

## 주의

- baseline은 **Phase 0에서 한 번** 만들고, **각 도메인 PR 머지 후 갱신**한다. PR 중간에는 안 갱신.
- 측정 환경(Node 버전, CPU 코어 수)에 따라 번들 사이즈가 미세 변동할 수 있음 — 5% 임계값은 그래서.
- 챗봇 SSE 테스트는 MSW로 결정론적으로 만들어야 flaky 안 됨.
