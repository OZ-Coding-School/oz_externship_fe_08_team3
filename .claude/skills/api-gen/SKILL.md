---
name: api-gen
description: Swagger 엔드포인트를 입력하면 TypeScript interface, MSW 핸들러, React Query 훅을 자동 생성합니다. API 연동 코드 생성, 엔드포인트 타입 추출, MSW 목업 생성, useSuspenseQuery/useMutation 훅 생성이 필요할 때 사용합니다.
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
argument-hint: <METHOD /path> (예: POST /api/v1/accounts/login)
---

# API Generator — Swagger 기반 코드 생성기

swagger.yaml에서 엔드포인트 정보를 추출하여 TypeScript interface, MSW 핸들러, React Query 훅을 한 번에 생성합니다.

## 실행 시 첫 단계: Swagger 최신화 확인

스킬이 호출될 때마다 swagger.yaml이 최신 상태인지 확인합니다.

```bash
curl -sf https://api.ozcodingschool.site/api/schema/ -o /tmp/swagger-latest.json 2>/dev/null
```

- 다운로드 성공 시: 기존 `swagger.yaml`과 diff를 비교한다.
  - 변경사항이 있으면 `swagger.yaml`을 업데이트하고 "swagger.yaml이 업데이트되었습니다."라고 안내한다.
  - 변경사항이 없으면 조용히 넘어간다.
- 다운로드 실패 시 (네트워크 에러, 404 등): 기존 `swagger.yaml`을 그대로 사용한다. 실패를 간단히 안내한다.

## 사전 조건: axios 인스턴스 확인

코드 생성 전에 `src/api/instance.ts`에 axios 인스턴스가 존재하는지 확인한다.

없으면 아래 내용으로 생성한다:

```typescript
// src/api/instance.ts
import axios from 'axios'

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ?? 'https://api.ozcodingschool.site',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터: access_token 자동 첨부
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

이미 존재하면 기존 파일을 그대로 사용한다.

## 입력 형식

```
/api-gen METHOD /path
```

예시:

```
/api-gen POST /api/v1/accounts/login
/api-gen GET /api/v1/accounts/me
/api-gen DELETE /api/v1/posts/{post_id}
```

## 입력 검증

- METHOD와 PATH가 모두 있는지 확인한다.
- swagger.yaml에 해당 엔드포인트가 존재하는지 확인한다.
- 없으면 비슷한 경로를 제안하고 재입력을 요청한다.

## 코드 생성 절차

### Step 1: Swagger 스키마 추출

swagger.yaml에서 해당 엔드포인트의 정보를 추출한다:

1. `paths["/api/v1/..."][method]`에서 엔드포인트 정의를 찾는다.
2. `requestBody`가 있으면 → request 스키마 추출
3. `responses["200"]` (또는 "201") → response 스키마 추출
4. `$ref`가 있으면 `components/schemas`에서 재귀적으로 해결한다.
5. 중첩 `$ref`도 모두 풀어서 완전한 타입을 만든다.

**타입 생성 우선순위:** schema 정의를 우선으로 따르되, schema가 실제 응답 구조를 충분히 반영하지 못하는 경우(예: 래핑 객체 누락) `examples`의 구조를 참고하여 보완한다. schema와 example이 함께 있으면 둘을 대조하여 실제 API 응답에 가장 가까운 타입을 생성한다.

### Step 2: 폴더 및 파일 생성

경로에서 feature 이름을 추출하여 폴더를 생성한다.

**폴더 경로 규칙:**

- `/api/v1/accounts/login` → `src/features/accounts/login/`
- `/api/v1/admin/students/{id}` → `src/features/admin/students/`
- `/api/v1/posts/{post_id}/comments` → `src/features/posts/comments/`

경로에서 `api/v1/` 접두사를 제거하고, path parameter (`{id}`, `{post_id}` 등)는 폴더명에서 제외한다.

### Step 3: types.ts 생성

swagger 스키마를 TypeScript interface로 변환한다.

**타입 변환 규칙:**

- `type: string` → `string`
- `type: integer` / `type: number` → `number`
- `type: boolean` → `boolean`
- `type: array, items: X` → `X[]`
- `type: object` → 중첩 interface
- `format: date` / `format: date-time` → `string` (주석에 형식 명시)
- `nullable: true` → `| null`
- `enum` → union type (예: `'monthly' | 'yearly'`)
- `allOf` → intersection (&)
- `oneOf` → union (|)

**네이밍 규칙:**

- Request 타입: `{OperationName}Request` (swagger의 스키마명을 camelCase로 변환)
- Response 타입: `{OperationName}Response`
- snake_case 프로퍼티는 그대로 유지한다 (API와 일치시키기 위해)

```typescript
// src/features/accounts/login/types.ts

/** POST /api/v1/accounts/login 요청 */
export interface LoginRequest {
  email: string
  password: string
}

/** POST /api/v1/accounts/login 응답 */
export interface LoginResponse {
  access_token: string
}
```

### Step 4: handler.ts 생성

MSW 핸들러를 생성한다.

```typescript
// src/features/accounts/login/handler.ts
import { http, HttpResponse } from 'msw'
import type { LoginResponse } from './types'

