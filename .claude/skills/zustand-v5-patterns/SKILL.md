---
name: zustand-v5-patterns
description: Zustand 5.0 의 모던 패턴으로 stores/* 를 표준화한다. useShallow 셀렉터 강제, slice 패턴으로 거대 store 분해, persist 미들웨어 안전 사용, action을 store 외부에 두는 패턴, devtools 통합. stores/authStore.ts 또는 stores/chatbotStore.ts를 수정할 때, "store", "전역 상태", "zustand", "리렌더링 최적화", "셀렉터" 같은 표현이 나올 때 반드시 사용한다. 컴포넌트가 store 전체를 구독해서 발생하는 불필요 리렌더를 잡고, store에 너무 많은 책임이 몰린 경우 slice로 분해한다.
---

# Zustand v5 Patterns

`src/stores/*` 를 v5 모범 사례로 정리.

## 핵심 원칙

1. **전체 구독 금지**: `const store = useStore()` 패턴 절대 금지. 항상 셀렉터.
2. **객체 셀렉터는 `useShallow`**: 여러 필드를 한 번에 꺼낼 때.
3. **Slice 패턴**: store가 30줄 넘으면 slice로 분리.
4. **Actions는 안정적 참조**: store 안에 정의된 함수는 자동으로 안정적 (재생성 안 됨). 외부에서 `store.getState().action()` 호출 가능.

## v5 변경점 (반드시 알아야 함)

- `create` 호출 방식: 항상 curried `create<T>()((set, get) => ({ ... }))`
- 기본 셀렉터(`useStore()` 전체)는 deprecated → 셀렉터 필수
- `useShallow`는 `zustand/react/shallow`에서 import
- 미들웨어 타입 추론 개선됨 (`StateCreator<T>`)

## 표준 Store 형태

### 단순 store

```ts
// stores/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  user: User | null
  // actions
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setAuth: (accessToken, user) => set({ accessToken, user }),
      clearAuth: () => set({ accessToken: null, user: null }),
    }),
    {
      name: 'auth',
      partialize: (s) => ({ accessToken: s.accessToken, user: s.user }), // 화이트리스트
      version: 1,
      // 스키마 변경 시 migrate 필수
    }
  )
)

// 컴포넌트 외부에서 호출하기 위한 헬퍼
export const authActions = {
  setAuth: (token: string, user: User) =>
    useAuthStore.getState().setAuth(token, user),
  clearAuth: () => useAuthStore.getState().clearAuth(),
}
```

`api/interceptors.ts`에서 `useAuthStore.getState()` 직접 호출 — 훅 사용 불가한 곳에서 유용.

### 복잡한 store는 slice로 분해

`chatbotStore`는 현재 view 상태 + 세션 + UI 토글이 섞여있을 가능성 높음 → slice 3개로:

```ts
// stores/chatbot/types.ts
export type ChatbotView = 'hub' | 'cs' | 'qna';

// stores/chatbot/viewSlice.ts
import type { StateCreator } from 'zustand';

export interface ViewSlice {
  view: ChatbotView;
  isOpen: boolean;
  setView: (v: ChatbotView) => void;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export const createViewSlice: StateCreator<ViewSlice & SessionSlice & ContextSlice, [], [], ViewSlice> = (set) => ({
  view: 'hub',
  isOpen: false,
  setView: (view) => set({ view }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
});

// stores/chatbot/sessionSlice.ts
export interface SessionSlice {
  currentSessionId: string | null;
  setCurrentSession: (id: string | null) => void;
}
export const createSessionSlice: StateCreator<ViewSlice & SessionSlice & ContextSlice, [], [], SessionSlice> = (set) => ({
  currentSessionId: null,
  setCurrentSession: (currentSessionId) => set({ currentSessionId }),
});

// stores/chatbot/contextSlice.ts — 페이지 컨텍스트 동기화 (QnaChatView 등에서 사용)
export interface ContextSlice {
  pageContext: { type: 'qna-detail'; questionId: string } | null;
  setPageContext: (ctx: ContextSlice['pageContext']) => void;
}
export const createContextSlice: StateCreator<...> = ...;

// stores/chatbotStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createViewSlice } from './chatbot/viewSlice';
import { createSessionSlice } from './chatbot/sessionSlice';
import { createContextSlice } from './chatbot/contextSlice';

export type ChatbotStore = ViewSlice & SessionSlice & ContextSlice;

export const useChatbotStore = create<ChatbotStore>()(
  devtools(
    (...a) => ({
      ...createViewSlice(...a),
      ...createSessionSlice(...a),
      ...createContextSlice(...a),
    }),
    { name: 'chatbot' }
  )
);
```

## 컴포넌트에서 사용

### 단일 필드

```tsx
const isOpen = useChatbotStore((s) => s.isOpen)
```

### 여러 필드 → useShallow 필수

```tsx
import { useShallow } from 'zustand/react/shallow'

const { view, setView, close } = useChatbotStore(
  useShallow((s) => ({ view: s.view, setView: s.setView, close: s.close }))
)
```

**`useShallow` 안 쓰면**: 매 렌더마다 새 객체가 생성되어 셀렉터가 항상 변경된 것으로 판정 → 무한 리렌더 또는 비효율.

### 안티 패턴 (즉시 수정)

```tsx
// ❌ 전체 구독 — 어떤 필드가 바뀌든 리렌더
const store = useChatbotStore()

// ❌ 셀렉터 안에서 객체 리터럴 (useShallow 없이)
const { a, b } = useChatbotStore((s) => ({ a: s.a, b: s.b }))

// ❌ 셀렉터에서 파생 계산 (매 렌더 새 객체)
const enriched = useChatbotStore((s) =>
  s.messages.map((m) => ({ ...m, time: format(m.ts) }))
)
// → 셀렉터는 raw만 꺼내고, 파생 계산은 컴포넌트 본문에서 (컴파일러가 처리)
```

## persist 주의사항

- `partialize` 필수 — 모든 상태를 persist하면 안 됨 (특히 actions, 임시 UI 상태)
- `version` + `migrate` 페어 — 스토어 형태 바뀌면 반드시
- `storage` 옵션으로 secure storage 또는 sessionStorage 선택 가능. JWT는 일반적으로 메모리 + httpOnly cookie 권장이지만, 현재 구조가 localStorage라면 XSS 대응을 별도로.
- SSR/하이드레이션 이슈 — 현재는 CSR이라 무관

## DevTools

개발 중에는 `devtools` 미들웨어 활성화. action 이름이 Redux DevTools에 뜨도록 `set(state, false, 'actionName')` 패턴 사용:

```ts
toggle: () => set((s) => ({ isOpen: !s.isOpen }), false, 'chatbot/toggle'),
```

## 마이그레이션 체크리스트

- [ ] 모든 `useXxxStore()` 호출에 셀렉터 존재
- [ ] 객체 리턴 셀렉터에 `useShallow` 적용
- [ ] `persist`에 `partialize` 있음
- [ ] store 파일이 50줄 넘으면 slice 패턴 검토
- [ ] non-React 코드(인터셉터, 유틸)에서 store 접근 시 `getState()` 사용
- [ ] action 이름 devtools에 표시되도록 라벨링

## 외부 라이브러리와의 연동

- TanStack Query 인증 토큰: `useAuthStore.getState().accessToken`을 axios 인터셉터에서 사용. 토큰 변경 시 인터셉터는 항상 최신값 읽음 (`getState()`라서).
- 로그아웃 시 `qc.clear()` 호출 필요 — 사용자별 캐시 잔류 방지.
