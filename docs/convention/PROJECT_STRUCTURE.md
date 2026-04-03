# 프로젝트 폴더 구조

## 루트 디렉토리

```
externship-ai-workflow/
├── .claude/                    # Claude Code 설정
│   ├── agents/                 # 서브에이전트 정의
│   │   ├── code-reviewer.md    # 코드 리뷰 에이전트 (Phase 1: 컨벤션 검증, Phase 2: 심층 리뷰)
│   │   └── dev-agent.md        # 기능 구현 에이전트 (Figma 기반 UI 구현)
│   └── skills/                 # 스킬 정의
│       ├── api-gen/            # Swagger 기반 API 코드 생성 (types, handler, queries)
│       ├── branch-reset/       # 브랜치 정리 → dev 최신화 → 새 feature 브랜치 생성
│       ├── git-sync/           # 이슈 생성 → commit → push 자동화
│       └── msw-maker/          # API 정보 입력 → MSW 핸들러 자동 생성
│
├── .github/                    # GitHub 설정
│   ├── ISSUE_TEMPLATE/         # 이슈 템플릿 (bug_report, feature_request)
│   ├── pull_request_template.md
│   └── workflows/
│       └── discord-notify.yml  # Push/PR/Issue 이벤트 Discord 알림
│
├── .husky/                     # Git Hooks (pre-commit, commit-msg)
├── docs/                       # 프로젝트 문서
├── e2e/                        # Playwright E2E 테스트
├── public/                     # 정적 파일
│
├── src/                        # 소스 코드 (아래 상세)
├── swagger.yaml                # OpenAPI 3.0 스펙 (백엔드 API 정의)
│
├── CLAUDE.md                   # Claude Code 프로젝트 지침
├── index.html                  # Vite 진입점
├── package.json                # 의존성 및 스크립트
├── vite.config.ts              # Vite 빌드 설정
├── eslint.config.js            # ESLint 설정
├── tsconfig.json               # TypeScript 설정 (루트)
├── tsconfig.app.json           # TypeScript 설정 (앱)
├── tsconfig.node.json          # TypeScript 설정 (Node)
├── playwright.config.ts        # Playwright 설정
└── .prettierrc                 # Prettier 설정
```

## src/ 디렉토리

```
src/
├── api/                        # API 관련
│   └── instance.ts             # axios 인스턴스 (baseURL, 인터셉터)
│
├── assets/                     # 이미지, 폰트 등 정적 에셋
│   ├── logo.png
│   └── hero.png
│
├── components/                 # 공통 UI 컴포넌트
│   ├── Avatar/
│   ├── Badge/
│   ├── Button/
│   ├── Card/
│   ├── Checkbox/
│   ├── Dropdown/
│   ├── Footer/
│   ├── Header/
│   ├── Input/
│   ├── Modal/                  # AlertModal, ConfirmModal, RestoreModal
│   ├── PasswordInput/
│   ├── SearchInput/
│   ├── SocialLoginButton/
│   ├── Spinner/
│   ├── SuccessCard/
│   ├── Tabs/
│   ├── Toast/
│   └── index.ts                # barrel export
│
├── constants/                  # 앱 전역 상수
│   └── routes.ts               # 라우트 경로 정의
│
├── features/                   # 도메인별 기능 모듈 (api-gen 스킬로 생성)
│   └── {domain}/{action}/      # 예: accounts/login/
│       ├── types.ts            # TypeScript interface (요청/응답)
│       ├── handler.ts          # MSW 핸들러
│       ├── queries.ts          # React Query 훅 (query factory)
│       └── index.ts            # barrel export
│
├── mocks/                      # MSW (Mock Service Worker)
│   ├── browser.ts              # 브라우저 워커 설정
│   └── handlers.ts             # 핸들러 등록 (features에서 import)
│
├── pages/                      # 페이지 컴포넌트
│   └── ComponentShowcase.tsx   # 컴포넌트 데모 페이지
│
├── providers/                  # React Context Provider
│   └── QueryProvider.tsx       # TanStack Query 설정
│
├── stores/                     # Zustand 상태 관리
│   └── authStore.ts            # 인증 상태 (로그인/로그아웃)
│
├── App.tsx                     # 루트 컴포넌트
├── App.css                     # @theme 디자인 토큰 정의
└── main.tsx                    # 앱 진입점 (BrowserRouter, QueryProvider, MSW)
```

## 컴포넌트 구조 규칙

각 컴포넌트는 아래 구조를 따릅니다:

```
ComponentName/
├── ComponentName.tsx           # 컴포넌트 구현 (named export)
├── icons.tsx                   # 컴포넌트 전용 아이콘 (있는 경우)
└── index.ts                    # barrel export
```

- **named export만 사용** (default export 사용 안 함)
- `index.ts`에서 컴포넌트와 타입을 re-export
- `src/components/index.ts`에서 전체 barrel export

## features 구조 규칙

`/api-gen` 스킬로 생성되는 도메인별 모듈입니다:

```
features/{domain}/{action}/
├── types.ts                    # swagger.yaml 기반 interface
├── handler.ts                  # MSW 핸들러 (성공 응답 + 더미 데이터)
├── queries.ts                  # useSuspenseQuery (GET) 또는 useMutation (POST/PUT/DELETE)
└── index.ts                    # barrel export
```

- **GET 요청**: `queryOptions` 기반 query factory 패턴
- **POST/PUT/PATCH/DELETE**: `useMutation`
- **API 호출**: `@/api/instance`의 axios 인스턴스 사용
- **경로 규칙**: `/api/v1/accounts/login` → `features/accounts/login/`

## 상태 관리

| 구분            | 도구               | 용도                    |
| --------------- | ------------------ | ----------------------- |
| 서버 상태       | TanStack Query     | API 데이터 캐싱, 동기화 |
| 클라이언트 상태 | Zustand + devtools | 인증, UI 상태 등        |

## 디자인 토큰

`src/App.css`의 `@theme {}` 블록에 정의:

- 색상 (primary, gray, error, info 등)
- 타이포그래피 (heading, body, caption)
- 간격 (spacing 1~20)
- 라운드 (rounded sm, md, lg, full)
- 그림자 (shadow sm, md, lg)

Tailwind CSS v4 유틸리티 클래스로 사용합니다.
