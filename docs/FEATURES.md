# Features 구조

## 개요

`src/features/`는 swagger.yaml의 API 엔드포인트를 기준으로 도메인별 API 연동 코드를 관리합니다. `/api-gen` 스킬로 자동 생성됩니다.

## 디렉토리 구성

```
src/features/
├── accounts/        # 인증, 계정, 프로필 (17개)
├── posts/           # 커뮤니티 게시글/댓글 (9개)
├── qna/             # 질의응답/답변 (11개)
├── exams/           # 쪽지시험 (6개)
├── chatbot/         # 챗봇 (4개)
└── course/          # 과정 정보 (1개)
```

## 도메인별 상세

### accounts/ — 인증, 계정, 프로필

| 폴더                 | API                                        | 메서드           |
| -------------------- | ------------------------------------------ | ---------------- |
| login/               | `/api/v1/accounts/login`                   | POST             |
| logout/              | `/api/v1/accounts/logout`                  | POST             |
| signup/              | `/api/v1/accounts/signup`                  | POST             |
| social-login/        | `/api/v1/accounts/social-login/{provider}` | GET              |
| me/                  | `/api/v1/accounts/me`                      | GET, PUT, DELETE |
| me-profile-image/    | `/api/v1/accounts/me/profile-image`        | PUT              |
| me-enrolled-courses/ | `/api/v1/accounts/me/enrolled-courses`     | GET              |
| me-refresh/          | `/api/v1/accounts/me/refresh`              | POST             |
| change-password/     | `/api/v1/accounts/change-password`         | PUT              |
| change-phone/        | `/api/v1/accounts/change-phone`            | PUT              |
| check-nickname/      | `/api/v1/accounts/check-nickname`          | POST             |
| find-email/          | `/api/v1/accounts/find-email`              | POST             |
| find-password/       | `/api/v1/accounts/find-password`           | POST             |
| restore/             | `/api/v1/accounts/restore`                 | POST             |
| enroll-student/      | `/api/v1/accounts/enroll-student`          | POST             |
| available-courses/   | `/api/v1/accounts/available-courses`       | GET              |
| verification/        | `/api/v1/accounts/verification/*`          | POST             |

### posts/ — 커뮤니티 게시글

| 폴더        | API                                | 메서드                 |
| ----------- | ---------------------------------- | ---------------------- |
| list/       | `/api/v1/posts`                    | GET                    |
| detail/     | `/api/v1/posts/{post_id}`          | GET                    |
| write/      | `/api/v1/posts`                    | POST                   |
| edit/       | `/api/v1/posts/{post_id}`          | PUT                    |
| delete/     | `/api/v1/posts/{post_id}`          | DELETE                 |
| like/       | `/api/v1/posts/{post_id}/like`     | POST                   |
| comments/   | `/api/v1/posts/{post_id}/comments` | GET, POST, PUT, DELETE |
| categories/ | `/api/v1/posts/categories`         | GET                    |
| search/     | `/api/v1/posts/user/search`        | GET                    |

### qna/ — 질의응답

| 폴더                | API                                             | 메서드                 |
| ------------------- | ----------------------------------------------- | ---------------------- |
| questions/          | `/api/v1/qna/questions/`                        | GET                    |
| question-detail/    | `/api/v1/qna/questions/{question_id}/`          | GET                    |
| question-write/     | `/api/v1/qna/questions/`                        | POST                   |
| question-edit/      | `/api/v1/qna/questions/{question_id}/`          | PUT                    |
| question-delete/    | `/api/v1/qna/questions/{question_id}/`          | DELETE                 |
| question-ai-answer/ | `/api/v1/qna/questions/{question_id}/ai-answer` | POST                   |
| answers/            | `/api/v1/qna/questions/{question_id}/answers`   | GET, POST, PUT, DELETE |
| answer-accept/      | `/api/v1/qna/answers/{id}/accept`               | POST                   |
| answer-comments/    | `/api/v1/qna/answers/{id}/comments`             | GET, POST              |
| categories/         | `/api/v1/qna/categories/`                       | GET                    |
| presigned-url/      | `/api/v1/qna/questions/presigned-url`           | GET                    |

### exams/ — 쪽지시험

| 폴더                   | API                                                    | 메서드 |
| ---------------------- | ------------------------------------------------------ | ------ |
| deployments/           | `/api/v1/exams/deployments`                            | GET    |
| deployment-detail/     | `/api/v1/exams/deployments/{deployment_id}`            | GET    |
| deployment-check-code/ | `/api/v1/exams/deployments/{deployment_id}/check-code` | POST   |
| deployment-status/     | `/api/v1/exams/deployments/{deployment_id}/status`     | GET    |
| submissions/           | `/api/v1/exams/submissions`                            | POST   |
| submission-detail/     | `/api/v1/exams/submissions/{submission_id}`            | GET    |

### chatbot/ — 챗봇

| 폴더            | API                                                  | 메서드    |
| --------------- | ---------------------------------------------------- | --------- |
| sessions/       | `/api/v1/chatbot/sessions/`                          | GET, POST |
| session-detail/ | `/api/v1/chatbot/sessions/{session_id}/`             | GET       |
| completions/    | `/api/v1/chatbot/sessions/{session_id}/completions/` | POST      |
| support/        | `/api/v1/chatbot/support/`                           | POST      |

### course/ — 과정 정보

| 폴더  | API              | 메서드 |
| ----- | ---------------- | ------ |
| list/ | `/api/v1/course` | GET    |

## 각 폴더 내부 구조

```
feature-name/
├── types.ts       # Request/Response interface (swagger 기반)
├── handler.ts     # MSW 핸들러 (더미 데이터)
├── queries.ts     # query factory (queryOptions) + 훅 (useSuspenseQuery/useMutation)
└── index.ts       # barrel export
```

## 코드 생성 방법

`/api-gen` 스킬로 자동 생성합니다.

```
/api-gen POST /api/v1/accounts/login
/api-gen GET /api/v1/accounts/me
/api-gen DELETE /api/v1/posts/{post_id}
```

## 페이지 ↔ features 매핑

| 페이지              | 사용하는 features                                                                                                           |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| LoginPage           | accounts/login, accounts/social-login, accounts/find-email, accounts/find-password, accounts/restore, accounts/verification |
| SignupPage          | accounts/signup, accounts/check-nickname, accounts/verification, accounts/enroll-student, accounts/available-courses        |
| MypagePage          | accounts/me, accounts/me-enrolled-courses, accounts/me-profile-image                                                        |
| MypageEditPage      | accounts/me, accounts/change-phone, accounts/check-nickname, accounts/verification                                          |
| ChangePasswordPage  | accounts/change-password                                                                                                    |
| QuizListPage        | exams/deployments                                                                                                           |
| QuizExamPage        | exams/deployment-detail, exams/deployment-check-code, exams/deployment-status, exams/submissions                            |
| QuizResultPage      | exams/submission-detail                                                                                                     |
| QnaListPage         | qna/questions, qna/categories                                                                                               |
| QnaDetailPage       | qna/question-detail, qna/answers, qna/answer-accept, qna/answer-comments, qna/question-ai-answer                            |
| QnaWritePage        | qna/question-write, qna/categories, qna/presigned-url                                                                       |
| CommunityListPage   | posts/list, posts/categories, posts/search                                                                                  |
| CommunityDetailPage | posts/detail, posts/comments, posts/like, posts/delete                                                                      |
| CommunityWritePage  | posts/write, posts/categories                                                                                               |
| 챗봇 위젯           | chatbot/sessions, chatbot/completions, chatbot/support                                                                      |
