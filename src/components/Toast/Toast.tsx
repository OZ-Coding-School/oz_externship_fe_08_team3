import { useCallback, useEffect, useRef } from 'react'
import { CheckCircleSmallIcon, InfoIcon, WarningIcon, ErrorIcon } from './icons'

export type ToastVariant = 'success' | 'info' | 'warning' | 'error'

export interface ToastProps {
  message: string
  variant?: ToastVariant
  /** 자동 닫힘 시간 (ms). 0이면 자동 닫힘 없음 */
  duration?: number
  visible?: boolean
  onClose?: () => void
  className?: string
}

const ANIMATION_DURATION = 300

const iconMap: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircleSmallIcon />,
  info: <InfoIcon />,
  warning: <WarningIcon />,
  error: <ErrorIcon />,
}

export function Toast({
  message,
  variant = 'success',
  duration = 3000,
  visible = true,
  onClose,
  className = '',
}: ToastProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  const handleAnimationEnd = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const style = el.style.animation
    if (style.includes('toast-out')) {
      onClose?.()
    }
  }, [onClose])

  // 자동 닫힘 타이머: visible일 때 duration 후 exit 애니메이션 시작
  useEffect(() => {
    if (!visible || duration === 0) return
    timerRef.current = setTimeout(() => {
      const el = containerRef.current
      if (el) {
        el.style.animation = `toast-out ${ANIMATION_DURATION}ms ease-in forwards`
      }
    }, duration)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [visible, duration])

  if (!visible) return null

  return (
    <div
      ref={containerRef}
      role="alert"
      aria-live="polite"
      onAnimationEnd={handleAnimationEnd}
      style={{
        animation: `toast-in ${ANIMATION_DURATION}ms ease-out forwards`,
      }}
      className={[
        'fixed top-6 right-6 rounded-sm border border-gray-200 bg-gray-50 px-4 py-3 shadow-[4px_4px_4px_0px_rgba(131,131,131,0.25)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-center gap-2">
        {iconMap[variant]}
        <p className="text-sm tracking-tight whitespace-nowrap text-gray-600">
          {message}
        </p>
      </div>
    </div>
  )
}
