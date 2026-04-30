import { http, HttpResponse } from 'msw'
import type {
  QuestionUpdateResponse,
  GetQuestionPresignedUrlResponse,
} from './types'

export const questionEditHandler = [
  http.put(
    `${import.meta.env.VITE_API_BASE_URL}/qna/questions/:question_id/`,
    ({ params }) => {
      const response: QuestionUpdateResponse = {
        message: '질문이 성공적으로 수정되었습니다.',
        question_id: Number(params.question_id),
      }
      return HttpResponse.json(response, { status: 200 })
    }
  ),
  http.post(
    `${import.meta.env.VITE_API_BASE_URL}/qna/questions/presigned-url`,
    async ({ request }) => {
      const body = (await request.json()) as { file_name: string }
      const uuid = crypto.randomUUID()
      const key = `uploads/images/questions/${uuid}-${body.file_name}`
      const baseUrl = `https://mock-bucket.s3.ap-northeast-2.amazonaws.com/${key}`

      const response: GetQuestionPresignedUrlResponse = {
        presigned_url: `${baseUrl}?AWSAccessKeyId=mock&Signature=mock`,
        img_url: baseUrl,
        key,
      }
      return HttpResponse.json(response, { status: 200 })
    }
  ),
]
