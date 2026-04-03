# 페이지 구조

## 디렉토리 구성

```
src/pages/
├── home/            # 랜딩 페이지
├── auth/            # 로그인
├── signup/          # 회원가입
├── mypage/          # 마이페이지
├── quiz/            # 쪽지시험
├── qna/             # 질의응답
├── community/       # 커뮤니티
└── ComponentShowcase.tsx  # 컴포넌트 데모 (개발용)
```

## 페이지 목록

### home/

| 파일         | 라우트 | 설명                      |
| ------------ | ------ | ------------------------- |
| HomePage.tsx | `/`    | 랜딩 페이지 (서비스 소개) |

### auth/

| 파일          | 라우트   | 설명               |
| ------------- | -------- | ------------------ |
| LoginPage.tsx | `/login` | 소셜/이메일 로그인 |

로그인 페이지 내 모달: 아이디 찾기, 비밀번호 찾기, 비밀번호 재설정, 계정 상태 확인, 계정 복구

### signup/

| 파일                 | 라우트         | 설명                       |
| -------------------- | -------------- | -------------------------- |
| SignupSelectPage.tsx | `/signup`      | 가입 방법 선택 (소셜/일반) |
| SignupPage.tsx       | `/signup/form` | 회원가입 폼                |

수강생 등록은 모달로 처리

### mypage/

| 파일                   | 라우트                    | 설명          |
| ---------------------- | ------------------------- | ------------- |
| MypagePage.tsx         | `/mypage`                 | 내 정보       |
| MypageEditPage.tsx     | `/mypage/edit`            | 정보 수정     |
| ChangePasswordPage.tsx | `/mypage/change-password` | 비밀번호 변경 |

회원 탈퇴는 모달로 처리

### quiz/

| 파일               | 라우트                 | 설명                  |
| ------------------ | ---------------------- | --------------------- |
| QuizListPage.tsx   | `/mypage/quiz`         | 쪽지시험 목록         |
| QuizExamPage.tsx   | `/quiz/:quizId/exam`   | 시험 응시 (문제 풀이) |
| QuizResultPage.tsx | `/quiz/:quizId/result` | 결과 확인             |

참가코드 입력, 제출 완료 안내는 모달로 처리

### qna/

| 파일              | 라우트                  | 설명      |
| ----------------- | ----------------------- | --------- |
| QnaListPage.tsx   | `/qna`                  | 질문 목록 |
| QnaWritePage.tsx  | `/qna/write`            | 질문 등록 |
| QnaDetailPage.tsx | `/qna/:questionId`      | 질문 상세 |
| QnaEditPage.tsx   | `/qna/:questionId/edit` | 질문 수정 |

### community/

| 파일                    | 라우트                    | 설명        |
| ----------------------- | ------------------------- | ----------- |
| CommunityListPage.tsx   | `/community`              | 게시글 목록 |
| CommunityWritePage.tsx  | `/community/write`        | 게시글 작성 |
| CommunityDetailPage.tsx | `/community/:postId`      | 게시글 상세 |
| CommunityEditPage.tsx   | `/community/:postId/edit` | 게시글 수정 |

## 모달로 처리되는 화면

별도 페이지가 아닌 해당 페이지 내 모달로 구현합니다.

| 모달                  | 트리거 페이지 |
| --------------------- | ------------- |
| 아이디 찾기           | LoginPage     |
| 아이디 찾기 결과      | LoginPage     |
| 비밀번호 찾기         | LoginPage     |
| 비밀번호 이메일 인증  | LoginPage     |
| 비밀번호 재설정       | LoginPage     |
| 계정 상태 확인        | LoginPage     |
| 계정 복구 이메일 인증 | LoginPage     |
| 수강생 등록           | SignupPage    |
| 회원 탈퇴             | MypagePage    |
| 참가코드 입력         | QuizListPage  |
| 제출 완료 안내        | QuizExamPage  |

## 페이지 파일 규칙

```
domain/
├── PageName.tsx     # 페이지 컴포넌트 (named export)
└── index.ts         # barrel export
```

- **named export만 사용**
- 라우트 상수는 `@/constants/routes.ts`에서 관리
- 페이지 내 모달은 `@/components/{domain}/` 컴포넌트를 사용
