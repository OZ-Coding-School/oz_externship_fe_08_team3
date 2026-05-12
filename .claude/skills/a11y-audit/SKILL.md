---
name: a11y-audit
description: WCAG 2.2 기준으로 접근성을 점검하고 수정한다. <dialog> 요소로 Modal 마이그레이션(focus-trap-react 제거), popover API로 Dropdown, aria-live로 Toast/SSE 메시지, 키보드 네비게이션(Tabs/Pagination/CategoryFilter), focus-visible, prefers-reduced-motion, 색 대비, 폼 라벨링(useId). components/common/Modal/AlertModal/ConfirmModal, Dropdown, Tabs, Toast, Pagination, Input/Checkbox 등을 다룰 때, "접근성", "a11y", "키보드", "스크린리더", "ARIA", "WCAG", "포커스", "다이얼로그", "모달" 같은 표현이 나올 때 반드시 사용한다.
---

# A11y Audit

WCAG 2.2 + 모던 HTML 요소 (dialog, popover) 기준 접근성 리팩토링.

## 측정 (먼저)

```bash
# 도구 설치
pnpm add -D @axe-core/react eslint-plugin-jsx-a11y axe-playwright

# Playwright 통합
```

`tests/a11y.spec.ts`:

```ts
import { test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('QnA 상세 페이지 a11y', async ({ page }) => {
  await page.goto('/qna/123')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})
```

페이지별로 baseline 위반 수 기록. 각 PR에서 회귀 방지.

ESLint:

```js
import jsxA11y from 'eslint-plugin-jsx-a11y';
{ plugins: { 'jsx-a11y': jsxA11y }, rules: jsxA11y.configs.strict.rules }
```

## Pattern 1: Modal → `<dialog>`

`focus-trap-react` 의존성 제거 가능. 브라우저가 처리.

```tsx
// components/common/Modal/Modal.tsx
import { useEffect, useRef } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        // backdrop 클릭 시 닫기 — dialog 자체에 클릭이 도달했을 때만
        if (e.target === dialogRef.current) onClose()
      }}
      aria-labelledby="modal-title"
      className="rounded-card w-full max-w-md p-6 backdrop:bg-black/40"
    >
      <header className="mb-4 flex items-center justify-between">
        <h2 id="modal-title" className="text-lg font-semibold">
          {title}
        </h2>
        <button onClick={onClose} aria-label="닫기">
          ✕
        </button>
      </header>
      {children}
    </dialog>
  )
}
```

**`<dialog>`의 a11y 자동 제공:**

- ESC로 닫기
- 포커스 트랩 (modal 외부로 Tab 안 나감)
- 열릴 때 첫 focusable 요소로 포커스
- 닫힐 때 열기 트리거 요소로 포커스 복귀 (대부분)
- `aria-modal="true"` 자동 적용

**커스텀 backdrop 스타일:**

```css
dialog::backdrop {
  background: oklch(0 0 0 / 0.4);
  backdrop-filter: blur(2px);
}
dialog[open] {
  animation: fadeIn var(--duration-normal) var(--ease-out-quart);
}
@media (prefers-reduced-motion: reduce) {
  dialog[open] {
    animation: none;
  }
}
```

`AlertModal`, `ConfirmModal`, `RestoreModal`도 모두 같은 베이스에서 파생.

`focus-trap-react` 의존성 제거: `package.json`에서 제거 → 번들 -15kb 정도.

## Pattern 2: Dropdown → Popover API

Chrome/Edge/Firefox/Safari 모두 지원 (2024년 기준 안정).

```tsx
// components/common/Dropdown/Dropdown.tsx
import { useId } from 'react'

interface DropdownProps {
  trigger: React.ReactNode
  items: { label: string; onSelect: () => void }[]
}

export function Dropdown({ trigger, items }: DropdownProps) {
  const id = useId()
  const popoverId = `dropdown-${id}`

  return (
    <>
      <button
        popoverTarget={popoverId}
        aria-haspopup="menu"
        aria-expanded={false}
      >
        {trigger}
      </button>
      <div
        id={popoverId}
        popover="auto"
        role="menu"
        className="rounded-card shadow-popover bg-surface m-0 p-1"
      >
        {items.map((item, i) => (
          <button
            key={i}
            role="menuitem"
            className="hover:bg-surface-muted block w-full rounded px-3 py-2 text-left"
            onClick={() => {
              item.onSelect()
              ;(
                document.getElementById(popoverId) as HTMLElement
              )?.hidePopover()
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </>
  )
}
```

**popover의 a11y:**

- ESC 자동 닫기
- 다른 곳 클릭 시 자동 닫기 (`popover="auto"`)
- 모달과 달리 본문 인터랙션 유지
- Top layer 자동 — z-index 충돌 없음

`Header/ProfileDropdown`이 즉시 적용 대상.

## Pattern 3: Toast — aria-live

스크린리더가 알림 읽도록:

```tsx
function ToastContainer({ toasts }: Props) {
  return createPortal(
    <div
      className="z-toast fixed top-4 right-4 space-y-2"
      role="region"
      aria-label="알림"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.type === 'error' ? 'alert' : 'status'}
          aria-live={t.type === 'error' ? 'assertive' : 'polite'}
          aria-atomic="true"
        >
          {t.message}
        </div>
      ))}
    </div>,
    document.body
  )
}
```

- `role="status"` + `aria-live="polite"` — 일반 토스트 (성공/안내)
- `role="alert"` + `aria-live="assertive"` — 에러
- `aria-atomic="true"` — 메시지 전체 다시 읽기

