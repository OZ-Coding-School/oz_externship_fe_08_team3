import { http, HttpResponse, delay } from 'msw'
import type { AiFirstAnswerResponse } from './types'

export const aiAnswerHandlers = [
  http.post(
    `${import.meta.env.VITE_API_BASE_URL}/qna/questions/:questionId/ai-answer`,
    async ({ params }) => {
      await delay(1000)

      const response: AiFirstAnswerResponse = {
        id: 8751,
        question_id: Number(params.questionId),
        output: [
          '## AI 답변',
          '',
          '리스트는 **수정 가능한(mutable)** 자료구조이며, 튜플은 **수정 불가능한(immutable)** 자료구조입니다.',
          '',
          '### 주요 차이점',
          '',
          '| 항목 | list | tuple |',
          '|------|------|-------|',
          '| 변경 가능 | O | X |',
          '| 문법 | `[]` | `()` |',
          '| 속도 | 느림 | 빠름 |',
          '',
          '### 코드 예시',
          '',
          '```python',
          '# 리스트 — 수정 가능',
          'fruits = ["apple", "banana"]',
          'fruits.append("cherry")',
          'print(fruits)  # ["apple", "banana", "cherry"]',
          '',
          '# 튜플 — 수정 불가능',
          'colors = ("red", "green", "blue")',
          '# colors[0] = "yellow"  # TypeError 발생',
          '```',
          '',
          '### 언제 무엇을 쓸까?',
          '',
          '- **리스트**: 데이터가 자주 변경되는 경우',
          '- **튜플**: 변경되지 않는 고정 데이터 (좌표, 설정값 등)',
          '',
          '> 성능이 중요한 경우 튜플이 리스트보다 약간 더 빠릅니다.',
        ].join('\n'),
        using_model: 'gemini-2.5-pro',
        created_at: '2025-03-01 14:20:33',
      }

      return HttpResponse.json(response, { status: 200 })
    }
  ),
]
