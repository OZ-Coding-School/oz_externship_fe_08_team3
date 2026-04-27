import axios from 'axios'

interface ApiErrorResult {
  message: string
  action?: () => void
}

/**
 * Axios 에러에서 상태 코드에 맞는 메시지와 사이드이펙트를 반환한다.
 * action은 호출 측에서 showToast 이후에 실행해야 한다 (toast가 먼저 렌더링되도록).
 */
export function handleApiError(
  error: unknown,
  messages: Partial<Record<number, string>>,
  actions?: Partial<Record<number, () => void>>
): ApiErrorResult {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status != null && messages[status] != null) {
      return { message: messages[status]!, action: actions?.[status] }
    }
  }
  return { message: '일시적인 오류가 발생했습니다. 다시 시도해 주세요.' }
}
