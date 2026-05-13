---
name: declarative-refactor
description: 명령형 분기 코드를 선언적 패턴으로 변환한다. switch/if-else 사다리를 룩업 객체와 Map으로, 중첩 조건을 가드 절(early return)로, 명령형 useEffect를 derived state로, 절차적 변환을 함수 파이프라인으로. .ts/.tsx 파일에 if-else가 3개 이상 연쇄되거나, switch 문이 있거나, 깊이 2 이상의 중첩 조건이 있거나, "복잡도", "리팩토링", "가독성", "if문", "switch문", "선언적", "분기" 같은 표현이 나올 때 반드시 사용한다. 결과적으로 cyclomatic complexity와 cognitive complexity를 낮추는 것이 목표.
---

# Declarative Refactor

명령형 패턴을 선언적으로 바꿔서 복잡도를 줄이는 변환 카탈로그.

## 변환 패턴

### Pattern 1: if-else 사다리 → 룩업 객체

**Before:**

```ts
function getBadgeColor(status: QuestionStatus): string {
  if (status === 'open') return 'blue'
  else if (status === 'answered') return 'green'
  else if (status === 'accepted') return 'purple'
  else if (status === 'closed') return 'gray'
  else return 'gray'
}
```

**After:**

```ts
const BADGE_COLOR = {
  open: 'blue',
  answered: 'green',
  accepted: 'purple',
  closed: 'gray',
} as const satisfies Record<QuestionStatus, string>

const getBadgeColor = (status: QuestionStatus) => BADGE_COLOR[status]
```

**효과:**

- 분기 0개. cyclomatic complexity 5 → 1.
- 타입 시스템이 케이스 누락을 잡아줌 (`satisfies Record<QuestionStatus, ...>`)
- 모듈 스코프 상수라 매 호출마다 재생성 없음

### Pattern 2: switch → 디스패치 객체

**Before:**

```ts
function reducer(state, action) {
  switch (action.type) {
    case 'add':
      return { ...state, items: [...state.items, action.item] }
    case 'remove':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) }
    case 'clear':
      return { ...state, items: [] }
    default:
      return state
  }
}
```

**After:**

```ts
const handlers = {
  add: (s: State, a: AddAction) => ({ ...s, items: [...s.items, a.item] }),
  remove: (s: State, a: RemoveAction) => ({
    ...s,
    items: s.items.filter((i) => i.id !== a.id),
  }),
  clear: (s: State) => ({ ...s, items: [] }),
} satisfies {
  [K in Action['type']]: (s: State, a: Extract<Action, { type: K }>) => State
}

const reducer = (state: State, action: Action): State =>
  (handlers[action.type] as any)(state, action)
```

### Pattern 3: 중첩 조건 → 가드 절

**Before:**

```ts
function canAnswer(user: User | null, question: Question): boolean {
  if (user) {
    if (!question.closed) {
      if (ANSWER_ALLOWED_ROLES.has(user.role)) {
        if (question.authorId !== user.id) {
          return true
        }
      }
    }
  }
  return false
}
```

**After:**

```ts
function canAnswer(user: User | null, question: Question): boolean {
  if (!user) return false
  if (question.closed) return false
  if (!ANSWER_ALLOWED_ROLES.has(user.role)) return false
  if (question.authorId === user.id) return false
  return true
}
```

또는 더 선언적으로:

```ts
const ANSWER_RULES = [
  (u: User | null, _q: Question) => u !== null,
  (_u: User | null, q: Question) => !q.closed,
  (u: User | null, _q: Question) => ANSWER_ALLOWED_ROLES.has(u!.role),
  (u: User | null, q: Question) => q.authorId !== u!.id,
] as const

const canAnswer = (user: User | null, question: Question) =>
  ANSWER_RULES.every((rule) => rule(user, question))
```

### Pattern 4: 명령형 useEffect → derived state

**Before:**

```tsx
function QuestionCard({ question }: Props) {
  const [isHot, setIsHot] = useState(false)
  useEffect(() => {
    if (question.viewCount > 100 && question.answerCount > 5) {
      setIsHot(true)
    } else {
      setIsHot(false)
    }
  }, [question.viewCount, question.answerCount])
  // ...
}
```

**After:**

```tsx
function QuestionCard({ question }: Props) {
  const isHot = question.viewCount > 100 && question.answerCount > 5
  // ...
}
```

useEffect 안에서 setState하는 패턴은 거의 항상 derived state로 치환 가능.

### Pattern 5: 절차적 변환 → 파이프라인

**Before:**

