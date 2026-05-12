---
name: hash-structure-optimize
description: O(n) 배열 순회를 O(1) 해시 룩업으로 바꾼다. Array.find/some/filter 반복 → Map, 멤버십 체크 → Set, 그룹핑 → Map.groupBy/Object.groupBy, 캐싱 → Map. constants/roles.ts의 ANSWER_ALLOWED_ROLES 같은 권한 체크, 카테고리 필터, 메시지 ID 룩업, 페이지네이션 캐시 등을 다룰 때 반드시 사용한다. "최적화", "성능", "find가 느림", "중복 제거", "그룹핑", "Set", "Map" 같은 표현이 나올 때, 또는 같은 배열에 .find()/.some()을 반복 호출하는 코드를 발견했을 때 적용한다.
---

# Hash Structure Optimize

배열 기반 룩업을 해시 기반으로 전환.

## 변환 패턴

### Pattern 1: 멤버십 체크 → Set

**Before:**

```ts
// constants/roles.ts
export const ANSWER_ALLOWED_ROLES = ['admin', 'mentor', 'tutor'] as const;

// 사용처
if (ANSWER_ALLOWED_ROLES.includes(user.role)) { ... }
```

**문제:** `.includes()`는 O(n). 호출이 잦으면 누적 비용. 그리고 `as const` 배열의 `.includes()`는 타입 좁히기가 안 됨.

**After:**

```ts
// constants/roles.ts
export const ANSWER_ALLOWED_ROLES: ReadonlySet<UserRole> = new Set(['admin', 'mentor', 'tutor']);

// 사용처
if (ANSWER_ALLOWED_ROLES.has(user.role)) { ... }
```

O(1) 룩업. `has()`는 타입 안전.

복잡한 경우 type predicate 추가:

```ts
const ANSWER_ALLOWED = new Set<UserRole>(['admin', 'mentor', 'tutor'])
export const canAnswer = (role: UserRole | undefined): role is UserRole =>
  role !== undefined && ANSWER_ALLOWED.has(role)
```

### Pattern 2: 반복 find → Map 인덱스

**Before:**

```tsx
function CommentList({ comments, users }: Props) {
  return (
    <ul>
      {comments.map((c) => {
        const author = users.find((u) => u.id === c.authorId) // O(n) × m
        return (
          <li key={c.id}>
            {author?.name}: {c.content}
          </li>
        )
      })}
    </ul>
  )
}
```

**문제:** O(n × m). comments 100개, users 100개면 10,000회 비교.

**After:**

```tsx
function CommentList({ comments, users }: Props) {
  // 모듈 스코프 함수로 추출하면 더 좋지만, props라면 컴포넌트 안에서 OK
  // React Compiler가 안정화함 — 수동 useMemo 불필요
  const userMap = new Map(users.map((u) => [u.id, u]))

  return (
    <ul>
      {comments.map((c) => {
        const author = userMap.get(c.authorId)
        return (
          <li key={c.id}>
            {author?.name}: {c.content}
          </li>
        )
      })}
    </ul>
  )
}
```

O(n + m). 항상 더 빠름.

### Pattern 3: 그룹핑 → Object.groupBy / Map.groupBy

ES2024 표준 (Node 21+, 모던 브라우저 전체 지원).

**Before:**

```ts
function groupByCategory(questions: Question[]): Record<string, Question[]> {
  return questions.reduce<Record<string, Question[]>>((acc, q) => {
    ;(acc[q.categoryId] ??= []).push(q)
    return acc
  }, {})
}
```

**After:**

```ts
const groupByCategory = (questions: Question[]) =>
  Object.groupBy(questions, (q) => q.categoryId)

// 또는 Map 버전 (키가 문자열 아닐 때 유용)
const groupByCategoryMap = (questions: Question[]) =>
  Map.groupBy(questions, (q) => q.categoryId)
```

### Pattern 4: 중복 제거 → Set

**Before:**

```ts
const uniqueTags = tags.filter((t, i, arr) => arr.indexOf(t) === i)
```

**After:**

