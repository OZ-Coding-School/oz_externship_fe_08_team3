/** POST /api/v1/chatbot/support/ 요청 */
export interface SupportRequest {
  message: string
}

/** POST /api/v1/chatbot/support/ 응답 */
export interface SupportResponse {
  support_id: number
  message: string
  created_at: string
}
