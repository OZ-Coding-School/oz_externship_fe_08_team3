# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 명령어

- **개발 서버:** `pnpm dev` (Vite, http://localhost:5173)
- **빌드:** `pnpm build` (`tsc -b && vite build`)
- **린트:** `pnpm lint` (ESLint, `*.{ts,tsx}` 대상)
- **포맷팅:** `npx prettier --write <파일>`
- **E2E 테스트:** `npx playwright test --project=chromium` (기능 테스트, `*.visual.*` 제외)
- **단일 E2E 테스트:** `npx playwright test <테스트파일> --project=chromium`
- **비주얼 회귀 테스트:** `pnpm test:visual` (`*.visual.spec.ts` 대상, 1920×1080 뷰포트)
- **Figma 베이스라인 갱신:** `pnpm test:visual:update-baseline` (Figma에서 스크린샷 다운로드)

## Git Hooks (Husky)

- **pre-commit:** `lint-staged` 실행 — staged된 `*.{ts,tsx}`에 ESLint --fix + Prettier, `*.{json,css,md}`에 Prettier 적용
- **commit-msg:** 커밋 메시지 형식 검증 — `<type>: <설명>` 형식 필수. 허용 타입: feat, fix, refactor, style, docs, test, chore, build, ci, perf. 예시: `feat: 로그인 기능 추가 (#12)`
- **pre-push:** `pnpm build` 실행 — 빌드 실패 시 push 차단

## 아키텍처

- **기술 스택:** React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + TanStack Query + Zustand + MSW
- **React Compiler:** `babel-plugin-react-compiler` + `@rolldown/plugin-babel`로 활성화
- **경로 별칭:** `@/` → `src/` (vite.config.ts, tsconfig.app.json 양쪽에 설정됨)
- **API 클라이언트:** `src/api/instance.ts` — axios 인스턴스. JWT를 localStorage에 저장하고 요청 헤더에 자동 주입. 401 시 `/api/v1/accounts/me/refresh`로 토큰 갱신 후 재시도, 갱신 실패 시 로그인 페이지로 리다이렉트
- **MSW:** DEV 모드에서 `main.tsx`의 `enableMocking()`이 서비스 워커를 활성화. `onUnhandledRequest: 'bypass'` 설정

### 라우팅 구조

`src/providers/RouterProvider.tsx`에서 전체 라우트 정의. 두 가지 레이아웃 사용:

- `AuthLayout` — 헤더만 (로그인, 회원가입)
- `DefaultLayout` — 헤더 + 푸터 (나머지 전체)

### Feature 모듈 패턴

`src/features/{도메인}/{액션}/` 구조. 각 모듈은 4개 파일로 구성:

- `types.ts` — 요청/응답 타입 정의
- `queries.ts` — TanStack Query 훅 (useQuery, useMutation)
- `handler.ts` — MSW 핸들러 (해당 API 모킹)
- `index.ts` — barrel export

도메인 예시: `accounts`, `posts`, `qna`, `course`, `chatbot`, `exams`

### Playwright 테스트 구조

`playwright.config.ts`에 두 개의 프로젝트가 정의됨:

- **chromium** — 기능 E2E 테스트. `e2e/` 하위의 `*.spec.ts` (`*.visual.*` 제외)
- **visual** — 비주얼 회귀 테스트. `e2e/visual/*.visual.spec.ts`. Figma 스크린샷을 베이스라인으로 사용하며 `e2e/__screenshots__/`에 저장. `maxDiffPixelRatio: 0.1`

## 참조 문서

| 문서                                   | 용도                                  |
| -------------------------------------- | ------------------------------------- |
| `docs/convention/CONVENTION.md`        | 코딩 컨벤션 (존재 시 반드시 준수)     |
| `docs/convention/COMPONENTS.md`        | 컴포넌트 컨벤션 (존재 시 반드시 준수) |
| `docs/convention/DESIGN_TOKENS.md`     | 디자인 시스템 참고                    |
| `docs/convention/STATE_MANAGEMENT.md`  | 상태관리 참고                         |
| `docs/convention/PROJECT_STRUCTURE.md` | 프로젝트 구조 참고                    |
| `docs/convention/FEATURES.md`          | 기능 개발 참고                        |
| `docs/convention/PAGES.md`             | 페이지 구현 참고                      |
| `docs/convention/ROUTING.md`           | 라우트, 페이지별 API, 컴포넌트명      |
| `.github/PULL_REQUEST_TEMPLATE.md`     | PR 작성 시 반드시 사용                |

### 주요 디렉토리

**참고 문서 : `docs/convention/PROJECT_STRUCTURE.md`**

- `src/components/` — 공통 UI 컴포넌트. `src/components/index.ts`에서 barrel export. 각 컴포넌트는 `컴포넌트명/컴포넌트명.tsx` + `index.ts` 구조
- `src/features/` — 도메인별 API 연동 모듈 (types, queries, handler, index)
- `src/stores/` — Zustand 스토어 (`devtools` 미들웨어 사용, 예: `authStore.ts`)
- `src/providers/` — `QueryProvider` (TanStack Query) + `RouterProvider` (라우트 정의)
- `src/mocks/` — MSW 브라우저 워커 설정. 실제 핸들러는 `src/features/*/handler.ts`에 위치
- `src/constants/` — 앱 전역 상수 (예: `routes.ts`의 라우트 경로)
- `src/pages/` — 페이지 단위 컴포넌트
- `e2e/` — Playwright 테스트. `e2e/visual/`은 비주얼 회귀, 나머지는 기능 E2E

### 디자인 토큰

**참고 문서 : `docs/convention/DESIGN_TOKENS.md`**

모든 디자인 토큰(색상, 간격, 타이포그래피, 라운드, 그림자)은 `src/App.css`의 `@theme {}` 블록에 Tailwind v4 CSS 테마 변수로 정의되어 있으며, Figma에서 추출한 값 기반. Tailwind 유틸리티 클래스로 사용 (예: `text-primary`, `bg-gray-100`, `rounded-lg`).

### 상태 관리 패턴

**참고 문서 : `docs/convention/STATE_MANAGEMENT.md`**

- **서버 상태:** TanStack Query (기본 staleTime: 60초, retry: 1, refetchOnWindowFocus: false)
- **클라이언트 상태:** Zustand 스토어 + devtools 미들웨어

## 스킬

- `/work-log` — 작업 시작 전 계획서를 생성하고, 각 단계 완료 시 결과 파일을 기록하는 워크플로우. `docs/work-log/`에 저장됨.
- `git commit` 실행 전 반드시 `.claude/skills/commit-frontend-check/SKILL.md` 스킬을 따른다. 스테이징된 `.ts`/`.tsx` 파일이 `.claude/docs/frontend-design-guide.checklist.md` 의 모든 항목을 통과해야 커밋 가능하다.

## 커밋 규칙

- 커밋 전 반드시 `.claude/skills/commit-frontend-check/SKILL.md` 스킬을 따른다.
