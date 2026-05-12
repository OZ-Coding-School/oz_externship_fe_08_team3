import { http, HttpResponse } from 'msw'
import type { ChatSessionDetailResponse } from './types'

const mockSessionDetail: ChatSessionDetailResponse = {
  session_id: 1,
  question_id: 42,
  question_title: '수강 신청 관련 질문',
  messages: [
    {
      role: 'user',
      content: '수강 신청은 어디서 하나요?',
      created_at: '2026-04-28T10:00:00Z',
    },
    {
      role: 'assistant',
      content: '수강 신청은 메인 페이지에서 진행하실 수 있습니다.',
      created_at: '2026-04-28T10:00:01Z',
    },
  ],
  created_at: '2026-04-28T10:00:00Z',
  updated_at: '2026-04-28T10:05:00Z',
}

export const sessionDetailHandlers = [
  http.get('*/chatbot/sessions/:sessionId/', ({ params }) => {
    const sessionId = Number(params.sessionId)
    return HttpResponse.json({ ...mockSessionDetail, session_id: sessionId })
  }),
]
