import { useEffect, useRef, useState } from 'react'
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
  const [mounted, setMounted] = useState(visible)
  const [animating, setAnimating] = useState<'in' | 'out' | null>(visible ? 'in' : null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    if (visible) {
      setMounted(true)
      setAnimating('in')
    } else if (mounted) {
      setAnimating('out')
      timerRef.current = setTimeout(() => {
        setMounted(false)
        setAnimating(null)
        onClose?.()
      }, ANIMATION_DURATION)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [visible])

  useEffect(() => {
    if (!mounted || duration === 0) return
    const autoClose = setTimeout(() => {
      setAnimating('out')
      timerRef.current = setTimeout(() => {
        setMounted(false)
        setAnimating(null)
        onClose?.()
      }, ANIMATION_DURATION)
    }, duration)
    return () => clearTimeout(autoClose)
  }, [mounted, duration, onClose])

  if (!mounted) return null

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        animation:
          animating === 'in'
            ? `toast-in ${ANIMATION_DURATION}ms ease-out forwards`
            : animating === 'out'
              ? `toast-out ${ANIMATION_DURATION}ms ease-in forwards`
              : undefined,
      }}
      className={[
        'fixed top-6 right-6 px-4 py-3 rounded-sm border border-gray-200 bg-gray-50 shadow-[4px_4px_4px_0px_rgba(131,131,131,0.25)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {iconMap[variant]}
      <p className="text-sm text-gray-600 tracking-tight whitespace-nowrap">
        {message}
      </p>
    </div>
  )
}

export default Toast
