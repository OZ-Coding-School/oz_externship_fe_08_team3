export interface PostCommentRequest {
  content: string
}

export interface PostCommentResponse {
  comment_id: number
  answer_id: number
  author_id: number
  created_at: string
}

export interface CommentAuthor {
  id: number
  nickname: string
  profile_image_url: string | null
}

export interface AnswerComment {
  id: number
  author: CommentAuthor
  content: string
  created_at: string
  updated_at: string
}
