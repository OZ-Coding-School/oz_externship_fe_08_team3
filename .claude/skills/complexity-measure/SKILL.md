---
name: complexity-measure
description: 프로젝트의 컴포넌트와 함수에 대해 cyclomatic complexity, cognitive complexity, LOC, useState/useEffect 개수, props 개수를 측정해서 리팩토링 우선순위 큐를 생성한다. 도구로 eslint(complexity, sonarjs/cognitive-complexity), tsc --listFiles, scc, 커스텀 ts-morph 스크립트 사용. "복잡도 측정", "baseline", "어디부터 리팩토링", "우선순위", "메트릭", "어느 파일이 복잡" 같은 요청이 나올 때 반드시 사용한다. 리팩토링 시작 전(Phase 0)과 후(검증)에 모두 실행한다.
---

# Complexity Measure

리팩토링 우선순위를 정량적으로 결정하기 위한 측정 절차.

## 측정 항목

| 메트릭                  | 도구                            | 임계값 (경고) | 임계값 (위험) |
| ----------------------- | ------------------------------- | ------------- | ------------- |
| Cyclomatic complexity   | ESLint `complexity`             | 10            | 15            |
| Cognitive complexity    | `eslint-plugin-sonarjs`         | 15            | 25            |
| 파일 LOC                | `scc` 또는 `wc -l`              | 200           | 400           |
| 함수 LOC                | ESLint `max-lines-per-function` | 50            | 100           |
| useState 개수/컴포넌트  | 커스텀 ts-morph                 | 5             | 8             |
| useEffect 개수/컴포넌트 | 커스텀 ts-morph                 | 2             | 4             |
| props 개수              | 커스텀 ts-morph                 | 7             | 12            |
| import 깊이             | madge                           | 8             | 12            |

## 1단계: 도구 설치

```bash
pnpm add -D eslint-plugin-sonarjs scc madge ts-morph
# scc는 바이너리 — 또는 brew install scc
```

`eslint.config.js`에 룰 추가:

```js
import sonarjs from 'eslint-plugin-sonarjs'

export default [
  // ...
  {
    plugins: { sonarjs },
    rules: {
      complexity: ['warn', 10],
      'max-lines-per-function': [
        'warn',
        { max: 50, skipBlankLines: true, skipComments: true },
      ],
      'max-depth': ['warn', 3],
      'max-nested-callbacks': ['warn', 3],
      'sonarjs/cognitive-complexity': ['warn', 15],
      'sonarjs/no-duplicate-string': ['warn', { threshold: 4 }],
      'sonarjs/no-identical-functions': 'warn',
    },
  },
]
```

## 2단계: 리포트 생성

`scripts/measure-complexity.mjs`:

```js
import { Project } from 'ts-morph'
import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'

const project = new Project({ tsConfigFilePath: 'tsconfig.json' })
const files = project.getSourceFiles('src/**/*.{ts,tsx}')

const results = files
  .map((file) => {
    const path = file.getFilePath()
    const loc = file.getEndLineNumber()
    const components = file
      .getFunctions()
      .concat(
        file
          .getVariableDeclarations()
          .filter((v) => v.getInitializer()?.getKindName().includes('Function'))
      )

    const hooks = file
      .getDescendantsOfKind(/* CallExpression */ 213)
      .filter((c) => {
        const expr = c.getExpression().getText()
        return /^use[A-Z]/.test(expr)
      })

    const states = hooks.filter(
      (h) => h.getExpression().getText() === 'useState'
    ).length
    const effects = hooks.filter(
      (h) => h.getExpression().getText() === 'useEffect'
    ).length
    const memos = hooks.filter((h) =>
      ['useMemo', 'useCallback'].includes(h.getExpression().getText())
    ).length

    return {
      path: path.replace(process.cwd() + '/', ''),
      loc,
      states,
      effects,
      memos,
      score: loc * 0.1 + states * 3 + effects * 5 + memos * 2,
    }
  })
  .sort((a, b) => b.score - a.score)

writeFileSync('reports/complexity.json', JSON.stringify(results, null, 2))

// 마크다운 요약
const top20 = results.slice(0, 20)
const md = [
  '# Complexity Report',
  '',
  '| 파일 | LOC | useState | useEffect | useMemo/Cb | 점수 |',
  '|------|-----|----------|-----------|------------|------|',
  ...top20.map(
    (r) =>
      `| ${r.path} | ${r.loc} | ${r.states} | ${r.effects} | ${r.memos} | ${r.score.toFixed(1)} |`
  ),
].join('\n')
writeFileSync('reports/complexity.md', md)

console.log(`Top 20:\n${md}`)
```

