export interface PutAnswerRequest {
  content: string
  img_urls: string[]
}

export interface PutAnswerResponse {
  answer_id: number
  updated_at: string
}
