# providers/

React 컨텍스트 프로바이더를 관리한다. 앱 전체에 걸쳐 공유되는 설정을 제공.

## 디렉토리 구조

```
src/providers/
├── QueryProvider.tsx     # TanStack Query 클라이언트 설정
└── RouterProvider.tsx    # React Router 라우트 정의
```

## QueryProvider

TanStack Query의 `QueryClient`를 생성하고 앱에 주입한다.

**기본 설정:**

| 옵션                 | 값    | 설명                       |
| -------------------- | ----- | -------------------------- |
| staleTime            | 60초  | 데이터 신선도 유지 시간    |
| retry                | 1     | 실패 시 재시도 횟수        |
| refetchOnWindowFocus | false | 포커스 복귀 시 재요청 안함 |

- `useState`로 QueryClient 인스턴스를 생성하여 리렌더링 시 재생성 방지
- `App.tsx`에서 최상위에 래핑

## RouterProvider

React Router v7의 `<Routes>`를 사용하여 전체 라우트를 정의한다.

**현재 구조:**

```tsx
<Routes>
  <Route element={<DefaultLayout />}>
    {' '}
    {/* Header + Footer */}
    <Route path="qna">
      <Route index element={<QnaListPage />} />
      <Route path="write" element={<QnaWritePage />} />
      <Route path=":questionId">
        <Route index element={<QnaDetailPage />} />
        <Route path="edit" element={<QnaEditPage />} />
      </Route>
    </Route>
    <Route path="showcase" element={<ComponentShowcase />} />
  </Route>
</Routes>
```

**레이아웃 패턴:**

- `DefaultLayout` — Header + Footer. 대부분의 페이지
- `AuthLayout` — Header만. 로그인/회원가입 (미구현)

**라우트 추가 절차:**

1. `src/constants/routes.ts`에 경로 상수 추가
2. `src/pages/{domain}/`에 페이지 컴포넌트 생성
3. `RouterProvider.tsx`에 `<Route>` 추가 (적절한 레이아웃 하위에)
