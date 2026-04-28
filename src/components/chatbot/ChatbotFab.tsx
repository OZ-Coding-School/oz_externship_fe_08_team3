import { useNavigate } from 'react-router'
import { ROUTES } from '@/constants/routes'

export function ChatbotFab() {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      aria-label="AI 챗봇 열기"
      onClick={() => navigate(ROUTES.CHATBOT.HOME)}
      className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95"
      style={{ backgroundColor: '#EDE9FE' }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 2v3"
          stroke="#6201e0"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="12" cy="2" r="1" fill="#6201e0" />
        <rect x="3" y="6" width="18" height="13" rx="3" fill="#DDD6FE" />
        <rect
          x="3"
          y="6"
          width="18"
          height="13"
          rx="3"
          stroke="#7c35d9"
          strokeWidth="1.5"
        />
        <circle cx="9" cy="12" r="2" fill="#6201e0" />
        <circle cx="15" cy="12" r="2" fill="#6201e0" />
        <circle cx="9.7" cy="11.3" r="0.6" fill="white" />
        <circle cx="15.7" cy="11.3" r="0.6" fill="white" />
        <path
          d="M9 15.5h6"
          stroke="#7c35d9"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M8 19l-1 2"
          stroke="#7c35d9"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M16 19l1 2"
          stroke="#7c35d9"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}
