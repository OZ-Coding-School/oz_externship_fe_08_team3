---
name: react-19-modernize
description: React 19.2 + React Compiler 1.0 기준으로 컴포넌트를 현대화한다. 수동 메모이제이션(useMemo/useCallback/React.memo) 일괄 제거, use() 훅으로 Promise/Context 언래핑, useActionState/useFormStatus/useOptimistic로 폼 현대화, <Activity>로 상태 보존, forwardRef 제거하고 ref-as-prop 적용, useId/useSyncExternalStore 적극 활용. .tsx 파일을 수정/리팩토링할 때, "현대화", "최신 패턴", "React 19", "컴파일러", "메모이제이션 제거", "폼 리팩토링" 같은 표현이 나올 때, 또는 useEffect/useState/useMemo/useCallback이 많은 컴포넌트를 다룰 때 반드시 사용한다. 사용자가 명시적으로 React 19를 언급하지 않아도, React 컴포넌트 리팩토링이라면 무조건 이 스킬을 먼저 참조한다.
---

# React 19 Modernize

React 19.2 + React Compiler 1.0 (babel-plugin-react-compiler) 환경에서 컴포넌트를 모던하게 리팩토링하기 위한 규칙과 변환 패턴 모음.

## 전제 조건 확인 (반드시 먼저)

리팩토링 시작 전에 다음을 확인한다:

1. `package.json`에 `babel-plugin-react-compiler` 존재 여부
2. `vite.config.ts`의 `@vitejs/plugin-react`에 컴파일러 플러그인이 등록되어 있는지
3. React 버전이 19.0 이상인지
4. `eslint-plugin-react-compiler`가 활성화되어 있는지 (컴파일 불가능한 패턴을 잡아냄)

위 중 하나라도 없으면 사용자에게 알리고 멈춘다. 컴파일러 없이 수동 메모이제이션을 제거하면 성능 회귀가 발생한다.

## 변환 규칙 (Mandatory)

### Rule 1: 수동 메모이제이션 일괄 제거

**제거 대상:**

- `useMemo` — 거의 모든 경우. 단, "값의 참조 동일성이 외부 라이브러리 API에서 필수"인 경우만 보존 (예: TanStack Query의 `queryKey`가 객체이고 그 객체가 effect dependency에 들어갈 때 — 사실상 드뭄)
- `useCallback` — 거의 모든 경우. 컴파일러가 동일성 보장.
- `React.memo` — 거의 모든 경우. props가 컴파일러에 의해 자동 안정화됨.

**판단 트리:**

```
useMemo/useCallback 발견
├─ 외부 라이브러리에 참조 동일성을 명시적으로 요구하는 인자로 전달되는가?
│  ├─ Yes → 보존하되 // compiler-skip 주석 추가
│  └─ No  → 제거
└─ 의존성 배열이 비어있는가 (`[]`)?
   ├─ Yes & 비싼 계산 → useMemo는 제거하되, 모듈 스코프 상수로 끌어올리는 게 더 나음
   └─ No → 제거
```

**제거 후 함수 인라인화:**

```tsx
// Before
const handleClick = useCallback(() => {
  onSelect(item.id)
}, [item.id, onSelect])

return <button onClick={handleClick}>...</button>

// After
return <button onClick={() => onSelect(item.id)}>...</button>
```

단, JSX 가독성을 해칠 정도로 로직이 길면 일반 함수로 추출 (메모이제이션 없이).

### Rule 2: forwardRef 제거 → ref-as-prop

React 19부터 ref는 일반 prop이다.

```tsx
// Before
const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <input ref={ref} {...props} />
})

// After
interface InputProps {
  ref?: React.Ref<HTMLInputElement>
  // ...
}
function Input({ ref, ...props }: InputProps) {
  return <input ref={ref} {...props} />
}
```

`src/components/common/*` 전체가 1차 타겟. `Input`, `Button`, `Checkbox`, `PasswordInput`, `SearchInput` 등 ref 받는 컴포넌트 모두.

### Rule 3: use() 훅 적용

`use()`는 Promise와 Context를 언래핑한다.

**Promise 언래핑** — 부모가 Promise를 전달하고 자식에서 `use()`:

```tsx
// 데이터 의존성이 있는 컴포넌트는 부모에서 promise를 시작하고
// 자식이 use()로 풀면 Suspense 경계와 자연스럽게 연동된다
function QuestionDetailPage({ id }: { id: string }) {
  const questionPromise = fetchQuestion(id) // 즉시 시작
  return (
    <Suspense fallback={<LoadingBox />}>
      <QuestionDetail questionPromise={questionPromise} />
    </Suspense>
  )
}

function QuestionDetail({
  questionPromise,
}: {
  questionPromise: Promise<Question>
}) {
  const question = use(questionPromise)
  return <article>{question.title}</article>
}
```

**조건부 Context 사용** — `use()`는 조건문/루프 안에서도 호출 가능:

```tsx
function Avatar({ user }: { user?: User }) {
  if (!user) return <DefaultAvatar />
  const theme = use(ThemeContext) // 조건 뒤에서도 OK (useContext는 불가)
  return <img className={theme.avatar} src={user.url} />
}
```

