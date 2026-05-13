# scripts/

리팩토링 측정 및 비교 스크립트를 관리한다. `pnpm baseline` 등의 npm script로 실행.

## 디렉토리 구조

```
scripts/
├── baseline.mjs            # 전체 baseline 측정 (복잡도 + ESLint + LOC + 순환 의존성 + a11y + 빌드)
├── measure-complexity.mjs  # ts-morph 기반 복잡도 측정 (useState/useEffect/memo/forwardRef 카운트)
├── compare-baseline.mjs    # baseline 대비 현재 측정값 diff
├── compare-bundle.mjs      # 번들 사이즈 baseline 대비 diff
└── a11y-grep.mjs           # 정적 접근성 패턴 검사 (forwardRef, prefers-reduced-motion 등)
```

## npm scripts

| 명령어                 | 설명                                  |
| ---------------------- | ------------------------------------- |
| `pnpm baseline`        | 전체 측정 + 첫 실행이면 baseline 저장 |
| `pnpm baseline:update` | 현재를 baseline으로 덮어쓰기          |
| `pnpm baseline:check`  | 회귀 시 exit 1 (CI용)                 |
| `pnpm baseline:quick`  | 번들 측정 skip (빠른 확인)            |
| `pnpm measure`         | 복잡도만 측정                         |
| `pnpm check:types`     | `tsc --noEmit`                        |
| `pnpm check:lint`      | ESLint max-warnings 0                 |
| `pnpm check:a11y`      | Playwright a11y 테스트                |

## 측정 항목

### measure-complexity.mjs

ts-morph로 모든 `.ts/.tsx` 파일을 분석:

- **LOC** — 파일 줄 수
- **useState/useEffect 수** — 상태 복잡도 지표
- **useMemo/useCallback/React.memo 수** — 수동 메모이제이션 (React Compiler 환경에서는 0이 목표)
- **forwardRef 수** — React 19에서는 0이 목표
- **점수** — 가중 합산 (LOC×0.1 + useState×3 + useEffect×5 + memo×2 + forwardRef×4)
- **도메인별 집계** — common, qna, chatbot, shared, other

생성 파일: `reports/complexity.{json,md}`, `reports/priority.md`

### baseline.mjs

8단계 순차 실행:

1. 복잡도 측정 (ts-morph)
2. ESLint 메트릭 수집 (JSON 출력)
3. LOC 측정 (scc 또는 wc 폴백)
4. 순환 의존성 탐지 (madge)
5. 접근성 패턴 검사 (a11y-grep)
6. Vite 빌드
7. 번들 사이즈 비교
8. baseline 대비 복잡도 비교

## 생성되는 리포트

```
reports/
├── baseline/              # baseline 저장소 (git 커밋 대상)
│   ├── complexity.json
│   └── bundle.json
├── complexity.{json,md}   # 현재 복잡도 측정
├── priority.md            # 도메인별 리팩토링 우선순위 큐
├── diff.md                # baseline 대비 diff
├── eslint.json            # ESLint 경고/에러
├── a11y-manual.{json,md}  # 접근성 패턴 검사 결과
├── circular.json          # 순환 의존성
├── bundle.json            # 번들 사이즈
└── run-summary.json       # 실행 결과 요약
```

## .gitignore 규칙

```
reports/*
!reports/baseline/
!reports/priority.md
!reports/complexity.md
```

baseline과 우선순위만 커밋, 나머지는 로컬 전용.
