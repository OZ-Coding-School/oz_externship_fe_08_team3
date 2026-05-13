---
name: cls-eliminate
description: Cumulative Layout Shift를 0에 가깝게 줄인다. 이미지 width/height + aspect-ratio, 폰트 size-adjust/font-display, 스켈레톤이 실제 컨텐츠와 동일한 박스 크기, 동적 삽입(토스트/모달/챗봇 FAB)이 페이지를 밀지 않도록 fixed/portal, content-visibility와 contain 사용. assets/* 이미지 컴포넌트, components/common/Avatar, UserAvatar, LoadingBox, Toast, chatbot/ChatbotFab, MarkdownViewer를 다룰 때, "CLS", "레이아웃 쉬프트", "이미지 크기", "스켈레톤", "performance", "Lighthouse" 같은 표현이 나올 때 반드시 사용한다.
---

# CLS Eliminate

레이아웃 시프트를 제거하기 위한 패턴 모음. 목표: CLS < 0.05.

## 측정 (먼저 baseline)

```bash
# 1) Lighthouse — local
pnpm exec lhci autorun
# 또는 Chrome DevTools Performance → Layout Shifts

# 2) PerformanceObserver — 코드로
```

`src/utils/measureCLS.ts`:

```ts
export function startCLSMonitoring() {
  let cls = 0
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries() as PerformanceEntry[]) {
      const e = entry as PerformanceEntry & {
        hadRecentInput?: boolean
        value: number
      }
      if (!e.hadRecentInput) cls += e.value
    }
    console.log('[CLS]', cls.toFixed(4))
  }).observe({ type: 'layout-shift', buffered: true })
}
```

개발 모드에서만 호출. baseline 기록.

## Pattern 1: 이미지 — 무조건 크기 지정

**Before:**

```tsx
<img src={user.avatarUrl} alt={user.name} />
```

**After:**

```tsx
<img
  src={user.avatarUrl}
  alt={user.name}
  width={40}
  height={40}
  loading="lazy"
  decoding="async"
  className="rounded-full object-cover"
/>
```

크기를 모르면 `aspect-ratio` CSS + 컨테이너 width 100%:

```tsx
<div className="aspect-square w-10">
  <img src={url} alt="" className="size-full object-cover" />
</div>
```

`components/common/Avatar` 와 `UserAvatar`는 size prop으로 통일:

```tsx
type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'
const SIZE_PX: Record<AvatarSize, number> = { sm: 24, md: 32, lg: 40, xl: 64 }

function Avatar({ src, alt, size = 'md' }: Props) {
  const px = SIZE_PX[size]
  return (
    <img src={src} alt={alt} width={px} height={px} className="rounded-full" />
  )
}
```

`assets/` 의 PNG들 (`ai-bot.png`, `default-profile.png`, `chatbot-robot.png`, `user-avatar.png`)을 import할 때 Vite의 `?url`/`?w=N` 같은 변환을 활용하거나, `vite-imagetools` 도입으로 사이즈별 srcset 생성.

## Pattern 2: 폰트 — size-adjust로 시프트 제거

**문제:** 시스템 폰트 → 웹 폰트 전환 시 행 높이가 바뀌면서 CLS.

**해결:**

```css
/* App.css */
@font-face {
  font-family: 'Pretendard';
  src: url('/fonts/Pretendard.woff2') format('woff2');
  font-display: swap;
  /* fallback과 동일한 metric에 맞춤 */
  ascent-override: 92%;
  descent-override: 24%;
  line-gap-override: 0%;
  size-adjust: 100%;
}

/* fallback 폰트 정의도 같이 — Pretendard와 metric 매칭 */
@font-face {
  font-family: 'Pretendard-fallback';
  src:
    local('Apple SD Gothic Neo'), local('Malgun Gothic'), local('sans-serif');
  ascent-override: 92%;
  descent-override: 24%;
  size-adjust: 100%;
}