ESLint 메트릭은 별도로:

```bash
pnpm exec eslint 'src/**/*.{ts,tsx}' --format json > reports/eslint.json
```

LOC와 언어 통계:

```bash
scc --by-file -f json src > reports/scc.json
```

순환 의존성:

```bash
pnpm exec madge --circular --extensions ts,tsx src > reports/circular.txt
pnpm exec madge --orphans --extensions ts,tsx src > reports/orphans.txt
```

## 3단계: 우선순위 큐

`reports/priority.md` 자동 생성. 각 파일에 대해:

```
점수 = (cyclomatic × 2) + (cognitive × 1.5) + (LOC ÷ 50) + (useState × 3) + (useEffect × 5) + (memos × 2)
```

> useEffect 가중치가 높은 이유: useEffect 1개 = 거의 항상 안티 패턴이거나 리팩토링 기회

상위 20개를 **Phase 3 도메인별 리팩토링의 시작점**으로 사용.

## 4단계: Baseline 저장

리팩토링 시작 전에 `reports/baseline/` 에 모든 리포트 복사.

```bash
mkdir -p reports/baseline
cp reports/*.{json,md,txt} reports/baseline/
git add reports/baseline && git commit -m "chore: complexity baseline 2026-05-12"
```

## 5단계: 진척도 추적

매 PR 후:

```bash
pnpm run measure
node scripts/diff-complexity.mjs reports/baseline reports
```

`diff-complexity.mjs`는 baseline 대비 각 파일의 변화량을 출력. 증가하면 경고.

## 도메인별 예상 핫스팟

폴더 구조 기반 추측:

- `components/qna/MarkdownEditor/MarkdownEditor.tsx` — commands, history, image upload 합쳐서 LOC 큼
- `components/qna/QuestionDetail/QuestionDetail.tsx` — 답변/댓글/AI 통합
- `components/chatbot/ChatbotWidget/ChatbotWidget.tsx` — view 분기 + 세션 관리
- `features/chatbot/completions/handler.ts` — SSE 파싱
- `features/chatbot/cs/hooks/useCsChat.ts`, `qna/hooks/useQnaChat.ts` — 메시지 상태 관리

이 파일들을 우선 측정해서 baseline 만들 것.

## 추가 메트릭 (선택)

- **Type coverage**: `npx type-coverage --detail` — `any` 비율
- **Bundle 크기**: `pnpm exec vite build && du -sh dist/` 또는 rollup-plugin-visualizer
- **Lighthouse 점수**: CI에서 lhci로
- **Render 횟수**: React DevTools Profiler — 수동 측정

## 출력 포맷 (사용자에게 보고할 때)

```
## Complexity Report — 2026-05-12

### Phase 0 Baseline
- 총 파일: 189개
- 평균 LOC: 87
- useEffect 총합: 42 (목표: <20)
- 수동 메모이제이션 총합: 58 (목표: 5 미만, 컴파일러 자동화)
- ESLint 경고: 23개 (sonarjs/cognitive-complexity)

### Top 10 리팩토링 우선순위
1. components/qna/MarkdownEditor/MarkdownEditor.tsx — LOC 312, useEffect 4, score 41
2. ...
```

사용자에게 항상 상대 수치(baseline 대비) 함께 제공.