// POST /api/v1/accounts/login — 로그인 API
export const loginHandlers = [
  http.post('/api/v1/accounts/login', () => {
    return HttpResponse.json<LoginResponse>(
      { access_token: 'mock-access-token-abc123' },
      { status: 200 }
    )
  }),
]
```

**핸들러 생성 규칙:**

- MSW는 상대 경로를 사용한다 (baseURL 불필요, MSW가 자동 매칭).
- swagger의 `summary`나 `description`을 주석에 포함한다.
- 성공 응답에는 현실적인 한국어 더미 데이터를 생성한다.
- 에러 핸들러는 생성하지 않는다. 에러 테스트는 테스트 코드에서 `server.use()`로 오버라이드하는 방식을 사용한다.
- `request.json()` 등 결과를 사용하지 않는 호출은 작성하지 않는다. 핸들러 내에서 요청 데이터를 참조할 필요가 있을 때만 `request`를 사용한다.
- path parameter가 있으면 제네릭 타입에 반영한다: `http.get<{ post_id: string }>`
- 배열 응답은 2~3개 항목을 생성한다.
- 204 응답은 `new HttpResponse(null, { status: 204 })`를 사용한다.

### Step 5: queries.ts 생성

query factory 패턴 + axios `api` 인스턴스를 사용하여 React Query 코드를 생성한다.

**query factory 패턴:**

`queryOptions`를 사용하여 queryKey와 queryFn을 함께 관리한다. 이렇게 하면 queryKey가 한 곳에서 관리되어 invalidation이나 prefetch 시 일관성이 보장된다.

**GET 요청 → queryOptions + useSuspenseQuery:**

```typescript
// src/features/accounts/me/queries.ts
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { api } from '@/api/instance'
import type { MeResponse } from './types'

// Query Factory — queryKey와 queryFn을 한 곳에서 관리
export const meQueries = {
  all: () => queryOptions({ queryKey: ['me'] }),
  detail: () =>
    queryOptions({
      queryKey: [...meQueries.all().queryKey, 'detail'],
      queryFn: async () => {
        const { data } = await api.get<MeResponse>('/api/v1/accounts/me')
        return data
      },
    }),
}

export function useMe() {
  return useSuspenseQuery(meQueries.detail())
}
```

**GET + path parameter:**

```typescript
// src/features/posts/queries.ts
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { api } from '@/api/instance'
import type { PostDetailResponse } from './types'

export const postQueries = {
  all: () => queryOptions({ queryKey: ['posts'] }),
  lists: () =>
    queryOptions({
      queryKey: [...postQueries.all().queryKey, 'list'],
    }),
  detail: (postId: number) =>
    queryOptions({
      queryKey: [...postQueries.all().queryKey, 'detail', postId],
      queryFn: async () => {
        const { data } = await api.get<PostDetailResponse>(
          `/api/v1/posts/${postId}`
        )
        return data
      },
    }),
}

export function usePostDetail(postId: number) {
  return useSuspenseQuery(postQueries.detail(postId))
}
```

**GET + query parameter (페이지네이션 등):**

```typescript
// src/features/admin/students/queries.ts
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { api } from '@/api/instance'
import type { StudentListResponse, StudentListParams } from './types'

export const studentQueries = {
  all: () => queryOptions({ queryKey: ['admin', 'students'] }),
  list: (params?: StudentListParams) =>
    queryOptions({
      queryKey: [...studentQueries.all().queryKey, 'list', params],
      queryFn: async () => {
        const { data } = await api.get<StudentListResponse>(
          '/api/v1/admin/students/',
          { params }
        )
        return data
      },
    }),
}

export function useStudentList(params?: StudentListParams) {
  return useSuspenseQuery(studentQueries.list(params))
}
```

**POST/PUT/PATCH/DELETE → useMutation:**

```typescript
// src/features/accounts/login/queries.ts
import { useMutation } from '@tanstack/react-query'
import { api } from '@/api/instance'
import type { LoginRequest, LoginResponse } from './types'

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const { data: responseData } = await api.post<LoginResponse>(
        '/api/v1/accounts/login',
        data
      )
      return responseData
    },
  })
}
```

**훅 생성 규칙:**

- 모든 API 호출은 `api` 인스턴스(`@/lib/api`)를 사용한다. fetch를 직접 사용하지 않는다.
- GET 요청은 반드시 query factory 패턴(`queryOptions`)으로 생성한다.
- queryKey는 도메인 > 액션 > 파라미터 순서로 계층적으로 설계한다.
- path parameter가 있으면 훅의 인자로 받고 queryKey에 포함한다.
- query parameter가 있으면 params 객체로 받고 queryKey에 포함한다.
- query parameter가 있으면 types.ts에 params interface도 함께 생성한다.
- 204 응답이면 반환 타입을 `void`로 한다.

### Step 6: index.ts 생성

barrel export 파일을 생성한다.

```typescript
// src/features/accounts/login/index.ts
export type { LoginRequest, LoginResponse } from './types'
export { loginHandlers } from './handler'
export { useLogin } from './queries'
```

GET 요청의 경우 query factory도 export한다:

```typescript
// src/features/accounts/me/index.ts
export type { MeResponse } from './types'
export { meHandlers } from './handler'
export { meQueries, useMe } from './queries'
```

## 출력

생성 완료 후 아래 내용을 출력한다:

```
✅ API 코드 생성 완료

📁 src/features/{path}/
├── types.ts      — interface 정의
├── handler.ts    — MSW 핸들러
├── queries.ts    — React Query 훅 (query factory)
└── index.ts      — barrel export

📌 MSW 핸들러 등록:
  src/mocks/handlers.ts에 아래를 추가하세요:
  import { loginHandlers } from '@/features/accounts/login'
  export const handlers = [...loginHandlers]
```
