import { useEffect, useRef, useState } from 'react'
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

/** SSE 이벤트 파싱 결과 */
interface ParsedSseEvent {
  done: boolean
  chunk: CsSseChunk | null
}

/** SSE 이벤트 문자열을 파싱 — [DONE]이면 done: true, 청크면 chunk 반환 */
function parseSseEvent(event: string): ParsedSseEvent {
  const line = event.split('\n').find((l) => l.startsWith('data:'))
  if (!line) return { done: false, chunk: null }

  const data = line.replace(/^data:\s*/, '').trim()
  if (data === '[DONE]') return { done: true, chunk: null }

  try {
    return { done: false, chunk: JSON.parse(data) as CsSseChunk }
  } catch {
    // malformed chunk 무시
    return { done: false, chunk: null }
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
    setMessages(
      results.length === 0 ? [WELCOME_MESSAGE] : mapHistoryToMessages(results)
    )
  }, [historyData])

  const sendMessage = async (text: string): Promise<void> => {
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
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

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
          const parsed = parseSseEvent(event)

          if (parsed.done) {
            completed = true
            break
          }
          if (!parsed.chunk) continue

          hasReceivedChunk = true
          assistantText += parsed.chunk.message

          // 버퍼 초과 체크
          if (assistantText.length > SSE_MAX_BUFFER_SIZE) {
            bufferExceeded = true
            abort()
            break
          }

          const chunkMessage = parsed.chunk.message
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId
                ? { ...msg, message: msg.message + chunkMessage }
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
      if (error instanceof DOMException && error.name === 'AbortError') return

      // 에러 처리: 부분 응답 유지 vs 빈 assistant 교체
      if (hasReceivedChunk) {
        setMessages((prev) => [
          ...prev,
          {
            id: `cs-error-${Date.now()}`,
            role: 'assistant',
            message: ERROR_TEXT,
          },
        ])
      } else {
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
  }

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
