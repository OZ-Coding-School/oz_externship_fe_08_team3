import { http, HttpResponse } from 'msw'
import type { ChatSessionListResponse } from './types'

// TODO: 실제 백엔드 응답 형식 확인 후 mock 데이터 조정 필요
const mockSessions: ChatSessionListResponse = {
  // 빈 배열 테스트 시 아래 주석 해제:
  // results: [],
  results: [
    {
      session_id: 1,
      question_id: 42,
      question_title: '수강 신청 관련 질문',
      first_answer: '수강 신청은 메인 페이지에서 진행하실 수 있습니다.',
      created_at: '2026-04-28T10:00:00Z',
      updated_at: '2026-04-28T10:05:00Z',
    },
    {
      session_id: 2,
      question_id: 99,
      question_title: 'TypeScript 제네릭 설명해주세요',
      first_answer: null,
      created_at: '2026-04-27T14:00:00Z',
      updated_at: '2026-04-27T14:00:00Z',
    },
  ],
}

export const sessionsHandlers = [
  http.get('*/chatbot/sessions/', () => {
    return HttpResponse.json(mockSessions)
  }),
]
