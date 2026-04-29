import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { useChatbotStore } from '@/stores/chatbotStore'

// URL 라우트에서 질문 ID를 추출하여 chatbotStore에 동기화
export function ChatbotPageContextSync() {
  const { pathname } = useLocation()
  const setCurrentPageQuestionId = useChatbotStore(
    (s) => s.setCurrentPageQuestionId
  )

  useEffect(() => {
    const match = pathname.match(/^\/qna\/(\d+)$/)
    const questionId = match ? Number(match[1]) : null
    setCurrentPageQuestionId(questionId)
  }, [pathname, setCurrentPageQuestionId])

  return null
}