### Rule 4: 폼은 useActionState + useFormStatus + useOptimistic

**대상 컴포넌트:** `QuestionForm`, `AnswerForm`, `CommentForm`, `ChatInput`

```tsx
// Before — useState + handleSubmit 수동 관리
function CommentForm({ onSubmit }: Props) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(content)
      setContent('')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }
  // ...
}

// After — useActionState
function CommentForm({
  action,
}: {
  action: (content: string) => Promise<void>
}) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: FormState, formData: FormData) => {
      const content = formData.get('content') as string
      try {
        await action(content)
        return { ok: true, content: '' }
      } catch (err) {
        return { ok: false, error: (err as Error).message, content }
      }
    },
    { ok: true, content: '' }
  )

  return (
    <form action={formAction}>
      <textarea name="content" defaultValue={state.content} />
      <SubmitButton />
      {!state.ok && <p role="alert">{state.error}</p>}
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>{pending ? '저장 중...' : '등록'}</button>
}
```

**useOptimistic** — 답변/댓글 추가, 좋아요 같은 UI에 필수:

```tsx
function CommentList({ comments, addComment }: Props) {
  const [optimisticComments, addOptimistic] = useOptimistic(
    comments,
    (state, newComment: Comment) => [...state, { ...newComment, pending: true }]
  )

  async function action(formData: FormData) {
    const content = formData.get('content') as string
    addOptimistic({ id: crypto.randomUUID(), content, pending: true })
    await addComment(content)
  }

  return (
    <>
      <ul>
        {optimisticComments.map((c) => (
          <li key={c.id} className={c.pending ? 'opacity-50' : ''}>
            {c.content}
          </li>
        ))}
      </ul>
      <form action={action}>{/* ... */}</form>
    </>
  )
}
```

### Rule 5: <Activity>로 상태 보존

**대상:** `ChatbotWidget`. 열고 닫을 때 메시지 목록과 입력 상태가 보존되어야 함.

```tsx
// Before — 언마운트되면 상태 사라짐
{
  isOpen && <ChatbotWidget />
}

// After — 숨겨져도 상태/effect 보존
;<Activity mode={isOpen ? 'visible' : 'hidden'}>
  <ChatbotWidget />
</Activity>
```

`<Activity mode="hidden">`은 React가 우선순위를 낮춰 렌더링하고 effects도 일시 정지한다. SSE 같은 장기 연결은 별도로 끊는 로직이 필요 (`hidden`일 때 `EventSource.close()` 호출).

### Rule 6: useId / useSyncExternalStore

- 모든 폼 컨트롤의 `htmlFor`/`id` 페어링은 `useId()` 사용 (현재 `Input` 컴포넌트 점검 대상)
- 외부 스토어 구독(예: `window.matchMedia`, `localStorage` 변경 감지)은 `useSyncExternalStore`로

### Rule 7: 'use client' / Server Components

현재 프로젝트는 Vite + CSR이므로 `'use client'` 디렉티브 불필요. 단, 향후 RSC 마이그레이션 시 폼이 우선 후보 — `useActionState`로 미리 작성해두면 호환됨.

## useEffect 감사

리팩토링하면서 마주치는 거의 모든 `useEffect`는 다음 중 하나의 안티 패턴이다:

| 패턴                     | 대체                                   |
| ------------------------ | -------------------------------------- |
| props로 state 동기화     | 렌더 중 derived value 또는 `key` reset |
| 이벤트 핸들러를 effect로 | 이벤트 핸들러로 이동                   |
| 외부 시스템 구독         | `useSyncExternalStore`                 |
| 데이터 페칭              | TanStack Query                         |
| 부모에 알림              | 이벤트 핸들러로 부모에서 처리          |

진짜 effect가 필요한 경우는 "React 외부 시스템과의 동기화" 뿐이다 (예: DOM API 직접 조작, 외부 라이브러리 초기화).

## 변환 체크리스트 (커밋 전)

- [ ] `useMemo`/`useCallback`/`React.memo` import가 남아있는가? → 남아있으면 정당화 사유 주석 필수
- [ ] `forwardRef` import가 남아있는가? → 0이어야 함
- [ ] 모든 폼이 `useActionState` 사용? (QuestionForm/AnswerForm/CommentForm/ChatInput)
- [ ] `useEffect` 개수가 리팩토링 전보다 줄었는가?
- [ ] `eslint-plugin-react-compiler`가 에러 없이 통과하는가?
- [ ] React DevTools "Components" 탭에서 "✨ Memo" 배지가 자동으로 붙어있는가? (컴파일러가 동작 중인 신호)

## 안전 가드

리팩토링 직후 반드시 `refactor-safety-check` 스킬을 호출해서 baseline과 비교한다.

## 주의

- 컴파일러는 Rules of React를 위반하는 코드(렌더 중 mutation, ref 직접 수정 등)는 자동으로 skip한다. 이런 코드가 있으면 위 메모이제이션 제거 효과가 안 나타날 수 있으므로 먼저 fix.
- `eslint-plugin-react-hooks`의 `react-hooks/exhaustive-deps`가 컴파일러와 충돌할 수 있다. 컴파일러를 신뢰하고 룰 조정 권장.
