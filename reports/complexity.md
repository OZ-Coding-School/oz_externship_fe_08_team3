# Complexity Report — 2026-05-12

## Headline

- 총 파일: **206**
- 총 LOC: **11,432**
- 총 `useState`: **60**
- 총 `useEffect`: **26** ⚠️ 목표: 절반 이하
- 총 수동 메모이제이션 (useMemo/useCallback/React.memo): **0** ⚠️ 목표: < 10
- 총 forwardRef: **2** ⚠️ 목표: 0
- React 19 신규 훅 사용 (useActionState/useOptimistic/useId): **5**

## By Domain

| 도메인  | 파일 | LOC  | useEffect | 수동 memo | 평균 점수 |
| ------- | ---- | ---- | --------- | --------- | --------- |
| common  | 56   | 2606 | 8         | 0         | 5.89      |
| qna     | 88   | 5859 | 13        | 0         | 8.56      |
| chatbot | 43   | 1917 | 5         | 0         | 5.39      |
| shared  | 15   | 578  | 0         | 0         | 4.85      |
| other   | 4    | 472  | 0         | 0         | 18.55     |

## Top 20 Refactor Priorities

| #   | 파일                                                               | LOC | useState | useEffect | memos | fwdRef | 점수 |
| --- | ------------------------------------------------------------------ | --- | -------- | --------- | ----- | ------ | ---- |
| 1   | `src/pages/ComponentShowcase.tsx`                                  | 413 | 9        | 0         | 0     | 0      | 68.3 |
| 2   | `src/components/qna/MarkdownEditor/MarkdownEditor.tsx`             | 441 | 3        | 1         | 0     | 0      | 58.1 |
| 3   | `src/components/qna/MarkdownEditor/markdownEditorCommands.ts`      | 554 | 0        | 0         | 0     | 0      | 55.4 |
| 4   | `src/pages/qna/QnaEditPage.tsx`                                    | 304 | 6        | 1         | 0     | 0      | 53.4 |
| 5   | `src/components/qna/MarkdownEditor/markdownEditorUtils.ts`         | 528 | 0        | 0         | 0     | 0      | 52.8 |
| 6   | `src/pages/qna/QnaListPage.tsx`                                    | 278 | 2        | 3         | 0     | 0      | 48.8 |
| 7   | `src/components/common/Dropdown/Dropdown.tsx`                      | 242 | 3        | 2         | 0     | 0      | 43.2 |
| 8   | `src/features/chatbot/qna/hooks/useQnaChat.ts`                     | 314 | 2        | 1         | 0     | 0      | 42.4 |
| 9   | `src/components/qna/AnswerForm/AnswerForm.tsx`                     | 149 | 5        | 2         | 0     | 0      | 39.9 |
| 10  | `src/features/qna/questions/handler.ts`                            | 387 | 0        | 0         | 0     | 0      | 38.7 |
| 11  | `src/components/qna/QuestionForm/QuestionForm.tsx`                 | 184 | 4        | 1         | 0     | 0      | 35.4 |
| 12  | `src/features/chatbot/cs/hooks/useCsChat.ts`                       | 242 | 2        | 1         | 0     | 0      | 35.2 |
| 13  | `src/components/qna/SortPopover/SortPopover.tsx`                   | 143 | 2        | 2         | 0     | 0      | 30.3 |
| 14  | `src/components/layout/Header/ProfileDropdown.tsx`                 | 149 | 0        | 3         | 0     | 0      | 29.9 |
| 15  | `src/pages/qna/QnaDetailPage.tsx`                                  | 221 | 2        | 0         | 0     | 0      | 28.1 |
| 16  | `src/components/common/Modal/Modal.tsx`                            | 131 | 0        | 2         | 0     | 0      | 23.1 |
| 17  | `src/components/qna/MarkdownEditor/useImageUpload.ts`              | 104 | 2        | 1         | 0     | 0      | 21.4 |
| 18  | `src/hooks/useCategorySelector.ts`                                 | 123 | 3        | 0         | 0     | 0      | 21.3 |
| 19  | `src/components/qna/AiFirstAnswerSection/AiFirstAnswerSection.tsx` | 146 | 2        | 0         | 0     | 0      | 20.6 |
| 20  | `src/components/qna/MarkdownEditor/useMarkdownHistory.ts`          | 86  | 2        | 1         | 0     | 0      | 19.6 |

## Notes

- 점수 가중치: LOC×0.1 + useState×3 + useEffect×5 + memo×2 + forwardRef×4
- 컴파일러 환경에서 수동 memo는 거의 다 제거 대상
- useEffect는 거의 대부분 derived state 또는 이벤트 핸들러로 치환 가능
- forwardRef는 React 19에서 ref-as-prop으로 마이그레이션 (이 카운트는 0이 목표)