:root {
  --font-sans: 'Pretendard', 'Pretendard-fallback', system-ui, sans-serif;
}
```

`size-adjust` 값은 https://screenspan.net/fallback 같은 도구로 측정. Tailwind v4 환경에서는 `@theme`의 `--font-sans` 토큰에 적용.

## Pattern 3: 스켈레톤은 실제 박스와 동일하게

**Before — `LoadingBox`가 임의 크기:**

```tsx
;<LoadingBox /> // 200×100 정도라고 가정
{
  data && <QuestionCard question={data} />
} // 실제는 120×280
```

→ 데이터 도착 시 큰 시프트.

**After:**

```tsx
function QuestionCardSkeleton() {
  return (
    <div className="rounded-card h-30 w-full animate-pulse bg-slate-100" />
    //         ↑ QuestionCard와 동일한 높이/패딩
  )
}
```

각 컴포넌트에 대응 Skeleton을 페어로 만들고, `LoadingBox`는 generic spinner 자리에만 사용.

## Pattern 4: 동적 삽입은 포털 + fixed

**대상:**

- `Toast` — 화면 우상단 fixed
- `Modal/AlertModal/ConfirmModal/RestoreModal` — fixed + backdrop
- `ChatbotFab` — fixed 우하단
- `ChatbotWidget` — fixed 우하단 (FAB 위에 슬라이드)
- `Dropdown` — popover API 또는 portal

이들은 `position: fixed` + `createPortal`로 document body에 렌더 → 본문 레이아웃에 영향 없음.

```tsx
import { createPortal } from 'react-dom'

function Toast({ children }: Props) {
  return createPortal(
    <div
      className="z-toast fixed top-4 right-4"
      role="status"
      aria-live="polite"
    >
      {children}
    </div>,
    document.body
  )
}
```

`ChatbotFab` 등장 시:

```tsx
// FAB은 컨텐츠 위에 떠야 하므로 fixed
<button className="fixed bottom-6 right-6 z-fab">...</button>
// 본문 padding-bottom 추가해서 가려지지 않게
<main className="pb-24 lg:pb-6">...</main>
```

## Pattern 5: contain / content-visibility

긴 리스트 (질문 목록, 메시지 목록):

```css
.question-card {
  contain: layout style;
  /* 내부 변경이 외부 레이아웃에 영향 안 줌 */
}

.message-list-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px; /* 추정 높이 */
}
```

`content-visibility: auto`는 화면 밖 요소의 렌더링을 스킵 → 스크롤 성능 + CLS 영향 없음.

## Pattern 6: 차원이 미정인 컨텐츠 — placeholder 보존

마크다운 뷰어/에디터는 컨텐츠 로드 전에 최소 높이를 보장:

```tsx
<div className="prose min-h-[40vh]">
  <MarkdownViewer content={data.body} />
</div>
```

이미지가 마크다운 안에 들어올 때:

```tsx
// MarkdownViewer 내부
<img loading="lazy" decoding="async" style={{ aspectRatio: '16/9' }} />
// 또는 rehype 플러그인으로 자동 추가
```

## Pattern 7: 헤더/푸터 sticky — placeholder 확보

`Header`가 위치 fixed라면, 본문에 `padding-top: 64px` (헤더 높이) 명시.

## 우선 점검 컴포넌트 (이 프로젝트)

| 컴포넌트                   | 시프트 원인            | 조치                             |
| -------------------------- | ---------------------- | -------------------------------- |
| `Avatar`, `UserAvatar`     | 이미지 크기 미지정     | size prop + width/height         |
| `LoadingBox`               | 단일 크기              | 컴포넌트별 Skeleton 페어         |
| `QuestionCard`             | 썸네일 자동 크기       | aspect-ratio 명시                |
| `MarkdownViewer`           | 컨텐츠 길이 가변       | min-height + 이미지 aspect-ratio |
| `ChatbotFab/ChatbotWidget` | 등장 시 본문 push 가능 | fixed + portal                   |
| `Header`                   | 폰트 로드 후 시프트    | size-adjust                      |
| `Modal` 계열               | backdrop이 본문 영향   | fixed + portal                   |
| `Toast`                    | 등장 위치              | fixed + portal                   |
| `AiFirstAnswerSection`     | 답변 도착 시 등장      | placeholder Skeleton 동일 크기   |

## 검증 체크리스트

- [ ] Chrome DevTools → Performance → "Experience" 트랙에 layout shift 마커 0개 (또는 < 0.05)
- [ ] Lighthouse 모바일 시뮬레이션 CLS < 0.05
- [ ] 모든 `<img>`에 width/height 또는 aspect-ratio
- [ ] 폰트 로드 전후 비교 스크린샷에서 텍스트 위치 변동 없음
- [ ] 챗봇 FAB 등장/사라짐 시 본문 위치 변동 없음
- [ ] 모달 열림/닫힘 시 본문 시프트 없음 (scrollbar gutter는 `scrollbar-gutter: stable`)

## scrollbar-gutter

모달 열렸을 때 body의 overflow를 hidden으로 만들면 스크롤바가 사라져서 시프트:

```css
html {
  scrollbar-gutter: stable;
}
```

## 함께 쓰는 스킬

- `tailwind-v4-tokenize` — aspect-ratio, min-height 토큰화
- `a11y-audit` — 모달/포털과 함께 점검
- `refactor-safety-check` — CLS 측정값 회귀 확인
