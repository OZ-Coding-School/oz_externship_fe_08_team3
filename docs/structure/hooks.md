# hooks/

앱 전역에서 재사용하는 커스텀 React 훅을 관리한다. 도메인 특화 훅은 해당 feature 또는 component 폴더 내부에 위치한다.

## 디렉토리 구조

```
src/hooks/
├── useCategorySelector.ts    # Q&A 카테고리 3단계 선택 로직
└── useToast.ts               # 토스트 알림 상태 관리
```

## useCategorySelector

Q&A 카테고리의 대/중/소 3단계 드롭다운 선택 로직을 캡슐화한다.

- `useQnaCategories()`로 카테고리 데이터를 가져옴
- 대분류 선택 시 중분류/소분류 자동 초기화
- `initialCategoryId`로 수정 페이지에서 기존 카테고리를 역추적하여 세팅
- `resolvedCategoryId`로 최종 선택된 카테고리 ID 반환 (가장 하위 단계 우선)

**반환값:**

- `largeCategoryId`, `mediumCategoryId`, `smallCategoryId` — 각 단계 선택값
- `largeOptions`, `mediumOptions`, `smallOptions` — 드롭다운 옵션
- `handleLargeChange`, `handleMediumChange`, `handleSmallChange` — 변경 핸들러
- `handleReset` — 전체 초기화
- `resolvedCategoryId` — 최종 카테고리 ID

**사용처:** `QnaWritePage`, `QnaEditPage`의 카테고리 선택 UI

## useToast

토스트 알림의 표시/숨김 상태를 관리한다.

```ts
const { toast, showToast, hideToast } = useToast()
showToast('저장되었습니다', 'success')
```

- `ToastVariant` 타입은 `@/components`에서 import
- `toast.visible`이 true일 때 `toast.message`, `toast.variant` 접근 가능

## 도메인 특화 훅 위치 (참고)

| 훅                 | 위치                             | 설명                 |
| ------------------ | -------------------------------- | -------------------- |
| useImageUpload     | `components/qna/MarkdownEditor/` | 에디터 이미지 업로드 |
| useMarkdownHistory | `components/qna/MarkdownEditor/` | 에디터 undo/redo     |
| useCsChat          | `features/chatbot/cs/`           | CS 챗봇 채팅 로직    |
| useQnaChat         | `features/chatbot/qna/`          | Q&A 챗봇 채팅 로직   |
| useSSEAbort        | `features/chatbot/hooks/`        | SSE 연결 중단 관리   |

## 추가 규칙

- 2개 이상의 페이지/컴포넌트에서 사용하는 훅만 `src/hooks/`에 배치
- 단일 컴포넌트 전용 훅은 해당 컴포넌트 폴더 내부에 위치
- 단일 도메인 전용 훅은 해당 feature 폴더 내부에 위치
