import { http, HttpResponse } from 'msw'

export const questionDeleteHandlers = [
  http.delete('*/qna/questions/:questionId', () => {
    return HttpResponse.json(
      { message: '질문이 삭제되었습니다.' },
      { status: 200 }
    )
  }),
]
