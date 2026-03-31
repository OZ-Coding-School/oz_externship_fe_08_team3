# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 명령어

- **개발 서버:** `pnpm dev` (Vite, http://localhost:5173)
- **빌드:** `pnpm build` (`tsc -b && vite build`)
- **린트:** `pnpm lint` (ESLint, `*.{ts,tsx}` 대상)
- **포맷팅:** `npx prettier --write <파일>`
- **E2E 테스트:** `npx playwright test` (테스트 디렉토리: `./e2e`)
- **단일 E2E 테스트:** `npx playwright test <테스트파일> --project=chromium`

## Git Hooks (Husky)

- **pre-commit:** `lint-staged` 실행 — staged된 `*.{ts,tsx}`에 ESLint --fix + Prettier, `*.{json,css,md}`에 Prettier 적용
- **commit-msg:** 커밋 메시지 형식 검증 — `<type>: <설명>` 형식 필수. 허용 타입: feat, fix, refactor, style, docs, test, chore, build, ci, perf. 예시: `feat: 로그인 기능 추가 (#12)`

## 아키텍처

- **기술 스택:** React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + TanStack Query + Zustand + MSW
- **React Compiler:** `babel-plugin-react-compiler` + `@rolldown/plugin-babel`로 활성화
- **경로 별칭:** `@/` → `src/` (vite.config.ts, tsconfig.app.json 양쪽에 설정됨)

### 주요 디렉토리

- `src/components/` — 공통 UI 컴포넌트. `src/components/index.ts`에서 barrel export. 각 컴포넌트는 `컴포넌트명/컴포넌트명.tsx` + `index.ts` 구조
- `src/stores/` — Zustand 스토어 (`devtools` 미들웨어 사용, 예: `authStore.ts`)
- `src/providers/` — React Context Provider (`QueryProvider`가 TanStack Query 래핑)
- `src/mocks/` — MSW 핸들러(`handlers.ts`) + 브라우저 워커 설정. DEV 모드에서 자동 활성화
- `src/constants/` — 앱 전역 상수 (예: `routes.ts`의 라우트 경로)
- `src/pages/` — 페이지 단위 컴포넌트

### 디자인 토큰

모든 디자인 토큰(색상, 간격, 타이포그래피, 라운드, 그림자)은 `src/App.css`의 `@theme {}` 블록에 Tailwind v4 CSS 테마 변수로 정의되어 있으며, Figma에서 추출한 값 기반. Tailwind 유틸리티 클래스로 사용 (예: `text-primary`, `bg-gray-100`, `rounded-lg`).

### 상태 관리 패턴

- **서버 상태:** TanStack Query (기본 staleTime: 60초, retry: 1, refetchOnWindowFocus: false)
- **클라이언트 상태:** Zustand 스토어 + devtools 미들웨어
