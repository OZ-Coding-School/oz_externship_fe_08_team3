import { http, HttpResponse } from 'msw'
import { answersHandlers } from '@/features/qna/answers'
import { answerAcceptHandlers } from '@/features/qna/answer-accept'
import { answerCommentsHandlers } from '@/features/qna/answer-comments'
import { presignedUrlHandlers } from '@/features/qna/presigned-url'
import { categoriesHandler } from '@/features/qna/categories'
import { questionsHandler } from '@/features/qna/questions'
import { questionWriteHandler } from '@/features/qna/question-write'
import { questionDetailHandler } from '@/features/qna/question-detail'

export const handlers = [
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' })
  }),
  ...answersHandlers,
  ...answerAcceptHandlers,
  ...answerCommentsHandlers,
  ...presignedUrlHandlers,
  ...categoriesHandler,
  ...questionsHandler,
  ...questionWriteHandler,
  ...questionDetailHandler,
]
