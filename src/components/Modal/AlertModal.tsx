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
      <div className="flex flex-col gap-10 items-end">
        <div className="w-full py-3">
          <p className="text-base text-gray-900 tracking-tight leading-relaxed">
            {message}
          </p>
        </div>
        <button
          onClick={handleConfirm}
          className="h-[42px] px-6 bg-primary text-white text-base font-semibold rounded-full tracking-tight hover:bg-primary-700 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}

export default AlertModal
