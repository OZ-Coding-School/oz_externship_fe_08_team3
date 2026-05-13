# Refactor Toolkit — 서브에이전트 + Baseline

QnA 플랫폼 (React 19.2 / TS 5.9 / Vite 8 / Tailwind v4) 리팩토링을 위한 Claude Code 워크플로우.

스킬은 [`refactor-skills/`](../refactor-skills/) (이전에 만든 10개)에서, 에이전트와 측정 도구는 여기서 제공합니다.

## 구성

```
refactor-toolkit/
├── .claude/agents/                  # 6개 서브에이전트
│   ├── complexity-analyst.md
│   ├── a11y-auditor.md
│   ├── common-component-refactorer.md
│   ├── qna-domain-refactorer.md
│   ├── chatbot-refactorer.md
│   └── api-layer-refactorer.md
├── scripts/                         # 측정 스크립트
│   ├── baseline.mjs                 # 마스터 — 모든 측정 한 번에
│   ├── measure-complexity.mjs       # ts-morph 기반 복잡도
│   ├── compare-baseline.mjs         # baseline vs current diff
│   ├── compare-bundle.mjs           # 번들 사이즈 회귀
│   └── a11y-grep.mjs                # 정적 a11y 안티패턴
├── tests/a11y.spec.ts               # Playwright axe 템플릿
├── eslint.config.refactor-patch.js  # ESLint 룰 추가
├── package.json.patch.md            # 의존성 + npm scripts
└── reports/baseline/                # baseline 저장 (gitignored 권장 안 함 — 커밋!)
```

## 설치 (5분)

### 1. 파일 복사

이 폴더의 내용을 프로젝트 루트로 복사:

```bash
# 에이전트는 .claude/agents/로
cp -r refactor-toolkit/.claude/agents/* .claude/agents/

# 스크립트는 scripts/로
cp -r refactor-toolkit/scripts/* scripts/

# Playwright 테스트
cp refactor-toolkit/tests/a11y.spec.ts tests/

# 스킬 (앞서 만든)
cp -r refactor-skills/* .claude/skills/
```

### 2. 의존성 설치

```bash
pnpm add -D \
  ts-morph \
  eslint-plugin-sonarjs \
  eslint-plugin-jsx-a11y \
  eslint-plugin-react-compiler \
  @axe-core/playwright \
  madge
```

### 3. ESLint 설정 병합

`eslint.config.js` 에 `eslint.config.refactor-patch.js` 의 내용을 spread:

```js
import refactorPatch from './eslint.config.refactor-patch.js'

export default [
  // ... 기존 설정
  ...refactorPatch,
]
```

### 4. package.json scripts 병합

`package.json.patch.md` 의 `"scripts"` 섹션을 기존 scripts에 병합.

### 5. (선택) scc 설치

```bash
brew install scc  # macOS — 없어도 wc 폴백 동작
```

## 첫 실행 — Phase 0 Baseline

```bash
pnpm baseline
```

다음 리포트가 생성됩니다:

| 파일                            | 내용                                     |
| ------------------------------- | ---------------------------------------- |
| `reports/complexity.json`       | 전체 파일별 메트릭 raw                   |
| `reports/complexity.md`         | 마크다운 요약                            |
| `reports/priority.md`           | 도메인별 우선순위 큐 (← 여기부터 보세요) |
| `reports/a11y-manual.{json,md}` | 정적 a11y 안티패턴                       |
| `reports/eslint.json`           | ESLint 결과                              |
| `reports/scc.json`              | LOC by file                              |
| `reports/circular.json`         | 순환 의존성                              |
| `reports/bundle.json`           | 번들 사이즈                              |
| `reports/baseline/`             | 위 결과의 baseline 스냅샷                |

**핵심: `reports/priority.md` 가 리팩토링 시작점입니다.**

baseline은 한 번만 만들고 커밋:

```bash
git add reports/baseline reports/priority.md reports/complexity.md
git commit -m "chore: Phase 0 baseline (2026-05-12)"
```

## 도메인별 리팩토링 워크플로우

### 예시: common 도메인 시작

Claude Code에서:

```
Use the complexity-analyst subagent to review the common domain hotspots
```

→ complexity-analyst가 baseline을 읽고 common 도메인 우선순위 보고

```
Use the a11y-auditor subagent to audit common components
```

→ a11y 위반 baseline 확보

```
Use the common-component-refactorer subagent to refactor Modal first
```

→ common-component-refactorer가 Modal/AlertModal/ConfirmModal/RestoreModal를 `<dialog>`로 마이그레이션. 내부적으로 `a11y-audit`, `react-19-modernize`, `tailwind-v4-tokenize` 스킬 사용. 마지막에 `refactor-safety-check` 자동 호출.

