---
name: tailwind-v4-tokenize
description: Tailwind v4의 @theme/@utility 시스템으로 스타일을 토큰화한다. 임의 값([#hex], [10px]) 제거, App.css의 디자인 토큰 활용 강제, 컨테이너 쿼리(@container) 도입, OKLCH 색상, color-mix() 사용, CSS-first 설정. App.css 또는 components/*.tsx의 className을 다룰 때, "디자인 토큰", "임의 값", "tailwind", "색상 통일", "테마", "컨테이너 쿼리" 같은 표현이 나올 때 반드시 사용한다. v4 (Oxide 엔진) 환경에서 v3 패턴이 남아있으면 마이그레이션한다.
---

# Tailwind v4 Tokenize

Tailwind CSS 4.2 기준. v3와 다른 점이 많으므로 주의.

## v4 핵심 변화 요약

- **설정 위치**: `tailwind.config.js` → CSS 안 `@theme` 블록 (CSS-first)
- **import 구문**: `@tailwind base/components/utilities` → `@import "tailwindcss"` 한 줄
- **색상**: 기본 팔레트가 OKLCH로
- **컨테이너 쿼리**: 코어 내장 (`@container`, `@sm:`, `@md:` 등)
- **3D, gradient interpolation, conic gradients** 등 신규 유틸
- **`@utility`**: 커스텀 유틸리티 정의

## 핵심 원칙

1. **임의 값 제거**: `bg-[#3b82f6]`, `text-[14px]`, `mt-[18px]` 같은 코드는 거의 항상 토큰화 가능
2. **App.css가 단일 진실**: 모든 디자인 토큰은 `@theme`에 정의, 컴포넌트는 토큰만 참조
3. **컴포넌트 단위 컨테이너 쿼리**: viewport 미디어 쿼리보다 컨테이너 쿼리 우선

## App.css 표준 형태

```css
/* src/App.css */
@import 'tailwindcss';

@theme {
  /* ── 색상 (OKLCH) ────────────────────────── */
  --color-brand-50: oklch(0.97 0.02 250);
  --color-brand-500: oklch(0.65 0.18 250);
  --color-brand-700: oklch(0.45 0.2 250);

  --color-surface: oklch(1 0 0);
  --color-surface-muted: oklch(0.97 0.005 250);
  --color-border: oklch(0.92 0.005 250);

  --color-text: oklch(0.18 0.01 250);
  --color-text-muted: oklch(0.45 0.01 250);

  /* QnA 도메인 상태 색상 */
  --color-status-open: oklch(0.65 0.18 230); /* blue */
  --color-status-answered: oklch(0.7 0.15 150); /* green */
  --color-status-accepted: oklch(0.55 0.22 290); /* purple */
  --color-status-closed: oklch(0.6 0.01 250); /* gray */

  /* ── 타이포 ────────────────────────────── */
  --font-sans: 'Pretendard', 'Pretendard-fallback', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  --text-xs: 0.75rem; /* 12 */
  --text-sm: 0.875rem; /* 14 */
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;

  /* ── 간격 / 반경 ────────────────────────── */
  --radius-card: 12px;
  --radius-input: 8px;
  --radius-pill: 999px;

  --shadow-card: 0 1px 2px oklch(0 0 0 / 0.04), 0 4px 12px oklch(0 0 0 / 0.06);
  --shadow-popover: 0 4px 20px oklch(0 0 0 / 0.12);

  /* ── z-index ────────────────────────── */
  --z-header: 30;
  --z-dropdown: 40;
  --z-fab: 50;
  --z-modal: 60;
  --z-toast: 70;

  /* ── 모션 ────────────────────────── */
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --duration-fast: 120ms;
  --duration-normal: 200ms;
  --duration-slow: 360ms;
}

/* ── 커스텀 유틸리티 ────────────────────────── */
@utility container-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}

@utility focus-ring {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
@utility focus-ring--visible {
  outline-color: var(--color-brand-500);
}

/* ── 모션 감소 대응 ────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 변환 패턴

### Pattern 1: 임의 색상 → 브랜드 토큰

```diff
- <button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">
+ <button className="bg-brand-500 hover:bg-brand-700 text-white">
```

### Pattern 2: 임의 간격 → spacing scale

v4는 default spacing scale을 0.25rem 기준으로 사용. 정말 필요한 값만 토큰 추가:

```css
@theme {
  --spacing-card-x: 1.25rem;
  --spacing-card-y: 1rem;
}
```

```diff
- <article className="px-[20px] py-[16px]">
+ <article className="px-card-x py-card-y">
```

### Pattern 3: 반복 className → @utility

`container-card` 같이 자주 쓰는 묶음을 유틸로:

```diff
- <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
+ <div className="container-card">
```

남용 주의 — 5회 이상 반복되는 묶음만.

### Pattern 4: 컨테이너 쿼리 도입

챗봇 위젯, 카드 그리드 등 부모 크기에 따라 레이아웃이 바뀌는 곳:

```tsx
// ChatbotWidget의 부모
<div className="@container fixed bottom-6 right-6 w-[24rem] max-w-[90vw]">
  <ChatbotWidget />
</div>

// ChatbotWidget 내부 — 위젯 너비 기준으로 반응
<header className="flex @sm:flex-row flex-col gap-2">
  ...
</header>
```

뷰포트가 아니라 **위젯 자체 크기**가 기준. 위젯이 페이지에 어디 박혀도 동작.

### Pattern 5: 색상 혼합 — color-mix()

```css
@utility hover-bg {
  background: color-mix(in oklch, var(--color-brand-500) 90%, white);
}
```

v3에서는 plugin으로 했던 일을 v4 + CSS만으로.

### Pattern 6: 다크 모드

v4는 `@variant` 또는 `data-theme` 패턴:

```css
@variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));
```

또는 미디어 쿼리:

```css
@variant dark (&:where(.dark, .dark *));
```

루트에 `<html data-theme="dark">` 토글. 색 토큰은 `@theme` 안에 light 기준으로, dark는 별도 셀렉터로 오버라이드:

```css
[data-theme='dark'] {
  --color-surface: oklch(0.18 0.01 250);
  --color-text: oklch(0.95 0.01 250);
  /* ... */
}
```

## 안티 패턴 (즉시 수정)

```tsx
// ❌ 임의 hex
className="bg-[#1e40af]"
// ✓ 토큰
className="bg-brand-700"

