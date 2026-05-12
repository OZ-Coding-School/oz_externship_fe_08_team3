# mocks/

MSW(Mock Service Worker) 브라우저 워커 설정을 관리한다. 실제 핸들러는 `src/features/*/handler.ts`에 위치.

## 디렉토리 구조

```
src/mocks/
├── browser.ts     # MSW 워커 인스턴스 생성
└── handlers.ts    # 전체 핸들러 집합 (features에서 import)
```

## browser.ts

```ts
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'
export const worker = setupWorker(...handlers)
```

- `main.tsx`의 `enableMocking()`에서 `worker.start()` 호출
- DEV 모드에서만 활성화
- `onUnhandledRequest: 'bypass'` — 핸들러 없는 요청은 통과

## handlers.ts

각 feature 모듈의 MSW 핸들러를 모아서 하나의 배열로 export한다.

현재 등록된 핸들러:

**QnA 도메인:**

- `answersHandlers` — 답변 CRUD
- `answerAcceptHandlers` — 답변 채택
- `answerCommentsHandlers` — 답변 댓글
- `presignedUrlHandlers` — 이미지 업로드 URL
- `categoriesHandler` — 카테고리 목록
- `questionsHandler` — 질문 목록
- `questionWriteHandler` — 질문 작성
- `questionDetailHandler` — 질문 상세
- `questionEditHandler` — 질문 수정
- `aiAnswerHandlers` — AI 답변

**Chatbot 도메인:**

- `csChatbotHandlers` — CS 챗봇
- `sessionsHandlers` — 세션 관리
- `qnaChatbotHandlers` — Q&A 챗봇

**기본:**

- `GET /api/health` — 헬스체크 (handlers.ts 내 직접 정의)

## 새 핸들러 추가 절차

1. `src/features/{domain}/{action}/handler.ts`에 핸들러 작성
2. `src/mocks/handlers.ts`에 import 추가
3. `handlers` 배열에 spread (`...newHandlers`)

## 핸들러 네이밍 규칙

- 핸들러 export명: `{도메인}{기능}Handler(s)` (예: `questionsHandler`, `answersHandlers`)
- 단수/복수는 기존 패턴 따름 (일관성 없음 — handler vs handlers 혼용)
