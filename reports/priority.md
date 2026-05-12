# Refactor Priority Queue — 2026-05-12

리팩토링은 도메인 단위 일괄로 진행한다: common → qna → chatbot

## common

| 순위 | 파일                                                    | 점수 | 키 이슈              |
| ---- | ------------------------------------------------------- | ---- | -------------------- |
| 1    | `src/components/common/Dropdown/Dropdown.tsx`           | 43.2 | useEffect×2, LOC×242 |
| 2    | `src/components/layout/Header/ProfileDropdown.tsx`      | 29.9 | useEffect×3          |
| 3    | `src/components/common/Modal/Modal.tsx`                 | 23.1 | useEffect×2          |
| 4    | `src/components/layout/DefaultLayout.tsx`               | 17.5 | —                    |
| 5    | `src/components/common/Tabs/Tabs.tsx`                   | 17   | —                    |
| 6    | `src/components/layout/Header/Header.tsx`               | 15.4 | —                    |
| 7    | `src/components/common/Toast/Toast.tsx`                 | 13.6 | useEffect×1          |
| 8    | `src/components/common/Checkbox/Checkbox.tsx`           | 11.4 | forwardRef×1         |
| 9    | `src/components/common/Input/Input.tsx`                 | 10.6 | —                    |
| 10   | `src/components/common/PasswordInput/PasswordInput.tsx` | 10.6 | forwardRef×1         |

## qna

| 순위 | 파일                                                          | 점수 | 키 이슈                          |
| ---- | ------------------------------------------------------------- | ---- | -------------------------------- |
| 1    | `src/components/qna/MarkdownEditor/MarkdownEditor.tsx`        | 58.1 | useEffect×1, LOC×441             |
| 2    | `src/components/qna/MarkdownEditor/markdownEditorCommands.ts` | 55.4 | LOC×554                          |
| 3    | `src/pages/qna/QnaEditPage.tsx`                               | 53.4 | useEffect×1, useState×6, LOC×304 |
| 4    | `src/components/qna/MarkdownEditor/markdownEditorUtils.ts`    | 52.8 | LOC×528                          |
| 5    | `src/pages/qna/QnaListPage.tsx`                               | 48.8 | useEffect×3, LOC×278             |
| 6    | `src/components/qna/AnswerForm/AnswerForm.tsx`                | 39.9 | useEffect×2, useState×5          |
| 7    | `src/features/qna/questions/handler.ts`                       | 38.7 | LOC×387                          |
| 8    | `src/components/qna/QuestionForm/QuestionForm.tsx`            | 35.4 | useEffect×1                      |
| 9    | `src/components/qna/SortPopover/SortPopover.tsx`              | 30.3 | useEffect×2                      |
| 10   | `src/pages/qna/QnaDetailPage.tsx`                             | 28.1 | LOC×221                          |

## chatbot

| 순위 | 파일                                                     | 점수 | 키 이슈              |
| ---- | -------------------------------------------------------- | ---- | -------------------- |
| 1    | `src/features/chatbot/qna/hooks/useQnaChat.ts`           | 42.4 | useEffect×1, LOC×314 |
| 2    | `src/features/chatbot/cs/hooks/useCsChat.ts`             | 35.2 | useEffect×1, LOC×242 |
| 3    | `src/components/chatbot/MessageList/MessageList.tsx`     | 16   | useEffect×1          |
| 4    | `src/components/chatbot/ChatInput/ChatInput.tsx`         | 13.1 | —                    |
| 5    | `src/features/chatbot/hub/HubView.tsx`                   | 12.1 | —                    |
| 6    | `src/components/chatbot/ChatbotHeader/ChatbotHeader.tsx` | 11.1 | —                    |
| 7    | `src/features/chatbot/qna/QnaChatView.tsx`               | 10.6 | —                    |
| 8    | `src/features/chatbot/cs/CsChatView.tsx`                 | 8.6  | —                    |
| 9    | `src/features/chatbot/qna/handler.ts`                    | 8.4  | —                    |
| 10   | `src/features/chatbot/hooks/useSSEAbort.ts`              | 8.3  | useEffect×1          |

## shared

| 순위 | 파일                               | 점수 | 키 이슈 |
| ---- | ---------------------------------- | ---- | ------- |
| 1    | `src/hooks/useCategorySelector.ts` | 21.3 | —       |
| 2    | `src/stores/chatbotStore.ts`       | 10.9 | —       |
| 3    | `src/api/interceptors.ts`          | 6.9  | —       |
| 4    | `src/providers/QueryProvider.tsx`  | 5    | —       |
| 5    | `src/hooks/useToast.ts`            | 4.9  | —       |
| 6    | `src/constants/routes.ts`          | 4.4  | —       |
| 7    | `src/stores/authStore.ts`          | 3.5  | —       |
| 8    | `src/mocks/handlers.ts`            | 3.4  | —       |
| 9    | `src/providers/RouterProvider.tsx` | 3.1  | —       |
| 10   | `src/utils/relativeTime.ts`        | 2.7  | —       |
