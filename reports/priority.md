# Refactor Priority Queue — 2026-05-12

리팩토링은 도메인 단위 일괄로 진행한다: common → qna → chatbot

## common

| 순위 | 파일                                               | 점수 | 키 이슈              |
| ---- | -------------------------------------------------- | ---- | -------------------- |
| 1    | `src/components/common/Dropdown/Dropdown.tsx`      | 43.2 | useEffect×2, LOC×242 |
| 2    | `src/components/layout/Header/ProfileDropdown.tsx` | 29.9 | useEffect×3          |
| 3    | `src/components/common/Modal/Modal.tsx`            | 23.1 | useEffect×2          |
| 4    | `src/components/layout/Header/Header.tsx`          | 22.1 | —                    |
| 5    | `src/components/layout/DefaultLayout.tsx`          | 17.5 | —                    |
| 6    | `src/components/common/Tabs/Tabs.tsx`              | 17   | —                    |
| 7    | `src/components/common/Toast/Toast.tsx`            | 13.6 | useEffect×1          |
| 8    | `src/components/layout/Footer/Footer.tsx`          | 11.5 | —                    |
| 9    | `src/components/common/Input/Input.tsx`            | 10.6 | —                    |
| 10   | `src/components/common/Card/Card.tsx`              | 10.5 | —                    |

## qna

| 순위 | 파일                                                          | 점수 | 키 이슈                 |
| ---- | ------------------------------------------------------------- | ---- | ----------------------- |
| 1    | `src/components/qna/MarkdownEditor/MarkdownEditor.tsx`        | 59.7 | useEffect×1, LOC×457    |
| 2    | `src/components/qna/MarkdownEditor/markdownEditorCommands.ts` | 55.4 | LOC×554                 |
| 3    | `src/components/qna/MarkdownEditor/markdownEditorUtils.ts`    | 52.8 | LOC×528                 |
| 4    | `src/pages/qna/QnaListPage.tsx`                               | 47.6 | useEffect×3, LOC×266    |
| 5    | `src/components/qna/AnswerForm/AnswerForm.tsx`                | 43.4 | useEffect×2, useState×5 |
| 6    | `src/pages/qna/QnaEditPage.tsx`                               | 39.8 | useEffect×1, LOC×258    |
| 7    | `src/features/qna/questions/handler.ts`                       | 38.7 | LOC×387                 |
| 8    | `src/components/qna/QuestionForm/QuestionForm.tsx`            | 35.4 | useEffect×1             |
| 9    | `src/components/qna/SortPopover/SortPopover.tsx`              | 30.8 | useEffect×2             |
| 10   | `src/pages/qna/QnaDetailPage.tsx`                             | 27.4 | LOC×214                 |

## chatbot

| 순위 | 파일                                                     | 점수 | 키 이슈     |
| ---- | -------------------------------------------------------- | ---- | ----------- |
| 1    | `src/features/chatbot/qna/hooks/useQnaChat.ts`           | 24.2 | useEffect×1 |
| 2    | `src/features/chatbot/hooks/sseStream.ts`                | 19   | —           |
| 3    | `src/features/chatbot/hooks/sendStreamingMessage.ts`     | 17.4 | —           |
| 4    | `src/components/chatbot/MessageList/MessageList.tsx`     | 16   | useEffect×1 |
| 5    | `src/components/chatbot/ChatInput/ChatInput.tsx`         | 13.1 | —           |
| 6    | `src/features/chatbot/cs/hooks/useCsChat.ts`             | 12.7 | —           |
| 7    | `src/features/chatbot/hub/HubView.tsx`                   | 12.1 | —           |
| 8    | `src/components/chatbot/ChatbotHeader/ChatbotHeader.tsx` | 11.1 | —           |
| 9    | `src/features/chatbot/qna/QnaChatView.tsx`               | 10.6 | —           |
| 10   | `src/features/chatbot/cs/CsChatView.tsx`                 | 8.6  | —           |

## shared

| 순위 | 파일                               | 점수 | 키 이슈     |
| ---- | ---------------------------------- | ---- | ----------- |
| 1    | `src/hooks/useCategorySelector.ts` | 23   | —           |
| 2    | `src/providers/AuthBootstrap.tsx`  | 13.1 | useEffect×1 |
| 3    | `src/stores/chatbotStore.ts`       | 10.9 | —           |
| 4    | `src/api/interceptors.ts`          | 6.9  | —           |
| 5    | `src/providers/QueryProvider.tsx`  | 5    | —           |
| 6    | `src/hooks/useToast.ts`            | 4.9  | —           |
| 7    | `src/constants/routes.ts`          | 4.3  | —           |
| 8    | `src/mocks/handlers.ts`            | 3.6  | —           |
| 9    | `src/stores/authStore.ts`          | 3.5  | —           |
| 10   | `src/providers/RouterProvider.tsx` | 3.1  | —           |
