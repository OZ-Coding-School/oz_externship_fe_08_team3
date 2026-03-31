import { Modal } from './Modal'
import { MehFaceIcon } from './icons'

export interface RestoreModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  /** 삭제 예정일 등 추가 안내 */
  buttonLabel?: string
  onRestore?: () => void
}

/** Figma 1:3245 — 아이콘 + 제목 + 설명 + 풀너비 CTA (탈퇴 복구) */
export function RestoreModal({
  isOpen,
  onClose,
  title,
  description,
  buttonLabel = '계정 다시 사용하기',
  onRestore,
}: RestoreModalProps) {
  const handleRestore = () => {
    onRestore?.()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-10 items-center">
        {/* Icon */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-7 h-7 rounded-full bg-primary-300 flex items-center justify-center">
            <MehFaceIcon />
          </div>
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-gray-600 tracking-tight leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleRestore}
          className="w-full h-[52px] bg-primary text-primary-100 text-base font-normal mb-4 rounded-sm tracking-tight hover:bg-primary-700 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
        >
          {buttonLabel}
        </button>
      </div>
    </Modal>
  )
}

export default RestoreModal
