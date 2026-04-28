import { http, HttpResponse } from 'msw'
import type {
  PostAnswerResponse,
  GetAnswersResponse,
  PutAnswerResponse,
} from './types'

// MSW 픽스처 상수
const MOCK_ANSWER_ID = 801
const MOCK_AUTHOR_ID = 211

// MSW 상태 — accept POST 후 GET 응답에 반영
const _adoptedAnswerIds = new Set<number>()

export function markAnswerAdopted(answerId: number) {
  _adoptedAnswerIds.add(answerId)
}

// answerId → questionId 매핑 — accept handler에서 dynamic question_id 반환에 사용
const _answerQuestionMap = new Map<number, number>()

export function getQuestionIdByAnswer(answerId: number): number {
  return _answerQuestionMap.get(answerId) ?? 0
}

export const answersHandlers = [
  http.get(
    `${import.meta.env.VITE_API_BASE_URL}/qna/questions/:question_id/answers`,
    ({ params }) => {
      // GET 시점에 매핑 초기화 — POST answer 이전 채택 시나리오도 커버
      _answerQuestionMap.set(MOCK_ANSWER_ID, Number(params.question_id))
      const response: GetAnswersResponse = [
        {
          id: MOCK_ANSWER_ID,
          author: {
            id: MOCK_AUTHOR_ID,
            nickname: '테스트유저',
            profile_image_url: null,
            course_name: 'OZ 코딩스쿨',
            cohort_name: '8기',
          },
          content: '기존 답변 내용입니다.\n\n마크다운으로 작성된 답변입니다.',
          is_adopted: _adoptedAnswerIds.has(MOCK_ANSWER_ID),
          images: [],
          comments: [
            {
              id: 1001,
              author: { id: 301, nickname: '댓글러', profile_image_url: null },
              content: '도움이 많이 되었습니다. 감사해요!',
              created_at: new Date(Date.now() - 3600000).toISOString(),
              updated_at: new Date(Date.now() - 3600000).toISOString(),
            },
            {
              id: 1002,
              author: {
                id: 302,
                nickname: '개발공부중',
                profile_image_url: null,
              },
              content: '저도 같은 문제로 고민했는데 덕분에 해결했어요.',
              created_at: new Date(Date.now() - 1800000).toISOString(),
              updated_at: new Date(Date.now() - 1800000).toISOString(),
            },
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]
      return HttpResponse.json(response, { status: 200 })
    }
  ),

  http.post(
    `${import.meta.env.VITE_API_BASE_URL}/qna/questions/:question_id/answers`,
    ({ params }) => {
      const questionId = Number(params.question_id)
      _answerQuestionMap.set(MOCK_ANSWER_ID, questionId)
      const response: PostAnswerResponse = {
        answer_id: MOCK_ANSWER_ID,
        question_id: questionId,
        author_id: MOCK_AUTHOR_ID,
        created_at: new Date().toISOString(),
      }
      return HttpResponse.json(response, { status: 201 })
    }
  ),

  http.put(
    `${import.meta.env.VITE_API_BASE_URL}/qna/answers/:id`,
    ({ params }) => {
      const response: PutAnswerResponse = {
        answer_id: Number(params.id),
        updated_at: new Date().toISOString(),
      }
      return HttpResponse.json(response, { status: 200 })
    }
  ),
]