```ts
const uniqueTags = [...new Set(tags)]
```

객체 배열의 중복 제거 (특정 키 기준):

```ts
// id 기준 중복 제거
const uniqueById = [...new Map(items.map((i) => [i.id, i])).values()]
```

### Pattern 5: 인덱스 캐싱 — 페이지네이션 등

**시나리오:** `QnaListPage`에서 페이지 이동마다 같은 ID의 질문을 다시 다룬다면, 메시지 캐시처럼 ID 기반 룩업이 잦다면.

```ts
// features/qna/questions/queries.ts
// TanStack Query가 이미 캐시하니까 별도 Map은 보통 불필요
// 단, optimistic update에서 ID로 빠르게 찾아야 한다면:

const messageMap = new Map<string, Message>()
// 스트리밍 중 메시지 partial update를 O(1)로
```

### Pattern 6: 정렬된 데이터 룩업 — 이진 탐색

데이터가 정렬되어 있고 범위 쿼리가 필요한 경우만. 일반 룩업은 Map.

### Pattern 7: 두 배열 비교 → Set 연산

**Before:**

```ts
const added = newTags.filter((t) => !oldTags.includes(t))
const removed = oldTags.filter((t) => !newTags.includes(t))
```

**After:**

```ts
const oldSet = new Set(oldTags)
const newSet = new Set(newTags)

const added = newTags.filter((t) => !oldSet.has(t))
const removed = oldTags.filter((t) => !newSet.has(t))

// 또는 ES2025 Set methods (이미 모든 모던 브라우저 지원):
const addedSet = newSet.difference(oldSet)
const removedSet = oldSet.difference(newSet)
```

ES2025 Set 메서드: `.union()`, `.intersection()`, `.difference()`, `.symmetricDifference()`, `.isSubsetOf()`, `.isSupersetOf()`, `.isDisjointFrom()`.

## 프로젝트 적용 우선순위

1. **`constants/roles.ts`** — `ANSWER_ALLOWED_ROLES` → `Set`
2. **`features/qna/categories`** — 카테고리 ID 기반 룩업 Map
3. **`components/qna/CategoryFilter`** — 선택된 카테고리 멤버십 Set
4. **`features/chatbot/sessions`** — 세션 ID 기반 Map
5. **`features/chatbot/cs/qna` 채팅** — 메시지 ID 기반 Map (스트리밍 partial update)
6. **`hooks/useCategorySelector`** — 선택 상태를 Set으로 관리

## 가이드라인

- **크기 < 5**: 배열 그대로. Map/Set 오버헤드가 더 큼.
- **크기 5~50 + 룩업 1~2회**: 배열 그대로.
- **크기 50+ 또는 룩업 반복**: Map/Set.
- **렌더링 안에서 매번 .find() 반복**: 무조건 Map.

## TypeScript 타입

```ts
// 읽기 전용 Set (외부에 노출할 때)
const ALLOWED: ReadonlySet<string> = new Set([...]);

// 키-값 매핑
type RoleMap = ReadonlyMap<UserRole, RolePermissions>;

// Record와의 차이: Record는 직렬화 가능 (JSON), Map은 객체 키 가능 + 순회 순서 보장
```

## 안티 패턴

```ts
// ❌ 매 렌더 새 Set — 컴파일러가 처리하지만 모듈 스코프가 더 명시적
function Component({ items }) {
  const set = new Set(items.map((i) => i.id)) // 차라리 props 모양을 바꿔서 부모가 Set을 전달
  // ...
}

// ❌ Map을 JSON.stringify로 직렬화 — Map은 직렬화 안 됨
JSON.stringify(new Map([['a', 1]])) // → "{}"

// ❌ Set에 객체 — 참조 비교라 동일 내용 객체가 중복
new Set([{ id: 1 }, { id: 1 }]) // size 2
```

## 검증

`refactor-safety-check`로 다음 확인:

- 변환 전후 결과 deep-equal
- 벤치마크 가능하면 측정 (대부분 측정 안 해도 되지만, 핫 패스면 권장)
