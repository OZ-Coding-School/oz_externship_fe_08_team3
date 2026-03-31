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
      <div className="flex flex-col items-center gap-10">
        {/* Icon */}
        <div className="flex flex-col items-center gap-4">
          <div className="bg-primary-300 flex h-7 w-7 items-center justify-center rounded-full">
            <MehFaceIcon />
          </div>
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-xl font-bold tracking-tight text-gray-900">
              {title}
            </h2>
            <p className="text-sm leading-relaxed tracking-tight whitespace-pre-line text-gray-600">
              {description}
            </p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleRestore}
          className="bg-primary text-primary-100 hover:bg-primary-700 focus-visible:ring-primary mb-4 h-[52px] w-full rounded-sm text-base font-normal tracking-tight transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          {buttonLabel}
        </button>
      </div>
    </Modal>
  )
}
