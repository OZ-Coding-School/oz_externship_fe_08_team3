export interface PostAnswerRequest {
  content: string
  img_urls: string[]
}

export interface PostAnswerResponse {
  answer_id: number
  question_id: number
  author_id: number
  created_at: string
}
