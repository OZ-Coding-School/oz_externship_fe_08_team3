# 오즈코딩스쿨 - 익스턴십 AI 워크플로우

> 오즈코딩스쿨 수강생을 위한 AI 기반 학습 / 질의응답 플랫폼

---

## 📌 프로젝트 소개

오즈코딩스쿨 수강생이 학습 중 마주치는 질문을 동료·튜터와 함께 해결하고,
AI 챗봇의 도움을 받아 빠르게 답을 찾을 수 있도록 설계된 **질의응답(QnA) + AI 챗봇** 통합 플랫폼입니다.

- 질문 등록 → 동료/튜터 답변 → 채택까지의 전 과정을 지원합니다.
- AI 답변/AI 챗봇을 결합해 단순 반복 질문에 대한 응답 속도를 단축합니다.
- 오즈코딩스쿨 메인 서비스(`my.ozcodingschool.site`)와 연동되어 동작합니다.

---

## 🔗 배포 링크

| 구분          | URL                                                                        |
| ------------- | -------------------------------------------------------------------------- |
| 서비스 진입점 | [https://qna.ozcodingschool.site/qna](https://qna.ozcodingschool.site/qna) |
| 메인 도메인   | [https://my.ozcodingschool.site](https://my.ozcodingschool.site)           |

---

## 🎤 프로젝트 발표 영상 & 발표 문서

| 자료      | 링크                       |
| --------- | -------------------------- |
| 발표 영상 | _TBD_ (추후 업데이트 예정) |
| 발표 문서 | _TBD_ (추후 업데이트 예정) |

---

## 🧩 서비스 소개

### 1. 질의응답 (QnA)

- 질문 등록 / 수정 / 삭제
- 답변 등록 / 수정 / 채택
- 카테고리(대분류·중분류) 필터, 검색, 정렬
- 답변 대기중 / 답변 완료 탭 분리
- 비회원도 질문 조회 가능, 답변·댓글은 로그인 후 가능
- **AI 답변** 요청 기능 (AI에게 즉시 답변 받기)

### 2. AI 챗봇

- **QnA 챗봇** — 질의응답 화면에서 보조 질의 가능
- **CS 챗봇** — 오즈코딩스쿨 관련 일반 질의응답
- **챗봇 허브** — 이전 대화 세션 관리, 새 채팅 시작, 마지막 메시지 미리보기 지원
- 플로팅 위젯(FAB)으로 어디서나 호출 가능
- SSE 기반 스트리밍 응답

---

## 🛠 사용 스택

### Frontend Core

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)

### State / Data

![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?logo=reactquery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5.0-000000?logo=react&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.13-5A29E4?logo=axios&logoColor=white)
![MSW](https://img.shields.io/badge/MSW-2.12-FF6A33?logo=mockserviceworker&logoColor=white)

### Tooling / Quality

![ESLint](https://img.shields.io/badge/ESLint-9-4B32C3?logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-3-F7B93E?logo=prettier&logoColor=black)
![Husky](https://img.shields.io/badge/Husky-9-2A8E82?logo=git&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-1.58-2EAD33?logo=playwright&logoColor=white)

### Collaboration

![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white)
![Discord](https://img.shields.io/badge/Discord-5865F2?logo=discord&logoColor=white)
![Figma](https://img.shields.io/badge/Figma-F24E1E?logo=figma&logoColor=white)

---

## 🏗 System Architecture

<!-- 아키텍처 이미지가 들어갈 자리입니다. 추후 이미지 첨부 예정. -->

> _시스템 아키텍처 다이어그램은 추후 추가 예정입니다._

---

## 💻 FE

### 팀원

| 프로필                                                                              | 이름   | 역할      | GitHub                                       |
| ----------------------------------------------------------------------------------- | ------ | --------- | -------------------------------------------- |
| <img src="https://github.com/Yumesa2025.png" width="80" height="80" alt="김태환" /> | 김태환 | 팀장 / FE | [@Yumesa2025](https://github.com/Yumesa2025) |
| <img src="https://github.com/wook3964.png" width="80" height="80" alt="박용욱" />   | 박용욱 | 팀원 / FE | [@wook3964](https://github.com/wook3964)     |
| <img src="https://github.com/choisky13.png" width="80" height="80" alt="최하늘" />  | 최하늘 | 팀원 / FE | [@choisky13](https://github.com/choisky13)   |

> Organization: [OZ-Coding-School](https://github.com/OZ-Coding-School)

### 기술 스택

| 분류         | 기술                   | 버전    | 비고                                      |
| ------------ | ---------------------- | ------- | ----------------------------------------- |
| Framework    | React                  | 19.2.4  | React Compiler 활성화                     |
| Language     | TypeScript             | 5.9.3   | strict mode                               |
| Build Tool   | Vite                   | 8.0.1   | `@rolldown/plugin-babel` 기반             |
| Styling      | Tailwind CSS           | v4.2.2  | `@theme` 기반 디자인 토큰 (CSS-first)     |
| Routing      | React Router           | 7.13.2  | `AuthLayout` / `DefaultLayout` 분리       |
| Server State | TanStack Query         | 5.95.2  | `queryOptions` 팩토리 패턴 + Suspense     |
| Client State | Zustand                | 5.0.12  | `devtools` 미들웨어                       |
| HTTP Client  | Axios                  | 1.13.6  | JWT 자동 주입 / 401 리프레시 처리         |
| API Mocking  | MSW                    | 2.12.14 | DEV 모드 서비스 워커                      |
| Markdown     | `@uiw/react-md-editor` | 4.1.0   | rehype-sanitize / remark-breaks 함께 사용 |
| Icon         | `lucide-react`         | 1.7.0   |                                           |
| Test (E2E)   | Playwright             | 1.58.2  | 기능 E2E + Visual Regression              |
| Test (a11y)  | `@axe-core/playwright` | 4.11.3  | `pnpm check:a11y`                         |
| Linter       | ESLint                 | 9.39.4  | sonarjs, react-hooks, jsx-a11y 등 포함    |
| Formatter    | Prettier               | 3.8.1   | `prettier-plugin-tailwindcss`             |
| Git Hooks    | Husky + lint-staged    | 9.1.7   | pre-commit / commit-msg / pre-push 3단계  |
| Package Mgr  | pnpm                   | -       | `pnpm-lock.yaml` 사용                     |

---

## 📐 프로젝트 규칙

### 1. Branch Strategy

```
main  ◀─── dev  ◀─── feature/<업무>
                ◀─── fix/<업무>
                ◀─── refactor/<업무>
                ◀─── docs/<업무>
```

- **`main`** — 배포 브랜치. `dev` → `main` PR로만 머지.
- **`dev`** — 통합 브랜치. 모든 작업 브랜치가 머지되는 지점.
- **`<type>/<업무>`** — 개인 작업 브랜치. `dev`에서 분기, `dev`로 PR.

**브랜치 네이밍 예시**

```
feat/login-page
fix/auth-token-expired
refactor/qna-detail-page
docs/add-convention
```

> 자세한 타입 목록: [`docs/convention/CONVENTION.md`](./docs/convention/CONVENTION.md#브랜치-네이밍)

---

### 2. Git Convention

**커밋 메시지 형식**

```
<type>: <설명> (#이슈번호)
```

- 허용 타입: `feat`, `fix`, `refactor`, `style`, `docs`, `test`, `chore`, `build`, `ci`, `perf`
- 이슈 번호는 관련 이슈가 있을 때만 포함
- `commit-msg` 훅에서 형식 자동 검증 (미준수 시 커밋 차단)

**예시**

```
feat: 로그인 기능 추가 (#12)
fix: 토큰 만료 오류 수정 (#15)
refactor: QnA 상세 페이지 컴포넌트 분리
docs: README 작성
```

**Git Hooks (Husky)**

| 훅           | 동작                                                                      |
| ------------ | ------------------------------------------------------------------------- |
| `pre-commit` | `lint-staged` — staged `*.{ts,tsx}`에 ESLint `--fix` + Prettier 자동 적용 |
| `commit-msg` | 커밋 메시지 형식 검증 (`<type>: <설명>`)                                  |
| `pre-push`   | `pnpm build` 실행, 빌드 실패 시 push 차단                                 |

---

### 3. Pull Request

**제목 형식**

```
<type>: <설명> (#이슈번호)
```

**본문 템플릿** ([`.github/PULL_REQUEST_TEMPLATE.md`](./.github/PULL_REQUEST_TEMPLATE.md))

```markdown
## 관련 이슈

- closes #

## 작업 내용

-

## 변경 사항

-

## 스크린샷 (선택)

## 체크리스트

- [ ] 코드가 정상적으로 동작하는지 확인했습니다
- [ ] 불필요한 console.log 또는 디버깅 코드를 제거했습니다
- [ ] 컨벤션에 맞게 작성했습니다
```

**리뷰 정책**

- 최소 1명 이상의 팀원 리뷰 후 머지
- `dev` 브랜치 직접 push 금지, PR로만 반영

---

### 4. Code Convention

| 대상            | 형식                       | 예시             |
| --------------- | -------------------------- | ---------------- |
| 컴포넌트 파일   | PascalCase                 | `LoginForm.tsx`  |
| 컴포넌트 폴더   | PascalCase                 | `LoginForm/`     |
| 페이지 컴포넌트 | PascalCase + `Page` suffix | `LoginPage.tsx`  |
| 훅              | camelCase + `use` prefix   | `useAuth.ts`     |
| 스토어          | camelCase + `Store` suffix | `authStore.ts`   |
| 유틸 / 헬퍼     | camelCase                  | `formatDate.ts`  |
| 상수            | camelCase                  | `routes.ts`      |
| 타입 파일       | camelCase                  | `user.types.ts`  |
| 일반 폴더       | kebab-case                 | `design-tokens/` |

**컴포넌트 디렉토리 구조**

```
src/components/ButtonGroup/
├── ButtonGroup.tsx   # 컴포넌트 본체
└── index.ts          # barrel export
```

> 전체 규칙: [`docs/convention/CONVENTION.md`](./docs/convention/CONVENTION.md)

---

### 5. Communication Rules

- **소통 채널:** Discord에서 수시 소통
- **PR:** 리뷰 후 머지 (직접 push 금지)
- **이슈 트래킹:** GitHub Issues (`Bug Report` / `Feature Request` 두 가지 템플릿)

---

### 6. Documents

| 문서                                                                             | 설명                                    |
| -------------------------------------------------------------------------------- | --------------------------------------- |
| [`docs/convention/CONVENTION.md`](./docs/convention/CONVENTION.md)               | 코딩 컨벤션 (브랜치 · 커밋 · 네이밍)    |
| [`docs/convention/COMPONENTS.md`](./docs/convention/COMPONENTS.md)               | 공통 컴포넌트 컨벤션                    |
| [`docs/convention/ROUTING.md`](./docs/convention/ROUTING.md)                     | 라우트 · 페이지별 API · 컴포넌트명 매핑 |
| [`docs/convention/FEATURES.md`](./docs/convention/FEATURES.md)                   | Feature 모듈 작성 가이드                |
| [`docs/convention/PROJECT_STRUCTURE.md`](./docs/convention/PROJECT_STRUCTURE.md) | 디렉토리 구조 설명                      |
| [`docs/convention/DESIGN_TOKENS.md`](./docs/convention/DESIGN_TOKENS.md)         | Tailwind v4 `@theme` 기반 디자인 토큰   |
| [`docs/convention/STATE_MANAGEMENT.md`](./docs/convention/STATE_MANAGEMENT.md)   | TanStack Query + Zustand 상태관리       |
| [`docs/convention/PAGES.md`](./docs/convention/PAGES.md)                         | 페이지 구현 가이드                      |

---

## 🚀 시작하기

### 요구사항

- Node.js 24 LTS 이상
- pnpm

### 설치 & 실행

```bash
pnpm install      # 의존성 설치
pnpm dev          # 개발 서버 (http://localhost:5173)
pnpm build        # 프로덕션 빌드
pnpm lint         # ESLint
pnpm test:e2e     # Playwright 기능 E2E
pnpm test:visual  # Playwright 비주얼 회귀
```
