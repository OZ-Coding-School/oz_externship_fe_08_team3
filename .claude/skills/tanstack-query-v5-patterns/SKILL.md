---
name: tanstack-query-v5-patterns
description: TanStack Query v5.95+ 의 모던 패턴으로 features/* 디렉토리를 표준화한다. queryOptions() 팩토리 패턴, useSuspenseQuery + Suspense 경계, useMutation + onMutate 낙관적 업데이트, infiniteQueryOptions, queryKey 계층 구조, prefetch on hover/intent, retry/staleTime 정책. features/qna/* 또는 features/chatbot/* 의 queries.ts/handler.ts를 수정할 때, "쿼리", "useQuery", "API 호출", "데이터 페칭", "낙관적 업데이트", "Suspense" 같은 표현이 나올 때 반드시 사용한다. handler.ts(순수 fetcher)와 queries.ts(쿼리 정의) 분리를 강제하고, 컴포넌트에서 직접 axios를 호출하는 것을 막는다.
---

# TanStack Query v5 Patterns

`src/features/*` 의 모든 데이터 페칭을 v5.95 모던 패턴으로 통일.

## 핵심 원칙

1. **계층 분리**: `handler.ts`(순수 fetcher) → `queries.ts`(queryOptions/mutationOptions) → 컴포넌트(`useQuery` 호출)
2. **queryOptions 팩토리**: 모든 쿼리는 `queryOptions()`로 정의. 인라인 객체 금지.
3. **queryKey는 계층 구조**: `['questions']` → `['questions', 'list', filter]` → `['questions', 'detail', id]`
4. **Suspense 우선**: 페이지 레벨은 `useSuspenseQuery`, 조건부/optional은 `useQuery`

## 표준 디렉토리 구조

```
features/qna/questions/
├── types.ts        # 도메인 타입 (Question, QuestionListResponse 등)
├── handler.ts      # 순수 axios 호출 함수 (UI 모름)
├── queries.ts      # queryOptions/mutationOptions 팩토리
└── index.ts        # 외부 노출 (types + queries만, handler는 내부)
```

## handler.ts 규칙

- `axios` 인스턴스만 의존. 다른 feature import 금지.
- 순수 함수. 인자→Promise<Response>만.
- 에러는 throw (catch 안 함). 인터셉터가 처리.

```ts
// features/qna/questions/handler.ts
import { api } from '@/api/instance'
import type {
  Question,
  QuestionListParams,
  QuestionListResponse,
} from './types'

export const fetchQuestionList = async (
  params: QuestionListParams
): Promise<QuestionListResponse> => {
  const { data } = await api.get<QuestionListResponse>('/questions', { params })
  return data
}

export const fetchQuestionDetail = async (id: string): Promise<Question> => {
  const { data } = await api.get<Question>(`/questions/${id}`)
  return data
}
```

## queries.ts 규칙 (핵심)

`queryOptions()`로 팩토리 생성. queryKey는 함수 인자 기반으로.

```ts
// features/qna/questions/queries.ts
import { queryOptions, infiniteQueryOptions } from '@tanstack/react-query'
import { fetchQuestionList, fetchQuestionDetail } from './handler'
import type { QuestionListParams } from './types'

// 쿼리키 계층은 한 곳에 모은다 (오타 방지 + 부분 무효화 용이)
export const questionKeys = {
  all: ['questions'] as const,
  lists: () => [...questionKeys.all, 'list'] as const,
  list: (params: QuestionListParams) =>
    [...questionKeys.lists(), params] as const,
  details: () => [...questionKeys.all, 'detail'] as const,
  detail: (id: string) => [...questionKeys.details(), id] as const,
}

export const questionListQuery = (params: QuestionListParams) =>
  queryOptions({
    queryKey: questionKeys.list(params),
    queryFn: () => fetchQuestionList(params),
    staleTime: 30_000,
  })

export const questionDetailQuery = (id: string) =>
  queryOptions({
    queryKey: questionKeys.detail(id),
    queryFn: () => fetchQuestionDetail(id),
    staleTime: 60_000,
  })

// 무한 스크롤
export const questionInfiniteQuery = (filter: Filter) =>
  infiniteQueryOptions({
    queryKey: [...questionKeys.lists(), 'infinite', filter] as const,
    queryFn: ({ pageParam }) =>
      fetchQuestionList({ ...filter, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor,
  })
```

## 컴포넌트에서 사용

### 페이지 레벨: useSuspenseQuery

```tsx
// pages/qna/QnaDetailPage.tsx
import { useSuspenseQuery } from '@tanstack/react-query'
import { questionDetailQuery } from '@/features/qna/question-detail'

export function QnaDetailPage() {
  const { id } = useParams()
  const { data: question } = useSuspenseQuery(questionDetailQuery(id!))
  // question은 정의상 undefined가 아님 — Suspense가 처리
  return <QuestionDetail question={question} />
}
```

이때 `pages/qna/QnaDetailPage.tsx`를 감싸는 라우트에서 `<Suspense fallback={<LoadingBox />}>` 와 `<ErrorBoundary>` 를 둔다. 컴포넌트 내부에서 `isLoading`, `isError` 분기 제거.

### Mutation + 낙관적 업데이트

```ts
// features/qna/answer-accept/queries.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { acceptAnswer } from './handler'
import { questionKeys } from '../questions/queries'

export const useAcceptAnswer = (questionId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: acceptAnswer,
    onMutate: async (answerId: string) => {
      await qc.cancelQueries({ queryKey: questionKeys.detail(questionId) })
      const previous = qc.getQueryData(questionKeys.detail(questionId))
      qc.setQueryData(
        questionKeys.detail(questionId),
        (old: Question | undefined) =>
          old ? { ...old, acceptedAnswerId: answerId } : old
      )
      return { previous }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous)
        qc.setQueryData(questionKeys.detail(questionId), ctx.previous)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: questionKeys.detail(questionId) })
    },
  })
}
```

낙관적 업데이트의 4단계는 항상 동일하다: **cancel → snapshot → setQueryData → onError rollback / onSettled invalidate**.

단, React 19의 `useOptimistic`이 더 적합한 경우 그쪽을 우선 (특히 폼 내부의 UI 즉시 반영). TanStack의 `onMutate`는 캐시 전역 정합성, `useOptimistic`은 컴포넌트 로컬 UI.

### Prefetch on intent

호버/포커스 시 미리 캐싱:

```tsx
const qc = useQueryClient()
const prefetch = () => qc.prefetchQuery(questionDetailQuery(question.id))

return (
  <Link to={`/qna/${question.id}`} onMouseEnter={prefetch} onFocus={prefetch}>
    ...
  </Link>
)
```

## 정책 기본값

`providers/QueryProvider.tsx`에서:

```ts
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // 30초 fresh
      gcTime: 5 * 60_000, // 5분 후 GC
      retry: (failureCount, error) => {
        // 4xx는 재시도 안 함
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status < 500
        )
          return false
        return failureCount < 2
      },
      refetchOnWindowFocus: 'always',
    },
    mutations: {
      retry: false,
    },
  },
})
```

## SSE / 챗봇 특수 케이스

`features/chatbot/completions`는 표준 query로 안 됨. `useMutation` 안에서 SSE 스트림을 처리하되 `onMutate`로 빈 메시지를 캐시에 미리 넣고, 스트림 진행 시마다 `setQueryData`로 partial update:

```ts
export const useChatCompletion = (sessionId: string) =>
  useMutation({
    mutationFn: async (prompt: string) => {
      // SSE 처리 — features/chatbot/hooks/useSSEAbort 사용
    },
    onMutate: async (prompt) => {
      const messageId = crypto.randomUUID()
      qc.setQueryData(sessionKeys.detail(sessionId), (old: Session) => ({
        ...old,
        messages: [
          ...old.messages,
          { id: messageId, role: 'user', content: prompt },
          {
            id: messageId + '-a',
            role: 'assistant',
            content: '',
            streaming: true,
          },
        ],
      }))
      return { messageId }
    },
  })
```

## 마이그레이션 체크리스트

각 feature 디렉토리마다:

- [ ] `handler.ts`에 UI/store 의존성 없음
- [ ] `queries.ts`에 `queryOptions()`/`mutationOptions()`로 모든 쿼리 정의
- [ ] `xxxKeys` 객체로 queryKey 계층화
- [ ] 페이지 컴포넌트는 `useSuspenseQuery`
- [ ] 부분 UI는 `useQuery` (조건부일 때만)
- [ ] mutation은 onMutate/onError/onSettled 4단계 적용 (해당하는 경우)
- [ ] `index.ts`에서 handler는 export 안 함 (queries만)

## 안티 패턴 (찾으면 즉시 수정)

- 컴포넌트 안에서 `axios.get` 직접 호출 → handler.ts로 추출
- `useQuery({ queryKey: ['x'], queryFn: ... })` 인라인 정의 → queryOptions로
- queryKey 문자열 하드코딩 → xxxKeys 객체로
- `isLoading && return <Loading />` 페이지 컴포넌트 → useSuspenseQuery + Suspense
- mutation 후 `window.location.reload()` → `invalidateQueries`