## Pattern 4: 챗봇 메시지 — SSE 스트리밍 a11y

스트리밍 메시지를 매 토큰마다 읽으면 시끄럽다 → 메시지 완성 시점에만 announce:

```tsx
<div
  role="log"
  aria-live="polite"
  aria-atomic="false"
  aria-relevant="additions"
>
  {messages.map((m) => (
    <div key={m.id} aria-busy={m.streaming}>
      {
        m.streaming ? (
          <span aria-hidden="true">{m.content}</span> // 시각만
        ) : (
          <span>{m.content}</span>
        ) // 완성 시 스크린리더에 노출
      }
    </div>
  ))}
</div>
```

## Pattern 5: Tabs — 키보드 네비게이션

WAI-ARIA Tabs Pattern:

```tsx
function Tabs({ tabs, value, onChange }: Props) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    const last = tabs.length - 1
    const move: Record<string, number | undefined> = {
      ArrowRight: i === last ? 0 : i + 1,
      ArrowLeft: i === 0 ? last : i - 1,
      Home: 0,
      End: last,
    }
    const next = move[e.key]
    if (next !== undefined) {
      e.preventDefault()
      const id = tabs[next].id
      onChange(id)
      refs.current[next]?.focus()
    }
  }

  return (
    <>
      <div role="tablist">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => (refs.current[i] = el)}
            role="tab"
            aria-selected={value === t.id}
            aria-controls={`panel-${t.id}`}
            id={`tab-${t.id}`}
            tabIndex={value === t.id ? 0 : -1}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`panel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          hidden={value !== t.id}
        >
          {t.content}
        </div>
      ))}
    </>
  )
}
```

`tabIndex={value === t.id ? 0 : -1}` — Tab키로는 선택된 탭만 들어가고, 화살표로 탭간 이동. WAI-ARIA 표준 패턴.

## Pattern 6: Pagination

```tsx
<nav aria-label="페이지 네비게이션">
  <ul className="flex gap-1">
    <li>
      <button aria-label="이전 페이지" disabled={page === 1}>
        ‹
      </button>
    </li>
    {pages.map((p) => (
      <li key={p}>
        <button
          aria-label={`${p}페이지`}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      </li>
    ))}
    <li>
      <button aria-label="다음 페이지" disabled={page === total}>
        ›
      </button>
    </li>
  </ul>
</nav>
```

## Pattern 7: 폼 라벨링 — useId

```tsx
function Input({ label, error, ...props }: Props) {
  const id = useId()
  const errorId = `${id}-error`
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
```

`Checkbox`, `PasswordInput`, `SearchInput`도 동일 패턴.

## Pattern 8: 색 대비

OKLCH 색상 사용 시 대비 측정 도구 (axe가 자동 검출). WCAG AA = 4.5:1 (본문), AAA = 7:1.

`@theme`의 색상 페어를 axe Playwright로 검증.

## Pattern 9: prefers-reduced-motion

모든 애니메이션/트랜지션은 위 `tailwind-v4-tokenize`의 글로벌 미디어 쿼리에서 무력화. 추가로 컴포넌트 레벨에서:

```tsx
const prefersReducedMotion = useSyncExternalStore(
  (cb) => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    mq.addEventListener('change', cb)
    return () => mq.removeEventListener('change', cb)
  },
  () => matchMedia('(prefers-reduced-motion: reduce)').matches,
  () => false
)
```

큰 애니메이션(챗봇 슬라이드, 모달 페이드)에서 분기.

## Pattern 10: focus-visible

마우스 클릭 시에는 outline 없고, 키보드 포커스에서만:

```css
*:focus-visible {
  outline: 2px solid var(--color-brand-500);
  outline-offset: 2px;
  border-radius: 4px;
}
```

전역 적용. 컴포넌트에서 별도 outline 처리 불필요.

## 도메인 체크리스트

| 컴포넌트                                            | a11y 변경                                             |
| --------------------------------------------------- | ----------------------------------------------------- |
| `Modal/AlertModal/ConfirmModal/RestoreModal`        | `<dialog>` + `showModal()`, focus-trap-react 제거     |
| `Dropdown`, `Header/ProfileDropdown`                | popover API + role="menu"                             |
| `Toast`                                             | aria-live, role 분기                                  |
| `Tabs`                                              | WAI-ARIA Tabs Pattern, 화살표 키                      |
| `Pagination`                                        | `<nav>` + aria-current, aria-label                    |
| `Input`, `Checkbox`, `PasswordInput`, `SearchInput` | useId, aria-describedby, aria-invalid                 |
| `MarkdownEditor`                                    | 툴바 버튼 aria-label, 단축키 안내                     |
| `CategoryFilter`                                    | role="listbox" 또는 체크박스 그룹                     |
| `Spinner`, `LoadingBox`                             | role="status", `<span class="sr-only">로딩 중</span>` |
| `ChatbotWidget` 메시지                              | role="log", aria-live                                 |
| `Avatar`                                            | alt 텍스트 또는 aria-hidden + aria-label              |

## 검증

- [ ] axe-core 위반 0건 (각 페이지)
- [ ] Playwright 키보드 시나리오 통과 (Tab만으로 모든 인터랙션 가능)
- [ ] 스크린리더 수동 점검 (NVDA 또는 VoiceOver) — 최소 핵심 플로우 (로그인, 질문 작성, 답변 작성, 챗봇)
- [ ] `focus-trap-react` 의존성 제거
- [ ] ESLint jsx-a11y 통과
