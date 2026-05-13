export interface QuestionCreateRequest {
  category_id: number
  title: string
  content: string
  img_urls?: string[]
}

export interface QuestionCreateResponse {
  message: string
  question_id: number
}
