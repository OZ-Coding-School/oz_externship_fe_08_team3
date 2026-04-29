import { useCallback, useEffect, useRef } from 'react'

// AbortController 기반 SSE 중단 유틸 훅
// 실제 SSE 연결부는 CS/QnA 구현 시 연동 예정
export function useSSEAbort() {
  const controllerRef = useRef<AbortController>(new AbortController())

  const reset = useCallback(() => {
    controllerRef.current.abort()
    controllerRef.current = new AbortController()
    return controllerRef.current.signal
  }, [])

  const abort = useCallback(() => {
    controllerRef.current.abort()
  }, [])

  const getSignal = useCallback(() => {
    return controllerRef.current.signal
  }, [])

  useEffect(() => {
    return () => {
      controllerRef.current.abort()
    }
  }, [])

  return {
    getSignal,
    reset,
    abort,
  }
}
