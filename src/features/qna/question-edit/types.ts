export interface QuestionUpdateRequest {
  category_id: number
  title: string
  content: string
  image_urls: string[]
}

export interface QuestionUpdateResponse {
  message: string
  question_id: number
}

export interface GetQuestionPresignedUrlRequest {
  file_name: string
}

export interface GetQuestionPresignedUrlResponse {
  presigned_url: string
  img_url: string
  key: string
}
