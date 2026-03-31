import { Modal } from './Modal'

export interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  message: string
  cancelLabel?: string
  confirmLabel?: string
  onCancel?: () => void
  onConfirm?: () => void
  /** 확인 버튼 위험 스타일 적용 */
  danger?: boolean
}

/** Figma 1:3271 — 본문 + 취소/확인 pill 버튼 */
export function ConfirmModal({
  isOpen,
  onClose,
  message,
  cancelLabel = '취소',
  confirmLabel = '삭제',
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  const handleCancel = () => {
    onCancel?.()
    onClose()
  }

  const handleConfirm = () => {
    onConfirm?.()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} hideCloseButton>
      <div className="flex flex-col gap-10">
        <div className="py-3">
          <p className="text-base text-gray-700 tracking-tight leading-relaxed whitespace-pre-line">
            {message}
          </p>
        </div>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={handleCancel}
            className="h-[42px] px-6 bg-primary-100 text-primary-800 text-base font-semibold rounded-full tracking-tight hover:bg-primary-200 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirm}
            className="h-[42px] px-6 bg-primary text-white text-base font-semibold rounded-full tracking-tight hover:bg-primary-700 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmModal
