/** POST /api/v1/chatbot/sessions/{session_id}/completions/ 요청 */
export interface CompletionRequest {
  message: string
}

/** SSE 스트리밍 청크 */
export interface CompletionSseChunk {
  message: string
}
