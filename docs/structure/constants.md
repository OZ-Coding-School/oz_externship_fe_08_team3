# constants/

앱 전역에서 사용하는 상수를 관리한다.

## 디렉토리 구조

```
src/constants/
├── roles.ts     # 사용자 역할 상수
└── routes.ts    # 라우트 경로 상수
```

## roles.ts

답변 작성/수정이 허용되는 역할 목록을 정의한다.

```ts
export const ANSWER_ALLOWED_ROLES: UserRole[] = [
  'STUDENT',
  'TA',
  'OM',
  'LC',
  'ADMIN',
]
```

- `UserRole` 타입은 `authStore.ts`에서 import
- `USER` 역할은 답변 권한 없음

## routes.ts

라우트 경로를 중앙 관리하는 상수 객체.

```ts
export const ROUTES = {
  HOME: '',
  AUTH: { LOGIN: '' },
  SIGNUP: { SELECT: '', FORM: '' },
  MYPAGE: { HOME: '', EDIT: '', CHANGE_PASSWORD: '', QUIZ: '' },
  QUIZ: { EXAM: '', RESULT: '' },
  QNA: {
    LIST: '/qna',
    WRITE: '/qna/write',
    DETAIL: '/qna/:questionId',
    EDIT: '/qna/:questionId/edit',
  },
  CHATBOT: { HOME: '/chatbot' },
  COMMUNITY: { LIST: '', WRITE: '', DETAIL: '', EDIT: '' },
} as const
```

- QNA, CHATBOT만 경로 할당됨. 나머지는 미구현 (빈 문자열)
- 라우트 추가 시 이 파일에 경로를 먼저 정의한 후 `RouterProvider.tsx`에서 사용

## 네이밍 규칙

- 상수명: SCREAMING_SNAKE_CASE (`ROUTES`, `ANSWER_ALLOWED_ROLES`)
- 파일명: camelCase (`roles.ts`, `routes.ts`)
