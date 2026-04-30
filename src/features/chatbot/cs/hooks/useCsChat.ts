import { useCallback, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSSEAbort } from '@/features/chatbot/hooks/useSSEAbort'
import { useGetCsHistory, CS_HISTORY_QUERY_KEY } from '../queries'
import type { ChatMessage } from '@/features/chatbot/widgetTypes'
import type { CsSseChunk } from '../types'
import { useAuthStore } from '@/stores/authStore'
import { ROUTES } from '@/constants/routes'

const WELCOME_MESSAGE: ChatMessage = {
  id: 'cs-welcome',
  role: 'assistant',
  message: '안녕하세요. 무엇을 도와드릴까요?',
}

const ERROR_TEXT = '응답을 불러오지 못했습니다. 다시 시도해주세요.'
const ERROR_BUFFER_TEXT = '응답이 너무 길어 중단되었습니다.'
const SSE_MAX_BUFFER_SIZE = 100_000

function mapHistoryToMessages(
  results: {
    role: 'user' | 'assistant'
    message?: string
    content?: string
    id?: string | number
  }[]
): ChatMessage[] {
  return results.map((item, index) => ({
    id: item.id?.toString() ?? `cs-history-${index}`,
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

export function useCsChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const hasInitializedHistoryRef = useRef(false)

  const { reset, abort } = useSSEAbort()
  const queryClient = useQueryClient()
  const { data: historyData, isLoading, isError, refetch } = useGetCsHistory()

  // 히스토리 초기화 (최초 1회)
  useEffect(() => {
    if (hasInitializedHistoryRef.current) return
    if (!historyData) return

    hasInitializedHistoryRef.current = true

    const results = historyData.results ?? []

    if (results.length === 0) {
      setMessages([WELCOME_MESSAGE])
    } else {
      setMessages(mapHistoryToMessages(results))
    }
  }, [historyData])

  const sendMessage = useCallback(
    async (text: string): Promise<void> => {
      const trimmed = text.trim()
      if (!trimmed || isStreaming) return

      // 사용자 메시지 낙관적 추가
      const userMsg: ChatMessage = {
        id: `cs-user-${crypto.randomUUID()}`,
        role: 'user',
        message: trimmed,
      }

      const assistantId = `cs-assistant-${crypto.randomUUID()}`
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        message: '',
      }

      setMessages((prev) => [...prev, userMsg, assistantMsg])
      setIsStreaming(true)

      let completed = false
      let hasReceivedChunk = false
      let bufferExceeded = false
      let assistantText = ''

      try {
        const signal = reset()
        const token = localStorage.getItem('accessToken')
        const baseUrl = import.meta.env.VITE_API_BASE_URL ?? ''

        const response = await fetch(`${baseUrl}/chatbot/completions`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
          },
          body: JSON.stringify({ message: trimmed }),
          signal,
        })

        // 401 처리
        if (response.status === 401) {
          redirectToLogin()
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

            let parsed: CsSseChunk
            try {
              parsed = JSON.parse(data) as CsSseChunk
            } catch {
              // malformed chunk 무시, 다음 이벤트 계속 처리
              continue
            }
            hasReceivedChunk = true

            // assistant 누적 답변 길이 체크 (setMessages 전에 수행)
            assistantText += parsed.message
            if (assistantText.length > SSE_MAX_BUFFER_SIZE) {
              bufferExceeded = true
              abort()
              break
            }

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantId
                  ? { ...msg, message: msg.message + parsed.message }
                  : msg
              )
            )
          }

          if (completed || bufferExceeded) break
        }

        // 버퍼 초과로 중단된 경우: 부분 응답 유지 + 에러 메시지
        if (bufferExceeded) {
          setMessages((prev) => [
            ...prev,
            {
              id: `cs-error-${crypto.randomUUID()}`,
              role: 'assistant',
              message: ERROR_BUFFER_TEXT,
            },
          ])
          return
        }

        // reader가 done이고 [DONE]을 못 받았더라도 정상 종료로 간주
        if (!completed && hasReceivedChunk) {
          completed = true
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          // bufferExceeded는 루프 직후에서 이미 처리됨
          // 사용자 abort (X/뒤로가기/ESC) — 무시
          return
        }

        // 에러 처리: 빈 assistant면 에러 문구로 교체, 부분 응답 있으면 별도 에러 메시지 추가
        if (hasReceivedChunk) {
          // 부분 응답 유지 + 별도 에러 메시지
          setMessages((prev) => [
            ...prev,
            {
              id: `cs-error-${Date.now()}`,
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
            queryKey: [...CS_HISTORY_QUERY_KEY],
          })
        }
      }
    },
    [isStreaming, reset, abort, queryClient]
  )

  return {
    messages,
    isStreaming,
    isLoading,
    isError,
    refetch,
    sendMessage,
    abort,
  }
}
