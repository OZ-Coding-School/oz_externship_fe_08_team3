import { http, HttpResponse } from 'msw'
import type { SupportResponse } from './types'

export const supportHandlers = [
  http.post('*/chatbot/support', () => {
    const response: SupportResponse = {
      support_id: 1,
      message: '지원 요청이 접수되었습니다.',
      created_at: new Date().toISOString(),
    }
    return HttpResponse.json(response, { status: 201 })
  }),
]
