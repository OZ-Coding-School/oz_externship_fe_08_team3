# Complexity Report — 2026-05-12

## Headline

- 총 파일: **210**
- 총 LOC: **11,668**
- 총 `useState`: **57**
- 총 `useEffect`: **25** ⚠️ 목표: 절반 이하
- 총 수동 메모이제이션 (useMemo/useCallback/React.memo): **0** ⚠️ 목표: < 10
- 총 forwardRef: **2** ⚠️ 목표: 0
- React 19 신규 훅 사용 (useActionState/useOptimistic/useId): **6**

## By Domain

| 도메인  | 파일 | LOC  | useEffect | 수동 memo | 평균 점수 |
| ------- | ---- | ---- | --------- | --------- | --------- |
| common  | 56   | 2691 | 8         | 0         | 6.04      |
| qna     | 90   | 5993 | 13        | 0         | 8.41      |
| chatbot | 45   | 1917 | 4         | 0         | 5.04      |
| shared  | 15   | 595  | 0         | 0         | 4.97      |
| other   | 4    | 472  | 0         | 0         | 18.55     |

## Top 20 Refactor Priorities

| #   | 파일                                                               | LOC | useState | useEffect | memos | fwdRef | 점수 |
| --- | ------------------------------------------------------------------ | --- | -------- | --------- | ----- | ------ | ---- |
| 1   | `src/pages/ComponentShowcase.tsx`                                  | 413 | 9        | 0         | 0     | 0      | 68.3 |
| 2   | `src/components/qna/MarkdownEditor/MarkdownEditor.tsx`             | 457 | 3        | 1         | 0     | 0      | 59.7 |
| 3   | `src/components/qna/MarkdownEditor/markdownEditorCommands.ts`      | 554 | 0        | 0         | 0     | 0      | 55.4 |
| 4   | `src/components/qna/MarkdownEditor/markdownEditorUtils.ts`         | 528 | 0        | 0         | 0     | 0      | 52.8 |
| 5   | `src/pages/qna/QnaListPage.tsx`                                    | 268 | 2        | 3         | 0     | 0      | 47.8 |
| 6   | `src/components/qna/AnswerForm/AnswerForm.tsx`                     | 189 | 5        | 2         | 0     | 0      | 43.9 |
| 7   | `src/components/common/Dropdown/Dropdown.tsx`                      | 242 | 3        | 2         | 0     | 0      | 43.2 |
| 8   | `src/pages/qna/QnaEditPage.tsx`                                    | 263 | 3        | 1         | 0     | 0      | 40.3 |
| 9   | `src/features/qna/questions/handler.ts`                            | 387 | 0        | 0         | 0     | 0      | 38.7 |
| 10  | `src/components/qna/QuestionForm/QuestionForm.tsx`                 | 184 | 4        | 1         | 0     | 0      | 35.4 |
| 11  | `src/components/qna/SortPopover/SortPopover.tsx`                   | 148 | 2        | 2         | 0     | 0      | 30.8 |
| 12  | `src/components/layout/Header/ProfileDropdown.tsx`                 | 149 | 0        | 3         | 0     | 0      | 29.9 |
| 13  | `src/pages/qna/QnaDetailPage.tsx`                                  | 214 | 2        | 0         | 0     | 0      | 27.4 |
| 14  | `src/features/chatbot/qna/hooks/useQnaChat.ts`                     | 131 | 2        | 1         | 0     | 0      | 24.1 |
| 15  | `src/components/common/Modal/Modal.tsx`                            | 131 | 0        | 2         | 0     | 0      | 23.1 |
| 16  | `src/hooks/useCategorySelector.ts`                                 | 140 | 3        | 0         | 0     | 0      | 23   |
| 17  | `src/components/layout/Header/Header.tsx`                          | 191 | 1        | 0         | 0     | 0      | 22.1 |
| 18  | `src/components/qna/MarkdownEditor/useImageUpload.ts`              | 104 | 2        | 1         | 0     | 0      | 21.4 |
| 19  | `src/components/qna/QuestionDetail/QuestionDetail.tsx`             | 213 | 0        | 0         | 0     | 0      | 21.3 |
| 20  | `src/components/qna/AiFirstAnswerSection/AiFirstAnswerSection.tsx` | 146 | 2        | 0         | 0     | 0      | 20.6 |

## Notes

- 점수 가중치: LOC×0.1 + useState×3 + useEffect×5 + memo×2 + forwardRef×4
- 컴파일러 환경에서 수동 memo는 거의 다 제거 대상
- useEffect는 거의 대부분 derived state 또는 이벤트 핸들러로 치환 가능
- forwardRef는 React 19에서 ref-as-prop으로 마이그레이션 (이 카운트는 0이 목표)