```bash
pnpm baseline  # diff 확인
cat reports/diff.md
```

만족스러우면:

```bash
git add -A
git commit -m "refactor(common): Modal series → <dialog> + WAI-ARIA"
pnpm baseline:update  # 새 baseline으로 갱신
```

### 도메인 진행 순서

권장 순서: **common → api → qna → chatbot**

이유:

1. **common 먼저**: 모든 도메인이 의존하므로 먼저 안정화
2. **api 다음**: handler.ts 정리는 features 리팩토링의 전제
3. **qna**: 데이터 페칭 + 폼 모더나이즈로 큰 효과
4. **chatbot 마지막**: 가장 까다로움 (SSE, Activity, 상태 보존)

각 도메인마다:

1. `complexity-analyst` 호출 → 우선순위 확인
2. `a11y-auditor` 호출 → 위반 baseline
3. 해당 도메인의 refactorer 호출 → 작업
4. `pnpm baseline` → diff 확인
5. 만족스러우면 PR/머지 → `pnpm baseline:update`

## 에이전트 트리거 방법

### 1. 명시적 @ 멘션

```
@agent-common-component-refactorer refactor the Modal components
```

### 2. 자연어 (description으로 자동 위임)

```
Refactor src/components/common/Modal — make it accessible and use React 19 patterns
```

→ Claude가 description을 보고 common-component-refactorer로 위임

### 3. 모든 에이전트 목록 보기

```
/agents
```

## 에이전트 책임 매트릭스

| 에이전트                      | 모드      | 편집 권한                                                 | 주요 스킬                                                           |
| ----------------------------- | --------- | --------------------------------------------------------- | ------------------------------------------------------------------- |
| `complexity-analyst`          | read-only | ×                                                         | complexity-measure                                                  |
| `a11y-auditor`                | read-only | ×                                                         | a11y-audit                                                          |
| `common-component-refactorer` | write     | components/common, layout                                 | react-19-modernize, a11y-audit, tailwind-v4-tokenize, cls-eliminate |
| `qna-domain-refactorer`       | write     | components/qna, features/qna, pages/qna                   | tanstack-query-v5-patterns, react-19-modernize                      |
| `chatbot-refactorer`          | write     | components/chatbot, features/chatbot, stores/chatbotStore | zustand-v5-patterns, react-19-modernize                             |
| `api-layer-refactorer`        | write     | api, mocks, utils, features/\*/handler.ts                 | declarative-refactor, hash-structure-optimize                       |

각 write 에이전트는 마지막에 자동으로 `refactor-safety-check` 스킬 실행.

## CI 통합

`.github/workflows/refactor-guard.yml`:

```yaml
name: Refactor Guard
on: pull_request
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install --with-deps
      - run: pnpm baseline:check # 회귀 시 fail
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: reports
          path: reports/
```

## FAQ

**Q. `pnpm baseline` 가 너무 오래 걸려요.**
A. `pnpm baseline:quick` 사용 (vite build skip). diff만 확인할 때 충분.

**Q. baseline을 언제 갱신해야 하나요?**
A. PR 머지 후 메인 브랜치에서. 절대 PR 중간에는 갱신 X.

**Q. 에이전트가 자기 영역 밖을 건드리려고 해요.**
A. 각 에이전트 정의에 boundaries 명시되어 있어서 거부합니다. 거부 시 "이 변경은 X 에이전트의 일"이라고 보고. 그 에이전트를 따로 호출하세요.

**Q. complexity-analyst와 a11y-auditor는 왜 read-only?**
A. 측정과 수정이 같은 에이전트에 있으면 "측정 결과를 맞추기 위해 코드를 바꾸는" 모순이 생깁니다. 분리해서 진실 보존.

**Q. React Compiler 플러그인이 없는데도 메모이제이션 제거해도 되나요?**
A. 안 됩니다. `react-19-modernize` 스킬 첫 단계가 컴파일러 활성화 확인. 없으면 거부합니다.

**Q. 한 도메인 끝나기 전에 다른 도메인 손대도 되나요?**
A. 권장 안 함. 도메인 단위 PR이 회귀 추적의 단위입니다. 여러 도메인 섞이면 무엇 때문에 깨졌는지 추적 어려워짐.

## 트러블슈팅

- **`ts-morph` 메모리 부족**: `NODE_OPTIONS=--max-old-space-size=4096 pnpm measure`
- **Playwright a11y가 느림**: `tests/a11y.spec.ts`의 `PAGES`를 줄여서 핵심만
- **circular 의존성 감지 못함**: madge가 path alias를 못 풀 수 있음. `madge --webpack-config` 또는 `--ts-config` 사용
- **eslint-plugin-react-compiler 룰이 너무 많이 잡힘**: 마이그레이션 중에는 `warn`으로, 완료 후 `error`로
