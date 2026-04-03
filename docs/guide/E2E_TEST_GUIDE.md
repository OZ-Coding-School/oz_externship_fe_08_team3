# E2E 기능 테스트 실행 가이드

이 문서는 Playwright 기반 E2E 기능 테스트의 상세 실행 가이드입니다. 테스트 개요 및 전체 테스트 전략은 [TESTING.md](./TESTING.md)를 참고하세요.

---

## 목차

1. [사전 준비](#사전-준비)
2. [실행 명령어](#실행-명령어)
3. [테스트 파일 구조 및 작성 규칙](#테스트-파일-구조-및-작성-규칙)
4. [결과 확인 방법](#결과-확인-방법)
5. [트러블슈팅](#트러블슈팅)

---

## 사전 준비

### 1. 의존성 설치

```bash
pnpm install
```

### 2. Playwright 브라우저 설치

Playwright가 사용하는 브라우저 바이너리를 설치합니다. 최초 한 번만 실행하면 됩니다.

```bash
npx playwright install
```

특정 브라우저만 설치하려면 브라우저 이름을 지정합니다.

```bash
npx playwright install chromium
```

### 3. 개발 서버 확인

E2E 테스트는 `http://localhost:5173`에서 동작하는 개발 서버가 필요합니다. Playwright 설정에 의해 테스트 실행 시 개발 서버가 자동으로 시작됩니다.

- 로컬 환경: 이미 `pnpm dev`로 서버가 실행 중이면 해당 서버를 재사용합니다.
- CI 환경: 항상 새 서버를 시작합니다.

수동으로 서버를 먼저 시작해두면 테스트 시작 시간이 단축됩니다.

```bash
pnpm dev
```

---

## 실행 명령어

### 기본 실행 (Chromium)

`package.json`에 정의된 기본 스크립트는 Chromium 프로젝트만 실행합니다.

```bash
pnpm test:e2e
```

이 명령어는 내부적으로 `playwright test --project=chromium`을 실행합니다.

### UI 모드

Playwright의 인터랙티브 UI에서 테스트를 실행하고 디버깅할 수 있습니다. 테스트를 선택적으로 실행하거나, 각 단계별 스크린샷을 확인할 때 유용합니다.

```bash
pnpm test:e2e:ui
```

### 특정 테스트 파일 실행

```bash
npx playwright test e2e/auth/login.spec.ts --project=chromium
```

### 특정 테스트 케이스 실행

`-g` 플래그로 테스트 이름을 필터링합니다.

```bash
npx playwright test --project=chromium -g "로그인 페이지가 렌더링된다"
```

### 디버그 모드

브라우저 창을 직접 보면서 테스트를 한 단계씩 실행할 수 있습니다.

```bash
npx playwright test --project=chromium --debug
```

### 헤드 모드 (브라우저 표시)

디버그 모드 없이 브라우저 창만 표시하려면 `--headed` 플래그를 사용합니다.

```bash
npx playwright test --project=chromium --headed
```

### 테스트 결과 리포트 열기

테스트 실행 후 HTML 리포트를 브라우저에서 확인합니다.

```bash
npx playwright show-report
```

---

## 테스트 파일 구조 및 작성 규칙

### 디렉토리 구조

```
e2e/
  app.spec.ts                         # 기본 앱 로드 테스트
  auth/                               # 인증 관련 테스트
    login.spec.ts                     # 로그인 페이지
    signup.spec.ts                    # 회원가입 페이지
    mypage.spec.ts                    # 마이페이지
    quiz.spec.ts                      # 퀴즈
  community/                          # 커뮤니티 테스트
    community-list.spec.ts            # 목록 페이지
    community-detail.spec.ts          # 상세 페이지
    community-write.spec.ts           # 글쓰기 페이지
  qna/                                # 질의응답 테스트
    qna-list.spec.ts                  # 목록 페이지
    qna-detail.spec.ts                # 상세 페이지
    qna-write.spec.ts                 # 글쓰기 페이지
```

### 파일 명명 규칙

- 기능 테스트 파일은 `<기능명>.spec.ts` 형식을 사용합니다.
- 도메인별 하위 디렉토리(`auth/`, `community/`, `qna/`)로 구분합니다.
- `visual/` 디렉토리 아래의 파일은 E2E 기능 테스트 프로젝트에서 자동으로 제외됩니다 (`testIgnore: /visual/`).

### 인터페이스 계약 주석

각 테스트 파일 상단에 `@interface-contract` 주석을 작성하여 테스트 대상 페이지의 UI 요소, API 엔드포인트, 요구사항 ID를 정의합니다.

```ts
/**
 * @interface-contract
 *
 * Page: /login (로그인)
 * - 이메일 입력 필드: placeholder "아이디 (example@gmail.com)"
 * - "일반회원 로그인" 버튼
 *
 * API:
 * - POST /accounts/login -> JWT 발급
 *
 * REQ-USER-006: 이메일 로그인
 */
```

### 테스트 작성 패턴

```ts
import { test, expect } from '@playwright/test'

test.describe('로그인 페이지 렌더링', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('로그인 페이지가 렌더링된다', async ({ page }) => {
    await expect(page).toHaveURL('/login')
  })

  test('이메일 입력 필드가 표시된다', async ({ page }) => {
    test.skip() // UI 구현 전 - 구현 완료 후 제거
    const emailInput = page.getByPlaceholder('아이디 (example@gmail.com)')
    await expect(emailInput).toBeVisible()
  })
})
```

### 주요 규칙

- **테스트 우선 작성**: UI 구현 전에 테스트 시나리오를 먼저 정의하고, `test.skip()`으로 건너뛰도록 설정합니다. 구현이 완료되면 `test.skip()`을 제거합니다.
- **Locator 우선순위**: `getByRole()` > `getByPlaceholder()` > `getByText()` > `getByTestId()` 순으로 사용합니다.
- **그룹화**: `test.describe()`로 관련 테스트를 논리적으로 그룹화합니다.
- **독립성**: 각 테스트는 `test.beforeEach()`에서 페이지를 새로 로드하여 독립적으로 실행됩니다.
- **API 모킹**: MSW가 개발 서버에서 자동 활성화되어 있으므로, 별도의 모킹 설정 없이 테스트를 실행할 수 있습니다. 특정 시나리오에 대한 API 응답 오버라이드가 필요한 경우 MSW 핸들러를 추가합니다.

---

## 결과 확인 방법

### 터미널 출력

테스트 실행 후 터미널에 결과가 요약됩니다.

```
Running 5 tests using 4 workers

  ✓ 홈페이지가 정상적으로 로드된다 (1.2s)
  ✓ 로그인 페이지가 렌더링된다 (0.8s)
  - 오즈코딩스쿨 로고가 표시된다 (skipped)
  ...

  3 passed
  2 skipped
```

### HTML 리포트

Playwright는 기본적으로 HTML 리포트를 `playwright-report/` 디렉토리에 생성합니다.

```bash
npx playwright show-report
```

리포트에서 확인할 수 있는 정보는 다음과 같습니다.

- 각 테스트의 성공/실패/스킵 상태
- 실행 시간
- 실패한 테스트의 에러 메시지 및 스택 트레이스
- 스크린샷 (실패 시 자동 캡처)

### 트레이스 뷰어

첫 번째 재시도 시 트레이스가 자동으로 수집됩니다 (`trace: 'on-first-retry'`). 트레이스 파일은 HTML 리포트에서 클릭하여 열 수 있으며, 다음 정보를 제공합니다.

- 테스트 실행의 각 액션 타임라인
- 각 액션 시점의 DOM 스냅샷
- 네트워크 요청 로그
- 콘솔 로그

트레이스 파일을 직접 열려면 다음 명령어를 사용합니다.

```bash
npx playwright show-trace <트레이스파일경로>
```

---

## 트러블슈팅

### 브라우저가 설치되지 않았다는 에러

```
Error: browserType.launch: Executable doesn't exist at ...
```

Playwright 브라우저를 설치합니다.

```bash
npx playwright install
```

### 개발 서버에 연결할 수 없는 경우

```
Error: page.goto: NS_ERROR_CONNECTION_REFUSED
```

개발 서버가 `http://localhost:5173`에서 실행 중인지 확인합니다. 포트가 다른 프로세스에 의해 점유되어 있을 수 있습니다.

```bash
# 포트 사용 중인 프로세스 확인 (macOS)
lsof -i :5173

# 수동으로 개발 서버 시작
pnpm dev
```

### 테스트가 타임아웃되는 경우

```
Error: Test timeout of 30000ms exceeded.
```

가능한 원인과 해결 방법은 다음과 같습니다.

- **페이지 로드 지연**: 개발 서버의 초기 빌드가 오래 걸릴 수 있습니다. 테스트 실행 전에 서버를 먼저 시작해두면 해결됩니다.
- **셀렉터 불일치**: 테스트에서 찾는 요소가 실제 DOM에 존재하지 않을 수 있습니다. `--debug` 모드로 실행하여 DOM 상태를 확인합니다.
- **네트워크 대기**: `waitForLoadState('networkidle')` 대신 특정 요소의 표시를 기다리는 방식을 고려합니다.

### skip 상태인 테스트를 활성화하려면

UI 컴포넌트 구현이 완료된 후 해당 테스트의 `test.skip()` 줄을 삭제합니다. 활성화 전에 단일 테스트로 먼저 확인하는 것을 권장합니다.

```bash
npx playwright test e2e/auth/login.spec.ts --project=chromium -g "오즈코딩스쿨 로고가 표시된다"
```

### lint-staged와의 충돌

테스트 파일을 수정한 후 커밋할 때 ESLint나 Prettier가 자동으로 실행됩니다. 테스트 파일의 포맷팅이 변경되어 의도치 않은 diff가 발생할 수 있으므로, 커밋 전에 수동으로 포맷팅을 적용해 두는 것이 좋습니다.

```bash
npx prettier --write e2e/**/*.spec.ts
```
