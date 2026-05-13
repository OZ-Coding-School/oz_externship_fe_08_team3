# components/

공통 UI 컴포넌트와 도메인별 컴포넌트를 관리한다.

## 디렉토리 구조

```
src/components/
├── common/           # 범용 재사용 컴포넌트
├── layout/           # 레이아웃 (Header, Footer, DefaultLayout, AuthLayout)
├── qna/              # Q&A 도메인 전용 컴포넌트
├── chatbot/          # 챗봇 도메인 전용 컴포넌트
└── index.ts          # 전체 barrel export
```

## common/ — 범용 UI 컴포넌트

| 컴포넌트          | 설명                                      |
| ----------------- | ----------------------------------------- |
| Avatar            | 기본 아바타 이미지                        |
| Badge             | 상태/카테고리 표시 뱃지                   |
| Button            | 공통 버튼 (variant, size 지원)            |
| Card              | 카드 컨테이너                             |
| Checkbox          | 체크박스 입력                             |
| Dropdown          | 드롭다운 선택                             |
| Input             | 텍스트 입력                               |
| LoadingBox        | 로딩 상태 표시 박스                       |
| Modal             | 모달 다이얼로그 (Alert, Confirm, Restore) |
| Pagination        | 페이지네이션                              |
| PasswordInput     | 비밀번호 입력 (토글 표시)                 |
| SearchInput       | 검색 입력                                 |
| SocialLoginButton | 소셜 로그인 버튼                          |
| Spinner           | 로딩 스피너                               |
| SuccessCard       | 성공 상태 카드                            |
| Tabs              | 탭 네비게이션                             |
| Toast             | 토스트 알림 (variant: success, error 등)  |
| UserAvatar        | 사용자 프로필 아바타                      |

## layout/ — 레이아웃 컴포넌트

```
layout/
├── DefaultLayout.tsx    # Header + Footer (일반 페이지)
├── AuthLayout.tsx       # Header만 (로그인, 회원가입)
├── Header/
│   ├── Header.tsx
│   ├── ProfileDropdown.tsx
│   ├── icons.tsx
│   └── index.ts
└── Footer/
    ├── Footer.tsx
    └── index.ts
```

- `DefaultLayout` — 대부분의 페이지에서 사용. `<Outlet />`으로 자식 라우트 렌더링
- `AuthLayout` — 인증 관련 페이지 전용. Header만 포함

## qna/ — Q&A 도메인 컴포넌트

| 컴포넌트             | 설명                                                |
| -------------------- | --------------------------------------------------- |
| QuestionCard         | 질문 목록 카드                                      |
| QuestionDetail       | 질문 상세 표시                                      |
| QuestionForm         | 질문 작성/수정 폼                                   |
| AnswerCard           | 답변 카드                                           |
| AnswerForm           | 답변 작성/수정 폼                                   |
| AnswerSection        | 답변 목록 영역                                      |
| AnswerPromptCard     | 답변 유도 카드                                      |
| AiFirstAnswerSection | AI 첫 답변 표시 영역                                |
| CommentForm          | 댓글 작성 폼                                        |
| CommentList          | 댓글 목록                                           |
| CategoryFilter       | 카테고리 필터 (대/중/소 3단계)                      |
| QaBadge              | Q&A 전용 뱃지 (채택, AI 등)                         |
| MarkdownEditor       | 마크다운 에디터 (이미지 업로드, 히스토리 지원)      |
| MarkdownViewer       | 마크다운 렌더러                                     |
| SortPopover          | 정렬 팝오버 (최신순/오래된순, QnaListPage에서 분리) |
| CategoryFilterModal  | 카테고리 필터 모달 (QnaListPage에서 분리)           |

### MarkdownEditor 내부 구조

```
MarkdownEditor/
├── MarkdownEditor.tsx
├── MarkdownEditor.css
├── markdownEditorConstants.ts    # 에디터 상수
├── markdownEditorCommands.ts     # 에디터 커맨드
├── useImageUpload.ts             # 이미지 업로드 훅
├── useMarkdownHistory.ts         # 실행취소/재실행 훅
└── index.ts
```

## chatbot/ — 챗봇 도메인 컴포넌트

| 컴포넌트      | 설명                   |
| ------------- | ---------------------- |
| ChatbotFab    | 챗봇 열기 FAB 버튼     |
| ChatbotWidget | 챗봇 위젯 컨테이너     |
| ChatbotHeader | 챗봇 헤더 (뷰 전환 탭) |
| ChatInput     | 채팅 메시지 입력       |
| MessageList   | 채팅 메시지 목록       |

## React 19 현대화 규칙

- **forwardRef 사용 금지** — React 19에서는 `ref`를 일반 prop으로 받음. `ref?: React.Ref<HTMLElement>`를 Props 인터페이스에 추가
- **수동 메모이제이션 금지** — `useMemo`, `useCallback`, `React.memo` 사용하지 않음. React Compiler가 자동 처리
- **default export 금지** — 모든 컴포넌트는 named export만 사용
- **CLS 방지** — `<img>` 태그에 `width`, `height` 속성 명시. 고정 크기 이미지에 `aspect-ratio` 추가
- **디자인 토큰 사용** — hex 임의값(`[#6201E0]`) 대신 Tailwind 토큰(`text-primary`) 사용. App.css `@theme`에 정의된 토큰 참조

## 파일 구조 규칙

각 컴포넌트는 폴더 단위로 구성:

```
ComponentName/
├── ComponentName.tsx    # named export (default export 금지)
├── icons.tsx            # 컴포넌트 전용 아이콘 (필요 시)
└── index.ts             # barrel export: export { ComponentName } from './ComponentName'
```

## Export 규칙

- 모든 컴포넌트는 `src/components/index.ts`에서 barrel export
- 사용처에서는 `import { Button, Modal } from '@/components'`로 import
- default export 사용 금지, 반드시 named export