```ts
function processQuestions(raw: RawQuestion[]): Question[] {
  const result: Question[] = []
  for (const r of raw) {
    if (r.deletedAt) continue
    const q: Question = {
      id: r.id,
      title: r.title.trim(),
      body: r.body,
      tags: r.tags?.split(',') ?? [],
      score: r.upvotes - r.downvotes,
    }
    if (q.score > -5) {
      result.push(q)
    }
  }
  result.sort((a, b) => b.score - a.score)
  return result
}
```

**After:**

```ts
const isVisible = (r: RawQuestion) => !r.deletedAt
const normalize = (r: RawQuestion): Question => ({
  id: r.id,
  title: r.title.trim(),
  body: r.body,
  tags: r.tags?.split(',') ?? [],
  score: r.upvotes - r.downvotes,
})
const isNotBuried = (q: Question) => q.score > -5
const byScoreDesc = (a: Question, b: Question) => b.score - a.score

const processQuestions = (raw: RawQuestion[]): Question[] =>
  raw.filter(isVisible).map(normalize).filter(isNotBuried).sort(byScoreDesc)
```

각 단계가 명명된 작은 함수가 되어 테스트하기도 쉽고 의도가 드러남.

### Pattern 6: 조건부 JSX → 조건부 컴포넌트/맵

**Before:**

```tsx
function AnswerSection({ question }: Props) {
  return (
    <section>
      {question.aiAnswer ? (
        <AiFirstAnswerSection answer={question.aiAnswer} />
      ) : null}
      {question.answers.length === 0 ? (
        <AnswerPromptCard />
      ) : (
        question.answers.map((a) => <AnswerCard key={a.id} answer={a} />)
      )}
      {question.closed ? null : <AnswerForm questionId={question.id} />}
    </section>
  )
}
```

**After (가드 절 + 단순 표현):**

```tsx
function AnswerSection({ question }: Props) {
  const hasAnswers = question.answers.length > 0
  return (
    <section>
      {question.aiAnswer && <AiFirstAnswerSection answer={question.aiAnswer} />}
      {hasAnswers ? (
        question.answers.map((a) => <AnswerCard key={a.id} answer={a} />)
      ) : (
        <AnswerPromptCard />
      )}
      {!question.closed && <AnswerForm questionId={question.id} />}
    </section>
  )
}
```

`x ? y : null` 패턴은 `x && y`로 단순화. 단, x가 숫자 0이 될 수 있으면 `Boolean(x) &&` 또는 `x != null &&`.

### Pattern 7: 컴포넌트 분기를 맵으로

**Before — ChatbotWidget 내부 view 분기:**

```tsx
function ChatbotWidget() {
  const view = useChatbotStore((s) => s.view)
  if (view === 'hub') return <HubView />
  if (view === 'cs') return <CsChatView />
  if (view === 'qna') return <QnaChatView />
  return null
}
```

**After:**

```tsx
const VIEWS: Record<ChatbotView, () => ReactElement> = {
  hub: () => <HubView />,
  cs: () => <CsChatView />,
  qna: () => <QnaChatView />,
}

function ChatbotWidget() {
  const view = useChatbotStore((s) => s.view)
  const View = VIEWS[view]
  return <View />
}
```

새 view 추가 시 한 줄. 타입이 케이스 누락 검출.

## 안티 패턴 탐지

리팩토링 시 다음 패턴을 우선 탐지:

| 패턴                 | 신호                                                            |
| -------------------- | --------------------------------------------------------------- |
| if-else 사다리       | 같은 변수에 대한 비교가 3회 이상                                |
| 깊은 중첩            | 들여쓰기 깊이 4 이상                                            |
| 불필요한 effect      | `useEffect`가 `setState`만 호출                                 |
| 변수 재할당으로 빌드 | `let result = ...; for (...) result.push(...)`                  |
| boolean 깃발 변수    | `let found = false; ... if (cond) found = true` → `.some()`으로 |

## 검증

각 변환 후:

1. ESLint `sonarjs/cognitive-complexity` 룰 적용 (임계값 15)
2. ESLint `complexity` 룰 (임계값 10)
3. 변환 전후 줄 수 비교 (대부분 줄어들어야 함)
4. 함수 인자/리턴 타입은 그대로 유지

선언적 변환은 **외부 동작을 바꾸지 않음**. 동일 입력 → 동일 출력. Playwright 회귀 통과 필수.

## 함께 쓰는 스킬

- `hash-structure-optimize`: 룩업 객체가 커지면 Map/Set으로
- `complexity-measure`: 변환 우선순위 결정
- `refactor-safety-check`: 변환 후 검증
