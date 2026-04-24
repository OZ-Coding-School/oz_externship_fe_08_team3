import { http, HttpResponse } from 'msw'
import type { GetPresignedUrlResponse } from './types'

export const presignedUrlHandlers = [
  http.put('/api/v1/qna/answers/presigned-url', async ({ request }) => {
    const body = (await request.json()) as { file_name: string }
    const uuid = crypto.randomUUID()
    const key = `uploads/images/answers/${uuid}-${body.file_name}`
    const baseUrl = `https://mock-bucket.s3.ap-northeast-2.amazonaws.com/${key}`

    const response: GetPresignedUrlResponse = {
      presigned_url: `${baseUrl}?AWSAccessKeyId=mock&Signature=mock`,
      img_url: baseUrl,
      key,
    }
    return HttpResponse.json(response, { status: 200 })
  }),
]
