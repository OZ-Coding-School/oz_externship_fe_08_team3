import { FocusTrap } from 'focus-trap-react'
import { useShallow } from 'zustand/react/shallow'
import { useChatbotStore } from '@/stores/chatbotStore'
import { CsChatView } from '@/features/chatbot/cs'
import { HubView } from '@/features/chatbot/hub'
import { QnaChatView } from '@/features/chatbot/qna'
import type { ChatbotView } from '@/features/chatbot/widgetTypes'

/** 뷰 디스패치 맵 — hub/cs는 props 없이 렌더링 */
const VIEW_COMPONENTS: Record<
  Exclude<ChatbotView, 'qna'>,
  React.ComponentType
> = {
  hub: HubView,
  cs: CsChatView,
}

export function ChatbotWidget() {
  const { isOpen, currentView, activeQnaQuestionId, close } = useChatbotStore(
    useShallow((s) => ({
      isOpen: s.isOpen,
      currentView: s.currentView,
      activeQnaQuestionId: s.activeQnaQuestionId,
      close: s.close,
    }))
  )

  if (!isOpen) return null

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      close()
    }
  }

  // qna 뷰는 questionId props가 필요하므로 별도 처리
  const renderView = () => {
    if (currentView === 'qna' && activeQnaQuestionId != null) {
      return (
        <QnaChatView
          key={activeQnaQuestionId}
          questionId={activeQnaQuestionId}
        />
      )
    }

    const ViewComponent =
      VIEW_COMPONENTS[currentView as Exclude<ChatbotView, 'qna'>]
    if (!ViewComponent) return null
    return <ViewComponent />
  }

  return (
    <FocusTrap
      active={isOpen}
      focusTrapOptions={{
        initialFocus: '#chatbot-close-button',
        fallbackFocus: '#chatbot-widget',
        escapeDeactivates: false,
        allowOutsideClick: true,
        returnFocusOnDeactivate: true,
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- dialog는 키보드 이벤트 허용 */}
      <div
        id="chatbot-widget"
        role="dialog"
        aria-modal="true"
        aria-labelledby="chatbot-title"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="bg-bg-base fixed right-6 bottom-[120px] z-50 flex h-[608px] max-h-[calc(100vh-9rem)] w-[360px] flex-col overflow-hidden rounded-xl border border-gray-200"
        style={{ boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.25)' }}
      >
        {renderView()}
      </div>
    </FocusTrap>
  )
}
