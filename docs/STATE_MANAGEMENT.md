# 상태 관리 가이드

이 프로젝트는 상태의 성격에 따라 두 가지 도구를 사용합니다.

| 구분                | 도구           | 용도                              |
| ------------------- | -------------- | --------------------------------- |
| **서버 상태**       | TanStack Query | API 데이터 캐싱, 동기화, 뮤테이션 |
| **클라이언트 상태** | Zustand        | 인증 정보, UI 전역 상태           |

---

## TanStack Query (서버 상태)

### 기본 설정

`src/providers/QueryProvider.tsx`에서 전역 설정을 관리합니다.

```ts
{
  staleTime: 60_000,        // 1분간 fresh 상태 유지
  retry: 1,                 // 실패 시 1회 재시도
  refetchOnWindowFocus: false
}
```

### Query — 데이터 조회

`queryOptions` 팩토리 패턴으로 쿼리를 정의하고 `useSuspenseQuery`로 소비합니다.

```ts
// features/qna/questions/queries.ts
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { instance } from '@/api/instance'
import type { QuestionListResponse } from './types'

export const questionListOptions = (params?: { search?: string }) =>
  queryOptions({
    queryKey: ['qna', 'questions', params],
    queryFn: () =>
      instance
        .get<QuestionListResponse>('/api/v1/qna/questions', { params })
        .then((r) => r.data),
  })

export function useQuestionList(params?: { search?: string }) {
  return useSuspenseQuery(questionListOptions(params))
}
```

```tsx
// 컴포넌트에서 사용
function QuestionList() {
  const { data } = useQuestionList({ search: query })
  return <ul>{data.results.map(...)}</ul>
}
```

### Mutation — 데이터 변경 (POST / PUT / PATCH / DELETE)

```ts
// features/qna/write-question/queries.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { instance } from '@/api/instance'
import type { WriteQuestionRequest } from './types'

export function useWriteQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: WriteQuestionRequest) =>
      instance.post('/api/v1/qna/questions', body).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qna', 'questions'] })
    },
  })
}
```

```tsx
function WriteForm() {
  const { mutate, isPending } = useWriteQuestion()

  const handleSubmit = (data: WriteQuestionRequest) => {
    mutate(data, { onSuccess: () => navigate('/qna') })
  }

  return <Button loading={isPending}>질문 등록</Button>
}
```

### 쿼리 키 규칙

```
[도메인, 리소스, ...파라미터]
예: ['qna', 'questions']
    ['qna', 'questions', { search: 'react' }]
    ['qna', 'question', questionId]
    ['community', 'posts']
    ['accounts', 'me']
```

- 목록 무효화: `queryClient.invalidateQueries({ queryKey: ['qna', 'questions'] })`
- 단건 무효화: `queryClient.invalidateQueries({ queryKey: ['qna', 'question', id] })`

---

## Zustand (클라이언트 상태)

### 기본 규칙

- 스토어 파일: `src/stores/{name}Store.ts`
- `devtools` 미들웨어 필수 (액션명 명시)
- 훅 이름: `use{Name}Store`

### authStore 예시

```ts
// src/stores/authStore.ts
export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (user) =>
        set({ isAuthenticated: true, user }, undefined, 'auth/login'),
      logout: () =>
        set({ isAuthenticated: false, user: null }, undefined, 'auth/logout'),
    }),
    { name: 'AuthStore' }
  )
)
```

```tsx
// 사용
function Header() {
  const { isAuthenticated, user, logout } = useAuthStore()
  return isAuthenticated ? <span>{user?.nickname}</span> : <LoginButton />
}
```

### 새 스토어 추가 패턴

```ts
// src/stores/uiStore.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface UiState {
  toastMessage: string | null
  showToast: (message: string) => void
  hideToast: () => void
}

export const useUiStore = create<UiState>()(
  devtools(
    (set) => ({
      toastMessage: null,
      showToast: (message) =>
        set({ toastMessage: message }, undefined, 'ui/showToast'),
      hideToast: () => set({ toastMessage: null }, undefined, 'ui/hideToast'),
    }),
    { name: 'UiStore' }
  )
)
```

---

## MSW (Mock Service Worker)

DEV 모드에서 자동으로 활성화되며 실제 API 없이 개발할 수 있습니다.

### 핸들러 추가

```ts
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/v1/qna/questions', () => {
    return HttpResponse.json({
      count: 2,
      results: [
        { id: 1, title: 'React 질문', status: 'pending' },
        { id: 2, title: 'TypeScript 질문', status: 'answered' },
      ],
    })
  }),

  http.post('/api/v1/qna/questions', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: 3, ...body }, { status: 201 })
  }),
]
```

> `api-gen` 스킬 사용 시 `features/{domain}/{action}/handler.ts`에 핸들러가 자동 생성되고 `handlers.ts`에 import만 추가하면 됩니다.

---

## 판단 기준 요약

```
API에서 오는 데이터인가?
  → YES → TanStack Query (서버 상태)
  → NO  → 여러 컴포넌트에서 공유하는가?
             → YES → Zustand (클라이언트 상태)
             → NO  → useState (로컬 상태)
```