// ❌ 임의 픽셀
className="w-[372px]"
// ✓ 정말 마법수면 토큰 추가, 아니면 의미 단위로
className="w-chatbot-widget" // @theme에 --width-chatbot-widget: 23.25rem

// ❌ inline style로 색상
style={{ color: '#fa5252' }}
// ✓ Tailwind 토큰
className="text-status-error"

// ❌ 뷰포트 브레이크포인트 남용
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
// 카드 그리드는 컨테이너 쿼리가 더 적절한 경우 많음
className="@container grid grid-cols-1 @md:grid-cols-2 @xl:grid-cols-3"
```

## 마이그레이션 절차

1. `App.css`에 디자인 토큰 정리 (위 템플릿)
2. 컴포넌트별로 임의 값을 grep해서 추출:
   ```bash
   grep -rn 'className="[^"]*\[#' src/
   grep -rn 'className="[^"]*\[[0-9]' src/
   ```
3. 각 임의 값을 토큰으로 매핑 (또는 새 토큰 추가)
4. 5회 이상 반복되는 className 묶음을 `@utility`로
5. 컨테이너 쿼리 기회 검토 — 챗봇, 카드, 사이드 영역
6. `prefers-reduced-motion` 적용 확인

## 검증

- `grep -rE 'className="[^"]*\[#' src/` 결과 0건
- `grep -rE 'style=\{\{.*color' src/` 결과 0건
- Tailwind v4 빌드 워닝 없음
- 다크 모드 토글 시 모든 색상이 토큰 기반으로 전환되는지 (수동 또는 스크린샷 테스트)

## 함께 쓰는 스킬

- `cls-eliminate` — aspect-ratio, min-height 토큰
- `a11y-audit` — focus-visible, prefers-reduced-motion
