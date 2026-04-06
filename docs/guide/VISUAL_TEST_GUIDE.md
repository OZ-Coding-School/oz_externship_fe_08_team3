# Visual 회귀 테스트 실행 가이드

이 문서는 Playwright 기반 시각적 회귀 테스트(Visual Regression Test)의 상세 실행 가이드입니다. 테스트 개요 및 전체 테스트 전략은 [TESTING.md](./TESTING.md)를 참고하세요.

---

## 목차

1. [사전 준비](#사전-준비)
2. [실행 명령어](#실행-명령어)
3. [테스트 파일 구조 및 작성 규칙](#테스트-파일-구조-및-작성-규칙)
4. [결과 확인 방법](#결과-확인-방법)
5. [Baseline 관리](#baseline-관리)
6. [트러블슈팅](#트러블슈팅)

---

## 사전 준비

### 1. 의존성 설치

```bash
pnpm install
```

### 2. Playwright 브라우저 설치

Visual 테스트는 Chromium에서만 실행됩니다.

```bash
npx playwright install chromium
```

### 3. Baseline 스크린샷 확인

Visual 테스트는 기준 이미지(baseline)와 실제 렌더링 결과를 비교합니다. Baseline 스크린샷이 `e2e/__screenshots__/` 디렉토리에 존재해야 합니다.

Baseline이 없는 상태에서 테스트를 실행하면 모든 테스트가 실패합니다. Baseline 준비 방법은 [Baseline 관리](#baseline-관리) 섹션을 참고하세요.

### 4. 개발 서버

E2E 기능 테스트와 동일하게, `http://localhost:5173`의 개발 서버가 필요합니다. Playwright 설정에 의해 자동으로 시작되며, 이미 실행 중이면 재사용합니다.

---

## 실행 명령어

### 전체 Visual 테스트 실행

```bash
pnpm test:visual
```

이 명령어는 내부적으로 `playwright test --project=visual`을 실행합니다. `*.visual.spec.ts` 패턴에 매칭되는 파일만 대상으로 합니다.

### 특정 Visual 테스트 파일 실행

```bash
npx playwright test e2e/visual/home.visual.spec.ts --project=visual
```

### 특정 테스트 케이스 실행

```bash
npx playwright test --project=visual -g "HomePage"
```

### Baseline 업데이트 (Playwright 자체 생성)

현재 렌더링된 화면을 새 baseline으로 저장합니다. UI가 의도적으로 변경되었을 때 사용합니다.

```bash
npx playwright test --project=visual --update-snapshots
```

### Figma에서 Baseline 다운로드

Figma 디자인을 baseline으로 사용하는 경우, 전용 스크립트를 통해 다운로드합니다.

```bash
# 매핑 현황만 확인 (다운로드 없음)
pnpm test:visual:update-baseline

# 누락된 baseline만 다운로드
FIGMA_TOKEN=<토큰> pnpm test:visual:update-baseline -- --download

# 전체 baseline 재다운로드
FIGMA_TOKEN=<토큰> pnpm test:visual:update-baseline -- --download --all
```

### 디버그 모드

```bash
npx playwright test --project=visual --debug
```

---

## 테스트 파일 구조 및 작성 규칙

### 디렉토리 구조

```
e2e/
  __screenshots__/                      # Baseline 스크린샷 저장소
    visual/
      auth.visual.spec.ts/
        login.png
        signup-select.png
        signup.png
      community.visual.spec.ts/
        community-list.png
        community-detail.png
        community-write.png
        community-edit.png
      home.visual.spec.ts/
        home.png
      mypage.visual.spec.ts/
        mypage.png
        mypage-edit.png
        change-password.png
      qna.visual.spec.ts/
        qna-list.png
        qna-detail.png
        qna-write.png
        qna-edit.png
      quiz.visual.spec.ts/
        quiz-list.png
        quiz-exam.png
        quiz-result.png
  visual/                               # Visual 테스트 파일
    visual.setup.ts                     # 테스트 헬퍼 (loginAsTestUser 등)
    home.visual.spec.ts
    auth.visual.spec.ts
    community.visual.spec.ts
    qna.visual.spec.ts
    mypage.visual.spec.ts
    quiz.visual.spec.ts
  scripts/
    update-figma-baselines.ts           # Figma baseline 다운로드 스크립트
```

### Baseline 스크린샷 경로 규칙

Playwright 설정의 `snapshotPathTemplate`에 의해 스크린샷 경로가 결정됩니다.

```
{testDir}/__screenshots__/{testFilePath}/{arg}{ext}
```

예를 들어, `e2e/visual/auth.visual.spec.ts` 파일에서 `toHaveScreenshot('login.png')`을 호출하면 다음 경로에서 baseline을 찾습니다.

```
e2e/__screenshots__/visual/auth.visual.spec.ts/login.png
```

### 기본 테스트 패턴 (공개 페이지)

```ts
import { test, expect } from '@playwright/test'

test.describe('Home 페이지 시각적 회귀 테스트', () => {
  test('HomePage', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('home.png', { fullPage: true })
  })
})
```

### 인증이 필요한 페이지 테스트 패턴

로그인이 필요한 페이지(마이페이지, 글쓰기 등)는 `loginAsTestUser()` 헬퍼를 사용합니다.

```ts
import { test, expect } from '@playwright/test'
import { loginAsTestUser } from './visual.setup'

test.describe('MyPage 페이지 시각적 회귀 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page)
  })

  test('MypagePage', async ({ page }) => {
    await page.goto('/mypage')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('mypage.png', { fullPage: true })
  })
})
```

`loginAsTestUser()` 함수는 Zustand `auth-storage` localStorage를 직접 설정하여 로그인 상태를 시뮬레이션합니다. 실제 로그인 API를 호출하지 않으므로 MSW 핸들러와 무관하게 동작합니다.

### 주요 규칙

- **파일 명명**: `<도메인>.visual.spec.ts` 형식을 사용합니다.
- **스크린샷 이름**: `toHaveScreenshot()`에 전달하는 이름은 Figma baseline 스크립트의 `PAGE_TO_SPEC` 매핑과 일치해야 합니다.
- **fullPage 옵션**: 스크롤 가능한 전체 페이지를 캡처하려면 `{ fullPage: true }`를 사용합니다.
- **networkidle 대기**: 스크린샷 촬영 전 `waitForLoadState('networkidle')`로 모든 네트워크 요청이 완료될 때까지 기다립니다.
- **뷰포트**: Visual 프로젝트는 1920x1080 해상도로 고정되어 있습니다.
- **애니메이션 비활성화**: 설정에서 `animations: 'disabled'`로 지정되어 있어, 애니메이션에 의한 불일치가 발생하지 않습니다.
- **허용 오차**: `maxDiffPixelRatio: 0.1`로 설정되어, 전체 픽셀의 10%까지 차이를 허용합니다.

---

## 결과 확인 방법

### 터미널 출력

```
Running 16 tests using 4 workers

  ✓ Home 페이지 시각적 회귀 테스트 > HomePage (2.1s)
  ✗ Auth 페이지 시각적 회귀 테스트 > LoginPage (3.2s)
  ...
```

### HTML 리포트

```bash
npx playwright show-report
```

Visual 테스트 실패 시 리포트에서 다음 이미지를 비교할 수 있습니다.

| 이미지              | 설명                                        |
| ------------------- | ------------------------------------------- |
| Expected (Baseline) | 기준 이미지 (Figma 디자인 또는 이전 스냅샷) |
| Actual              | 현재 렌더링된 실제 스크린샷                 |
| Diff                | 두 이미지의 차이를 강조한 이미지            |

리포트의 슬라이더를 사용하여 Expected와 Actual을 겹쳐서 비교할 수 있습니다.

### 실패 시 생성되는 파일

테스트 실패 시 다음 파일이 `test-results/` 디렉토리에 생성됩니다.

```
test-results/
  <테스트명>/
    <스크린샷명>-actual.png      # 실제 렌더링 결과
    <스크린샷명>-expected.png    # 기준 이미지 (baseline)
    <스크린샷명>-diff.png        # 차이점 하이라이트
```

---

## Baseline 관리

### Baseline의 두 가지 원천

이 프로젝트에서 baseline 스크린샷은 두 가지 방법으로 관리됩니다.

| 방법               | 용도                           | 명령어                                                    |
| ------------------ | ------------------------------ | --------------------------------------------------------- |
| Figma에서 다운로드 | 디자인과 구현의 일치를 검증    | `pnpm test:visual:update-baseline -- --download`          |
| Playwright로 생성  | 현재 구현을 기준으로 회귀 감지 | `npx playwright test --project=visual --update-snapshots` |

### Figma Baseline 다운로드

#### Figma 토큰 발급

1. [Figma 개발자 설정](https://www.figma.com/developers/api#access-tokens)에 접속합니다.
2. Personal Access Token을 생성합니다.
3. 환경 변수로 설정합니다.

```bash
export FIGMA_TOKEN=figd_xxxxxxxxxxxxx
```

#### 매핑 현황 확인

토큰 없이 실행하면 현재 매핑 상태만 표시합니다.

```bash
pnpm test:visual:update-baseline
```

출력 예시:

```
Page                     Spec                          NodeId         Status
--------------------------------------------------------------------------------
login                    auth.visual.spec.ts           123-456        ✅
signup                   auth.visual.spec.ts           123-789        ❌
home                     home.visual.spec.ts           124-001        ✅
```

#### 누락된 Baseline 다운로드

```bash
FIGMA_TOKEN=<토큰> pnpm test:visual:update-baseline -- --download
```

#### 전체 Baseline 재다운로드

기존 baseline을 모두 덮어쓰고 Figma의 최신 디자인으로 갱신합니다.

```bash
FIGMA_TOKEN=<토큰> pnpm test:visual:update-baseline -- --download --all
```

### Figma 연동 구조

Baseline 다운로드 스크립트(`e2e/scripts/update-figma-baselines.ts`)는 다음과 같이 동작합니다.

1. `src/pages/` 디렉토리의 모든 `.tsx` 파일을 스캔합니다.
2. 각 파일에서 `@figma` 주석의 Figma URL과 `node-id`를 추출합니다.
3. `PAGE_TO_SPEC` 매핑 테이블을 참조하여 스크린샷 저장 경로를 결정합니다.
4. `--download` 플래그가 있으면 Figma API를 호출하여 이미지를 다운로드합니다.

#### 페이지 파일에 Figma 주석 추가하기

새 페이지를 추가할 때는 `.tsx` 파일 상단에 `@figma` 주석을 작성합니다.

```tsx
/**
 * @figma https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/...?node-id=123-456
 */
export default function NewPage() {
  // ...
}
```

그리고 `e2e/scripts/update-figma-baselines.ts`의 `PAGE_TO_SPEC` 매핑에 항목을 추가합니다.

```ts
const PAGE_TO_SPEC: Record<string, string> = {
  // 기존 항목...
  NewPage: 'new.visual.spec.ts',
}
```

### Baseline 업데이트 시점

다음과 같은 상황에서 baseline을 업데이트해야 합니다.

- **Figma 디자인 변경**: `--download --all` 옵션으로 전체 재다운로드합니다.
- **UI 컴포넌트 의도적 변경**: `--update-snapshots`로 현재 렌더링을 새 baseline으로 저장합니다.
- **새 페이지 추가**: Figma 주석과 `PAGE_TO_SPEC` 매핑을 추가한 뒤 baseline을 다운로드합니다.

### Baseline 파일의 버전 관리

Baseline 스크린샷은 Git에 커밋하여 팀 전체가 동일한 기준으로 테스트를 실행할 수 있도록 합니다. `e2e/__screenshots__/` 디렉토리 전체가 버전 관리 대상입니다.

---

## 트러블슈팅

### 모든 테스트가 "Screenshot comparison failed" 에러로 실패

Baseline 스크린샷이 존재하지 않거나, 다른 환경(OS, 브라우저 버전)에서 생성된 baseline을 사용하고 있을 수 있습니다.

```bash
# Baseline 존재 여부 확인
pnpm test:visual:update-baseline

# Playwright로 현재 환경의 baseline 생성
npx playwright test --project=visual --update-snapshots
```

### 미세한 렌더링 차이로 테스트가 실패하는 경우

폰트 렌더링, 안티앨리어싱 등은 OS와 환경에 따라 다를 수 있습니다. `maxDiffPixelRatio`를 조정하여 허용 범위를 넓힐 수 있습니다.

개별 테스트에서 허용 범위를 지정할 수도 있습니다.

```ts
await expect(page).toHaveScreenshot('home.png', {
  fullPage: true,
  maxDiffPixelRatio: 0.15, // 15%까지 허용
})
```

### Figma 토큰 관련 에러

```
API 요청 실패: 403 Forbidden
```

Figma 토큰이 만료되었거나 권한이 부족합니다. [Figma 설정](https://www.figma.com/developers/api#access-tokens)에서 새 토큰을 발급받으세요.

### 인증이 필요한 페이지에서 로그인 페이지로 리다이렉트되는 경우

`loginAsTestUser()` 헬퍼가 정상적으로 동작하지 않을 수 있습니다. `visual.setup.ts`에서 `auth-storage` localStorage 키 이름이 Zustand 스토어 설정과 일치하는지 확인합니다.

### 개발 서버 포트 충돌

```
Error: listen EADDRINUSE: address already in use :::5173
```

이미 다른 프로세스가 5173 포트를 사용 중입니다. 기존 프로세스를 종료하거나, 실행 중인 개발 서버가 있다면 Playwright가 자동으로 재사용하므로 그대로 테스트를 실행합니다.

```bash
# macOS에서 포트 사용 프로세스 확인
lsof -i :5173
```

### CI 환경에서의 스크린샷 불일치

CI 환경과 로컬 환경의 렌더링 결과가 다를 수 있습니다. CI에서 visual 테스트를 실행할 때는 Docker 컨테이너를 사용하여 환경을 통일하는 것을 권장합니다. Playwright 공식 Docker 이미지(`mcr.microsoft.com/playwright`)를 활용하세요.
