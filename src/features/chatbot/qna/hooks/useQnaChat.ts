import { useCallback, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSSEAbort } from '@/features/chatbot/hooks/useSSEAbort'
import { useGetQnaHistory, QNA_HISTORY_QUERY_KEY } from '../queries'
import { SESSIONS_QUERY_KEY } from '@/features/chatbot/sessions/queries'
import { useChatbotStore } from '@/stores/chatbotStore'
import { useAuthStore } from '@/stores/authStore'
import { ROUTES } from '@/constants/routes'
import type { ChatMessage } from '@/features/chatbot/widgetTypes'
import type { QnaSseChunk } from '../types'

const ERROR_TEXT = '응답을 불러오지 못했습니다. 다시 시도해주세요.'

function mapHistoryToMessages(
  results: {
    role: 'user' | 'assistant'
    message?: string
    content?: string
    id?: string | number
  }[]
): ChatMessage[] {
  return results.map((item, index) => ({
    id: item.id?.toString() ?? `qna-history-${index}`,
    role: item.role,
    message: item.message ?? item.content ?? '',
  }))
}

// POST 401 시 기존 인증 처리 방식과 동일하게 로그인 리다이렉트
function redirectToLogin() {
  useAuthStore.getState().logout()
  localStorage.removeItem('accessToken')
  if (window.location.pathname !== ROUTES.AUTH.LOGIN) {
    window.location.href = ROUTES.AUTH.LOGIN
  }
}

export function useQnaChat({ questionId }: { questionId: number }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const initializedQuestionIdRef = useRef<number | null>(null)

  const { reset, abort } = useSSEAbort()
  const queryClient = useQueryClient()

  const {
    currentPageQuestionId,
    firstAnswerFromProps,
    qnaLimitExceededIds,
    markQnaLimitExceeded,
    clearQnaLimitExceeded,
  } = useChatbotStore()

  const isReadOnly = questionId !== currentPageQuestionId
  const isLimitExceeded = qnaLimitExceededIds.has(questionId)

  const {
    data: historyData,
    isLoading,
    isError,
    refetch,
  } = useGetQnaHistory(questionId)

  // 히스토리 초기화 (1차 답변 Hybrid 처리)
  useEffect(() => {
    if (!historyData || !questionId) return
    if (initializedQuestionIdRef.current === questionId) return
    initializedQuestionIdRef.current = questionId

    const results = historyData.results ?? []
    const mapped = mapHistoryToMessages(results)

    // 1차 답변: props 우선 → 히스토리 첫 assistant fallback
    // 핵심: 첫 항목이 assistant면 props 유무와 무관하게 항상 제외 (중복 방지)
    const hasFirstAnswerInHistory = mapped[0]?.role === 'assistant'
    const resolvedFirstAnswer =
      firstAnswerFromProps ??
      (hasFirstAnswerInHistory ? mapped[0].message : null)

    const conversation = hasFirstAnswerInHistory ? mapped.slice(1) : mapped

    const display: ChatMessage[] = []
    if (resolvedFirstAnswer) {
      display.push({
        id: 'qna-first-answer',
        role: 'assistant',
        message: resolvedFirstAnswer,
      })
    }
    display.push(...conversation)
    setMessages(display)

    // 히스토리 비어있으면 제한 해제 (새 세션/TTL 만료)
    if (results.length === 0) {
      clearQnaLimitExceeded(questionId)
    }
  }, [questionId, historyData, firstAnswerFromProps, clearQnaLimitExceeded])

  const sendMessage = useCallback(
    async (text: string): Promise<void> => {
      const trimmed = text.trim()
      if (
        !trimmed ||
        isStreaming ||
        isReadOnly ||
        isLimitExceeded ||
        isLoading ||
        isError
      )
        return

      // 사용자 메시지 낙관적 추가
      const userMsg: ChatMessage = {
        id: `qna-user-${crypto.randomUUID()}`,
        role: 'user',
        message: trimmed,
      }

      const assistantId = `qna-assistant-${crypto.randomUUID()}`
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        message: '',
      }

      setMessages((prev) => [...prev, userMsg, assistantMsg])
      setIsStreaming(true)

      let completed = false
      let hasReceivedChunk = false

      try {
        const signal = reset()
        const token = localStorage.getItem('accessToken')
        const baseUrl = import.meta.env.VITE_API_BASE_URL ?? ''

        const response = await fetch(
          `${baseUrl}/api/v1/qna/questions/${questionId}/chatbot`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              Accept: 'text/event-stream',
            },
            body: JSON.stringify({ message: trimmed }),
            signal,
          }
        )

        // 401 처리
        if (response.status === 401) {
          redirectToLogin()
          return
        }

        // 429 처리: 5회 초과
        if (response.status === 429) {
          setMessages((prev) => prev.filter((msg) => msg.id !== assistantId))
          markQnaLimitExceeded(questionId)
          setIsStreaming(false)
          return
        }

        // 기타 HTTP 에러
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const reader = response.body?.getReader()
        if (!reader) throw new Error('ReadableStream 없음')

        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })

          const events = buffer.split('\n\n')
          buffer = events.pop() ?? ''

          for (const event of events) {
            const line = event.split('\n').find((l) => l.startsWith('data:'))

            if (!line) continue

            const data = line.replace(/^data:\s*/, '').trim()

            if (data === '[DONE]') {
              completed = true
              break
            }

            let parsed: QnaSseChunk
            try {
              parsed = JSON.parse(data) as QnaSseChunk
            } catch {
              // malformed chunk 무시, 다음 이벤트 계속 처리
              continue
            }
            hasReceivedChunk = true

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantId
                  ? { ...msg, message: msg.message + parsed.message }
                  : msg
              )
            )
          }

          if (completed) break
        }

        // reader가 done이고 [DONE]을 못 받았더라도 정상 종료로 간주
        if (!completed && hasReceivedChunk) {
          completed = true
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          // 의도적 중단 — 무시
          return
        }

        // 에러 처리: 빈 assistant면 에러 문구로 교체, 부분 응답 있으면 별도 에러 메시지 추가
        if (hasReceivedChunk) {
          // 부분 응답 유지 + 별도 에러 메시지
          setMessages((prev) => [
            ...prev,
            {
              id: `qna-error-${Date.now()}`,
              role: 'assistant',
              message: ERROR_TEXT,
            },
          ])
        } else {
          // 빈 assistant 메시지를 에러 문구로 교체
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId ? { ...msg, message: ERROR_TEXT } : msg
            )
          )
        }
      } finally {
        setIsStreaming(false)
        if (completed) {
          queryClient.invalidateQueries({
            queryKey: [...QNA_HISTORY_QUERY_KEY(questionId)],
          })
          queryClient.invalidateQueries({
            queryKey: [...SESSIONS_QUERY_KEY],
          })
        }
      }
    },
    [
      isStreaming,
      isReadOnly,
      isLimitExceeded,
      isLoading,
      isError,
      questionId,
      reset,
      queryClient,
      markQnaLimitExceeded,
    ]
  )

  // 다시시도 시 ref 초기화하여 히스토리 재반영
  const handleRetry = useCallback(async () => {
    initializedQuestionIdRef.current = null
    await refetch()
  }, [refetch])

  return {
    messages,
    isStreaming,
    isLoading,
    isError,
    isLimitExceeded,
    isReadOnly,
    refetch: handleRetry,
    sendMessage,
    abort,
  }
}
