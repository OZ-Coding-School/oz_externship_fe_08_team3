# stores/

Zustand 기반 클라이언트 상태 스토어를 관리한다. 서버 상태는 TanStack Query가 담당.

## 디렉토리 구조

```
src/stores/
├── authStore.ts       # 인증 상태 (로그인/로그아웃, 사용자 정보)
└── chatbotStore.ts    # 챗봇 UI 상태 (열기/닫기, 뷰 전환)
```

## authStore

사용자 인증 상태와 프로필 정보를 관리한다.

**UserRole 타입:**

```ts
type UserRole = 'USER' | 'STUDENT' | 'TA' | 'OM' | 'LC' | 'ADMIN'
```

**User 인터페이스:**

```ts
interface User {
  id?: number
  nickname: string
  email: string
  profileImage?: string | null
  role?: UserRole
}
```

**상태 & 액션:**

| 이름            | 타입           | 설명                   |
| --------------- | -------------- | ---------------------- |
| isAuthenticated | boolean        | 로그인 여부            |
| user            | User \| null   | 현재 사용자 정보       |
| login(user)     | (User) => void | 로그인 처리            |
| logout()        | () => void     | 로그아웃 (상태 초기화) |

- devtools 미들웨어 사용 (`name: 'AuthStore'`)
- 액션별 label 지정 (`'auth/login'`, `'auth/logout'`)

## chatbotStore

챗봇 위젯의 UI 상태를 관리한다.

**ChatbotView 타입:** `features/chatbot/widgetTypes.ts`에서 import. `'cs' | 'qna' | 'hub'` 등.

**상태:**

| 이름                  | 타입           | 설명                             |
| --------------------- | -------------- | -------------------------------- |
| isOpen                | boolean        | 위젯 열림 여부                   |
| currentView           | ChatbotView    | 현재 표시 뷰 (cs, qna, hub)      |
| activeQnaQuestionId   | number \| null | Q&A 챗봇에서 활성화된 질문 ID    |
| currentPageQuestionId | number \| null | 현재 페이지의 질문 ID            |
| firstAnswerFromProps  | string \| null | Q&A 진입 시 전달된 첫 번째 답변  |
| questionTitle         | string \| null | Q&A 진입 시 전달된 질문 제목     |
| qnaLimitExceededIds   | Set\<number\>  | AI 답변 횟수 초과된 질문 ID 집합 |

**액션:**

| 이름                      | 설명                                           |
| ------------------------- | ---------------------------------------------- |
| open()                    | 위젯 열기 (CS 뷰로 초기화)                     |
| close()                   | 위젯 닫기 (상태 초기화)                        |
| toggle()                  | 열기/닫기 토글                                 |
| setView(view)             | 뷰 전환                                        |
| setCurrentPageQuestionId  | 현재 페이지 질문 ID 설정                       |
| enterQna({...})           | Q&A 챗봇 진입 (위젯 열기 + qna 뷰 + 질문 세팅) |
| markQnaLimitExceeded(id)  | AI 답변 횟수 초과 표시                         |
| clearQnaLimitExceeded(id) | AI 답변 횟수 초과 해제                         |

## 스토어 작성 규칙

- `create<State>()(devtools(...))` 패턴 사용
- devtools `name` 옵션으로 DevTools 식별명 지정
- 각 `set()` 호출 시 세 번째 인자로 액션 label 전달 (`'store/action'`)
- 타입은 스토어 파일 내 인터페이스로 정의
- 외부 타입은 해당 모듈에서 import (`UserRole`, `ChatbotView`)
