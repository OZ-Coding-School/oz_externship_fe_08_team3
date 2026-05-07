export interface QuestionListCategory {
  id: number
  depth: number
  names: string[]
}

export interface QuestionListAuthor {
  id: number
  nickname: string
  profile_img_url: string | null
  course_name: string | null
  cohort_number: number | null
}

export interface QuestionListItem {
  id: number
  category: QuestionListCategory
  author: QuestionListAuthor
  title: string
  content_preview: string
  answer_count: number
  view_count: number
  created_at: string
  thumbnail_img_url: string | null
}

export interface QuestionsListResponse {
  count: number
  next: string | null
  previous: string | null
  results: QuestionListItem[]
}

export interface QuestionsListParams {
  page?: number
  page_size?: number
  search_keyword?: string
  category_id?: number
  answer_status?: 'answered' | 'unanswered'
  sort?: 'latest' | 'oldest'
}
