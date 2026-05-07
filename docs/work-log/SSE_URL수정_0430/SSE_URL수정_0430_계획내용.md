# SSE*URL수정\_0430*계획내용

## 작업 계획

- 전체 목표: 챗봇 CS/QNA 모듈에서 API URL `/api/v1` 이중 포함 버그 수정 (GitHub #53)

## 작업01 — CS 모듈 URL 수정 (queries + SSE fetch + MSW handler)

- [x] 완료

### 상세

- `src/features/chatbot/cs/queries.ts` (L12): `/api/v1/chatbot/completions` → `/chatbot/completions`
- `src/features/chatbot/cs/hooks/useCsChat.ts` (L97): `${baseUrl}/api/v1/chatbot/completions` → `${baseUrl}/chatbot/completions`
- `src/features/chatbot/cs/handler.ts` (L5, L25): `/api/v1/...` → `${import.meta.env.VITE_API_BASE_URL}/chatbot/completions`

## 작업02 — QNA 모듈 URL 수정 (queries + SSE fetch + MSW handler)

- [x] 완료

### 상세

- `src/features/chatbot/qna/queries.ts` (L13-14): `/api/v1/qna/questions/${questionId}/ai-answer` → `/qna/questions/${questionId}/ai-answer`
- `src/features/chatbot/qna/hooks/useQnaChat.ts` (L137-138): `${baseUrl}/api/v1/qna/questions/${questionId}/chatbot` → `${baseUrl}/qna/questions/${questionId}/chatbot`
- `src/features/chatbot/qna/handler.ts` (L5, L27): `/api/v1/...` → `${import.meta.env.VITE_API_BASE_URL}/qna/questions/...`

## 작업03 — 빌드/린트 검증 + 잔존 확인

- [x] 완료

### 상세

- `pnpm build` + `pnpm lint` 통과 확인
- `rg "api/v1"` grep으로 코드 내 하드코딩 잔존 여부 확인 (주석/types 제외)
- trailing slash 통일 여부 최종 확인
