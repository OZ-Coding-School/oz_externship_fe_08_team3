/** GET /api/v1/chatbot/sessions/{session_id}/ 응답 내 메시지 */
export interface SessionMessage {
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

/** GET /api/v1/chatbot/sessions/{session_id}/ 응답 */
export interface ChatSessionDetailResponse {
  session_id: number
  question_id: number
  question_title: string | null
  messages: SessionMessage[]
  created_at: string
  updated_at: string
}
