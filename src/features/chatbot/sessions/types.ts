// TODO: GET /api/v1/chatbot/sessions/ 실제 백엔드 응답과 필드명이 다를 수 있음
// FEATURES.md 기준 작성, 실제 연동 시 타입과 매핑 조정 필요

/** GET /api/v1/chatbot/sessions/ 응답 내 개별 세션 */
export interface ChatSession {
  session_id: number
  question_id: number
  question_title: string | null
  first_answer: string | null
  created_at: string
  updated_at: string
}

/** GET /api/v1/chatbot/sessions/ 응답 */
export interface ChatSessionListResponse {
  results: ChatSession[]
}
