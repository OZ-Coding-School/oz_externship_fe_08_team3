import type { GetAnswerItem } from '@/features/qna/answers'

export interface QuestionAuthor {
  id: number
  nickname: string
  profile_image_url: string | null
  course_name: string
  cohort_name: string
}

export interface QuestionImage {
  id: number
  img_url: string
}

export interface QuestionCategory {
  id: number
  name: string
}

// swagger QuestionListDetail 기반
export interface GetQuestionDetailResponse {
  id: number
  title: string
  content: string
  category: QuestionCategory
  images: QuestionImage[]
  view_count: number
  created_at: string
  updated_at: string
  author: QuestionAuthor
  answers: GetAnswerItem[]
}
