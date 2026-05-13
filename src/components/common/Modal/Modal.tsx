import { useEffect, useId, useRef } from 'react'
import { CloseIcon } from './icons'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  /** Override the default max-width class */
  maxWidth?: string
  /** Hide the X close button */
  hideCloseButton?: boolean
  /** 하단 sticky footer (액션 버튼 영역) */
  footer?: React.ReactNode
  /** dialog에 적용할 aria-label (title 미사용 시 대체) */
  'aria-label'?: string
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-md',
  hideCloseButton = false,
  footer,
  'aria-label': ariaLabel,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const id = useId()
  const titleId = `${id}-title`
  const descId = `${id}-desc`

  // showModal / close 제어 + backdrop 클릭 닫기
  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    if (isOpen && !d.open) {
      d.showModal()
    } else if (!isOpen && d.open) {
      d.close()
    }
  }, [isOpen])

  // 네이티브 close 이벤트 (ESC 포함) → onClose 콜백
  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    const handleClose = () => onClose()
    // backdrop 클릭 감지: dialog 자체 영역 클릭 시 닫기
    const handleClick = (e: MouseEvent) => {
      if (e.target === d) onClose()
    }
    d.addEventListener('close', handleClose)
    d.addEventListener('click', handleClick)
    return () => {
      d.removeEventListener('close', handleClose)
      d.removeEventListener('click', handleClick)
    }
  }, [onClose])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descId : undefined}
      aria-label={!title ? ariaLabel : undefined}
      className="m-auto max-h-[90vh] w-full rounded-2xl bg-transparent p-0 outline-none backdrop:bg-gray-900/60 backdrop:backdrop-blur-sm open:flex open:flex-col"
      style={{ maxWidth: undefined }}
    >
      <div
        className={[
          'bg-bg-base relative flex max-h-[90vh] w-full flex-col rounded-2xl shadow-xl',
          maxWidth,
        ].join(' ')}
      >
        {/* Header */}
        {(title || !hideCloseButton) && (
          <div className="flex items-start justify-between px-6 pt-6">
            <div className="flex flex-col gap-1">
              {title && (
                <h2
                  id={titleId}
                  className="text-text-heading text-xl font-semibold"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p id={descId} className="text-text-muted text-sm">
                  {description}
                </p>
              )}
            </div>
            {!hideCloseButton && (
              <button
                onClick={onClose}
                aria-label="모달 닫기"
                className="text-text-muted hover:text-text-heading hover:bg-bg-muted focus-visible:ring-primary ml-4 shrink-0 rounded-lg p-1 transition-colors duration-150 outline-none focus-visible:ring-2"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div
          className={[
            'flex-1 overflow-y-auto px-6 py-5',
            footer ? '' : 'rounded-b-2xl',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="rounded-b-2xl bg-[#FAFAFA] px-12 py-5 shadow-[0_-2px_16px_rgba(160,160,160,0.25)]">
            {footer}
          </div>
        )}
      </div>
    </dialog>
  )
}
