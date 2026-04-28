import { http, HttpResponse } from 'msw'
import type { PostCommentResponse, AnswerComment } from './types'

const MAX_COMMENT_LENGTH = 500

const MOCK_AUTHOR: AnswerComment['author'] = {
  id: 211,
  nickname: '테스트유저',
  profile_image_url: null,
}

// answerId → 댓글 목록 (MSW 인메모리 상태)
const _commentStore = new Map<number, AnswerComment[]>()
let _nextCommentId = 91001

export function getCommentsForAnswer(answerId: number): AnswerComment[] {
  return _commentStore.get(answerId) ?? []
}

export const answerCommentsHandlers = [
  http.post(
    `${import.meta.env.VITE_API_BASE_URL}/qna/answers/:answer_id/comments`,
    async ({ params, request }) => {
      const answerId = Number(params.answer_id)
      const body = (await request.json()) as { content?: string }
      const content = body.content ?? ''
      const trimmed = content.trim()

      const isInvalidContent = !trimmed || trimmed.length > MAX_COMMENT_LENGTH
      if (isInvalidContent) {
        return HttpResponse.json(
          { error_detail: '댓글 내용은 1~500자 사이로 입력해야 합니다.' },
          { status: 400 }
        )
      }

      const commentId = _nextCommentId++
      const createdAt = new Date().toISOString()

      const newComment: AnswerComment = {
        id: commentId,
        author: MOCK_AUTHOR,
        content: trimmed,
        created_at: createdAt,
        updated_at: createdAt,
      }

      const existing = _commentStore.get(answerId) ?? []
      _commentStore.set(answerId, [...existing, newComment])

      const response: PostCommentResponse = {
        comment_id: commentId,
        answer_id: answerId,
        author_id: MOCK_AUTHOR.id,
        created_at: createdAt,
      }

      return HttpResponse.json(response, { status: 201 })
    }
  ),
]
