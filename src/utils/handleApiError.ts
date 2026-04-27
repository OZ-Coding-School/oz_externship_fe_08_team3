import axios from 'axios'

export function handleApiError(
  error: unknown,
  messages: Partial<Record<number, string>>,
  actions?: Partial<Record<number, () => void>>
): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status != null && messages[status] != null) {
      actions?.[status]?.()
      return messages[status]!
    }
  }
  return '일시적인 오류가 발생했습니다. 다시 시도해 주세요.'
}
