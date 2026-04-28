import type { AnswerComment } from '../answer-comments/types'

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

export interface AnswerAuthor {
  id: number
  nickname: string
  profile_image_url: string | null
  course_name: string
  cohort_name: string
}

export interface AnswerImage {
  id: number
  img_url: string
}

export interface GetAnswerItem {
  id: number
  author: AnswerAuthor
  content: string
  is_adopted: boolean
  images: AnswerImage[]
  comments: AnswerComment[]
  created_at: string
  updated_at: string
}

export type GetAnswersResponse = GetAnswerItem[]

export interface PutAnswerRequest {
  content: string
  img_urls: string[]
}

export interface PutAnswerResponse {
  answer_id: number
  updated_at: string
}
