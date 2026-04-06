import { Modal } from './Modal'

export interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  message: string
  confirmLabel?: string
  onConfirm?: () => void
}

/** Figma 1:3282 — 단순 메시지 + 확인 버튼 */
export function AlertModal({
  isOpen,
  onClose,
  message,
  confirmLabel = '확인',
  onConfirm,
}: AlertModalProps) {
  const handleConfirm = () => {
    onConfirm?.()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} hideCloseButton>
      <div className="flex flex-col items-end gap-10">
        <div className="w-full py-3">
          <p className="text-base leading-relaxed tracking-tight text-gray-900">
            {message}
          </p>
        </div>
        <button
          onClick={handleConfirm}
          className="bg-primary hover:bg-primary-700 focus-visible:ring-primary h-[42px] rounded-full px-6 text-base font-semibold tracking-tight text-white transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
