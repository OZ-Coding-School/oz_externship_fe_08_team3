import { useState } from 'react'
import type { ToastVariant } from '@/components'

type ToastState =
  | { visible: false }
  | { visible: true; message: string; variant: ToastVariant }

export function useToast() {
  const [toast, setToast] = useState<ToastState>({ visible: false })

  const showToast = (message: string, variant: ToastVariant) => {
    setToast({ visible: true, message, variant })
  }

  const hideToast = () => setToast({ visible: false })

  return { toast, showToast, hideToast }
}
