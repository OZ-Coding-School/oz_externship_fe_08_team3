# pages/

라우트에 매핑되는 페이지 단위 컴포넌트를 관리한다.

## 디렉토리 구조

```
src/pages/
├── qna/
│   ├── hooks/
│   │   └── useAnswerActions.ts  # 답변 등록/수정/채택 mutation 훅 (QnaDetailPage에서 추출)
│   ├── QnaListPage.tsx          # /qna — 질문 목록 (SortPopover, CategoryFilterModal 분리됨)
│   ├── QnaDetailPage.tsx        # /qna/:questionId — 질문 상세 + 답변 + 댓글
│   ├── QnaWritePage.tsx         # /qna/write — 질문 작성
│   ├── QnaEditPage.tsx          # /qna/:questionId/edit — 질문 수정
│   └── index.ts                 # barrel export
└── ComponentShowcase.tsx        # /showcase — UI 컴포넌트 데모 (개발용)
```

## 페이지 레벨 훅

| 훅               | 위치               | 설명                                                                                     |
| ---------------- | ------------------ | ---------------------------------------------------------------------------------------- |
| useAnswerActions | `pages/qna/hooks/` | 답변 등록(postAnswer), 수정(putAnswer), 채택(acceptAnswer) mutation + 에러 핸들링 캡슐화 |

## 현재 구현된 라우트

| 경로                    | 페이지            | 레이아웃      |
| ----------------------- | ----------------- | ------------- |
| `/qna`                  | QnaListPage       | DefaultLayout |
| `/qna/write`            | QnaWritePage      | DefaultLayout |
| `/qna/:questionId`      | QnaDetailPage     | DefaultLayout |
| `/qna/:questionId/edit` | QnaEditPage       | DefaultLayout |
| `/showcase`             | ComponentShowcase | DefaultLayout |

## 미구현 페이지 (계획)

| 도메인    | 페이지              | 경로 |
| --------- | ------------------- | ---- |
| Auth      | LoginPage           | 미정 |
| Auth      | SignupPage          | 미정 |
| Mypage    | MypagePage          | 미정 |
| Mypage    | MypageEditPage      | 미정 |
| Mypage    | ChangePasswordPage  | 미정 |
| Quiz      | QuizListPage        | 미정 |
| Quiz      | QuizExamPage        | 미정 |
| Quiz      | QuizResultPage      | 미정 |
| Community | CommunityListPage   | 미정 |
| Community | CommunityDetailPage | 미정 |
| Community | CommunityWritePage  | 미정 |

## 페이지 파일 규칙

- 파일명: `{도메인}{동작}Page.tsx` (PascalCase)
- 도메인별 하위 폴더로 구분 (`pages/qna/`, `pages/community/` 등)
- 각 도메인 폴더에 `index.ts` barrel export 필수
- 페이지 컴포넌트는 named export (default export 금지)

## 페이지 ↔ features 매핑

| 페이지        | 사용하는 features                                                                                |
| ------------- | ------------------------------------------------------------------------------------------------ |
| QnaListPage   | qna/questions, qna/categories                                                                    |
| QnaDetailPage | qna/question-detail, qna/answers, qna/answer-accept, qna/answer-comments, qna/question-ai-answer |
| QnaWritePage  | qna/question-write, qna/categories, qna/presigned-url                                            |
| QnaEditPage   | qna/question-edit, qna/categories, qna/presigned-url                                             |
